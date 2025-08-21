import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    employeeCode: { type: String, required: true, unique: true },
    role: { type: String, enum: ['EMPLOYEE', 'ADMIN', 'MANAGER'], default: 'EMPLOYEE' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);


