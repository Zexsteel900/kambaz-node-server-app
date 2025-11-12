import db from "../Database/index.js";
import {v4 as uuidv4} from "uuid";

export function findModulesForCourse(courseId) {
    const {modules} = db;
    return modules.filter((module) => module.course === courseId);
}

export function createModule(module) {
    const newModule = {...module, _id: uuidv4()};
    db.modules = [...db.modules, newModule];
    return newModule;
}

export function deleteModule(moduleId) {
    const {modules} = db;
    db.modules = modules.filter((module) => module._id !== moduleId);
}

export function updateModule(moduleId, moduleUpdates) {
    const {modules} = db;
    const module = modules.find((module) => module._id === moduleId);
    Object.assign(module, moduleUpdates);
    return module;
}