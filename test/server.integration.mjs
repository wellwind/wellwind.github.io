import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const workspaceRoot = resolve(import.meta.dirname, '..');
const serverPath = resolve(
  workspaceRoot,
  'dist/blog/browser/server/server.mjs',
);
const port = 44000 + (process.pid % 1000);
const baseUrl = `http://localhost:${port}`;
const output = [];

const server = spawn(process.execPath, [serverPath], {
  cwd: workspaceRoot,
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: String(port),
  },
  stdio: ['ignore', 'pipe', 'pipe'],
});

server.stdout.on('data', (chunk) => output.push(chunk.toString()));
server.stderr.on('data', (chunk) => output.push(chunk.toString()));

const waitForServer = new Promise((resolveStart, rejectStart) => {
  const timeout = setTimeout(() => {
    rejectStart(new Error(`Server start timed out.\n${output.join('')}`));
  }, 15_000);

  server.stdout.on('data', (chunk) => {
    if (chunk.toString().includes('Node Express server listening')) {
      clearTimeout(timeout);
      resolveStart();
    }
  });

  server.once('exit', (code) => {
    clearTimeout(timeout);
    rejectStart(
      new Error(`Server exited with code ${code}.\n${output.join('')}`),
    );
  });
});

try {
  await waitForServer;

  for (const path of ['/', '/blog', '/query?q=angular']) {
    const response = await fetch(`${baseUrl}${path}`, {
      signal: AbortSignal.timeout(15_000),
    });
    const html = await response.text();

    assert.equal(response.status, 200, `${path} returned ${response.status}`);
    assert.match(html, /<app-root[\s>]/, `${path} did not render Angular HTML`);
  }

  const blogResponse = await fetch(`${baseUrl}/blog`);
  const blogHtml = await blogResponse.text();
  const mainScript = blogHtml.match(/src="(main-[^"]+\.js)"/)?.[1];
  assert.ok(mainScript, 'The rendered blog page did not reference main.js');

  const scriptResponse = await fetch(`${baseUrl}/${mainScript}`, {
    signal: AbortSignal.timeout(15_000),
  });
  assert.equal(scriptResponse.status, 200, 'The main browser bundle was missing');
} finally {
  if (server.exitCode === null) {
    server.kill('SIGTERM');
    await new Promise((resolveExit) => server.once('exit', resolveExit));
  }
}
