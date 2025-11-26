import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao() {
  
  // Find all assignments for a course
  async function findAssignmentsForCourse(courseId) {
    return model.find({ courseId });
  }

  // Find single assignment by ID
  async function findAssignmentById(assignmentId) {
    return model.findById(assignmentId);
  }

  // Create a new assignment
  async function createAssignment(courseId, assignment) {
    const newAssignment = { ...assignment, _id: uuidv4(), courseId };
    await model.create(newAssignment);
    return newAssignment;
  }

  // Update an assignment
  async function updateAssignment(assignmentId, assignmentUpdates) {
    const assignment = await model.findById(assignmentId);
    Object.assign(assignment, assignmentUpdates);
    await assignment.save();
    return assignment;
  }

  // Delete an assignment
  async function deleteAssignment(assignmentId) {
    return model.deleteOne({ _id: assignmentId });
  }

  return {
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}
