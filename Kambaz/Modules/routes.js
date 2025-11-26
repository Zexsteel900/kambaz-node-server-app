import ModulesDao from "./dao.js";

export default function ModulesRoutes(app, db) {
  const modulesDao = ModulesDao(db);

  // ----------------------
  // Fetch modules for a course
  // ----------------------
  const findModulesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const modules = await modulesDao.findModulesForCourse(courseId);
    res.json(modules);
  };
  app.get("/api/courses/:courseId/modules", findModulesForCourse);

  // ----------------------
  // Create a module
  // ----------------------
  const createModuleForCourse = async (req, res) => {
    const { courseId } = req.params;
    const module = req.body;
    const newModule = await modulesDao.createModule(courseId, module);
    res.json(newModule);
  };
  app.post("/api/courses/:courseId/modules", createModuleForCourse);

  // ----------------------
  // Update a module
  // ----------------------
  const updateModule = async (req, res) => {
    const { courseId, moduleId } = req.params;
    const moduleUpdates = req.body;
    const updatedModule = await modulesDao.updateModule(courseId, moduleId, moduleUpdates);
    res.json(updatedModule);
  };
  app.put("/api/courses/:courseId/modules/:moduleId", updateModule);

  // ----------------------
  // Delete a module
  // ----------------------
  const deleteModule = async (req, res) => {
    const { courseId, moduleId } = req.params;
    const status = await modulesDao.deleteModule(courseId, moduleId);
    res.json(status);
  };
  app.delete("/api/courses/:courseId/modules/:moduleId", deleteModule);
}
