import { slugify } from '../../utils/slugify';
import { PostMetaWithSlug } from './post-meta.interface';

const searchFieldMapping = {
  tag: '標籤',
  category: '分類'
}

const getSearchFieldName = (fieldName: string) => {
  return (searchFieldMapping as any)[fieldName] || '';
}

export const searchPostsByDateRange = (start?: Date, end?: Date) => (posts: PostMetaWithSlug[]) => {
  return posts.filter(post => {
    const postDate = new Date(post.date);
    return (start ? postDate >= new Date(start) : true) && (end ? postDate <= new Date(end) : true);
  });
}

export const searchPosts = (posts: PostMetaWithSlug[], keywordString: string) => {

  if (!keywordString) {
    return posts.map(post => ({
      type: '文章',
      text: post.title,
      date: post.date,
      link: `/blog/${post.date.slice(0, 10).replace(/-/g, '/')}/${post.slug}`,
      toString: () => ''
    }));
  }

  const filterPostBy = (keyword: string) => (post: PostMetaWithSlug) =>
    post.title.toLowerCase().indexOf(keyword.toLowerCase()) >= 0
    || post.summary.toLowerCase().indexOf(keyword.toLowerCase()) >= 0;

  let result = [];

  let searchType = 'any';
  let searchField = '';
  let searchFrom = '';
  let keyword = '';
  const chunks = keywordString.split(':');
  if (chunks.length > 2) {
    searchType = 'post';
    searchField = chunks[0];
    searchFrom = chunks[1];
    keyword = chunks[2];
  } else if (chunks.length > 1) {
    searchType = chunks[0].toLowerCase();
    keyword = chunks[1];
  } else {
    keyword = chunks[0];
  }

  if (searchType === 'any' || searchType === 'post') {
    const relatePosts = posts
      .filter(post => {
        const filterKeywordFn = filterPostBy(keyword);
        if (searchField === 'category') {
          return filterKeywordFn(post) && !!(post.categories || []).find((category) => category.toLowerCase().indexOf(searchFrom.toLowerCase()) >= 0);
        } else if (searchField === 'tag') {
          return filterKeywordFn(post) && !!(post.tags || []).find((tag) => tag.toLowerCase().indexOf(searchFrom.toLowerCase()) >= 0);
        } else {
          return filterKeywordFn(post);
        }
      })
      .sort((postA, postB) =>
        postA.title.toLowerCase().indexOf(keyword.toLowerCase()) - postB.title.toLowerCase().indexOf(keyword.toLowerCase()))
    result.push(...relatePosts.map(post => ({
      type: `${getSearchFieldName(searchField)}${searchField ? ':' : ''}${searchFrom}${searchFrom ? ';' : ''}文章`,
      text: post.title,
      date: post.date,
      link: `/blog/${post.date.slice(0, 10).replace(/-/g, '/')}/${post.slug}`,
      toString: () => ''
    })));
  }

  if (searchType === 'any' || searchType === 'category') {
    const allCategories = posts
      .reduce((curr, post) => ([...new Set([...curr, ...post.categories || []])]), [] as string[])

    const relatedCategories = allCategories.filter((category: string) =>
      category.toLowerCase().indexOf(keyword.toLowerCase()) >= 0
    )
      .sort((categoryA, categoryB) =>
        categoryA.toLowerCase().indexOf(keyword.toLowerCase()) - categoryB.toLowerCase().indexOf(keyword.toLowerCase()))
    result.push(...relatedCategories.map(category => ({
      type: '分類',
      text: category,
      date: '',
      link: `/blog/categories/${slugify(category)}`,
      toString: () => ''
    })));
  }

  if (searchType === 'any' || searchType === 'tag') {
    const allTags = posts
      .reduce((curr, post) => ([...new Set([...curr, ...post.tags || []])]), [] as string[])

    const relatedTags = allTags
      .filter((tag: string) => tag.toLowerCase().indexOf(keyword.toLowerCase()) >= 0)
      .sort((tagA, tagB) =>
        tagA.toLowerCase().indexOf(keyword.toLowerCase()) - tagB.toLowerCase().indexOf(keyword.toLowerCase()))
    result.push(...relatedTags.map(tag => ({
      type: '標籤',
      text: tag,
      date: '',
      link: `/blog/tags/${slugify(tag)}`,
      toString: () => ''
    })));
  }

  return result;
}
