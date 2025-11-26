import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
  const dao = AssignmentsDao(db);

  // ----------------------
  // Assignments for a course
  // ----------------------
  const findAssignmentsForCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
      const assignments = await dao.findAssignmentsForCourse(courseId);
      res.json(assignments);
    } catch (err) {
      console.error("Error fetching assignments:", err.message);
      res.status(500).json({ message: err.message });
    }
  };

  const createAssignment = async (req, res) => {
    const { courseId } = req.params;
    try {
      const newAssignment = await dao.createAssignment(courseId, req.body);
      res.json(newAssignment);
    } catch (err) {
      console.error("Error creating assignment:", err.message);
      res.status(500).json({ message: err.message });
    }
  };

  const updateAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    try {
      const updatedAssignment = await dao.updateAssignment(assignmentId, req.body);
      res.json(updatedAssignment);
    } catch (err) {
      console.error("Error updating assignment:", err.message);
      res.status(500).json({ message: err.message });
    }
  };

  const deleteAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    try {
      const status = await dao.deleteAssignment(assignmentId);
      res.json(status);
    } catch (err) {
      console.error("Error deleting assignment:", err.message);
      res.status(500).json({ message: err.message });
    }
  };

  // ----------------------
  // Route definitions
  // ----------------------
  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.post("/api/courses/:courseId/assignments", createAssignment);
  app.put("/api/assignments/:assignmentId", updateAssignment);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
}
