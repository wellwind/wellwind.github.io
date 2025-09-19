#!/usr/bin/env node

const path = require('path');
const Module = require('module');
const ts = require('typescript');

const projectRoot = path.resolve(__dirname, '..');
process.env.TS_NODE_PROJECT =
  process.env.TS_NODE_PROJECT || path.join(projectRoot, 'tsconfig.spec.json');

if (!process.env.TS_NODE_COMPILER_OPTIONS) {
  process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({
    module: 'commonjs',
    moduleResolution: 'node',
  });
}

require('ts-node/register');

const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
const tsconfigFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

if (tsconfigFile.error) {
  const message = ts.flattenDiagnosticMessageText(tsconfigFile.error.messageText, '\n');
  console.error(`Failed to read ${tsconfigPath}: ${message}`);
  process.exit(1);
}

const tsconfig = tsconfigFile.config || {};
const baseUrl = tsconfig.compilerOptions?.baseUrl || '.';
const pathMappings = tsconfig.compilerOptions?.paths || {};

const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function patchedResolveFilename(
  request,
  parent,
  isMain,
  options,
) {
  if (Object.prototype.hasOwnProperty.call(pathMappings, request)) {
    const candidates = pathMappings[request];
    for (const target of candidates) {
      const candidatePath = path.resolve(projectRoot, baseUrl, target);
      try {
        return originalResolveFilename.call(
          this,
          candidatePath,
          parent,
          isMain,
          options,
        );
      } catch (error) {
        // Try the next candidate in the mapping list.
      }
    }
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};

const { sync: globSync } = require('glob');
const jasmineCore = require('jasmine-core');
const jasmine = jasmineCore.boot(jasmineCore);
const env = jasmine.getEnv();

require('zone.js/node');
require('zone.js/testing');

const { getTestBed } = require('@angular/core/testing');
const {
  ServerTestingModule,
  platformServerTesting,
} = require('@angular/platform-server/testing');

const testBed = getTestBed();

try {
  testBed.resetTestEnvironment();
} catch (error) {
  // Ignore if the environment was not previously initialized.
}

testBed.initTestEnvironment(
  ServerTestingModule,
  platformServerTesting(),
  { teardown: { destroyAfterEach: true } },
);

env.configure({ random: false });
env.clearReporters();

const nonFlagArgs = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
const specPattern = nonFlagArgs[0] || 'src/**/*.spec.ts';
const specFiles = globSync(specPattern, { cwd: projectRoot, absolute: true });

if (specFiles.length === 0) {
  console.warn(`No spec files matched pattern "${specPattern}".`);
}

specFiles.forEach((specFile) => {
  require(specFile);
});

const failedSpecs = new Set();

env.addReporter({
  jasmineStarted(suiteInfo) {
    const total = suiteInfo.totalSpecsDefined ?? specFiles.length;
    console.log(`Running ${total} spec${total === 1 ? '' : 's'}...\n`);
  },
  specDone(result) {
    const icon = result.status === 'passed' ? '✓' : result.status === 'failed' ? '✗' : '∙';
    console.log(`${icon} ${result.fullName}`);
    if (result.status === 'failed') {
      failedSpecs.add(result.fullName);
      result.failedExpectations.forEach((failure) => {
        console.error(`   • ${failure.message}`);
        if (failure.stack) {
          const stackLines = failure.stack.split('\n').slice(0, 5);
          console.error(stackLines.map((line) => `     ${line}`).join('\n'));
        }
      });
    }
  },
  jasmineDone(result) {
    const totalTimeMs = result.totalTime ?? 0;
    const totalSeconds = (totalTimeMs / 1000).toFixed(3);
    if (result.overallStatus === 'passed') {
      console.log(`\nAll specs passed in ${totalSeconds}s.`);
    } else {
      const failureCount = failedSpecs.size || result.failedExpectations?.length || 0;
      console.error(`\n${failureCount} spec${failureCount === 1 ? '' : 's'} failed.`);
      process.exitCode = 1;
    }
  },
});

env.execute();
