import axios from "axios";

// ✅ use environment variable from Render or fallback locally
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// -------------------- Simulation Endpoints --------------------
export const getSimulations = async () => api.get("/api/simulations");
export const createSimulation = async (data) =>
  api.post("/api/simulations/email", data);

// -------------------- Interaction Endpoints --------------------
export const recordInteraction = async (data) =>
  api.post("/api/interactions", data);
export const getInteractions = async () => api.get("/api/interactions");

// -------------------- Analytics Endpoints --------------------
export const getAnalytics = async () => api.get("/api/analytics/summary");
export const getTrend = async () => api.get("/api/analytics/trend");
export const clearTrend = async () => api.delete("/api/analytics/trend");

export default api;
