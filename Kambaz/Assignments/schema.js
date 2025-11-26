import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    _id: String,
    courseId: { type: String, ref: "CourseModel" }, // reference to the course
    title: String,
    description: String,
    dueDate: Date,
    points: Number,
  },
  { collection: "assignments" }
);

export default assignmentSchema;
