export interface MarkdownYamlMeta {
  title: string;
  date: Date;
  category: string[] | string;
  tags: string[];
  draft?: boolean;
}
