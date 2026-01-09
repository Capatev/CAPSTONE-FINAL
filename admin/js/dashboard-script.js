// Dashboard Script

// Declare variables before using them
const analyticsAPI = {} // Placeholder for actual API implementation
const reservationAPI = {} // Placeholder for actual API implementation
const userAPI = {} // Placeholder for actual API implementation
const vehicleAPI = {} // Placeholder for actual API implementation
const db = {} // Placeholder for actual database implementation
const SimpleCharts = {} // Placeholder for actual chart library implementation

const formatCurrency = (amount) => {
  // Placeholder for currency formatting logic
  return `$${amount.toFixed(2)}`
}

const formatDate = (date) => {
  // Placeholder for date formatting logic
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

const getStatusBadge = (status) => {
  // Placeholder for status badge logic
  switch (status) {
    case "Pending":
      return '<span class="badge badge-warning">Pending</span>'
    case "Active":
      return '<span class="badge badge-success">Active</span>'
    case "Completed":
      return '<span class="badge badge-info">Completed</span>'
    default:
      return '<span class="badge badge-secondary">Unknown</span>'
  }
}

function initDashboard() {
  updateKPICards()
  loadRecentBookings()
  drawCharts()
  updateFleetStatus()
}

function updateKPICards() {
  document.getElementById("totalVehicles").textContent = analyticsAPI.getTotalVehicles()
  document.getElementById("activeBookings").textContent = analyticsAPI.getActiveReservations()
  document.getElementById("totalRevenue").textContent = formatCurrency(analyticsAPI.getTotalRevenue())
  document.getElementById("totalUsers").textContent = analyticsAPI.getTotalUsers()
}

function loadRecentBookings() {
  const tbody = document.getElementById("recentBookingsTable")
  const reservations = reservationAPI.getAll().slice(-5).reverse()

  tbody.innerHTML = reservations
    .map((res) => {
      const user = userAPI.getById(res.userId)
      const vehicle = vehicleAPI.getById(res.vehicleId)
      return `
            <tr>
                <td>${res.id}</td>
                <td>${user?.name || "N/A"}</td>
                <td>${vehicle?.model || "N/A"}</td>
                <td>${formatDate(res.startDate)}</td>
                <td>${getStatusBadge(res.status)}</td>
                <td>${formatCurrency(res.amount)}</td>
            </tr>
        `
    })
    .join("")
}

function drawCharts() {
  // Revenue Chart
  const last30Days = []
  const revenueData = []

  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    last30Days.push(date.toLocaleDateString("en-US", { month: "short", day: "numeric" }))

    const dayRevenue = db.billing
      .filter((b) => {
        const billDate = new Date(b.date)
        return billDate.toDateString() === date.toDateString() && b.status === "paid"
      })
      .reduce((sum, b) => sum + b.amount, 0)

    revenueData.push(dayRevenue)
  }

  SimpleCharts.drawLineChart("revenueChart", last30Days, revenueData, "Revenue Trend")

  // Booking Status Chart
  const bookingStatus = ["Pending", "Active", "Completed"]
  const bookingCounts = [
    analyticsAPI.getPendingReservations(),
    analyticsAPI.getActiveReservations(),
    analyticsAPI.getCompletedReservations(),
  ]

  SimpleCharts.drawPieChart("bookingChart", bookingStatus, bookingCounts)
}

function updateFleetStatus() {
  document.getElementById("statusAvailable").textContent = analyticsAPI.getVehiclesByStatus("available")
  document.getElementById("statusRented").textContent = analyticsAPI.getVehiclesByStatus("rented")
  document.getElementById("statusMaintenance").textContent = analyticsAPI.getVehiclesByStatus("maintenance")
  document.getElementById("statusDamaged").textContent = analyticsAPI.getVehiclesByStatus("damaged")
}

// Initialize dashboard when page loads
document.addEventListener("DOMContentLoaded", initDashboard)
