import model from "./model.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

export default function UsersDao() {
  
  const createUser = async (user) => {
    try {
      // Remove _id if present
      const { _id, ...rest } = user;

      // Generate safe, unique username
      const username = rest.username || `newuser${Date.now()}`;

      const newUser = {
        ...rest,
        _id: uuidv4(),
        firstName: rest.firstName || "New",
        lastName: rest.lastName || `User${Date.now()}`,
        username,
        password: rest.password || "password123",
        email: rest.email || `email${Date.now()}@neu.edu`,
        section: rest.section || "S101",
        role: rest.role || "STUDENT",
      };

      return await model.create(newUser);
    } catch (err) {
      console.error("DAO createUser error:", err);

      if (err.code === 11000 && err.keyPattern?.username) {
        throw new Error("Username already exists");
      }
      if (err.name === "ValidationError") {
        throw new Error(
          Object.values(err.errors).map((e) => e.message).join(", ")
        );
      }
      throw new Error("Failed to create user");
    }
  };
  const findAllUsers = () => model.find({});
  
  const findUserById = (userId) => model.findById(userId);

  const findUserByUsername = (username) => model.findOne({ username });

  const findUsersByRole = (role) => model.find({ role });

  const findUsersByPartialName = (name) => {
    const regex = new RegExp(name, "i");
    return model.find({
      $or: [{ firstName: regex }, { lastName: regex }],
    });
  };

  const updateUser = (userId, user) => model.updateOne({ _id: userId }, { $set: user });

  const deleteUser = (userId) => model.findByIdAndDelete(userId);

  const findUserByCredentials = (username, password) =>
    model.findOne({ username, password });

  return {
    createUser,
    findAllUsers,
    findUserById,
    findUserByUsername,
    findUsersByRole,
    findUsersByPartialName,
    updateUser,
    deleteUser,
    findUserByCredentials,
  };
}
