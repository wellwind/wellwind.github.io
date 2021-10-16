export interface MarkdownMeta {
  slug: string;
  title: string;
  date: Date;
  categories: string[];
  tags: string[];
  draft?: boolean;
  summary: string;
  content: string;
  originalContent: string;
}
