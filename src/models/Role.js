import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      uppercase: true,
    },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

roleSchema.plugin(mongoosePaginate);

const Role = mongoose.model("Role", roleSchema);
export default Role;
