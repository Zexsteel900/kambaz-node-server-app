import PazzaDao from "./dao.js";

export default function PazzaRoutes(app) {
  const dao = PazzaDao();

  // ------------------------------
  // POSTS
  // ------------------------------
  app.post("/api/pazza/:courseId/posts", async (req, res) => {
    try {
      const { courseId } = req.params;
      const author = req.session?.currentUser?._id;

      if (!author) return res.status(401).send("Not logged in");

      const post = await dao.createPost({
        ...req.body,
        courseId,
        author,
      });

      res.json(post);
    } catch (e) {
      console.error("Create post error:", e);
      res.status(500).send("Error creating post");
    }
  });

  app.get("/api/pazza/:courseId/posts", async (req, res) => {
    res.json(await dao.findPostsByCourse(req.params.courseId));
  });

  app.get("/api/pazza/posts/:postId", async (req, res) => {
    const post = await dao.findPostById(req.params.postId);
    res.json(post ?? {});
  });

  app.put("/api/pazza/posts/:postId", async (req, res) => {
    res.json(await dao.updatePost(req.params.postId, req.body));
  });

  app.delete("/api/pazza/posts/:postId", async (req, res) => {
    res.json(await dao.deletePost(req.params.postId));
  });

  // ------------------------------
  // ANSWERS
  // ------------------------------
  app.post("/api/pazza/posts/:postId/answers", async (req, res) => {
    try {
      const user = req.session?.currentUser;
      if (!user) return res.status(401).send("Not logged in");

      const answer = await dao.addAnswer(req.params.postId, {
        author: user._id,
        text: req.body.text,
        isInstructor: user.role === "FACULTY",
      });

      res.json(answer);
    } catch (e) {
      console.error("Add answer error:", e);
      res.status(500).send("Error adding answer");
    }
  });

  app.put("/api/pazza/posts/:postId/answers/:answerId", async (req, res) => {
    res.json(await dao.updateAnswer(req.params.postId, req.params.answerId, req.body));
  });

  app.delete("/api/pazza/posts/:postId/answers/:answerId", async (req, res) => {
    res.json(await dao.deleteAnswer(req.params.postId, req.params.answerId));
  });

  // ------------------------------
  // FOLLOWUPS & REPLIES
  // ------------------------------
  app.post("/api/pazza/posts/:postId/followups", async (req, res) => {
    const user = req.session?.currentUser;
    if (!user) return res.status(401).send("Not logged in");

    const followup = await dao.addFollowup(req.params.postId, {
      author: user._id,
      text: req.body.text,
    });

    res.json(followup);
  });

  app.post("/api/pazza/posts/:postId/followups/:fid/replies", async (req, res) => {
    const user = req.session?.currentUser;
    if (!user) return res.status(401).send("Not logged in");

    const reply = await dao.addReply(req.params.postId, req.params.fid, {
      author: user._id,
      text: req.body.text,
    });

    res.json(reply);
  });

  app.delete("/api/pazza/posts/:postId/followups/:fid", async (req, res) => {
    res.json(await dao.deleteFollowup(req.params.postId, req.params.fid));
  });

  app.delete("/api/pazza/posts/:postId/followups/:fid/replies/:rid", async (req, res) => {
    res.json(await dao.deleteReply(req.params.postId, req.params.fid, req.params.rid));
  });

  // ------------------------------
  // FOLDERS
  // ------------------------------
  app.get("/api/pazza/:courseId/folders", async (req, res) => {
    res.json(await dao.getFolders(req.params.courseId));
  });

  app.post("/api/pazza/:courseId/folders", async (req, res) => {
    res.json(await dao.createFolder(req.params.courseId, req.body.name));
  });

  app.delete("/api/pazza/folders/:id", async (req, res) => {
    res.json(await dao.deleteFolder(req.params.id));
  });

  // ------------------------------
  // CLASS STATS
  // ------------------------------
  app.get("/api/pazza/:courseId/stats", async (req, res) => {
    const stats = await dao.getStats(req.params.courseId);
    res.json(stats);
  });
}
