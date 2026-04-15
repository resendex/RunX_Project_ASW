import * as postService from './post.service';
import * as reactionService from './reaction.service';
import * as commentService from './comment.service';
export const feedService = {
  getFeed: postService.getFeed,

  createPost: postService.createPost,
  getPostById: postService.getPostById,
  deletePost: postService.deletePost,

  addReaction: reactionService.addReaction,
  removeReaction: reactionService.removeReaction,

  addComment: commentService.addComment,
  deleteComment: commentService.deleteComment,
};
