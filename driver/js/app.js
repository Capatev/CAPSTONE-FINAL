// Driver Dashboard App
const driverDB = {
  getCurrentDriver: () => {
    // Mock implementation for demonstration purposes
    return { fullname: "John Doe", id: "123" }
  },
  getTodayBookingsCount: (driverId) => {
    // Mock implementation for demonstration purposes
    return 5
  },
  getActiveBooking: (driverId) => {
    // Mock implementation for demonstration purposes
    return {
      id: "456",
      vehicleName: "Car XYZ",
      clientName: "Jane Smith",
      pickupLocation: "123 Main St",
      startDate: "2023-10-01",
      endDate: "2023-10-05",
    }
  },
  getPendingCheckIns: (driverId) => {
    // Mock implementation for demonstration purposes
    return 2
  },
  logout: () => {
    // Mock implementation for demonstration purposes
    console.log("Logging out...")
  },
}

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Dashboard
  initializeDashboard()
  setupEventListeners()
})

function initializeDashboard() {
  const driver = driverDB.getCurrentDriver()

  if (!driver) {
    window.location.href = "../../index.html"
    return
  }

  // Update driver name
  document.getElementById("driverName").textContent = driver.fullname

  // Update KPIs
  updateKPIs()

  // Load active booking
  loadActiveBooking()

  // Setup logout
  setupLogout()
}

function updateKPIs() {
  const driver = driverDB.getCurrentDriver()

  const todayBookings = driverDB.getTodayBookingsCount(driver.id)
  document.getElementById("assignedToday").textContent = todayBookings

  const activeBooking = driverDB.getActiveBooking(driver.id)
  if (activeBooking) {
    document.getElementById("currentVehicle").textContent = activeBooking.vehicleName
  } else {
    document.getElementById("currentVehicle").textContent = "No Active Booking"
  }

  const pendingCheckIns = driverDB.getPendingCheckIns(driver.id)
  document.getElementById("pendingCheckIns").textContent = pendingCheckIns
}

function loadActiveBooking() {
  const driver = driverDB.getCurrentDriver()
  const activeBooking = driverDB.getActiveBooking(driver.id)

  const container = document.getElementById("activeBooking")

  if (activeBooking) {
    container.innerHTML = `
      <div class="booking-card">
        <div class="booking-info-group">
          <div class="booking-info-label">Booking ID</div>
          <div class="booking-info-value">${activeBooking.id}</div>
        </div>
        <div class="booking-info-group">
          <div class="booking-info-label">Vehicle</div>
          <div class="booking-info-value">${activeBooking.vehicleName}</div>
        </div>
        <div class="booking-info-group">
          <div class="booking-info-label">Client</div>
          <div class="booking-info-value">${activeBooking.clientName}</div>
        </div>
        <div class="booking-info-group">
          <div class="booking-info-label">Pickup Location</div>
          <div class="booking-info-value">${activeBooking.pickupLocation}</div>
        </div>
        <div class="booking-info-group">
          <div class="booking-info-label">Duration</div>
          <div class="booking-info-value">${calculateDays(activeBooking.startDate, activeBooking.endDate)} days</div>
        </div>
        <div class="booking-info-group">
          <div class="booking-info-label">Status</div>
          <div class="booking-info-value"><span class="badge badge-active">ACTIVE</span></div>
        </div>
      </div>
    `
  } else {
    container.innerHTML = `<p class="empty-state">No active bookings at the moment</p>`
  }
}

function calculateDays(start, end) {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const timeDiff = Math.abs(endDate - startDate)
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1
}

function setupEventListeners() {
  const logoutBtn = document.querySelector(".logout-btn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout)
  }
}

function handleLogout() {
  if (confirm("Are you sure you want to logout?")) {
    driverDB.logout()
    window.location.href = "../../index.html"
  }
}

function setupLogout() {
  const logoutBtn = document.querySelector(".logout-btn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout)
  }
}
