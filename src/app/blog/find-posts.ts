import { slugify } from '../../../utils/slugify';
import { PostMetaWithSlug } from '../post-meta.interface';

export const findPosts = (slug: string, data: { [key: string]: PostMetaWithSlug[] }) => {
  const found = Object
    .entries(data)
    .find(entry => slugify(entry[0]) === slug);
  if (found) {
    return found[1];
  }

  return [];
}
