import db from "../Database/index.js";
import {v4 as uuidv4} from "uuid";

export function findAssignmentForCourse(courseId) {
    const {assignments} = db;
    return assignments.filter((assignment) => assignment.course === courseId);
}

export function deleteAssignment(assignmentId) {
    const {assignments} = db;
    db.assignments = assignments.filter((assignment) => assignment._id !== assignmentId);
}

export function updateAssignment(assignmentId, assignmentUpdates) {
    const {assignments} = db;
    const assignment = assignments.find((assignment) => assignment._id === assignmentId);
    Object.assign(assignment, assignmentUpdates);
    return assignment;
}

export function createAssignment(assignment) {
    const newAssignment = {...assignment, _id: uuidv4()};
    db.assignments = [...db.assignments, newAssignment];
    return newAssignment;
}