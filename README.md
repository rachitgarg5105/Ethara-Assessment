# Team Task Manager

A full-stack web application for team project management with role-based access control.

## Features

- **Authentication**: JWT-based user registration and login
- **Role-Based Access Control**: Admin and Member permissions
- **Project Management**: Create, manage, and track projects
- **Task Management**: Assign tasks with status and priority tracking
- **Team Collaboration**: Add/remove team members
- **Dashboard**: Visual overview of projects and statistics
- **Responsive UI**: Built with React and Tailwind CSS

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs

**Frontend:** React, React Router, Tailwind CSS, Lucide React, React Hook Form, Axios

## Quick Start

```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Create .env file
PORT=5000
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d

# Start servers
npm run dev        # Backend: http://localhost:5000
npm start          # Frontend: http://localhost:3000 (in client/)
```

## Demo Credentials

- **Email:** admin@demo.com
- **Password:** demo123

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/projects` | Get projects |
| POST | `/api/projects` | Create project |
| GET | `/api/tasks` | Get tasks |
| POST | `/api/tasks` | Create task |

## License

MIT License
