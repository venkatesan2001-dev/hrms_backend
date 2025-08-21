import { Router } from 'express';
import { body, param } from 'express-validator';
import PayrollAllocation from '../models/PayrollAllocation.js';

const router = Router();

router.get('/:userId', async (req, res, next) => {
  try {
    const allocations = await PayrollAllocation.find({ user: req.params.userId }).sort({ effectiveFrom: -1 });
    res.json(allocations);
  } catch (e) {
    next(e);
  }
});

router.post(
  '/',
  [
    body('user').isMongoId(),
    body('ctc').isNumeric(),
    body('basic').isNumeric(),
    body('hra').isNumeric(),
    body('allowances').optional().isNumeric(),
    body('deductions').optional().isNumeric(),
    body('effectiveFrom').isISO8601()
  ],
  async (req, res, next) => {
    try {
      const allocation = await PayrollAllocation.create(req.body);
      res.status(201).json(allocation);
    } catch (e) {
      next(e);
    }
  }
);

router.put('/:id', [param('id').isMongoId()], async (req, res, next) => {
  try {
    const allocation = await PayrollAllocation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(allocation);
  } catch (e) {
    next(e);
  }
});

export default router;


