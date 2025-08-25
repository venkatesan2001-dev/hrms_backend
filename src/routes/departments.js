import express from 'express';
import Department from '../models/Department.js';

const router = express.Router();

// Get all departments with pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    
    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }
    
    // Pagination options
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      select: 'name code description status createdAt updatedAt'
    };
    
    const result = await Department.paginate(query, options);
    
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
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch departments',
      error: error.message 
    });
  }
});

// Get single department by ID
router.get('/:id', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({ 
        success: false, 
        message: 'Department not found' 
      });
    }
    
    res.json({ success: true, data: department });
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch department',
      error: error.message 
    });
  }
});

// Create new department
router.post('/', async (req, res) => {
  try {
    const { name, code, description, status = 'active' } = req.body;
    
    // Validation
    if (!name || !code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and code are required' 
      });
    }
    
    // Check if department with same name or code already exists
    const existingDept = await Department.findOne({
      $or: [{ name }, { code: code.toUpperCase() }]
    });
    
    if (existingDept) {
      return res.status(400).json({ 
        success: false, 
        message: 'Department with this name or code already exists' 
      });
    }
    
    const department = new Department({
      name,
      code: code.toUpperCase(),
      description,
      status
    });
    
    await department.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Department created successfully',
      data: department 
    });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create department',
      error: error.message 
    });
  }
});

// Update department
router.put('/:id', async (req, res) => {
  try {
    const { name, code, description, status } = req.body;
    
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({ 
        success: false, 
        message: 'Department not found' 
      });
    }
    
    // Check if updated name or code conflicts with existing departments
    if (name || code) {
      const existingDept = await Department.findOne({
        _id: { $ne: req.params.id },
        $or: [
          { name: name || department.name },
          { code: (code || department.code).toUpperCase() }
        ]
      });
      
      if (existingDept) {
        return res.status(400).json({ 
          success: false, 
          message: 'Department with this name or code already exists' 
        });
      }
    }
    
    // Update fields
    if (name) department.name = name;
    if (code) department.code = code.toUpperCase();
    if (description !== undefined) department.description = description;
    if (status) department.status = status;
    
    await department.save();
    
    res.json({ 
      success: true, 
      message: 'Department updated successfully',
      data: department 
    });
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update department',
      error: error.message 
    });
  }
});

// Delete department
router.delete('/:id', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({ 
        success: false, 
        message: 'Department not found' 
      });
    }
    
    await Department.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true, 
      message: 'Department deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete department',
      error: error.message 
    });
  }
});

export default router;
