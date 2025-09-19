import { PostMetaWithSlug } from '@shared/core';

export type PostMetaBuilderOptions = Partial<PostMetaWithSlug> & {
  index?: number;
};

export const postMetaBuilder = (
  options: PostMetaBuilderOptions = {},
): PostMetaWithSlug => {
  const { index, ...overrides } = options;
  const suffix = typeof index === 'number' ? `-${index}` : '';

  return {
    title: overrides.title ?? `範例文章${suffix}`,
    date: overrides.date ?? '2024-01-01',
    categories: overrides.categories ?? ['angular'],
    tags: overrides.tags ?? ['angular'],
    summary: overrides.summary ?? '預設摘要',
    slug: overrides.slug ?? `sample-post${suffix}`,
  };
};
