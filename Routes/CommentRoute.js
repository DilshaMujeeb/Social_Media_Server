import express from "express";
import {
  createComment,
  getAllComments,
} from "../Controllers/CommentController.js";
const router = express.Router()

router.post('/:postId', createComment)
router.get("/:postId", getAllComments);

export default router