import { Router } from 'express';
import { body, param } from 'express-validator';
import User from '../models/User.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (e) {
    next(e);
  }
});

router.post(
  '/',
  [
    body('firstName').notEmpty(),
    body('lastName').notEmpty(),
    body('email').isEmail(),
    body('employeeCode').notEmpty(),
    body('role').optional().isIn(['EMPLOYEE', 'ADMIN', 'MANAGER'])
  ],
  async (req, res, next) => {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  }
);

router.put(
  '/:id',
  [param('id').isMongoId()],
  async (req, res, next) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(user);
    } catch (e) {
      next(e);
    }
  }
);

router.delete('/:id', [param('id').isMongoId()], async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;


