import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: [true, "Name already exists"], // Custom error message for name
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email already exists"], // Custom error message for email
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email"], // Regex for email format validation
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters"], // Minimum length validation
    },
    profilePicture: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    status: {
      type: String,
      enum: ["online", "offline", "busy", "away"],
      default: "offline",
    },
    bio: {
      type: String,
      maxlength: [200, "Bio cannot exceed 200 characters"], // Max length validation for bio
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    conversationsHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatRoom",
      },
    ],
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
