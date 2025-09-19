import { getPagePosts } from './get-page-posts';
import { PostMetaWithSlug } from '../site-common/post-meta.interface';

const buildPost = (slug: string): PostMetaWithSlug => ({
  slug,
  title: slug,
  date: '2024-01-01 00:00:00',
  categories: [],
  tags: [],
  summary: '',
});

describe('getPagePosts', () => {
  const posts: PostMetaWithSlug[] = Array.from({ length: 5 }, (_, index) =>
    buildPost(`post-${index + 1}`),
  );

  it('returns posts for the requested page', () => {
    const result = getPagePosts(2, 2, posts);

    expect(result.map((post) => post.slug)).toEqual(['post-3', 'post-4']);
  });

  it('returns the remainder of posts on the final page', () => {
    const result = getPagePosts(3, 2, posts);

    expect(result.map((post) => post.slug)).toEqual(['post-5']);
  });
});
