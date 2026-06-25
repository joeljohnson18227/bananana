import Complaint from '../models/Complaint.js';
import User from '../models/User.js';

export async function getAdminUsers(req, res) {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    const complaints = await Complaint.find({}).select('createdBy student');

    const complaintCounts = complaints.reduce((acc, complaint) => {
      const ownerId = complaint.createdBy?.toString?.() || complaint.student?.toString?.();
      if (!ownerId) {
        return acc;
      }
      acc[ownerId] = (acc[ownerId] || 0) + 1;
      return acc;
    }, {});

    return res.status(200).json(
      users.map((user) => {
        const userId = user._id.toString();
        return {
          id: userId,
          name: user.name,
          email: user.email,
          role: user.role,
          complaints: complaintCounts[userId] || 0,
          status: complaintCounts[userId] > 0 ? 'active' : 'inactive',
          createdAt: user.createdAt,
        };
      }),
    );
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
}

export async function createAdminUser(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    if (!['student', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const user = await User.create({ name, email, password, role });

    return res.status(201).json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      complaints: 0,
      status: 'inactive',
      createdAt: user.createdAt,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to create user',
      error: error.message,
    });
  }
}

export async function updateAdminUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) {
      if (!['student', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      user.role = role;
    }
    if (password) user.password = password;

    await user.save();

    const complaints = await Complaint.find({}).select('createdBy student');
    const complaintCount = complaints.filter((complaint) => {
      const ownerId = complaint.createdBy?.toString?.() || complaint.student?.toString?.();
      return ownerId === user._id.toString();
    }).length;

    return res.status(200).json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      complaints: complaintCount,
      status: complaintCount > 0 ? 'active' : 'inactive',
      createdAt: user.createdAt,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to update user',
      error: error.message,
    });
  }
}

export async function deleteAdminUser(req, res) {
  try {
    const { id } = req.params;

    if (req.user?.id?.toString?.() === id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.deleteOne({ _id: id });

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete user',
      error: error.message,
    });
  }
}
