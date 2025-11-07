// src/api/api.js
import axios from "axios";

// 🌐 Base API URL — uses live backend if deployed, localhost if running locally
const API_BASE_URL =
  process.env.REACT_APP_API_BASE || "https://hfts-backend.onrender.com";

// Optional: log for debugging
console.log("🔗 API Base URL:", API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Simulation endpoints
export const getSimulations = async () => {
  try {
    const res = await api.get("/simulations");
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch simulations:", err);
    throw err;
  }
};

export const createSimulation = async (data) => {
  try {
    const res = await api.post("/simulations/email", data);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to create simulation:", err.response?.data || err);
    throw err;
  }
};

// ✅ Interaction endpoints
export const recordInteraction = async (data) => {
  try {
    const res = await api.post("/interactions", data);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to record interaction:", err);
    throw err;
  }
};

// ✅ Analytics endpoints
export const getAnalytics = async () => {
  try {
    const res = await api.get("/analytics/summary");
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch analytics:", err);
    throw err;
  }
};

// ✅ Risk Trend endpoints (persistent tracking)
export const getTrend = async () => {
  try {
    const res = await api.get("/analytics/trend");
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch trend:", err);
    throw err;
  }
};

export const clearTrend = async () => {
  try {
    const res = await api.delete("/analytics/trend");
    return res.data;
  } catch (err) {
    console.error("❌ Failed to clear trend:", err);
    throw err;
  }
};

export default api;
