import { Router } from 'express';
import {
  getAdminComplaints,
  updateAdminComplaintPriority,
  updateAdminComplaintStatus,
} from '../controllers/complaintController.js';
import {
  createAdminUser,
  deleteAdminUser,
  getAdminUsers,
  updateAdminUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(protect);
router.use(requireRole('admin'));

router.get('/complaints', getAdminComplaints);
router.get('/users', getAdminUsers);
router.post('/users', createAdminUser);
router.put('/users/:id', updateAdminUser);
router.delete('/users/:id', deleteAdminUser);
router.put('/status/:id', updateAdminComplaintStatus);
router.patch('/complaints/:id/priority', updateAdminComplaintPriority);

export default router;
