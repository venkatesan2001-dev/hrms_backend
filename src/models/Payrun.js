import mongoose from 'mongoose';

const PayrunSchema = new mongoose.Schema(
  {
    periodMonth: { type: Number, min: 1, max: 12, required: true },
    periodYear: { type: Number, required: true },
    status: { type: String, enum: ['DRAFT', 'PROCESSED', 'PAID'], default: 'DRAFT' },
    items: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        gross: { type: Number, required: true },
        totalDeductions: { type: Number, required: true },
        net: { type: Number, required: true }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Payrun', PayrunSchema);


