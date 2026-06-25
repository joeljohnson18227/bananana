import mongoose from 'mongoose';
import Complaint from '../models/Complaint.js';

function getCreatorId(complaint) {
  const createdBy = complaint?.createdBy || complaint?.student;

  if (!createdBy) {
    return null;
  }

  if (typeof createdBy === 'object') {
    return createdBy._id?.toString?.() ?? null;
  }

  return createdBy.toString();
}

function isCreator(user, complaint) {
  if (!user || !complaint) {
    return false;
  }

  return getCreatorId(complaint) === user.id.toString();
}

function canEditComplaint(user, complaint) {
  const normalizedStatus = complaint?.status === 'open' ? 'pending' : complaint?.status;
  return isCreator(user, complaint) && normalizedStatus === 'pending';
}

function formatComplaint(complaint) {
  const createdBy = complaint.createdBy || complaint.student;
  const createdById = createdBy && typeof createdBy === 'object' ? createdBy._id?.toString() : createdBy?.toString?.();
  const normalizedStatus = complaint.status === 'open' ? 'pending' : complaint.status;

  return {
    id: complaint._id.toString(),
    title: complaint.title,
    category: complaint.category,
    description: complaint.description,
    location: complaint.location,
    status: normalizedStatus,
    createdBy: createdById || createdBy,
    student: createdById || createdBy,
    createdByName: createdBy && typeof createdBy === 'object' ? createdBy.name : undefined,
    createdByEmail: createdBy && typeof createdBy === 'object' ? createdBy.email : undefined,
    studentName: createdBy && typeof createdBy === 'object' ? createdBy.name : undefined,
    createdDate: complaint.createdDate,
    submittedAt: complaint.createdDate,
    priority: complaint.priority || 'medium',
    assignedTo: complaint.assignedTo ?? null,
    resolvedAt: complaint.resolvedAt ?? null,
  };
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseAdminDateFilter(dateValue) {
  if (!dateValue) {
    return null;
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return { error: 'Invalid date filter' };
  }

  return {
    createdDate: {
      $gte: new Date(
        Date.UTC(
          parsedDate.getUTCFullYear(),
          parsedDate.getUTCMonth(),
          parsedDate.getUTCDate(),
          0,
          0,
          0,
          0,
        ),
      ),
      $lte: new Date(
        Date.UTC(
          parsedDate.getUTCFullYear(),
          parsedDate.getUTCMonth(),
          parsedDate.getUTCDate(),
          23,
          59,
          59,
          999,
        ),
      ),
    },
  };
}

function buildAdminComplaintFilter(query = {}) {
  const filter = {};

  if (query.category) {
    filter.category = new RegExp(`^${escapeRegex(query.category.trim())}$`, 'i');
  }

  if (query.status) {
    const normalizedStatus = String(query.status).trim().toLowerCase();
    const allowedStatuses = ['pending', 'open', 'in_progress', 'resolved', 'rejected'];

    if (!allowedStatuses.includes(normalizedStatus)) {
      return { error: 'Invalid complaint status filter' };
    }

    filter.status =
      normalizedStatus === 'pending'
        ? { $in: ['pending', 'open'] }
        : normalizedStatus;
  }

  const dateFilter = parseAdminDateFilter(query.date);

  if (dateFilter?.error) {
    return { error: dateFilter.error };
  }

  if (dateFilter) {
    Object.assign(filter, dateFilter);
  }

  return filter;
}

async function findComplaintById(id) {
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }

  return Complaint.findById(id).populate([
    { path: 'createdBy', select: 'name email role' },
    { path: 'student', select: 'name email role' },
  ]);
}

export async function createComplaint(req, res) {
  try {
    const { title, category, description, location } = req.body;

    if (!title || !category || !description || !location) {
      return res.status(400).json({
        message: 'Title, category, description, and location are required',
      });
    }

    const complaint = await Complaint.create({
      title,
      category,
      description,
      location,
      createdBy: req.user.id,
      student: req.user.id,
      priority: 'medium',
      assignedTo: req.body.assignedTo ?? null,
    });

    const populatedComplaint = await complaint.populate([
      { path: 'createdBy', select: 'name email role' },
      { path: 'student', select: 'name email role' },
    ]);

    return res.status(201).json(formatComplaint(populatedComplaint));
  } catch (error) {
    console.log('ERROR START');
  console.error(error);
  console.log('ERROR END');
    return res.status(500).json({
      message: 'Failed to create complaint',
      error: error.message,
    });
  }
}

export async function getComplaints(req, res) {
  try {
    const complaints = await Complaint.find({})
      .sort({ createdDate: -1 })
      .populate([
        { path: 'createdBy', select: 'name email role' },
        { path: 'student', select: 'name email role' },
      ]);

    return res.status(200).json(complaints.map(formatComplaint));
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch complaints',
      error: error.message,
    });
  }
}

export async function getAdminComplaints(req, res) {
  try {
    const filter = buildAdminComplaintFilter(req.query);

    if (filter.error) {
      return res.status(400).json({ message: filter.error });
    }

    const complaints = await Complaint.find(filter)
      .sort({ createdDate: -1 })
      .populate([
        { path: 'createdBy', select: 'name email role' },
        { path: 'student', select: 'name email role' },
      ]);

    return res.status(200).json(complaints.map(formatComplaint));
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch admin complaints',
      error: error.message,
    });
  }
}

export async function getComplaintById(req, res) {
  try {
    const complaint = await findComplaintById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    return res.status(200).json(formatComplaint(complaint));
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch complaint',
      error: error.message,
    });
  }
}

export async function updateComplaint(req, res) {
  try {
    const complaint = await findComplaintById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (!isCreator(req.user, complaint)) {
      return res.status(403).json({ message: 'Not authorized to edit this complaint' });
    }

    if (!canEditComplaint(req.user, complaint)) {
      return res.status(400).json({
        message: 'Only pending complaints can be edited',
      });
    }

    const allowedFields = ['title', 'category', 'description', 'location'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        complaint[field] = req.body[field];
      }
    });

    const updatedComplaint = await complaint.save();
    await updatedComplaint.populate([
      { path: 'createdBy', select: 'name email role' },
      { path: 'student', select: 'name email role' },
    ]);

    return res.status(200).json(formatComplaint(updatedComplaint));
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to update complaint',
      error: error.message,
    });
  }
}

export async function updateComplaintStatus(req, res) {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const normalizedStatus = String(status).toLowerCase();
    const allowedStatuses = ['pending', 'in_progress', 'resolved', 'rejected'];

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({ message: 'Invalid complaint status' });
    }

    const complaint = await findComplaintById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = normalizedStatus;
    complaint.resolvedAt = normalizedStatus === 'resolved' ? new Date() : null;
    const updatedComplaint = await complaint.save();
    await updatedComplaint.populate([
      { path: 'createdBy', select: 'name email role' },
      { path: 'student', select: 'name email role' },
    ]);

    return res.status(200).json(formatComplaint(updatedComplaint));
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to update complaint status',
      error: error.message,
    });
  }
}

export async function updateAdminComplaintStatus(req, res) {
  return updateComplaintStatus(req, res);
}

export async function updateAdminComplaintPriority(req, res) {
  try {
    const { priority } = req.body;

    if (!priority) {
      return res.status(400).json({ message: 'Priority is required' });
    }

    const normalizedPriority = String(priority).toLowerCase();
    const allowedPriorities = ['low', 'medium', 'high'];

    if (!allowedPriorities.includes(normalizedPriority)) {
      return res.status(400).json({ message: 'Invalid complaint priority' });
    }

    const complaint = await findComplaintById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.priority = normalizedPriority;
    const updatedComplaint = await complaint.save();
    await updatedComplaint.populate([
      { path: 'createdBy', select: 'name email role' },
      { path: 'student', select: 'name email role' },
    ]);

    return res.status(200).json(formatComplaint(updatedComplaint));
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to update complaint priority',
      error: error.message,
    });
  }
}

export async function deleteComplaint(req, res) {
  try {
    const complaint = await findComplaintById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (!isCreator(req.user, complaint)) {
      return res.status(403).json({ message: 'Not authorized to delete this complaint' });
    }

    await Complaint.deleteOne({ _id: complaint._id });

    return res.status(200).json({
      message: 'Complaint deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete complaint',
      error: error.message,
    });
  }
}
