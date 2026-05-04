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
  Activity,
  Target,
  ArrowUp,
  ArrowDown,
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="relative inline-flex">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Briefcase className="h-8 w-8 text-blue-600 opacity-50" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium animate-pulse">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="group">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-700 group-hover:to-indigo-700">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-lg font-medium">Welcome back, <span className="text-blue-600 font-semibold">{user?.name}</span>! 👋</p>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/projects"
                className="btn-primary flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Link>
              <Link
                to="/tasks"
                className="btn-secondary flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
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
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="card-body relative">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Projects</p>
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-gray-900">
                        {projects.length}
                      </p>
                      <div className="ml-2 text-xs text-green-600 font-medium flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        12%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="card-body relative">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                      <CheckSquare className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Completed Tasks</p>
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.byStatus?.find(s => s._id === 'completed')?.count || 0}
                      </p>
                      <div className="ml-2 text-xs text-green-600 font-medium flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        8%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-100">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="card-body relative">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Overdue Tasks</p>
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.overdue || 0}
                      </p>
                      {stats.overdue > 0 && (
                        <div className="ml-2 text-xs text-red-600 font-medium flex items-center">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          Alert
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-100">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="card-body relative">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">My Tasks</p>
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.myTasks || 0}
                      </p>
                      <div className="ml-2 text-xs text-purple-600 font-medium flex items-center">
                        <Activity className="h-3 w-3 mr-1" />
                        Active
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <div className="card-header bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  Recent Projects
                </h2>
                <Link
                  to="/projects"
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium flex items-center group hover:translate-x-1 transition-all duration-200"
                >
                  View all
                  <ArrowUp className="ml-1 h-3 w-3 rotate-45" />
                </Link>
              </div>
            </div>
            <div className="card-body">
              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="relative inline-flex mb-6">
                    <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl">
                      <Briefcase className="h-12 w-12 text-blue-600" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <div className="p-1 bg-red-500 rounded-full animate-pulse">
                        <Plus className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No projects yet</h3>
                  <p className="text-gray-600 mb-6 max-w-sm mx-auto">Create your first project to start organizing your work and collaborating with your team.</p>
                  <Link
                    to="/projects"
                    className="btn-primary shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first project
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.map((project, index) => (
                    <div 
                      key={project._id} 
                      className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md border border-gray-100"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex-1">
                        <Link
                          to={`/projects/${project._id}`}
                          className="font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 group-hover:translate-x-1 inline-block"
                        >
                          {project.name}
                        </Link>
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <span className={`mr-4 px-2 py-1 rounded-full text-xs font-medium ${getProjectStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                          <span className="flex items-center mr-4">
                            <Users className="h-4 w-4 mr-1" />
                            <span className="font-medium">{project.members?.length || 0}</span>
                          </span>
                          {project.priority && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              project.priority === 'high' ? 'bg-red-100 text-red-700' :
                              project.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {project.priority}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900 mb-2">
                          {project.progress}%
                        </div>
                        <div className="relative w-20 bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
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
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <div className="card-header bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <CheckSquare className="h-5 w-5 mr-2 text-green-600" />
                  Recent Tasks
                </h2>
                <Link
                  to="/tasks"
                  className="text-sm text-green-600 hover:text-green-500 font-medium flex items-center group hover:translate-x-1 transition-all duration-200"
                >
                  View all
                  <ArrowUp className="ml-1 h-3 w-3 rotate-45" />
                </Link>
              </div>
            </div>
            <div className="card-body">
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="relative inline-flex mb-6">
                    <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl">
                      <CheckSquare className="h-12 w-12 text-green-600" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <div className="p-1 bg-red-500 rounded-full animate-pulse">
                        <Plus className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No tasks yet</h3>
                  <p className="text-gray-600 mb-6 max-w-sm mx-auto">Create your first task to start tracking your work and staying organized.</p>
                  <Link
                    to="/tasks"
                    className="btn-primary shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first task
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task, index) => (
                    <div 
                      key={task._id} 
                      className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl hover:from-green-50 hover:to-emerald-50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md border border-gray-100"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex-1">
                        <Link
                          to={`/tasks/${task._id}`}
                          className="font-semibold text-gray-900 hover:text-green-600 transition-colors duration-200 group-hover:translate-x-1 inline-block"
                        >
                          {task.title}
                        </Link>
                        <div className="flex items-center mt-2 text-sm text-gray-600 flex-wrap gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                            task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {task.priority}
                          </span>
                          {task.dueDate && (
                            <span className="flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              <Calendar className="h-3 w-3 mr-1" />
                              {format(new Date(task.dueDate), 'MMM d')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {task.assignedTo ? (
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                              {task.assignedTo.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-sm text-gray-600">
                              <div className="font-medium">{task.assignedTo.name}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 flex items-center">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold mr-2">
                              ?
                            </div>
                            <span>Unassigned</span>
                          </div>
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
