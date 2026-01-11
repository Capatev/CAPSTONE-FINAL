/**
 * MVRMS Client Backend - PHP API Integration (FIXED)
 */

/* ================= CONFIG ================= */
const API_BASE = "/MVRMS/api";

/* ================= API HELPER ================= */
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: options.body ? JSON.stringify(options.body) : null,
    });

    const text = await response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

/* ================= VEHICLES ================= */
let vehiclesDB = [];

/* Load vehicles from REAL API */
async function loadVehicles() {
  try {
    const data = await apiRequest("get-available-vehicles.php");

    vehiclesDB = data.map(v => ({
      id: v.vehicle_id,                 // DB ID
      name: v.vehicle_name,
      dailyRate: Number(v.daily_rate),
      availability: v.availability,
      image: v.image
    }));

    return vehiclesDB;
  } catch (err) {
    console.error("Failed to load vehicles", err);
    return [];
  }
}

/* Getter */
function getVehicles() {
  return vehiclesDB;
}

/* ================= RESERVATION ================= */
async function createReservation(payload) {
  return await apiRequest("create-reservation.php", {
    method: "POST",
    body: payload
  });
}

/* ================= AUTH ================= */
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", async () => {
  await loadVehicles();
  console.log("Client backend initialized with PHP API (FIXED)");
});