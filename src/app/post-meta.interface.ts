export interface PostMeta {
  title: string;
  date: Date;
  categories: string[];
  tags: string[];
  summary: string;
}

export interface PostMetaWithSlug extends PostMeta {
  slug: string;
}
