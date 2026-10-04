import ts from "typescript";
import { mkdir, readFile, writeFile, readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
const tests = [];
async function visit(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = dir + "/" + entry.name;
    if (entry.isDirectory()) await visit(file);
    else if (file.endsWith(".ts")) {
      const target = "output/tests/" + file.replace(/\.ts$/, ".js");
      await mkdir(target.slice(0, target.lastIndexOf("/")), {
        recursive: true,
      });
      const source = await readFile(file, "utf8");
      const result = ts
        .transpileModule(source, {
          compilerOptions: {
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ES2022,
          },
        })
        .outputText.replace(
          /(from\s+['"])(\.[^'"]+)(['"])/g,
          (_m, a, b, c) => a + b.replace(/\.ts$/, "") + ".js" + c,
        );
      await writeFile(target, result);
      if (file.endsWith(".test.ts")) tests.push(target);
    }
  }
}
await visit("src");
await visit("functions");
await visit("worker");
await visit("tests");
const r = spawnSync(process.execPath, ["--test", ...tests], {
  stdio: "inherit",
});
process.exit(r.status ?? 1);
