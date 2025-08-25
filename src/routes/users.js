import { Router } from 'express';
import { body, param } from 'express-validator';
import User from '../models/User.js';

const router = Router();

// Get all users with pagination
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', role = '', isActive = '' } = req.query;
    
    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeCode: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }
    
    if (isActive !== '') {
      query.isActive = isActive === 'true';
    }
    
    // Pagination options
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      select: 'firstName lastName email employeeCode role isActive createdAt updatedAt'
    };
    
    const result = await User.paginate(query, options);
    
    res.json({
      success: true,
      data: result.docs,
      pagination: {
        page: result.page,
        limit: result.limit,
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
        nextPage: result.nextPage,
        prevPage: result.prevPage
      }
    });
  } catch (e) {
    next(e);
  }
});

// Get single user by ID
router.get('/:id', [param('id').isMongoId()], async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({ success: true, data: user });
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
      res.status(201).json({ success: true, data: user });
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
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
      
      res.json({ success: true, data: user });
    } catch (e) {
      next(e);
    }
  }
);

router.delete('/:id', [param('id').isMongoId()], async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (e) {
    next(e);
  }
});

export default router;


