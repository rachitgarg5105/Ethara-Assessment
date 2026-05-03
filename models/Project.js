const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['planning', 'active', 'completed', 'on-hold'],
    default: 'planning'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  tags: [{
    type: String,
    trim: true
  }],
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
projectSchema.index({ owner: 1, status: 1 });
projectSchema.index({ 'members.user': 1 });

// Method to check if user is a member
projectSchema.methods.isMember = function(userId) {
  return this.members.some(member => member.user.toString() === userId.toString()) || 
         this.owner.toString() === userId.toString();
};

// Method to check if user is admin
projectSchema.methods.isAdmin = function(userId) {
  return this.owner.toString() === userId.toString() || 
         this.members.some(member => 
           member.user.toString() === userId.toString() && member.role === 'admin'
         );
};

// Method to add member
projectSchema.methods.addMember = function(userId, role = 'member') {
  if (!this.isMember(userId)) {
    this.members.push({ user: userId, role: role });
  }
};

// Method to remove member
projectSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(member => member.user.toString() !== userId.toString());
};

// Method to update progress based on tasks
projectSchema.methods.updateProgress = async function() {
  const Task = mongoose.model('Task');
  const tasks = await Task.find({ project: this._id });
  
  if (tasks.length === 0) {
    this.progress = 0;
  } else {
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    this.progress = Math.round((completedTasks / tasks.length) * 100);
  }
  
  return this.save();
};

module.exports = mongoose.model('Project', projectSchema);
