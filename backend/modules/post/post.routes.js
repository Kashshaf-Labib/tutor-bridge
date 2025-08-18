import express from "express";
import { protect, authorizeRoles } from "../auth/auth.middleware.js";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
} from "./post.controller.js";

const router = express.Router();

// POST /posts → Create a post (Student only)
router.post(
  "/",
  protect,
  authorizeRoles("Student"),
  createPost
);

// GET /posts → Fetch all posts (with filtering)
router.get(
  "/",
  getAllPosts
);

// GET /posts/:id → Fetch a single post
router.get(
  "/:id",
  getPostById
);

// PUT /posts/:id → Update post (Student only, own posts)
router.put(
  "/:id",
  protect,
  authorizeRoles("Student"),
  updatePost
);

// DELETE /posts/:id → Delete post (Student only, own posts)
router.delete(
  "/:id",
  protect,
  authorizeRoles("Student"),
  deletePost
);

export default router;
