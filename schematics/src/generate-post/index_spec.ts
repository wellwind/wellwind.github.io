import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';


const collectionPath = path.join(__dirname, '../collection.json');


describe('schematics', () => {
  it('creates a post and its asset directory', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const source = Tree.empty();
    source.create(
      'angular.json',
      JSON.stringify({
        projects: {
          blog: {
            sourceRoot: 'src',
          },
        },
      }),
    );
    const tree = await runner.runSchematic(
      'generate-post',
      { name: 'Angular Signals', project: 'blog', draft: true },
      source,
    );

    expect(tree.files).toContain('/src/assets/blog/angular-signals.md');
    expect(tree.files).toContain('/src/assets/blog/angular-signals/.gitkeep');
    expect(
      tree.readContent('/src/assets/blog/angular-signals.md'),
    ).toContain('title: "Angular Signals"');
  });
});
