const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const mockData = require('../mock-data');

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all projects for the current user
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const status = req.query.status;
    const search = req.query.search;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }

    if (search) {
      query.search = search;
    }

    const allProjects = mockData.projects.find(query);
    
    // Apply pagination
    const projects = allProjects.slice(skip, skip + limit);
    const total = allProjects.length;

    res.json({
      success: true,
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = mockData.projects.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is a member or owner
    const userId = '64f1a2b3c4d5e6f7g8h9i0j1'; // Demo user ID
    const isMember = project.owner._id === userId || 
                     project.members.some(m => m.user._id === userId);

    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get project tasks
    const tasks = mockData.tasks.find({ project: project._id });

    res.json({
      success: true,
      project,
      tasks
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new project
router.post('/', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Project name must be between 2 and 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('startDate').optional().isISO8601().withMessage('Invalid start date'),
  body('endDate').optional().isISO8601().withMessage('Invalid end date')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, priority, startDate, endDate, tags } = req.body;

    const projectData = {
      name,
      description,
      owner: { _id: '64f1a2b3c4d5e6f7g8h9i0j1', name: 'Demo Admin', email: 'admin@demo.com' },
      priority,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : undefined,
      tags: tags || []
    };

    const project = mockData.projects.create(projectData);

    res.status(201).json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project
router.put('/:id', [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Project name must be between 2 and 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('status').optional().isIn(['planning', 'active', 'completed', 'on-hold']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = mockData.projects.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin of the project
    const userId = '64f1a2b3c4d5e6f7g8h9i0j1'; // Demo user ID
    const isAdmin = project.owner._id === userId || 
                  project.members.some(m => m.user._id === userId && m.role === 'admin');

    if (!isAdmin) {
      return res.status(403).json({ message: 'Access denied. Only project admins can update projects' });
    }

    const { name, description, status, priority, startDate, endDate, tags } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (tags) updateData.tags = tags;

    const updatedProject = mockData.projects.updateById(req.params.id, updateData);

    res.json({
      success: true,
      project: updatedProject
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add member to project
router.post('/:id/members', [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('role').optional().isIn(['admin', 'member']).withMessage('Role must be either admin or member')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin of the project
    if (!project.isAdmin(req.user.id)) {
      return res.status(403).json({ message: 'Access denied. Only project admins can add members' });
    }

    const { email, role = 'member' } = req.body;

    // Find user by email
    const userToAdd = await User.findOne({ email });

    if (!userToAdd) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already a member
    if (project.isMember(userToAdd._id)) {
      return res.status(400).json({ message: 'User is already a member of this project' });
    }

    // Add member to project
    project.addMember(userToAdd._id, role);
    await project.save();

    // Add project to user's joined projects
    await User.findByIdAndUpdate(userToAdd._id, {
      $push: { joinedProjects: project._id }
    });

    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    res.json({
      success: true,
      message: 'Member added successfully',
      project: updatedProject
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove member from project
router.delete('/:id/members/:userId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin of the project
    if (!project.isAdmin(req.user.id)) {
      return res.status(403).json({ message: 'Access denied. Only project admins can remove members' });
    }

    const userIdToRemove = req.params.userId;

    // Cannot remove the project owner
    if (project.owner.toString() === userIdToRemove) {
      return res.status(400).json({ message: 'Cannot remove project owner' });
    }

    // Check if user is a member
    if (!project.isMember(userIdToRemove)) {
      return res.status(404).json({ message: 'User is not a member of this project' });
    }

    // Remove member from project
    project.removeMember(userIdToRemove);
    await project.save();

    // Remove project from user's joined projects
    await User.findByIdAndUpdate(userIdToRemove, {
      $pull: { joinedProjects: project._id }
    });

    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    res.json({
      success: true,
      message: 'Member removed successfully',
      project: updatedProject
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const project = mockData.projects.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only project owner can delete the project
    const userId = '64f1a2b3c4d5e6f7g8h9i0j1'; // Demo user ID
    if (project.owner._id !== userId) {
      return res.status(403).json({ message: 'Access denied. Only project owner can delete projects' });
    }

    // Delete the project (mock data also deletes associated tasks)
    mockData.projects.deleteById(req.params.id);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
