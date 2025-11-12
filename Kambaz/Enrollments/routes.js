import * as dao from './dao.js';

export default function EnrollmentRoutes(app) {
    app.post("/api/users/:uid/enrollments/:cid", (req, res) => {
        const { uid, cid } = req.params;
        const enrollment = dao.enrollUserInCourse(uid, cid);
        res.json(enrollment);
      });
    
      app.delete("/api/users/:uid/enrollments/:cid", (req, res) => {
        const { uid, cid } = req.params;
        const result = dao.unenrollUserFromCourse(uid, cid);
        res.json(result);
      });
    
      app.get("/api/users/:uid/enrollments", (req, res) => {
        const { uid } = req.params;
        const enrolledCourses = dao.findCoursesForUser(uid);
        res.json(enrolledCourses);
      });
}