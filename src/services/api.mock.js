import { adminComplaints } from '../data/dummyData';

const MOCK_USERS_KEY = 'ccms_mock_users';
const MOCK_COMPLAINTS_KEY = 'ccms_mock_complaints';
const MOCK_DELAY = 300;

const defaultUsers = [
  {
    id: 'usr_1',
    name: 'Demo Student',
    email: 'student@campus.edu',
    password: 'password123',
    role: 'student',
  },
  {
    id: 'usr_2',
    name: 'Demo Admin',
    email: 'admin@campus.edu',
    password: 'password123',
    role: 'admin',
  },
];

function getMockComplaints() {
  const stored = localStorage.getItem(MOCK_COMPLAINTS_KEY);
  if (stored) {
    const complaints = JSON.parse(stored);
    // Check if the structure is outdated (missing studentName on the first item)
    if (complaints.length > 0 && !complaints[0].studentName) {
      localStorage.removeItem(MOCK_COMPLAINTS_KEY);
      return getMockComplaints();
    }
    return complaints;
  }
  // Use adminComplaints from dummyData to seed the mock storage
  localStorage.setItem(MOCK_COMPLAINTS_KEY, JSON.stringify(adminComplaints));
  return adminComplaints;
}

function saveMockComplaints(complaints) {
  localStorage.setItem(MOCK_COMPLAINTS_KEY, JSON.stringify(complaints));
}

function getMockUsers() {
  const stored = localStorage.getItem(MOCK_USERS_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

function saveMockUsers(users) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

function generateToken() {
  return 'mock_jwt_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function createError(status, message) {
  const error = new Error(message);
  error.response = { status, data: { message } };
  return error;
}

const mockApi = {
  get: async (url) => {
    await delay(MOCK_DELAY);
    if (url === '/complaints') {
      const allComplaints = getMockComplaints();
      const userStr = localStorage.getItem('ccms_user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      // If student, only show their complaints (simplified for mock)
      if (user && user.role === 'student') {
        return { data: allComplaints.filter(c => c.studentName === user.name || !c.studentName) };
      }
      
      return { data: allComplaints };
    }
    if (url === '/auth/me') {
      const user = localStorage.getItem('ccms_user');
      if (!user) throw createError(401, 'Unauthorized');
      return { data: { user: JSON.parse(user) } };
    }
    throw createError(404, 'Not found');
  },
  post: async (url, data) => {
    await delay(MOCK_DELAY);
    if (url === '/auth/login') {
      const users = getMockUsers();
      const user = users.find((u) => u.email === data.email && u.password === data.password);
      if (!user) throw createError(401, 'Invalid email or password');
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem('ccms_user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('ccms_token', generateToken());
      return { data: { token: localStorage.getItem('ccms_token'), user: userWithoutPassword } };
    }
    if (url === '/auth/register') {
      const users = getMockUsers();
      if (users.some((u) => u.email === data.email)) throw createError(409, 'Email already registered');
      const newUser = { id: 'usr_' + Date.now(), ...data };
      users.push(newUser);
      saveMockUsers(users);
      const { password, ...userWithoutPassword } = newUser;
      localStorage.setItem('ccms_user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('ccms_token', generateToken());
      return { data: { token: localStorage.getItem('ccms_token'), user: userWithoutPassword } };
    }
    throw createError(404, 'Not found');
  },
  put: async (url, data) => {
    await delay(MOCK_DELAY);
    return { data };
  },
  patch: async (url, data) => {
    await delay(MOCK_DELAY);
    
    // Handle status updates
    if (url.startsWith('/complaints/')) {
      const id = url.split('/').pop();
      const complaints = getMockComplaints();
      const index = complaints.findIndex(c => c.id === id);
      
      if (index !== -1) {
        complaints[index] = { ...complaints[index], ...data };
        saveMockComplaints(complaints);
        return { data: complaints[index] };
      }
      throw createError(404, 'Complaint not found');
    }
    
    return { data };
  },
  delete: async (url) => {
    await delay(MOCK_DELAY);
    return { data: { success: true } };
  },
};

export default mockApi;
