# Campus Complaint Management System (CCMS)

A full-stack MERN application for managing campus complaints with role-based dashboards for students and administrators.

## 🚀 Current Status: Hybrid Mode

The project is currently in a **Hybrid Development Phase**:
- **Frontend**: Fully functional with a mock API (`src/services/api.mock.js`) that uses `localStorage` for persistence.
- **Backend**: Authentication (Login/Register) is implemented with JWT and MongoDB. Complaint management controllers are scaffolded but return 501 (Not Implemented).
- **Default Config**: The app defaults to the Mock API due to IP whitelist restrictions on the shared MongoDB Atlas instance.

## Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS v4
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Auth**: JWT with localStorage, role-based access (student/admin)
- **Dev Tools**: ESLint, Nodemon, Concurrently

## Project Structure

```
bananana/
├── server/              # Express Backend
│   ├── config/          # DB connection
│   ├── controllers/     # Route logic (Auth: Done, Complaints: WIP)
│   ├── middleware/      # Auth & Error handlers
│   ├── models/          # Mongoose Schemas (User, Complaint)
│   └── routes/          # API Route definitions
├── src/                 # React Frontend
│   ├── components/      
│   │   ├── ui/          # Base Reusable UI Components
│   │   ├── admin/       # Specialized Admin Components (Tables, Filters)
│   │   └── complaints/  # Complaint-specific logic
│   ├── context/         # AuthContext & Session management
│   ├── pages/           # Routed Page Components
│   ├── services/        # API Layer (Switches between Real/Mock)
│   └── data/            # Static constants and helper data
```

## Recent Progress (June 2026)

- **Admin Suite Implementation**: Launched `AdminComplaints` page featuring:
  - **Modular Admin Components**: `AdminTable`, `FilterBar`, `SearchBox`, and `StatusDropdown`.
  - **Enhanced Filtering**: Real-time search, category filtering, and status tracking.
  - **Sorting**: Multi-directional sorting by submission date.
- **Backend Foundation**: Established full JWT Authentication flow and Mongoose models for Users and Complaints.
- **UI Standardization**: Completed the `src/components/ui` library for consistent forms and layout.

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas) - Required for backend auth features.

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Setup Environment
cp .env.example .env

# 3. Configure .env
# MONGODB_URI=your_mongodb_uri
# JWT_SECRET=your_secret_key
# CLIENT_URL=http://localhost:5173
```

### Running the Application

| Mode | Command | Description |
|------|---------|-------------|
| **Mock Only** | `npm run client` | Frontend only (runs on :5173, uses LocalStorage) |
| **Full Stack**| `npm run dev` | Runs Client + Server concurrently |
| **Server Only**| `npm run server` | Runs Express server with Nodemon |

## 🛠 Developer Guide: Switching to Real Backend

To transition from the Mock API to the live Express backend:

1.  **Whitelist your IP**: Ensure your current IP is whitelisted in your MongoDB Atlas cluster.
2.  **Toggle the Service**: Open `src/services/api.js` and switch the export:
    ```javascript
    // import mockApi from './api.mock';
    import realApi from './api.real'; 
    const api = realApi;
    export default api;
    ```
3.  **Implement Controllers**: Fill in the logic in `server/controllers/complaintController.js`.

## Demo Credentials (Mock API)

| Role | Email | Password |
|------|-------|----------|
| Student | student@campus.edu | password123 |
| Admin | admin@campus.edu | password123 |

## TODO / Roadmap

- [ ] **Phase 1 (Backend)**: Implement `complaintController.js` (CRUD operations).
- [ ] **Phase 2 (Integration)**: Connect Frontend to Real API and verify auth flow.
- [ ] **Phase 3 (Admin)**: Implement status update functionality in the backend.
- [ ] **Phase 4 (Features)**:
  - [ ] Add file upload for complaint attachments.
  - [ ] Implement email notifications for status changes.
  - [ ] Add dashboard analytics charts (using Chart.js or Recharts).

## License

MIT
