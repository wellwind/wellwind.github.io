import { readFileSync } from 'fs';
import { join } from 'path';
import { parseMarkdownMeta } from './index';

export const getMarkdownMeta = (folderPath: string,fileName: string) => {
  const filePath = join(folderPath, fileName);
  const fileContent = readFileSync(filePath).toString('utf-8');
  // replace `.md` as slug
  const slug = fileName.substr(0, fileName.length - 3);
  return parseMarkdownMeta(fileContent, slug);
}
