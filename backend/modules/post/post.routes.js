import express from "express";
import { protect, authorizeRoles } from "../auth/auth.middleware.js";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  expressInterest,
  getInterestedTutors,
  getMyPosts,
  selectTutor
} from "./post.controller.js";

const router = express.Router();

// POST /posts → Create a post (Student only)
router.post("/", protect, authorizeRoles("Student"), createPost);

// GET /posts/my-posts → Get current student's posts (Student only)
router.get("/my-posts", protect, authorizeRoles("Student"), getMyPosts);

// GET /posts → Fetch all posts (with filtering support)
// Query params: ?subject=math&location=dhaka&minSalary=5000&maxSalary=20000&page=1&limit=10
router.get("/", getAllPosts);

// GET /posts/:id → Fetch a single post
router.get("/:id", getPostById);

// PUT /posts/:id → Update post (Student only, own posts)
router.put("/:id", protect, authorizeRoles("Student"), updatePost);

// DELETE /posts/:id → Delete post (Student only, own posts)
router.delete("/:id", protect, authorizeRoles("Student"), deletePost);

// PUT /posts/:id/select-tutor → Select tutor for post (Student only, own posts)
router.put("/:id/select-tutor", protect, authorizeRoles("Student"), selectTutor);

router.post("/:id/interested", protect, expressInterest);

router.get("/:id/interested", protect, getInterestedTutors);

export default router;
