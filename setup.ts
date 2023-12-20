import * as childProcess from "node:child_process";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as process from "node:process";
import * as readLine from "node:readline/promises";
import * as util from "node:util";

async function updatePackageJson() {
  console.log("Updating package.json...");

  const buffer = await fs.readFile(path.join(__dirname, "package.json"));
  const packageJson = JSON.parse(buffer.toString());

  packageJson.name = path.basename(__dirname);
  packageJson.scripts.postinstall = undefined;

  await fs.writeFile(path.join(__dirname, "package.json"), JSON.stringify(packageJson, null, 2));
}

async function removeRedundantFiles() {
  console.log("Removing redundant files...");

  await fs.rm(path.join(__dirname, ".git"), { force: true, recursive: true });
  await fs.rm(path.join(__dirname, "setup.ts"));
}

async function initRepo() {
  console.log("Initialising git repo...");

  const commands = ["git init", "git add .", 'git commit -m "Initial commit"'];

  for (const command of commands) await util.promisify(childProcess.exec)(command);
}

async function setup() {
  console.log("Running setup script...");

  try {
    await updatePackageJson();
    await removeRedundantFiles();
    await initRepo();
  } catch (error) {
    console.log("Something went wrong during project initialisation!");
    console.log((error as Error).message);
  }
}

async function main() {
  const rli = readLine.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rli.question("Run setup script? [Y/n] ");

  if (answer === "" || answer.toLowerCase() === "y") await setup();

  rli.close();
}

main();
