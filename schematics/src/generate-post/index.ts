import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as path from 'path';

interface GeneratePostOptions {
  name: string;
  draft?: boolean;
}

export function generatePost(options: GeneratePostOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    _context.logger.info('📄 Generate a blog post');

    const angularJsonContent = tree.read('angular.json');
    if (!angularJsonContent) {
      _context.logger.error('Can not find angular.json');
      return;
    }

    // find source root
    const angularJson = JSON.parse(angularJsonContent.toString('UTF-8')!);
    const defaultProject = angularJson['defaultProject'];
    const projectSourceRoot = angularJson['projects'][defaultProject]['sourceRoot'];

    // file name & path
    const dasherizeName = `${dasherize(options.name)}`;
    const fileName = `${dasherizeName}.md`;
    const filePath = [projectSourceRoot, 'assets', 'blog', fileName].join(path.sep);
    const assetsKeepFile = [projectSourceRoot, 'assets', 'blog', dasherizeName, '.gitkeep'].join(path.sep);

    // content
    const date = new Date();
    const isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();

    const fileContent = `---
title: "${options.name}"
date: ${isoDateTime.substr(0, 19).replace('T', ' ')}
category:
tags:
draft: ${options.draft}
---

<!-- more -->
`;

    // create file
    tree.create(filePath, fileContent);

    // create assets folder
    tree.create(assetsKeepFile, '');

    _context.logger.info('✅ Done');

    return tree;
  };
}
