import api from './api';

export const taskService = {
  getTasks: async (params = {}) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  addComment: async (taskId, comment) => {
    const response = await api.post(`/tasks/${taskId}/comments`, { text: comment });
    return response.data;
  },

  getTaskStats: async () => {
    const response = await api.get('/tasks/stats/dashboard');
    return response.data;
  },
};
