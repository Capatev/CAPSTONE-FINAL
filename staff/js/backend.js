/**
 * MVRS Staff Backend - PHP Database Integration
 * SAFE VERSION (works even if some APIs don't exist yet)
 */

// ✅ FINAL & CORRECT API PATH
const API_BASE_URL = "/MVRMS/api";

// ===============================
// API REQUEST HELPER (SAFE)
// ===============================
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}/${endpoint}`;

  const config = {
    method: options.method || "GET",
    headers: { "Content-Type": "application/json" },
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    // ❗ If API does not exist, stop here
    if (!response.ok) {
      console.warn("API not found:", url);
      return { success: false, data: [] };
    }

    const text = await response.text();

    try {
      return JSON.parse(text);
    } catch {
      console.warn("Invalid JSON from:", url);
      return { success: false, data: [] };
    }
  } catch (err) {
    console.error("API Error:", err);
    return { success: false, data: [] };
  }
}

// ===============================
// GLOBAL DB (DECLARE ONCE ONLY)
// ===============================
window.db = window.db || {
  vehicles: [],
  clients: [],
  bookings: [],
  invoices: [],
  paymentMethods: [],
};

// ===============================
// INITIALIZE STAFF DB (MINIMUM)
// ===============================
async function initializeStaffDB() {
  console.log("Initializing staff DB...");

  // 👉 ONLY load what exists
  const [reservationsRes, vehiclesRes, usersRes] = await Promise.all([
    apiRequest("reservations.php"), // REQUIRED
    apiRequest("vehicles.php"),     // optional
    apiRequest("users.php"),        // optional
  ]);

  // -------- BOOKINGS --------
  if (reservationsRes.success) {
    db.bookings = reservationsRes.data.map((r) => ({
      id: r.booking_id ?? r.id,
      dbId: r.booking_id ?? r.id,
      clientName: r.client_name ?? "Unknown",
      vehicle: r.vehicle ?? "N/A",
      pickupDate: r.start_date,
      returnDate: r.end_date,
      status: r.status ?? "pending",
      totalAmount: Number(r.amount ?? 0),
      notes: r.notes ?? "",
    }));
  }

  // -------- VEHICLES --------
  if (Array.isArray(vehiclesRes)) {
    db.vehicles = vehiclesRes.map((v) => ({
      id: v.vehicle_id,
      name: v.vehicle_name,
      brand: v.brand,
      model: v.model,
      dailyRate: Number(v.daily_rate),
      status: v.availability.toLowerCase(), // Available / Rented
      plate: v.plate_number ?? "N/A",
    }));
  }

  // -------- CLIENTS --------
  if (Array.isArray(usersRes)) {
    db.clients = usersRes
      .filter(u => u.role === "client")
      .map((u) => ({
        id: u.user_id,
        name: u.full_name,
        email: u.email,
        phone: u.phone,
        status: u.status,
        joined: u.created_at,
      }))
  }


  console.log("✅ Staff DB ready", db);
  return true;
}

// ===============================
// CREATE BOOKING (API)
// ===============================
async function createBooking(data) {
  return apiRequest("reservations.php", {
    method: "POST",
    body: data,
  });
}

// ===============================
// UPDATE BOOKING STATUS
// ===============================
async function updateBookingStatus(bookingId, status) {
  return apiRequest("reservations.php", {
    method: "PUT",
    body: { booking_id: bookingId, status },
  });
}

// ===============================
// HELPERS (BASIC)
// ===============================
function getAvailableVehicles() {
  return db.vehicles.filter(v => v.status === "available");
}

function formatCurrency(val) {
  return "₱" + Number(val).toLocaleString();
}

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

function createBadge(status) {
  return `<span class="badge badge-${status}">${status}</span>`;
}

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", initializeStaffDB);
