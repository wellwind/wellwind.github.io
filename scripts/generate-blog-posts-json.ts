import { join } from 'path';
import * as fs from 'fs';
import { parseMarkdownMeta } from '../utils';

console.log('generate blog-posts.json');

const postsPath = join(process.cwd(), 'src', 'assets', 'blog');

const getMarkdownMeta = (dirName: string) => {
  const slug = dirName;
  const filePath = join(postsPath, dirName, `${dirName}.md`);
  const fileContent = fs.readFileSync(filePath).toString('utf-8');
  return parseMarkdownMeta(fileContent, slug);
}

const posts = fs.readdirSync(postsPath, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)
  .map(dirName => getMarkdownMeta(dirName))
  .filter(markdownMeta => !!markdownMeta)
  .filter(markdownMeta => !markdownMeta?.draft)
  .reduce((prev, markdownMeta) => ({
    ...prev,
    [markdownMeta!.slug]: {
      title: markdownMeta!.title,
      date: markdownMeta!.date,
      categories: markdownMeta!.categories,
      tags: markdownMeta!.tags,
      summary: markdownMeta!.summary
    }
  }), {} as any)

fs.writeFileSync(join(postsPath, 'blog-posts.json'), JSON.stringify(posts));
console.log('done');
