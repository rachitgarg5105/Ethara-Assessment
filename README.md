# Team Task Manager

A full-stack web application for team project management with role-based access control, built with Node.js/Express backend and React frontend.

## 🚀 Features

- **Authentication**: User registration and login with JWT tokens
- **Role-Based Access Control**: Admin and Member roles with different permissions
- **Project Management**: Create, manage, and collaborate on projects
- **Task Management**: Create, assign, and track tasks with status updates
- **Dashboard**: Overview of projects, tasks, and team statistics
- **Team Collaboration**: Add/remove team members from projects
- **Real-time Updates**: Task progress tracking and project statistics
- **Modern UI**: Clean, responsive interface built with Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security middleware
- **cors** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icons
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Ethara_Assessment
```

### 2. Backend Setup

1. Install backend dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=30d
```

3. Start MongoDB (if using local installation):
```bash
mongod
```

4. Start the backend server:
```bash
npm run dev
```

The backend API will be running on `http://localhost:5000`

### 3. Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will be running on `http://localhost:3000`

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Projects
- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member to project
- `DELETE /api/projects/:id/members/:userId` - Remove member

### Tasks
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/comments` - Add comment to task
- `GET /api/tasks/stats/dashboard` - Get dashboard statistics

### Users
- `GET /api/users` - Get all users (for member selection)
- `GET /api/users/:id` - Get user by ID

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/member),
  avatar: String,
  isActive: Boolean,
  joinedProjects: [ObjectId]
}
```

### Project Model
```javascript
{
  name: String,
  description: String,
  owner: ObjectId (ref: User),
  members: [{
    user: ObjectId (ref: User),
    role: String (admin/member),
    joinedAt: Date
  }],
  status: String (planning/active/completed/on-hold),
  startDate: Date,
  endDate: Date,
  priority: String (low/medium/high/urgent),
  tags: [String],
  progress: Number (0-100)
}
```

### Task Model
```javascript
{
  title: String,
  description: String,
  project: ObjectId (ref: Project),
  assignedTo: ObjectId (ref: User),
  createdBy: ObjectId (ref: User),
  status: String (todo/in-progress/review/completed),
  priority: String (low/medium/high/urgent),
  dueDate: Date,
  estimatedHours: Number,
  actualHours: Number,
  tags: [String],
  comments: [{
    user: ObjectId (ref: User),
    text: String,
    createdAt: Date
  }],
  dependencies: [ObjectId (ref: Task)],
  completedAt: Date
}
```

## 🔐 Authentication & Authorization

- JWT tokens are used for authentication
- Tokens are stored in localStorage and sent with each API request
- Role-based access control:
  - **Admin**: Full access to all features
  - **Member**: Limited access based on project membership
- Protected routes require valid JWT token
- Project-level permissions for members

## 🎨 UI Components

The application uses a modern, clean design with:
- Responsive layout that works on desktop and mobile
- Tailwind CSS for styling
- Lucide React for consistent iconography
- React Hot Toast for user notifications
- Form validation with React Hook Form

## 📱 Features Overview

### Dashboard
- Overview of projects and tasks
- Task statistics (completed, overdue, assigned)
- Recent projects and tasks
- Quick access to create new projects/tasks

### Project Management
- Create and manage projects
- Add/remove team members
- Track project progress
- Set project status and priority

### Task Management
- Create and assign tasks
- Update task status and priority
- Add comments and track progress
- Set due dates and time estimates

### User Management
- User registration and authentication
- Profile management
- Role-based permissions

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Build and deploy to your preferred platform (Heroku, AWS, etc.)
3. Ensure MongoDB is accessible (MongoDB Atlas recommended)

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the build folder to your hosting service
3. Configure environment variables as needed

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file
   - Verify network connectivity

2. **CORS Issues**
   - Backend CORS is configured for localhost:3000
   - Update CORS settings for production domains

3. **Authentication Issues**
   - Check JWT_SECRET in .env file
   - Ensure tokens are being sent with requests
   - Verify token expiration settings

4. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check Node.js version compatibility
   - Verify all environment variables are set

## 📝 Development Notes

- The application follows RESTful API principles
- Input validation is implemented on both frontend and backend
- Error handling includes user-friendly messages
- Database relationships ensure data integrity
- Security best practices are followed (password hashing, JWT tokens, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For any questions or issues, please contact the development team.

---

**Note**: This is a demonstration project for internship assessment purposes. Some advanced features like real-time updates, file attachments, and advanced analytics are marked as "Coming Soon" in the UI but can be implemented as needed.
