import UsersDao from "./dao.js";

export default function UserRoutes(app) {
  const usersDao = UsersDao();

  // ----------------------
  // ACCOUNT ROUTES
  // ----------------------
  app.post("/api/users", async (req, res) => {
    try {
      const user = await usersDao.createUser(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      const { role, name } = req.query;

      if (role) return res.json(await usersDao.findUsersByRole(role));
      if (name) return res.json(await usersDao.findUsersByPartialName(name));

      const users = await usersDao.findAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:userId", async (req, res) => {
    try {
      const user = await usersDao.findUserById(req.params.userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.put("/api/users/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      await usersDao.updateUser(userId, req.body);
      const updatedUser = await usersDao.findUserById(userId);
      req.session["currentUser"] = updatedUser;
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/users/:userId", async (req, res) => {
    try {
      const status = await usersDao.deleteUser(req.params.userId);
      res.json(status);
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // ----------------------
  // AUTH ROUTES
  // ----------------------
  app.post("/api/users/signup", async (req, res) => {
    try {
      const { username, firstName } = req.body;
      if (!username || !firstName) {
        return res.status(400).json({ message: "Username and first name required" });
      }

      if (await usersDao.findUserByUsername(username)) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const currentUser = await usersDao.createUser(req.body);
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } catch (error) {
      console.error("Error signing up:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  app.post("/api/users/signin", async (req, res) => {
    try {
      const { username, password } = req.body;
      const currentUser = await usersDao.findUserByCredentials(username, password);
      
      if (!currentUser) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } catch (error) {
      console.error("Error signing in:", error);
      res.status(500).json({ message: "Failed to sign in" });
    }
  });

  app.post("/api/users/signout", (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  });

  app.post("/api/users/profile", (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    res.json(currentUser);
  });

  // ❌ REMOVED: Duplicate enrollment routes
  // These should ONLY be in CourseRoutes to avoid conflicts
  // The following routes were removed:
  // - GET /api/users/:userId/courses
  // - POST /api/users/:uid/courses/:cid
  // - DELETE /api/users/:uid/courses/:cid
  // - GET /api/courses/:cid/users
}