import express from 'express';
const router = express.Router();
import {
    getAllUsers,
    deleteUser,
  followUser,
  getUser,
  unFollowUser,
  updateUser,
} from "../Controllers/UserController.js";
import authMiddleWare from "../middleware/authMiddleWare.js"
router.get('/',getAllUsers)
router.get('/:id', getUser)

router.put("/:id",authMiddleWare, updateUser);

router.delete("/:id",authMiddleWare, deleteUser)
router.put('/:id/follow',authMiddleWare, followUser)

router.put("/:id/unfollow", authMiddleWare,unFollowUser);

export default router;