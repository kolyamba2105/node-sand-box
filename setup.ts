import childProcess from "child_process";
import fs from "fs";
import path from "path";
import util from "util";

const executeCommand = util.promisify(childProcess.exec);
const readFile = util.promisify(fs.readFile);
const remove = util.promisify(fs.rm);
const writeFile = util.promisify(fs.writeFile);

async function updatePackageJson() {
  console.log("Updating package.json...");

  const buffer = await readFile(path.join(__dirname, "package.json"));
  const packageJson = JSON.parse(buffer.toString());

  packageJson.name = path.basename(__dirname);
  packageJson.scripts.postinstall = undefined;

  await writeFile(path.join(__dirname, "package.json"), JSON.stringify(packageJson, null, 2));
}

async function removeRedundantFiles() {
  console.log("Removing redundant files...");

  await remove(path.join(__dirname, ".git"), { force: true, recursive: true });
  await remove(path.join(__dirname, "setup.ts"));
}

async function initRepo() {
  console.log("Initialising git repo...");

  const commands = ["git init", "git add .", 'git commit -m "Initial commit"'];

  for (const command of commands) await executeCommand(command);
}

async function setup() {
  try {
    await updatePackageJson();
    await removeRedundantFiles();
    await initRepo();
  } catch (error) {
    console.log("Something went wrong during project initialisation!");
    console.log((error as Error).message);
  }
}

setup();
