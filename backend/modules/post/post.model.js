import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    subject: { 
      type: String, 
      required: [true, "Subject is required"],
      trim: true,
      minlength: [2, "Subject must be at least 2 characters long"],
      maxlength: [100, "Subject cannot exceed 100 characters"]
    },
    location: { 
      type: String, 
      required: [true, "Location is required"],
      trim: true,
      minlength: [2, "Location must be at least 2 characters long"],
      maxlength: [50, "Location cannot exceed 50 characters"]
    },
    salary: { 
      type: Number, 
      required: [true, "Salary is required"],
      min: [0, "Salary cannot be negative"],
      max: [1000000, "Salary cannot exceed 1,000,000"]
    },
    requirements: { 
      type: String,
      trim: true,
      maxlength: [1000, "Requirements cannot exceed 1000 characters"]
    },
    student: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: [true, "Student reference is required"]
    },
    interestedTutors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    selectedTutor: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      default: null
    },
    status: {
      type: String,
      enum: ["open", "assigned", "completed"],
      default: "open"
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for better query performance
PostSchema.index({ subject: 1, location: 1 });
PostSchema.index({ salary: 1 });
PostSchema.index({ student: 1 });

// Virtual to populate student details
PostSchema.virtual('studentDetails', {
  ref: 'User',
  localField: 'student',
  foreignField: '_id',
  justOne: true
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
