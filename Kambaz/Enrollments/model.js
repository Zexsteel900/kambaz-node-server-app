import mongoose from "mongoose";
import schema from "./schema.js";

const EnrollmentModel = mongoose.model("EnrollmentModel", schema);
export default EnrollmentModel;
