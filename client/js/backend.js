/**
 * MVRS Client Backend - PHP Database Integration
 */

// API Configuration
const API_BASE_URL = "../php/api"

// API Request Helper
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}/${endpoint}`

  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  }

  if (options.body) {
    config.body = JSON.stringify(options.body)
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()
    return data
  } catch (error) {
    console.error("API Error:", error)
    return { success: false, message: error.message }
  }
}

// Vehicles Database (loaded from API)
let vehiclesDB = []

async function loadVehicles() {
  const response = await apiRequest("vehicles.php?status=available")
  if (response.success) {
    vehiclesDB = (response.data || []).map((v) => ({
      id: `v${v.id}`,
      dbId: v.id,
      name: v.model,
      type: v.type,
      dailyRate: Number.parseFloat(v.daily_rate),
      available: v.status === "available",
      plate: v.plate,
    }))
  }
  return vehiclesDB
}

// Get vehicles
function getVehicles() {
  return vehiclesDB
}

// User databases (loaded from API)
let staffDB = []
let adminDB = []
let driverDB = []

async function loadUsers() {
  const response = await apiRequest("users.php")
  if (response.success) {
    const users = response.data || []
    staffDB = users.filter((u) => u.role === "staff")
    adminDB = users.filter((u) => u.role === "admin")
    driverDB = users.filter((u) => u.role === "driver")
  }
}

function getStaffMembers() {
  return staffDB
}

function getAdmins() {
  return adminDB
}

function getDrivers() {
  return driverDB
}

// Create booking
async function createBooking(
  clientUsername,
  vehicleId,
  pickupDate,
  returnDate,
  pickupLocation,
  dropoffLocation,
  totalCost,
) {
  // Get actual vehicle ID from our mapped ID
  const vehicle = vehiclesDB.find((v) => v.id === vehicleId)
  if (!vehicle) {
    console.error("Vehicle not found")
    return null
  }

  // Get current user from session
  const currentUser = JSON.parse(localStorage.getItem("mvrms_user") || "{}")

  const response = await apiRequest("reservations.php", {
    method: "POST",
    body: {
      user_id: currentUser.id || 1,
      vehicle_id: vehicle.dbId,
      start_date: pickupDate,
      end_date: returnDate,
      pickup_location: pickupLocation,
      dropoff_location: dropoffLocation,
      total_amount: totalCost,
      status: "pending",
    },
  })

  if (response.success) {
    // Update local vehicle availability
    vehicle.available = false

    return {
      id: response.data.reservation_code,
      clientUsername,
      vehicleId,
      vehicleName: vehicle.name,
      pickupDate,
      returnDate,
      pickupLocation,
      dropoffLocation,
      totalCost,
      status: "pending",
      createdAt: new Date().toISOString(),
    }
  }

  return null
}

// Update vehicle availability
async function updateVehicleAvailability(vehicleId, available) {
  const vehicle = vehiclesDB.find((v) => v.id === vehicleId)
  if (vehicle) {
    await apiRequest(`vehicles.php?id=${vehicle.dbId}`, {
      method: "PUT",
      body: {
        status: available ? "available" : "rented",
      },
    })
    vehicle.available = available
  }
}

// Record check-in
async function recordCheckIn(bookingId, mileage, fuelLevel, condition) {
  // Get reservation ID from booking code
  const reservations = await apiRequest(`reservations.php?search=${bookingId}`)
  if (!reservations.success || !reservations.data.length) {
    console.error("Reservation not found")
    return null
  }

  const reservation = reservations.data[0]

  const response = await apiRequest("check-records.php", {
    method: "POST",
    body: {
      reservation_id: reservation.id,
      vehicle_id: reservation.vehicle_id,
      type: "checkin",
      mileage,
      fuel_level: fuelLevel,
      vehicle_condition: condition,
    },
  })

  if (response.success) {
    return {
      id: response.data.record_code,
      bookingId,
      mileage,
      fuelLevel,
      condition,
      timestamp: new Date().toISOString(),
    }
  }

  return null
}

// Record check-out
async function recordCheckOut(bookingId, mileage, fuelLevel, condition) {
  const reservations = await apiRequest(`reservations.php?search=${bookingId}`)
  if (!reservations.success || !reservations.data.length) {
    console.error("Reservation not found")
    return null
  }

  const reservation = reservations.data[0]

  const response = await apiRequest("check-records.php", {
    method: "POST",
    body: {
      reservation_id: reservation.id,
      vehicle_id: reservation.vehicle_id,
      type: "checkout",
      mileage,
      fuel_level: fuelLevel,
      vehicle_condition: condition,
    },
  })

  if (response.success) {
    return {
      id: response.data.record_code,
      bookingId,
      mileage,
      fuelLevel,
      condition,
      timestamp: new Date().toISOString(),
    }
  }

  return null
}

// Report issue
async function reportIssue(driverId, vehicleId, severity, category, description) {
  const vehicle = vehiclesDB.find((v) => v.id === vehicleId)
  const currentUser = JSON.parse(localStorage.getItem("mvrms_user") || "{}")

  const response = await apiRequest("issues.php", {
    method: "POST",
    body: {
      reporter_id: currentUser.id || driverId,
      vehicle_id: vehicle ? vehicle.dbId : 1,
      severity,
      category,
      description,
    },
  })

  if (response.success) {
    return {
      id: response.data.issue_code,
      driverId,
      vehicleId,
      severity,
      category,
      description,
      status: "reported",
      createdAt: new Date().toISOString(),
    }
  }

  return null
}

// Process payment
async function processPayment(bookingId, amount, method, transactionDetails) {
  const reservations = await apiRequest(`reservations.php?search=${bookingId}`)
  if (!reservations.success || !reservations.data.length) {
    console.error("Reservation not found")
    return null
  }

  const reservation = reservations.data[0]

  // Create invoice
  const response = await apiRequest("invoices.php", {
    method: "POST",
    body: {
      user_id: reservation.user_id,
      reservation_id: reservation.id,
      amount,
      total_amount: amount,
      due_date: new Date().toISOString().split("T")[0],
      payment_method: method,
      status: "paid",
    },
  })

  if (response.success) {
    return {
      id: response.data.invoice_code,
      bookingId,
      amount,
      method,
      transactionDetails,
      status: "Completed",
      timestamp: new Date().toISOString(),
    }
  }

  return null
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", async () => {
  await loadVehicles()
  await loadUsers()
  console.log("Client backend initialized with PHP API")
})
