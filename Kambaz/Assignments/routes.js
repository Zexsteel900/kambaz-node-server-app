import * as dao from './dao.js';

export default function AssignmentRoutes(app) {
    app.get('/api/courses/:courseId/assignments', (req, res) => {
        const {courseId} = req.params;
        const assignments = dao.findAssignmentForCourse(courseId);
        res.json(assignments);
    });

    app.delete('/api/assignments/:aid', (req, res) => {
        const {aid} = req.params;
        const result = dao.deleteAssignment(aid);
        res.json(result);
    });

    app.put('/api/assignments/:aid', (req, res) => {
        const {aid} = req.params;
        const assignmentUpdates = req.body;
        const status = dao.updateAssignment(aid, assignmentUpdates);
        res.send(status);
    });

    app.post('/api/courses/:courseId/assignments', (req, res) => {
        const {courseId} = req.params;
        const assignment = {...req.body, course: courseId};
        const newAssignment = dao.createAssignment(assignment);
        res.send(newAssignment);
    });
}