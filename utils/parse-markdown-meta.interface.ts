export interface MarkdownYamlMeta {
  title: string;
  date: Date;
  category: string[] | string;
  tags: string[];
  ogImage?: string;
  draft?: boolean;
}
