// Mock database for demo purposes
let projects = [
  {
    _id: 'proj1',
    name: 'Website Redesign',
    description: 'Complete redesign of the company website with modern UI/UX',
    owner: { _id: '64f1a2b3c4d5e6f7g8h9i0j1', name: 'Demo Admin', email: 'admin@demo.com' },
    members: [
      { user: { _id: '64f1a2b3c4d5e6f7g8h9i0j1', name: 'Demo Admin', email: 'admin@demo.com' }, role: 'admin', joinedAt: new Date('2024-01-15') },
      { user: { _id: '2', name: 'John Doe', email: 'john@example.com' }, role: 'member', joinedAt: new Date('2024-01-16') }
    ],
    status: 'active',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-03-15'),
    priority: 'high',
    tags: ['design', 'frontend', 'urgent'],
    progress: 65,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    _id: 'proj2',
    name: 'Mobile App Development',
    description: 'Develop a cross-platform mobile application for iOS and Android',
    owner: { _id: '64f1a2b3c4d5e6f7g8h9i0j1', name: 'Demo Admin', email: 'admin@demo.com' },
    members: [
      { user: { _id: '64f1a2b3c4d5e6f7g8h9i0j1', name: 'Demo Admin', email: 'admin@demo.com' }, role: 'admin', joinedAt: new Date('2024-02-01') }
    ],
    status: 'planning',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-06-01'),
    priority: 'medium',
    tags: ['mobile', 'react-native', 'development'],
    progress: 15,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-05')
  },
  {
    _id: 'proj3',
    name: 'API Integration',
    description: 'Integrate third-party APIs for payment processing and analytics',
    owner: { _id: '64f1a2b3c4d5e6f7g8h9i0j1', name: 'Demo Admin', email: 'admin@demo.com' },
    members: [
      { user: { _id: '64f1a2b3c4d5e6f7g8h9i0j1', name: 'Demo Admin', email: 'admin@demo.com' }, role: 'admin', joinedAt: new Date('2024-01-20') },
      { user: { _id: '3', name: 'Mike Johnson', email: 'mike@example.com' }, role: 'member', joinedAt: new Date('2024-01-21') }
    ],
    status: 'completed',
    startDate: new Date('2024-01-20'),
    endDate: new Date('2024-02-20'),
    priority: 'low',
    tags: ['api', 'backend', 'integration'],
    progress: 100,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-20')
  }
];

let tasks = [
  {
    _id: 'task1',
    title: 'Create wireframes for homepage',
    description: 'Design and create wireframes for the new homepage layout',
    project: 'proj1',
    assignedTo: { _id: '2', name: 'John Doe', email: 'john@example.com' },
    createdBy: { _id: '64f1a2b3c4d5e6f7g8h9i0j1', name: 'Demo Admin', email: 'admin@demo.com' },
    status: 'completed',
    priority: 'high',
    dueDate: new Date('2024-01-25'),
    estimatedHours: 8,
    actualHours: 6,
    tags: ['design', 'wireframes'],
    comments: [],
    dependencies: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-24'),
    completedAt: new Date('2024-01-24')
  },
  {
    _id: 'task2',
    title: 'Implement responsive navigation',
    description: 'Create a responsive navigation menu that works on all devices',
    project: 'proj1',
    assignedTo: { _id: '64f1a2b3c4d5e6f7g8h9i0j1', name: 'Demo Admin', email: 'admin@demo.com' },
    createdBy: { _id: '64f1a2b3c4d5e6f7g8h9i0j1', name: 'Demo Admin', email: 'admin@demo.com' },
    status: 'in-progress',
    priority: 'medium',
    dueDate: new Date('2024-02-01'),
    estimatedHours: 12,
    actualHours: 8,
    tags: ['frontend', 'css', 'responsive'],
    comments: [
      { user: { _id: '64f1a2b3c4d5e6f7g8h9i0j1', name: 'Demo Admin' }, text: 'Started working on the mobile menu', createdAt: new Date('2024-01-26') }
    ],
    dependencies: ['task1'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-26')
  },
  {
    _id: 'task3',
    title: 'Set up React Native project',
    description: 'Initialize the React Native project and configure development environment',
    project: 'proj2',
    assignedTo: { _id: '64f1a2b3c4d5e6f7g8h9i0j1', name: 'Demo Admin', email: 'admin@demo.com' },
    createdBy: { _id: '64f1a2b3c4d5e6f7g8h9i0j1', name: 'Demo Admin', email: 'admin@demo.com' },
    status: 'todo',
    priority: 'high',
    dueDate: new Date('2024-02-10'),
    estimatedHours: 4,
    actualHours: 0,
    tags: ['mobile', 'setup', 'react-native'],
    comments: [],
    dependencies: [],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    _id: 'task4',
    title: 'Research payment gateway APIs',
    description: 'Research and compare different payment gateway options',
    project: 'proj3',
    assignedTo: { _id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
    createdBy: { _id: '64f1a2b3c4d5e6f7g8h9i0j1', name: 'Demo Admin', email: 'admin@demo.com' },
    status: 'completed',
    priority: 'medium',
    dueDate: new Date('2024-01-30'),
    estimatedHours: 6,
    actualHours: 5,
    tags: ['research', 'api', 'payment'],
    comments: [],
    dependencies: [],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-29'),
    completedAt: new Date('2024-01-29')
  }
];

// Mock data functions
const mockData = {
  projects: {
    find: (query = {}) => {
      let filtered = [...projects];
      
      // Apply filters
      if (query.status) {
        filtered = filtered.filter(p => p.status === query.status);
      }
      
      if (query.search) {
        const searchLower = query.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply user filter
      const userId = '64f1a2b3c4d5e6f7g8h9i0j1'; // Demo user ID
      filtered = filtered.filter(p => 
        p.owner._id === userId || 
        p.members.some(m => m.user._id === userId)
      );
      
      return filtered;
    },
    
    findById: (id) => {
      return projects.find(p => p._id === id);
    },
    
    create: (data) => {
      const newProject = {
        _id: Date.now().toString(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        members: [
          { user: data.owner, role: 'admin', joinedAt: new Date() }
        ]
      };
      projects.push(newProject);
      return newProject;
    },
    
    updateById: (id, data) => {
      const index = projects.findIndex(p => p._id === id);
      if (index !== -1) {
        projects[index] = { ...projects[index], ...data, updatedAt: new Date() };
        return projects[index];
      }
      return null;
    },
    
    deleteById: (id) => {
      const index = projects.findIndex(p => p._id === id);
      if (index !== -1) {
        const deleted = projects.splice(index, 1)[0];
        // Also delete associated tasks
        tasks = tasks.filter(t => t.project !== id);
        return deleted;
      }
      return null;
    },
    
    addMember: (projectId, memberData) => {
      const project = projects.find(p => p._id === projectId);
      if (project) {
        const existingMember = project.members.find(m => m.user._id === memberData.user._id);
        if (!existingMember) {
          project.members.push({
            user: memberData.user,
            role: memberData.role || 'member',
            joinedAt: new Date()
          });
          project.updatedAt = new Date();
        }
        return project;
      }
      return null;
    },
    
    removeMember: (projectId, userId) => {
      const project = projects.find(p => p._id === projectId);
      if (project) {
        project.members = project.members.filter(m => m.user._id !== userId);
        project.updatedAt = new Date();
        return project;
      }
      return null;
    }
  },
  
  tasks: {
    find: (query = {}) => {
      let filtered = [...tasks];
      
      // Apply filters
      if (query.status) {
        filtered = filtered.filter(t => t.status === query.status);
      }
      
      if (query.priority) {
        filtered = filtered.filter(t => t.priority === query.priority);
      }
      
      if (query.project) {
        filtered = filtered.filter(t => t.project === query.project);
      }
      
      if (query.assignedTo) {
        filtered = filtered.filter(t => t.assignedTo?._id === query.assignedTo);
      }
      
      if (query.search) {
        const searchLower = query.search.toLowerCase();
        filtered = filtered.filter(t => 
          t.title.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Filter by user's projects
      const userId = '64f1a2b3c4d5e6f7g8h9i0j1'; // Demo user ID
      const userProjects = projects.filter(p => 
        p.owner._id === userId || 
        p.members.some(m => m.user._id === userId)
      ).map(p => p._id);
      
      filtered = filtered.filter(t => userProjects.includes(t.project));
      
      return filtered;
    },
    
    findById: (id) => {
      return tasks.find(t => t._id === id);
    },
    
    create: (data) => {
      const newTask = {
        _id: Date.now().toString(),
        ...data,
        comments: [],
        dependencies: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      tasks.push(newTask);
      return newTask;
    },
    
    updateById: (id, data) => {
      const index = tasks.findIndex(t => t._id === id);
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...data, updatedAt: new Date() };
        return tasks[index];
      }
      return null;
    },
    
    deleteById: (id) => {
      const index = tasks.findIndex(t => t._id === id);
      if (index !== -1) {
        return tasks.splice(index, 1)[0];
      }
      return null;
    },
    
    addComment: (taskId, comment) => {
      const task = tasks.find(t => t._id === taskId);
      if (task) {
        task.comments.push({
          user: comment.user,
          text: comment.text,
          createdAt: new Date()
        });
        task.updatedAt = new Date();
        return task;
      }
      return null;
    },
    
    getStats: () => {
      const userId = '64f1a2b3c4d5e6f7g8h9i0j1'; // Demo user ID
      const userTasks = tasks.filter(t => {
        const userProjects = projects.filter(p => 
          p.owner._id === userId || 
          p.members.some(m => m.user._id === userId)
        ).map(p => p._id);
        return userProjects.includes(t.project);
      });
      
      const stats = userTasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {});
      
      const overdue = userTasks.filter(t => 
        t.dueDate && 
        new Date(t.dueDate) < new Date() && 
        t.status !== 'completed'
      ).length;
      
      const myTasks = userTasks.filter(t => 
        t.assignedTo?._id === userId && 
        t.status !== 'completed'
      ).length;
      
      return {
        byStatus: Object.entries(stats).map(([status, count]) => ({ _id: status, count })),
        overdue,
        myTasks
      };
    }
  }
};

module.exports = mockData;
