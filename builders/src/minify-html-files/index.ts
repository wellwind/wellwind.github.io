import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import * as fs from 'fs';
import * as path from 'path';
import { minify as minifyHtml } from 'html-minifier';

interface Options extends JsonObject {
  targetPath: string;
}

export default createBuilder(minifyHtmlFiles);

async function minifyHtmlFiles(options: Options, context: BuilderContext): Promise<BuilderOutput> {
  context.logger.info(`📦 Minifying html files in ${options.targetPath}`);

  for (const filePath of getAllHtmlFiles(options.targetPath)) {
    const result = minifyHtml(
      fs.readFileSync(filePath).toString('utf-8'),
      {
        removeComments: true,
        minifyJS: true,
        minifyCSS: true,
        collapseWhitespace: true
      }).replace(/<!---->/g, '');
    fs.writeFileSync(filePath, result);
  }

  context.logger.info('✅ Done');
  return { success: true };
}

function* getAllHtmlFiles(dir: string) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      yield* getAllHtmlFiles(path.join(dir, file.name));
    } else if(file.name.endsWith('.html')) {
      yield path.join(dir, file.name);
    }
  }
}
