import { PostMetaWithSlug } from '../post-meta.interface';

export const getPagePosts = (pageNum: number, pageSize: number, item: PostMetaWithSlug[]) =>
  item.slice((pageNum - 1) * pageSize, (pageNum - 1) * pageSize + pageSize);