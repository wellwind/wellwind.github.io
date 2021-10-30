export interface MarkdownMeta {
  slug: string;
  title: string;
  date: string;
  categories: string[];
  tags: string[];
  draft?: boolean;
  summary: string;
  content: string;
  originalContent: string;
}
