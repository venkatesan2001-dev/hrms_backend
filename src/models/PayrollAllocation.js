import mongoose from 'mongoose';

const PayrollAllocationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    ctc: { type: Number, required: true },
    basic: { type: Number, required: true },
    hra: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    effectiveFrom: { type: Date, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('PayrollAllocation', PayrollAllocationSchema);


