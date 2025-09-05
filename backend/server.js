import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

connectDB();

const app = express();
app.use(express.json());

//auth routes
import authRoutes from "./modules/auth/auth.routes.js";
app.use("/api/auth", authRoutes);

//post routes
import postRoutes from "./modules/post/post.routes.js";
app.use("/api/posts", postRoutes);

//user routes
import userRoutes from "./modules/user/user.routes.js";
app.use("/api/users", userRoutes);

// Sample route
app.get("/", (req, res) => {
  res.send("API is running.....");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
