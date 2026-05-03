import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  Briefcase,
  CheckSquare,
  Clock,
  Users,
  Plus,
  Calendar,
  AlertCircle,
  TrendingUp,
  MoreVertical,
} from 'lucide-react';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [projectsRes, tasksRes, statsRes] = await Promise.all([
        projectService.getProjects({ limit: 5 }),
        taskService.getTasks({ limit: 10 }),
        taskService.getTaskStats(),
      ]);

      setProjects(projectsRes.projects || []);
      setTasks(tasksRes.tasks || []);
      setStats(statsRes.stats);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'todo': 'badge-gray',
      'in-progress': 'badge-primary',
      'review': 'badge-warning',
      'completed': 'badge-success',
    };
    return colors[status] || 'badge-gray';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'text-gray-500',
      'medium': 'text-blue-500',
      'high': 'text-orange-500',
      'urgent': 'text-red-500',
    };
    return colors[priority] || 'text-gray-500';
  };

  const getProjectStatusColor = (status) => {
    const colors = {
      'planning': 'text-gray-500',
      'active': 'text-green-500',
      'completed': 'text-blue-500',
      'on-hold': 'text-orange-500',
    };
    return colors[status] || 'text-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/projects/new"
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Link>
              <Link
                to="/tasks/new"
                className="btn-secondary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Briefcase className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Projects</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {projects.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckSquare className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.byStatus?.find(s => s._id === 'completed')?.count || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Overdue Tasks</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.overdue || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">My Tasks</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.myTasks || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
              <Link
                to="/projects"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>
            <div className="card-body">
              {projects.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No projects yet</p>
                  <Link
                    to="/projects/new"
                    className="btn-primary mt-4 inline-flex"
                  >
                    Create your first project
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <Link
                          to={`/projects/${project._id}`}
                          className="font-medium text-gray-900 hover:text-primary-600"
                        >
                          {project.name}
                        </Link>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <span className={`mr-3 ${getProjectStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {project.members?.length || 0}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {project.progress}%
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
              <Link
                to="/tasks"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>
            <div className="card-body">
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No tasks yet</p>
                  <Link
                    to="/tasks/new"
                    className="btn-primary mt-4 inline-flex"
                  >
                    Create your first task
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <Link
                          to={`/tasks/${task._id}`}
                          className="font-medium text-gray-900 hover:text-primary-600"
                        >
                          {task.title}
                        </Link>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <span className={`mr-3 ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          <span className={`mr-3 ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          {task.dueDate && (
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {format(new Date(task.dueDate), 'MMM d')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {task.assignedTo ? (
                          <div className="text-sm text-gray-600">
                            {task.assignedTo.name}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">Unassigned</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
