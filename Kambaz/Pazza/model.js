import mongoose from "mongoose";
import { PostSchema, FolderSchema } from "./schema.js";

export const PostModel = mongoose.model("PazzaPostModel", PostSchema);
export const FolderModel = mongoose.model("PazzaFolderModel", FolderSchema);
