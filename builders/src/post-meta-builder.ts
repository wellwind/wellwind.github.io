import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import { LogLevel } from '@angular/compiler-cli/ngcc';
import { promises as fs } from 'fs';

interface Options extends JsonObject {
  source: string;
  destination: string;
}

export default createBuilder(copyFileBuilder);

async function copyFileBuilder(
  options: Options,
  context: BuilderContext
): Promise<BuilderOutput> {
  context.logger.info('test');
  context.reportStatus(`Copying ${options.source} to ${options.destination}.`);
  try {
    await fs.copyFile(options.source, options.destination);
  } catch (err) {
    context.logger.error('Failed to copy file.');
    return {
      success: false,
      error: err.message
    };
  }

  context.reportStatus('Done.');
  return { success: true };
}
