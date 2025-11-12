import db from "../Database/index.js";

export function enrollUserInCourse(userId, courseId) {
    const enrollment = { user: userId, course: courseId };
    db.enrollments.push(enrollment);
    return enrollment;
  }
  
  export function unenrollUserFromCourse(userId, courseId) {
    db.enrollments = db.enrollments.filter(
      (e) => !(e.user === userId && e.course === courseId)
    );
    return { status: "unenrolled" };
  }
  
  export function findCoursesForUser(userId) {
    const { courses, enrollments } = db;
    return courses.filter((course) =>
      enrollments.some((e) => e.user === userId && e.course === course._id)
    );
  }