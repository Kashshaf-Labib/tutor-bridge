import Post from "./post.model.js";
import mongoose from "mongoose";

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private (Student only)
export const createPost = async (req, res) => {
  try {
    const { subject, location, salary, requirements } = req.body;

    // Validate required fields
    if (!subject || !location || !salary) {
      return res.status(400).json({
        success: false,
        message: "Subject, location, and salary are required"
      });
    }

    // Sanitize and validate input
    const sanitizedData = {
      subject: subject.toString().trim(),
      location: location.toString().trim(),
      salary: Number(salary),
      requirements: requirements ? requirements.toString().trim() : "",
      student: req.user._id
    };

    // Create new post
    const newPost = await Post.create(sanitizedData);
    
    // Populate student details for response
    const populatedPost = await Post.findById(newPost._id).populate('student', 'name email role');

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: populatedPost
    });

  } catch (error) {
    console.error("Error creating post:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating post"
    });
  }
};

// @desc    Get all posts with optional filtering
// @route   GET /api/posts
// @access  Public
export const getAllPosts = async (req, res) => {
  try {
    const { subject, location, minSalary, maxSalary } = req.query;

    // Build filter object
    const filter = {};
    
    if (subject) {
      filter.subject = { $regex: subject.toString().trim(), $options: 'i' };
    }
    
    if (location) {
      filter.location = { $regex: location.toString().trim(), $options: 'i' };
    }
    
    if (minSalary || maxSalary) {
      filter.salary = {};
      if (minSalary) filter.salary.$gte = Number(minSalary);
      if (maxSalary) filter.salary.$lte = Number(maxSalary);
    }

    // Execute query without pagination
    const posts = await Post.find(filter)
      .populate('student', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: posts
    });

  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching posts"
    });
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID"
      });
    }

    const post = await Post.findById(id).populate('student', 'name email role phone');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      data: post
    });

  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching post"
    });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (Student only, own posts)
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, location, salary, requirements } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID"
      });
    }

    // Find post and check ownership
    const existingPost = await Post.findById(id);
    
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // Check if user owns the post
    if (existingPost.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own posts"
      });
    }

    // Prepare update data (only include fields that are provided)
    const updateData = {};
    if (subject !== undefined) updateData.subject = subject.toString().trim();
    if (location !== undefined) updateData.location = location.toString().trim();
    if (salary !== undefined) updateData.salary = Number(salary);
    if (requirements !== undefined) updateData.requirements = requirements.toString().trim();

    // Update post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('student', 'name email role');

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: updatedPost
    });

  } catch (error) {
    console.error("Error updating post:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating post"
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Student only, own posts)
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID"
      });
    }

    // Find post and check ownership
    const existingPost = await Post.findById(id);
    
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // Check if user owns the post
    if (existingPost.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own posts"
      });
    }

    // Delete post
    await Post.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting post"
    });
  }
};
