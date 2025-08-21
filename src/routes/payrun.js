import { Router } from 'express';
import { body, param } from 'express-validator';
import dayjs from 'dayjs';
import PayrollAllocation from '../models/PayrollAllocation.js';
import Payrun from '../models/Payrun.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const payruns = await Payrun.find().sort({ createdAt: -1 });
    res.json(payruns);
  } catch (e) {
    next(e);
  }
});

router.post(
  '/generate',
  [body('periodMonth').isInt({ min: 1, max: 12 }), body('periodYear').isInt({ min: 2000 })],
  async (req, res, next) => {
    try {
      const { periodMonth, periodYear } = req.body;

      const start = dayjs(`${periodYear}-${String(periodMonth).padStart(2, '0')}-01`).startOf('month').toDate();
      const end = dayjs(start).endOf('month').toDate();

      const allocations = await PayrollAllocation.aggregate([
        { $match: { effectiveFrom: { $lte: end } } },
        { $sort: { effectiveFrom: -1 } },
        {
          $group: {
            _id: '$user',
            allocation: { $first: '$$ROOT' }
          }
        }
      ]);

      const items = allocations.map((a) => {
        const gross = a.allocation.basic + a.allocation.hra + a.allocation.allowances;
        const totalDeductions = a.allocation.deductions;
        const net = gross - totalDeductions;
        return { user: a._id, gross, totalDeductions, net };
      });

      const payrun = await Payrun.create({ periodMonth, periodYear, items, status: 'DRAFT' });
      res.status(201).json(payrun);
    } catch (e) {
      next(e);
    }
  }
);

router.post('/:id/process', [param('id').isMongoId()], async (req, res, next) => {
  try {
    const payrun = await Payrun.findByIdAndUpdate(
      req.params.id,
      { status: 'PROCESSED' },
      { new: true }
    );
    res.json(payrun);
  } catch (e) {
    next(e);
  }
});

router.post('/:id/mark-paid', [param('id').isMongoId()], async (req, res, next) => {
  try {
    const payrun = await Payrun.findByIdAndUpdate(
      req.params.id,
      { status: 'PAID' },
      { new: true }
    );
    res.json(payrun);
  } catch (e) {
    next(e);
  }
});

export default router;


