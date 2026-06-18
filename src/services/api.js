import mockApi from './api.mock';
// import realApi from './api.real'; // Uncomment when DB is ready

/**
 * Switching to mockApi temporarily because the MongoDB Atlas connection 
 * is failing due to an IP Whitelist restriction.
 * 
 * To use the real backend:
 * 1. Whitelist your IP in MongoDB Atlas.
 * 2. Ensure the backend server is running (npm run server).
 * 3. Switch the export below to realApi.
 */

const api = mockApi;

export default api;
