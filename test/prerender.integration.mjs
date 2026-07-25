import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { extname, resolve, sep } from "node:path";

const workspaceRoot = resolve(import.meta.dirname, "..");
const browserRoot = resolve(
  workspaceRoot,
  "dist/blog/browser/browser",
);
const routes = readFileSync(resolve(workspaceRoot, "pages.txt"), "utf8")
  .split(/\r?\n/)
  .map((route) => route.trim())
  .filter(Boolean);
const indexPaths = new Map();
const missingRoutes = [];
const invalidPages = [];
const missingAssets = new Set();
const assetExtensions = new Set([
  ".css",
  ".gif",
  ".ico",
  ".jpeg",
  ".jpg",
  ".js",
  ".png",
  ".svg",
  ".webp",
  ".woff",
  ".woff2",
  ".xml",
]);

for (const route of routes) {
  const indexPath = resolve(browserRoot, route.replace(/^\/+/, ""), "index.html");
  assert.ok(
    indexPath.startsWith(`${browserRoot}${sep}`),
    `${route} resolves outside the browser output directory`,
  );

  const normalizedPath = indexPath.toLocaleLowerCase("en-US");
  const collidingRoute = indexPaths.get(normalizedPath);
  assert.equal(
    collidingRoute,
    undefined,
    `${route} collides with ${collidingRoute} on case-insensitive file systems`,
  );
  indexPaths.set(normalizedPath, route);

  if (!existsSync(indexPath)) {
    missingRoutes.push(route);
    continue;
  }

  const html = readFileSync(indexPath, "utf8");
  if (
    !/<app-root[\s>]/.test(html) ||
    !/<title>[^<]+<\/title>/.test(html) ||
    /Internal Server Error/.test(html)
  ) {
    invalidPages.push(route);
  }

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const reference = match[1];
    if (
      /^(?:data:|https?:|mailto:|tel:|#)/.test(reference) ||
      !assetExtensions.has(extname(reference.split(/[?#]/, 1)[0]))
    ) {
      continue;
    }

    const assetPath = resolve(browserRoot, reference.replace(/^\/+/, ""));
    if (!existsSync(assetPath)) {
      missingAssets.add(reference);
    }
  }
}

assert.deepEqual(missingRoutes, [], "Some prerender routes have no index.html");
assert.deepEqual(invalidPages, [], "Some prerender pages contain invalid HTML");
assert.deepEqual(
  [...missingAssets],
  [],
  "Some prerender pages reference missing assets",
);
assert.ok(existsSync(resolve(browserRoot, "index.html")), "Root index is missing");

const rss = readFileSync(resolve(browserRoot, "atom.xml"), "utf8");
assert.equal(rss.match(/<item>/g)?.length, 20);

const specialTagHeadings = new Map([
  ["/blog/tags/C~23~", "C#"],
  ["/blog/tags/~2A~ngIf", "*ngIf"],
  ["/blog/tags/~2A~ngTemplateOutlet", "*ngTemplateOutlet"],
  ["/blog/tags/~2A~ngComponentOutlet", "*ngComponentOutlet"],
]);

for (const [route, heading] of specialTagHeadings) {
  const html = readFileSync(
    resolve(browserRoot, route.replace(/^\/+/, ""), "index.html"),
    "utf8",
  );
  assert.ok(html.includes(`<h1>${heading}</h1>`));
}
