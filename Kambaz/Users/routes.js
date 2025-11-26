import UsersDao from "./dao.js";
import * as CourseDao from "../Courses/dao.js";
import * as EnrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
  const dao = UsersDao();

  // ----------------------
  // ACCOUNT ROUTES
  // ----------------------

  const createUser = async (req, res) => {
  try {
    const user = await dao.createUser(req.body);
    res.json(user);
  } catch (err) {
    console.error("Route createUser error:", err.message);
    res.status(500).json({ message: err.message });
  }
  };

  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;

    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }

    if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }

    const users = await dao.findAllUsers();
    res.json(users);
  };

  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    res.json(user);
  };

  const updateUser = async (req, res) => {
    const userId = req.params.userId;
    await dao.updateUser(userId, req.body);
    const updatedUser = await dao.findUserById(userId);
    req.session["currentUser"] = updatedUser;
    res.json(updatedUser);
  };

  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };

  const signup = async (req, res) => {
    const { username, firstName } = req.body;

    // Validation
    if (!username || username.trim() === "" || !firstName || firstName.trim() === "") {
      res.status(400).json({ message: "Username and first name are required" });
      return;
    }

    const existingUser = await dao.findUserByUsername(username);
    if (existingUser) {
      res.status(400).json({ message: "Username already exists" });
      return;
    }

    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (!currentUser) {
      res.status(401).json({ message: "Unable to login. Try again later." });
      return;
    }
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signout = async (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  // ----------------------
  // COURSES FOR USER
  // ----------------------
  const findCoursesForEnrolledUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = await CourseDao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };

  const createCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const newCourse = await CourseDao.createCourse(req.body);
    await EnrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };

  // ----------------------
  // ROUTE DEFINITIONS
  // ----------------------
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);

  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);

  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.post("/api/users/current/courses", createCourse);

  // Enrolled users in a course
  app.get("/api/courses/:cid/users", async (req, res) => {
    const { cid } = req.params;
    const enrolledUserIds = await EnrollmentsDao.findUsersByCourseId(cid);
    const users = await dao.findAllUsers();
    const enrolledUsers = users.filter(u => enrolledUserIds.includes(u._id));
    res.json(enrolledUsers);
  });
}
