/**
 * MVRS Staff Backend - PHP Database Integration
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

// Database object for compatibility
const db = {
  vehicles: [],
  clients: [],
  bookings: [],
  invoices: [],
  assets: [],
  paymentMethods: [],
  activities: [],
}

// Initialize database from PHP API
async function initializeStaffDB() {
  try {
    const [vehiclesRes, usersRes, reservationsRes, invoicesRes, paymentMethodsRes] = await Promise.all([
      apiRequest("vehicles.php"),
      apiRequest("users.php?role=customer"),
      apiRequest("reservations.php"),
      apiRequest("invoices.php"),
      apiRequest("payment-methods.php"),
    ])

    if (vehiclesRes.success) {
      db.vehicles = (vehiclesRes.data || []).map((v) => ({
        id: v.id,
        plate: v.plate,
        model: v.model,
        type: v.type,
        year: v.year,
        mileage: v.mileage,
        status: v.status,
        dailyRate: Number.parseFloat(v.daily_rate),
        totalRentals: v.total_rentals,
      }))
    }

    if (usersRes.success) {
      db.clients = (usersRes.data || []).map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        idType: u.id_type || "national_id",
        status: u.status === "active" ? "verified" : u.status,
        joined: u.joined,
      }))
    }

    if (reservationsRes.success) {
      db.bookings = (reservationsRes.data || []).map((r) => ({
        id: r.reservation_code,
        dbId: r.id,
        clientId: r.user_id,
        vehicleId: r.vehicle_id,
        clientName: r.user_name,
        vehicle: `${r.vehicle_plate} - ${r.vehicle_model}`,
        pickupDate: r.start_date,
        returnDate: r.end_date,
        status: r.status,
        totalAmount: Number.parseFloat(r.total_amount),
        notes: r.notes,
      }))
    }

    if (invoicesRes.success) {
      db.invoices = (invoicesRes.data || []).map((i) => ({
        id: i.invoice_code,
        dbId: i.id,
        clientId: i.user_id,
        bookingId: i.reservation_id,
        clientName: i.user_name,
        amount: Number.parseFloat(i.total_amount),
        dueDate: i.due_date,
        status: i.status,
        paymentMethod: i.payment_method,
        createdDate: i.created_at,
      }))
    }

    if (paymentMethodsRes.success) {
      db.paymentMethods = (paymentMethodsRes.data || []).map((pm) => ({
        id: pm.method_code,
        dbId: pm.id,
        name: pm.name,
        status: pm.status,
        config: pm.account_details || {},
      }))
    }

    console.log("Staff database initialized from PHP API")
    return true
  } catch (error) {
    console.error("Failed to initialize staff database:", error)
    return false
  }
}

// Utility Functions
function getAvailableVehicles() {
  return db.vehicles.filter((v) => v.status === "available")
}

function getRentedVehicles() {
  return db.vehicles.filter((v) => v.status === "rented")
}

function getMaintenanceVehicles() {
  return db.vehicles.filter((v) => v.status === "maintenance")
}

function getDamagedVehicles() {
  return db.vehicles.filter((v) => v.status === "damaged")
}

function getPendingVerifications() {
  return db.clients.filter((c) => c.status === "pending")
}

function getPendingInvoices() {
  return db.invoices.filter((i) => i.status === "pending")
}

function getTodayBookings() {
  const today = new Date().toISOString().split("T")[0]
  return db.bookings.filter((b) => b.pickupDate === today || b.status === "pending")
}

function getTotalReceivable() {
  return db.invoices.filter((i) => i.status === "pending").reduce((sum, inv) => sum + inv.amount, 0)
}

function getTotalRevenue() {
  return db.invoices.filter((i) => i.status === "paid").reduce((sum, inv) => sum + inv.amount, 0)
}

// Booking operations
async function createBooking(bookingData) {
  const response = await apiRequest("reservations.php", {
    method: "POST",
    body: {
      user_id: bookingData.clientId,
      vehicle_id: bookingData.vehicleId,
      start_date: bookingData.pickupDate,
      end_date: bookingData.returnDate,
      pickup_location: bookingData.pickupLocation || "Main Branch",
      dropoff_location: bookingData.dropoffLocation || "Main Branch",
      total_amount: bookingData.totalAmount,
      status: "pending",
      notes: bookingData.notes,
    },
  })

  if (response.success) {
    await initializeStaffDB() // Refresh data
  }
  return response
}

async function updateBookingStatus(bookingId, status) {
  const booking = db.bookings.find((b) => b.id === bookingId)
  if (!booking) return { success: false, message: "Booking not found" }

  const response = await apiRequest(`reservations.php?id=${booking.dbId}`, {
    method: "PUT",
    body: { status },
  })

  if (response.success) {
    await initializeStaffDB()
  }
  return response
}

// Invoice operations
async function createInvoice(invoiceData) {
  const response = await apiRequest("invoices.php", {
    method: "POST",
    body: {
      user_id: invoiceData.clientId,
      reservation_id: invoiceData.bookingId,
      amount: invoiceData.amount,
      total_amount: invoiceData.amount,
      due_date: invoiceData.dueDate,
      status: "pending",
    },
  })

  if (response.success) {
    await initializeStaffDB()
  }
  return response
}

async function processPayment(invoiceId, paymentMethod) {
  const invoice = db.invoices.find((i) => i.id === invoiceId)
  if (!invoice) return { success: false, message: "Invoice not found" }

  const response = await apiRequest(`invoices.php?id=${invoice.dbId}`, {
    method: "PUT",
    body: {
      status: "paid",
      payment_method: paymentMethod,
    },
  })

  if (response.success) {
    await initializeStaffDB()
  }
  return response
}

// Client verification
async function verifyClient(clientId) {
  const response = await apiRequest(`users.php?id=${clientId}`, {
    method: "PUT",
    body: { status: "active" },
  })

  if (response.success) {
    await initializeStaffDB()
  }
  return response
}

async function rejectClient(clientId) {
  const response = await apiRequest(`users.php?id=${clientId}`, {
    method: "PUT",
    body: { status: "inactive" },
  })

  if (response.success) {
    await initializeStaffDB()
  }
  return response
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  initializeStaffDB()
})
