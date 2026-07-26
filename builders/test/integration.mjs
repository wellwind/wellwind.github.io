import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const workspaceRoot = resolve(fileURLToPath(import.meta.url), "../../..");
const outputDirectory = mkdtempSync(join(tmpdir(), "blog-builders-"));
const ngExecutable = join(workspaceRoot, "node_modules", ".bin", "ng");

const runBuilder = (target, option, outputPath) => {
  const result = spawnSync(
    ngExecutable,
    ["run", `blog:${target}`, `--${option}`, outputPath],
    {
      cwd: workspaceRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        NODE_ENV: "production",
      },
    },
  );

  assert.equal(result.status, 0, result.stderr || result.stdout);
};

try {
  const postsPath = join(outputDirectory, "blog-posts.json");
  const routesPath = join(outputDirectory, "pages.txt");
  const rssPath = join(outputDirectory, "rss.xml");

  runBuilder("generate-blog-posts-json", "target-json-path", postsPath);
  runBuilder("generate-prerender-urls", "urls-path", routesPath);
  runBuilder("generate-rss", "rss-path", rssPath);

  const posts = JSON.parse(readFileSync(postsPath, "utf8"));
  const routes = readFileSync(routesPath, "utf8").trim().split("\n");
  const rss = readFileSync(rssPath, "utf8");
  const tags = [
    ...new Set(Object.values(posts).flatMap((post) => post.tags ?? [])),
  ];

  assert.equal(Object.keys(posts).length, 278);
  assert.equal(routes.length, 810);
  assert.equal(new Set(tags.map((tag) => tag.toLowerCase())).size, tags.length);
  assert.ok(routes.includes("/blog"));
  assert.ok(routes.includes("/blog/tags/C~23~"));
  assert.ok(routes.includes("/blog/tags/~2A~ngIf"));
  assert.ok(!routes.includes("/blog/tags/C#"));
  assert.ok(!routes.includes("/blog/tags/*ngIf"));
  assert.equal(rss.match(/<item>/g)?.length, 20);
  assert.ok(rss.includes('<rss version="2.0">'));

  const htmlDirectory = join(outputDirectory, "html");
  const htmlPath = join(htmlDirectory, "index.html");
  mkdirSync(htmlDirectory);
  writeFileSync(
    htmlPath,
    "<!doctype html><html><body><!-- remove --><p> Hello </p></body></html>",
  );

  runBuilder("minify-rendered-files", "target-path", htmlDirectory);

  const minifiedHtml = readFileSync(htmlPath, "utf8");
  assert.ok(!minifiedHtml.includes("<!-- remove -->"));
  assert.ok(minifiedHtml.includes("<p>Hello</p>"));
} finally {
  rmSync(outputDirectory, { recursive: true, force: true });
}
