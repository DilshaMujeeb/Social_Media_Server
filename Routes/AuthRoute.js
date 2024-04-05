import express from "express";
const router = express.Router();
console.log("inside auth");
import { registerUser, loginUser } from "../Controllers/AuthController.js";

router.post('/register',registerUser)
router.post('/login', loginUser)
export default router;