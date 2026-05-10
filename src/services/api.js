import axios from 'axios';

const AUTH_TOKEN_KEY = 'team-task-token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

const request = async (method, url, data = null) => {
  const response = await api({ method, url, data });
  return response.data.data;
};

export const loginUser = (credentials) => request('post', '/api/auth/login', credentials);
export const registerUser = (credentials) => request('post', '/api/auth/register', credentials);
export const fetchDashboard = () => request('get', '/api/dashboard/stats');
export const fetchProjects = () => request('get', '/api/projects');
export const createProject = (project) => request('post', '/api/projects', project);
export const inviteProjectMember = (projectId, member) => request('post', `/api/projects/${projectId}/members`, member);
export const fetchProjectTasks = (projectId) => request('get', `/api/projects/${projectId}/tasks`);
export const createTask = (projectId, task) => request('post', `/api/projects/${projectId}/tasks`, task);
export const updateTask = (taskId, task) => request('put', `/api/tasks/${taskId}`, task);
