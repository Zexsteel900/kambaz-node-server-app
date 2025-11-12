import * as dao from './dao.js';
import * as courseDao from '../Courses/dao.js';
import * as enrollmentsDao from '../Enrollments/dao.js';
import db from '../Database/index.js';

export default function UserRoutes(app) {
    const createUser = (req, res) => { };
    const deleteUser = (req, res) => { };
    const findAllUsers = (req, res) => { };
    const findUserById = (req, res) => { };

    const updateUser = (req, res) => {
        const userId = req.params.userId;
        const userUpdates = req.body;
        dao.updateUser(userId, userUpdates);
        const currentUser = dao.findUserById(userId);
        req.session['currentUser'] = currentUser;
        res.json(currentUser);
     };

    const signup = (req, res) => {
        const user = dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json({message: "Username already exists"});
            return;
        }
        const currentUser = dao.createUser(req.body);
        req.session['currentUser'] = currentUser;
        res.json(currentUser);
     };

    const signin = (req, res) => {
        const {username, password} = req.body;
        const currentUser = dao.findUserByCredentials(username, password);
        if (currentUser) {
            req.session['currentUser'] = currentUser;
            res.json(currentUser);
        } else {
            res.status(400).json({message: "Unable to login. Try again later."});
        }
     };

    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };

    const profile = (req, res) => {
        const currentUser = req.session['currentUser'];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
     };

     const findCoursesForEnrolledUser = (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
          const currentUser = req.session["currentUser"];
          if (!currentUser) {
            res.sendStatus(401);
            return;
          }
          userId = currentUser._id;
        }
        const courses = courseDao.findCoursesForEnrolledUser(userId);
        res.json(courses);
      };

      const createCourse = (req, res) => {
        const currentUser = req.session['currentUser'];
        const newCourse = courseDao.createCourse(req.body);
        enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
        res.json(newCourse);
      };

      app.get("/api/courses/:cid/users", (req, res) => {
        const { cid } = req.params;
        const enrolledUserIds = db.enrollments
          .filter((e) => e.course === cid)
          .map((e) => e.user);
        const users = db.users.filter((u) => enrolledUserIds.includes(u._id));
        res.send(users);
      });

      app.delete("/api/users/:uid", (req, res) => {
        const { uid } = req.params;
        db.users = db.users.filter((u) => u._id !== uid);
        res.send({ status: "deleted" });
      });

    app.post('/api/users', createUser);
    app.get('/api/users', findAllUsers);
    app.get('/api/users/:userId', findUserById);
    app.put('/api/users/:userId', updateUser);
    app.delete('/api/users/:userId', deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);
    app.get('/api/users/:userId/courses', findCoursesForEnrolledUser);
    app.post('/api/users/current/courses', createCourse);

}