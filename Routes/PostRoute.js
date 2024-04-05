import express from 'express';
import {
  createPost,
  deletePost,
  getPost,
  getTimelinePosts,
  likePost,
  updatePost,
  getAllPosts,
} from "../Controllers/PostController.js";
const router = express.Router();

router.post('/', createPost)
router.get('/:id', getPost);
router.get('/posts',getAllPosts)
router.put('/:id', updatePost);
router.delete('/:id', deletePost)
router.put('/:id/like', likePost)
router.get('/:id/timeline', getTimelinePosts)
export default router;