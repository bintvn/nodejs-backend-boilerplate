import type { PostEntity } from './post.entity.js';

const postDto = (post: PostEntity) => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  content: post.content,
  categories: post.categoryPosts
    ? post.categoryPosts.map((categoryPost) => categoryPost.category)
    : [],
});

export default postDto;
