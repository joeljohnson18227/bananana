import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import AdminAnalytics from '../pages/AdminAnalytics.jsx';
import AdminComplaints from '../pages/complaints/AdminComplaints.jsx';
import AdminDashboard from '../pages/AdminDashboard.jsx';
import AdminUsers from '../pages/AdminUsers.jsx';
import TestAdminComponents from '../pages/admin/TestAdminComponents.jsx';
import UpdateStatus from '../pages/admin/UpdateStatus.jsx';
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import NotFound from '../pages/NotFound.jsx';
import Register from '../pages/Register.jsx';
import Settings from '../pages/Settings.jsx';
import StudentComplaints from '../pages/complaints/StudentComplaints.jsx';
import StudentDashboard from '../pages/StudentDashboard.jsx';
import SubmitComplaint from '../pages/complaints/SubmitComplaint.jsx';
import ComplaintDetails from '../pages/complaints/ComplaintDetails.jsx';
import EditComplaint from '../pages/complaints/EditComplaint.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}>
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="student/dashboard" element={<StudentDashboard />} />
          <Route path="student/complaints" element={<StudentComplaints />} />
          <Route path="student/complaints/:id" element={<ComplaintDetails />} />
          <Route path="student/complaints/edit/:id" element={<EditComplaint />} />
          <Route path="student/submit" element={<SubmitComplaint />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="admin/complaints" element={<AdminComplaints />} />
          <Route path="admin/complaints/:id/status" element={<UpdateStatus />} />
          <Route path="admin/analytics" element={<AdminAnalytics />} />
          <Route path="admin/users" element={<AdminUsers />} />
          <Route path="admin/test-components" element={<TestAdminComponents />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;