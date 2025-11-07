// src/api/api.js
import axios from "axios";

// ✅ Use deployed backend by default (Render)
const API_BASE_URL = "https://hfts-backend.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===============================
// ✅ Simulation Endpoints
// ===============================
export const getSimulations = async () => api.get("/api/simulations");
export const createSimulation = async (data) =>
  api.post("/api/simulations/email", data);

// ===============================
// ✅ Interaction Endpoints
// ===============================
export const recordInteraction = async (data) =>
  api.post("/api/interactions", data);

// ✅ NEW: Get all interactions
export const getInteractions = async () => api.get("/api/interactions");

// ===============================
// ✅ Analytics Endpoints
// ===============================
export const getAnalytics = async () => api.get("/api/analytics/summary");
export const getTrend = async () => api.get("/api/analytics/trend");
export const clearTrend = async () => api.delete("/api/analytics/trend");

// ✅ Default export
export default api;
