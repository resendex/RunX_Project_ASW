import * as postService from './post.service';
import * as reactionService from './reaction.service';
import * as commentService from './comment.service';

export const getFeed = postService.getFeed;

export const createPost = postService.createPost;
export const getPostById = postService.getPostById;
export const deletePost = postService.deletePost;

export const addReaction = reactionService.addReaction;
export const removeReaction = reactionService.removeReaction;

export const addComment = commentService.addComment;
export const deleteComment = commentService.deleteComment;
