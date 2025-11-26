import model from "./model.js";

export default function EnrollmentsDao() {
  async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map(e => e.course);
  }

  async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments.map(e => e.user);
  }

  async function enrollUserInCourse(userId, courseId) {
    try {
      // ✅ Check if enrollment already exists
      const existing = await model.findOne({ user: userId, course: courseId });
      if (existing) {
        return existing; // Return existing enrollment instead of throwing error
      }

      return await model.create({
        _id: `${userId}-${courseId}`,
        user: userId,
        course: courseId,
        enrollmentDate: new Date(),
      });
    } catch (error) {
      // Handle duplicate key error
      if (error.code === 11000) {
        console.log("User already enrolled, returning existing enrollment");
        return await model.findOne({ user: userId, course: courseId });
      }
      throw error;
    }
  }

  async function unenrollUserFromCourse(userId, courseId) {
    return model.deleteOne({ user: userId, course: courseId });
  }

  async function unenrollAllUsersFromCourse(courseId) {
    return model.deleteMany({ course: courseId });
  }

  return {
    findCoursesForUser,
    findUsersForCourse,
    enrollUserInCourse,
    unenrollUserFromCourse,
    unenrollAllUsersFromCourse,
  };
}