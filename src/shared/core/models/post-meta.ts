export type Category = string;
export type Tag = string;

export interface PostMeta {
  title: string;
  date: string;
  categories: Category[];
  tags: Tag[];
  summary: string;
}

export interface PostMetaWithSlug extends PostMeta {
  slug: string;
}
