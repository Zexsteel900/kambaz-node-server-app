import model from "./model.js";
import bcrypt from "bcrypt";

export default function UsersDao() {
  
  // ----------------------
  // CREATE USER
  // ----------------------
  const createUser = async (user) => {
    try {
      // Remove any _id the frontend accidentally sends
      const { _id, password, ...rest } = user;

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        ...rest,
        password: hashedPassword,
      };

      return await model.create(newUser);
    } catch (err) {
      console.error("DAO createUser error:", err);

      if (err.code === 11000 && err.keyPattern?.username) {
        throw new Error("Username already exists");
      }
      throw new Error("Failed to create user");
    }
  };

  // ----------------------
  // FIND USERS
  // ----------------------
  const findAllUsers = () => model.find({});

  const findUserById = (userId) => model.findById(userId);

  const findUserByUsername = (username) =>
    model.findOne({ username });

  const findUsersByRole = (role) =>
    model.find({ role });

  const findUsersByPartialName = (name) => {
    const regex = new RegExp(name, "i");
    return model.find({
      $or: [{ firstName: regex }, { lastName: regex }],
    });
  };

  // ----------------------
  // UPDATE USER
  // ----------------------
  const updateUser = async (userId, user) => {
    // Prevent password overwrite unless explicitly provided
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    return model.findByIdAndUpdate(userId, user, { new: true });
  };

  // ----------------------
  // DELETE USER
  // ----------------------
  const deleteUser = (userId) =>
    model.findByIdAndDelete(userId);

  // ----------------------
  // SIGNIN: VERIFY PASSWORD
  // ----------------------
  const findUserByCredentials = async (username, password) => {
    const user = await model.findOne({ username });
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    return match ? user : null;
  };

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
