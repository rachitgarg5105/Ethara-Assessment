const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const mockData = require('../mock-data');

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all tasks for the current user
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const status = req.query.status;
    const priority = req.query.priority;
    const project = req.query.project;
    const assignedTo = req.query.assignedTo;
    const search = req.query.search;
    
    let query = {};

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (project) {
      query.project = project;
    }

    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    if (search) {
      query.search = search;
    }

    const allTasks = mockData.tasks.find(query);
    
    // Apply pagination
    const tasks = allTasks.slice(skip, skip + limit);
    const total = allTasks.length;

    res.json({
      success: true,
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = mockData.tasks.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is a member of the project
    const project = mockData.projects.findById(task.project);
    const userId = '64f1a2b3c4d5e6f7g8h9i0j1'; // Demo user ID
    const isMember = project.owner._id === userId || 
                     project.members.some(m => m.user._id === userId);

    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new task
router.post('/', [
  body('title').trim().isLength({ min: 2, max: 200 }).withMessage('Task title must be between 2 and 200 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('project').notEmpty().withMessage('Project is required'),
  body('assignedTo').optional().notEmpty().withMessage('Invalid user ID'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('dueDate').optional().isISO8601().withMessage('Invalid due date'),
  body('estimatedHours').optional().isFloat({ min: 0, max: 1000 }).withMessage('Estimated hours must be between 0 and 1000')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, project, assignedTo, priority, dueDate, estimatedHours, tags } = req.body;

    // Check if project exists
    const projectDoc = mockData.projects.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is a member
    const userId = '64f1a2b3c4d5e6f7g8h9i0j1'; // Demo user ID
    const isMember = projectDoc.owner._id === userId || 
                     projectDoc.members.some(m => m.user._id === userId);

    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const taskData = {
      title,
      description,
      project,
      assignedTo: assignedTo || null,
      createdBy: { _id: '64f1a2b3c4d5e6f7g8h9i0j1', name: 'Demo Admin', email: 'admin@demo.com' },
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      estimatedHours,
      tags: tags || []
    };

    const task = mockData.tasks.create(taskData);

    res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 2, max: 200 }).withMessage('Task title must be between 2 and 200 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('status').optional().isIn(['todo', 'in-progress', 'review', 'completed']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('assignedTo').optional().notEmpty().withMessage('Invalid user ID'),
  body('dueDate').optional().isISO8601().withMessage('Invalid due date'),
  body('estimatedHours').optional().isFloat({ min: 0, max: 1000 }).withMessage('Estimated hours must be between 0 and 1000'),
  body('actualHours').optional().isFloat({ min: 0, max: 1000 }).withMessage('Actual hours must be between 0 and 1000')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = mockData.tasks.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is a member of the project
    const project = mockData.projects.findById(task.project);
    const userId = '64f1a2b3c4d5e6f7g8h9i0j1'; // Demo user ID
    const isMember = project.owner._id === userId || 
                     project.members.some(m => m.user._id === userId);

    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, status, priority, assignedTo, dueDate, estimatedHours, actualHours, tags } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (dueDate) updateData.dueDate = new Date(dueDate);
    if (estimatedHours !== undefined) updateData.estimatedHours = estimatedHours;
    if (actualHours !== undefined) updateData.actualHours = actualHours;
    if (tags) updateData.tags = tags;

    const updatedTask = mockData.tasks.updateById(req.params.id, updateData);

    res.json({
      success: true,
      task: updatedTask
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment to task
router.post('/:id/comments', [
  body('text').trim().isLength({ min: 1, max: 500 }).withMessage('Comment must be between 1 and 500 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is a member of the project
    const project = await Project.findById(task.project);
    if (!project.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { text } = req.body;

    task.comments.push({
      user: req.user.id,
      text,
      createdAt: new Date()
    });

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('project', 'name status')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('comments.user', 'name email');

    res.json({
      success: true,
      message: 'Comment added successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = mockData.tasks.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is a member of the project
    const project = mockData.projects.findById(task.project);
    const userId = '64f1a2b3c4d5e6f7g8h9i0j1'; // Demo user ID
    const isMember = project.owner._id === userId || 
                     project.members.some(m => m.user._id === userId);

    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    mockData.tasks.deleteById(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get task statistics for dashboard
router.get('/stats/dashboard', async (req, res) => {
  try {
    const stats = mockData.tasks.getStats();

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
