import * as ESBuild from "esbuild";

async function build() {
  try {
    await ESBuild.build({
      bundle: true,
      entryPoints: ["./src/index.ts"],
      minify: true,
      outdir: "build",
      packages: "external",
      platform: "node",
      target: "node20",
    });

    return console.log("Build success!");
  } catch {
    return console.log("Build failure!");
  }
}

build();
