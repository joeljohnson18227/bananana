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
    if (complaints.length > 0 && !complaints[0].studentName) {
      localStorage.removeItem(MOCK_COMPLAINTS_KEY);
      return getMockComplaints();
    }
    return complaints;
  }
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

function getCurrentUser() {
  const userStr = localStorage.getItem('ccms_user');
  return userStr ? JSON.parse(userStr) : null;
}

function getComplaintOwnerId(complaint) {
  return complaint.studentId || complaint.createdBy || complaint.student || null;
}

function getVisibleComplaintsForUser(complaints) {
  const user = getCurrentUser();

  if (!user) {
    return complaints;
  }

  return complaints;
}

function isComplaintOwner(user, complaint) {
  if (!user || !complaint) {
    return false;
  }

  const ownerId = complaint.studentId || complaint.createdBy || complaint.student;
  return ownerId === user.id;
}

const mockApi = {
  get: async (url) => {
    await delay(MOCK_DELAY);

    if (url === '/complaints') {
      return { data: getVisibleComplaintsForUser(getMockComplaints()) };
    }

    if (url === '/auth/me') {
      const user = localStorage.getItem('ccms_user');
      if (!user) throw createError(401, 'Unauthorized');
      return { data: { user: JSON.parse(user) } };
    }

    if (url === '/admin/users') {
      const users = getMockUsers();
      const complaints = getMockComplaints();
      const complaintCounts = complaints.reduce((acc, complaint) => {
        const ownerId = getComplaintOwnerId(complaint);
        if (!ownerId) {
          return acc;
        }
        acc[ownerId] = (acc[ownerId] || 0) + 1;
        return acc;
      }, {});

      return {
        data: users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          complaints: complaintCounts[user.id] || 0,
          status: complaintCounts[user.id] > 0 ? 'active' : 'inactive',
        })),
      };
    }

    if (url.startsWith('/complaints/')) {
      const id = url.split('/').pop();
      const complaint = getMockComplaints().find((item) => item.id === id);
      if (!complaint) throw createError(404, 'Complaint not found');
      return { data: complaint };
    }

    throw createError(404, 'Not found');
  },
  post: async (url, data) => {
    await delay(MOCK_DELAY);

    if (url === '/auth/login') {
      const users = getMockUsers();
      const user = users.find((u) => u.email === data.email && u.password === data.password);
      if (!user) throw createError(401, 'Invalid email or password');
      const { password: _password, ...userWithoutPassword } = user;
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
      const { password: _password, ...userWithoutPassword } = newUser;
      localStorage.setItem('ccms_user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('ccms_token', generateToken());
      return { data: { token: localStorage.getItem('ccms_token'), user: userWithoutPassword } };
    }

    if (url === '/complaints') {
      const user = getCurrentUser();
      const complaints = getMockComplaints();
      const newComplaint = {
        ...data,
        id: 'CMP-' + Math.floor(1000 + Math.random() * 9000),
        studentId: user?.id,
        studentName: user?.name || 'Demo Student',
        status: 'pending',
        priority: 'medium',
        submittedAt: new Date().toISOString(),
        resolvedAt: null,
        assignedTo: null,
      };

      complaints.unshift(newComplaint);
      saveMockComplaints(complaints);
      return { data: newComplaint };
    }

    if (url === '/admin/users') {
      const users = getMockUsers();
      if (!data?.name || !data?.email || !data?.password || !data?.role) {
        throw createError(400, 'Name, email, password, and role are required');
      }
      if (!['student', 'admin'].includes(String(data.role).toLowerCase())) {
        throw createError(400, 'Invalid role');
      }
      if (users.some((u) => u.email === data.email)) {
        throw createError(409, 'Email already exists');
      }
      const newUser = {
        id: 'usr_' + Date.now(),
        name: data.name,
        email: data.email,
        password: data.password,
        role: String(data.role).toLowerCase(),
      };
      users.unshift(newUser);
      saveMockUsers(users);
      const { password: _password, ...userWithoutPassword } = newUser;
      return {
        data: {
          ...userWithoutPassword,
          complaints: 0,
          status: 'inactive',
        },
      };
    }

    throw createError(404, 'Not found');
  },
  put: async (url, data) => {
    await delay(MOCK_DELAY);

    if (url.startsWith('/complaints/')) {
      const id = url.split('/').pop();
      const complaints = getMockComplaints();
      const index = complaints.findIndex((complaint) => complaint.id === id);

      if (index === -1) throw createError(404, 'Complaint not found');
      const user = getCurrentUser();

      if (!isComplaintOwner(user, complaints[index])) {
        throw createError(403, 'Not authorized to edit this complaint');
      }

      complaints[index] = { ...complaints[index], ...data };
      saveMockComplaints(complaints);
      return { data: complaints[index] };
    }

    if (url.startsWith('/admin/users/')) {
      const id = url.split('/').pop();
      const users = getMockUsers();
      const index = users.findIndex((user) => user.id === id);

      if (index === -1) {
        throw createError(404, 'User not found');
      }

      if (data?.role && !['student', 'admin'].includes(String(data.role).toLowerCase())) {
        throw createError(400, 'Invalid role');
      }

      const updatedUser = { ...users[index], ...data };
      if (data?.role) {
        updatedUser.role = String(data.role).toLowerCase();
      }
      users[index] = updatedUser;
      saveMockUsers(users);
      const complaints = getMockComplaints();
      const complaintCount = complaints.filter((complaint) => complaint.studentId === id || complaint.createdBy === id || complaint.student === id).length;
      const { password: _password, ...userWithoutPassword } = updatedUser;
      return {
        data: {
          id: userWithoutPassword.id,
          name: userWithoutPassword.name,
          email: userWithoutPassword.email,
          role: userWithoutPassword.role,
          complaints: complaintCount,
          status: complaintCount > 0 ? 'active' : 'inactive',
        },
      };
    }

    if (url.startsWith('/admin/complaints/') && url.endsWith('/priority')) {
      const segments = url.split('/');
      const id = segments[segments.length - 2];
      const complaints = getMockComplaints();
      const index = complaints.findIndex((complaint) => complaint.id === id);

      if (index === -1) {
        throw createError(404, 'Complaint not found');
      }

      if (!data?.priority || !['low', 'medium', 'high'].includes(String(data.priority).toLowerCase())) {
        throw createError(400, 'Invalid complaint priority');
      }

      complaints[index] = {
        ...complaints[index],
        priority: String(data.priority).toLowerCase(),
      };
      saveMockComplaints(complaints);
      return { data: complaints[index] };
    }

    throw createError(404, 'Not found');
  },
  patch: async (url, data) => {
    await delay(MOCK_DELAY);

    if (url.startsWith('/complaints/')) {
      const id = url.split('/').pop();
      const complaints = getMockComplaints();
      const index = complaints.findIndex((complaint) => complaint.id === id);

      if (index !== -1) {
        complaints[index] = { ...complaints[index], ...data };
        saveMockComplaints(complaints);
        return { data: complaints[index] };
      }
      throw createError(404, 'Complaint not found');
    }

    throw createError(404, 'Not found');
  },
  delete: async (url) => {
    await delay(MOCK_DELAY);

    if (url.startsWith('/complaints/')) {
      const id = url.split('/').pop();
      const complaints = getMockComplaints();
      const filtered = complaints.filter((complaint) => complaint.id !== id);
      const target = complaints.find((complaint) => complaint.id === id);
      const user = getCurrentUser();

      if (filtered.length === complaints.length) {
        throw createError(404, 'Complaint not found');
      }

      if (!isComplaintOwner(user, target)) {
        throw createError(403, 'Not authorized to delete this complaint');
      }

      saveMockComplaints(filtered);
      return { data: { success: true } };
    }

    if (url.startsWith('/admin/users/')) {
      const id = url.split('/').pop();
      const users = getMockUsers();
      const index = users.findIndex((user) => user.id === id);

      if (index === -1) {
        throw createError(404, 'User not found');
      }

      users.splice(index, 1);
      saveMockUsers(users);
      return { data: { success: true } };
    }

    throw createError(404, 'Not found');
  },
};

export default mockApi;
