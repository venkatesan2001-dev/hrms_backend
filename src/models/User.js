import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    employeeCode: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["EMPLOYEE", "ADMIN", "MANAGER"],
      default: "EMPLOYEE",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Add pagination plugin
UserSchema.plugin(mongoosePaginate);

// Indexes for better performance

export default mongoose.model("User", UserSchema);
