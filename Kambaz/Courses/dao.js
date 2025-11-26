import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function CoursesDao() {
  async function findAllCourses() {
    return model.find({});
  }

  async function findCourseById(courseId) {
    return model.findById(courseId);
  }

  async function createCourse(courseData) {
    console.log("DAO: Creating course with data:", courseData);
    
    // Generate _id if not provided
    const newCourse = {
      ...courseData,
      _id: courseData._id || uuidv4()
    };
    
    console.log("DAO: Course with _id:", newCourse);
    
    const result = await model.create(newCourse);
    console.log("DAO: Course created, result:", result);
    
    return result;
  }

  async function updateCourse(courseId, updates) {
    return model.findByIdAndUpdate(courseId, updates, { new: true });
  }

  async function deleteCourse(courseId) {
    return model.findByIdAndDelete(courseId);
  }

  return {
    findAllCourses,
    findCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
  };
}