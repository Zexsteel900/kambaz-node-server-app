import mongoose from "mongoose";

const ReplySchema = new mongoose.Schema(
  {
    _id: String,
    author: { type: String, ref: "UserModel" },
    text: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const FollowupSchema = new mongoose.Schema(
  {
    _id: String,
    author: { type: String, ref: "UserModel" },
    text: String,
    resolved: { type: Boolean, default: false },
    replies: [ReplySchema],
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const AnswerSchema = new mongoose.Schema(
  {
    _id: String,
    postId: String,
    author: { type: String, ref: "UserModel" },
    text: String, // RTE HTML
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const PostSchema = new mongoose.Schema(
  {
    _id: String,
    courseId: String,
    author: { type: String, ref: "UserModel" },
    postType: { type: String, enum: ["question", "note"] },
    summary: String,
    details: String, // RTE HTML content
    folders: [String],
    visibility: {
      entireClass: { type: Boolean, default: true },
      allowedUsers: [String], // user._id list
    },
    answersStudents: [AnswerSchema],
    answersInstructors: [AnswerSchema],
    followups: [FollowupSchema],
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "pazza_posts" }
);

const FolderSchema = new mongoose.Schema(
  {
    _id: String,
    courseId: String,
    name: String,
  },
  { collection: "pazza_folders" }
);

export { PostSchema, FolderSchema };
