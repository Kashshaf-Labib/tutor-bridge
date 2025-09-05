import express from "express";
import { updateUserPhone, updateUserPassword } from "./user.controller.js";
import { protect } from "../auth/auth.middleware.js";

const router = express.Router();

// Routes for updating user information
router.put("/update-phone", protect, updateUserPhone);
router.put("/update-password", protect, updateUserPassword);

export default router;
