import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
  const dao = CoursesDao();
  const enrollmentsDao = EnrollmentsDao();

  // ----------------------
  // Create a new course
  // ----------------------
  app.post("/api/courses", async (req, res) => {
    console.log("=== CREATE COURSE START ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("Session:", req.session);
    console.log("Current user:", req.session?.currentUser);

    try {
      console.log("Step 1: Creating course in database...");
      const newCourse = await dao.createCourse(req.body);
      console.log("Step 2: Course created successfully:", newCourse);

      // Auto-enroll current user if session exists
      const currentUser = req.session?.currentUser;
      if (currentUser) {
        console.log("Step 3: Auto-enrolling user:", currentUser._id, "in course:", newCourse._id);
        try {
          const enrollment = await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
          console.log("Step 4: Enrollment successful:", enrollment);
        } catch (enrollError) {
          console.error("Enrollment error (non-fatal):", enrollError);
          console.error("Stack:", enrollError.stack);
          // Don't fail the whole operation if enrollment fails
        }
      } else {
        console.log("Step 3: No current user in session, skipping enrollment");
      }

      console.log("Step 5: Sending response");
      res.json(newCourse);
      console.log("=== CREATE COURSE END (SUCCESS) ===");
    } catch (error) {
      console.error("=== CREATE COURSE ERROR ===");
      console.error("Error message:", error.message);
      console.error("Error name:", error.name);
      console.error("Error code:", error.code);
      console.error("Full error:", error);
      console.error("Stack trace:", error.stack);
      console.error("=== END ERROR ===");
      
      res.status(500).json({ 
        message: "Failed to create course", 
        error: error.message,
        errorName: error.name,
        errorCode: error.code
      });
    }
  });

  // ----------------------
  // Fetch all courses
  // ----------------------
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await dao.findAllCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses", error: error.message });
    }
  });

  // ----------------------
  // Update course
  // ----------------------
  app.put("/api/courses/:courseId", async (req, res) => {
    try {
      const updatedCourse = await dao.updateCourse(req.params.courseId, req.body);
      if (!updatedCourse) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(updatedCourse);
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({ message: "Failed to update course", error: error.message });
    }
  });

  // ----------------------
  // Delete course
  // ----------------------
  app.delete("/api/courses/:courseId", async (req, res) => {
    try {
      const { courseId } = req.params;
      await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
      const status = await dao.deleteCourse(courseId);
      if (!status) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(status);
    } catch (error) {
      console.error("Error deleting course:", error);
      res.status(500).json({ message: "Failed to delete course", error: error.message });
    }
  });

  // ----------------------
  // Get courses for a user
  // ----------------------
  app.get("/api/users/:userId/courses", async (req, res) => {
    try {
      let { userId } = req.params;
      if (userId === "current") {
        const currentUser = req.session?.currentUser;
        if (!currentUser) {
          return res.status(401).json({ message: "Not authenticated" });
        }
        userId = currentUser._id;
      }
      const courses = await enrollmentsDao.findCoursesForUser(userId);
      res.json(courses);
    } catch (error) {
      console.error("Error fetching user courses:", error);
      res.status(500).json({ message: "Failed to fetch courses", error: error.message });
    }
  });

  // ----------------------
  // Enroll user in course
  // ----------------------
  app.post("/api/users/:uid/courses/:cid", async (req, res) => {
    try {
      let { uid, cid } = req.params;
      if (uid === "current") {
        const currentUser = req.session?.currentUser;
        if (!currentUser) {
          return res.status(401).json({ message: "Not authenticated" });
        }
        uid = currentUser._id;
      }
      const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
      res.json(status);
    } catch (error) {
      console.error("Error enrolling user:", error);
      res.status(500).json({ message: "Failed to enroll user", error: error.message });
    }
  });

  // ----------------------
  // Unenroll user from course
  // ----------------------
  app.delete("/api/users/:uid/courses/:cid", async (req, res) => {
    try {
      let { uid, cid } = req.params;
      if (uid === "current") {
        const currentUser = req.session?.currentUser;
        if (!currentUser) {
          return res.status(401).json({ message: "Not authenticated" });
        }
        uid = currentUser._id;
      }
      const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
      res.json(status);
    } catch (error) {
      console.error("Error unenrolling user:", error);
      res.status(500).json({ message: "Failed to unenroll user", error: error.message });
    }
  });

  // ----------------------
  // Get users in a course
  // ----------------------
  app.get("/api/courses/:cid/users", async (req, res) => {
    try {
      const { cid } = req.params;
      const users = await enrollmentsDao.findUsersForCourse(cid);
      res.json(users);
    } catch (error) {
      console.error("Error fetching course users:", error);
      res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
  });
}