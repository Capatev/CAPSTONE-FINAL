// Reports Script

const analyticsAPI = {} // Declare analyticsAPI variable
const SimpleCharts = {} // Declare SimpleCharts variable
const vehicleAPI = {} // Declare vehicleAPI variable
const billingAPI = {} // Declare billingAPI variable
const reservationAPI = {} // Declare reservationAPI variable
const userAPI = {} // Declare userAPI variable
const db = {} // Declare db variable

function getStatusBadge(status) {
  // Implement getStatusBadge function
  return `<span class="badge badge-${status === "paid" ? "success" : "danger"}">${status}</span>`
}

function formatCurrency(amount) {
  // Implement formatCurrency function
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
}

function formatDate(date) {
  // Implement formatDate function
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function showNotification(message) {
  // Implement showNotification function
  alert(message)
}

function initReports() {
  const currentPage = window.location.pathname.split("/").pop()

  if (currentPage.includes("vehicle-report")) {
    initVehicleReport()
  } else if (currentPage.includes("revenue-report")) {
    initRevenueReport()
  } else if (currentPage.includes("booking-report")) {
    initBookingReport()
  }
}

// VEHICLE REPORT
function initVehicleReport() {
  updateVehicleMetrics()
  drawVehicleCharts()
  displayVehicleDetails()
}

function updateVehicleMetrics() {
  document.getElementById("reportTotalVehicles").textContent = analyticsAPI.getTotalVehicles()
  document.getElementById("reportAvailable").textContent = analyticsAPI.getVehiclesByStatus("available")
  document.getElementById("reportRented").textContent = analyticsAPI.getVehiclesByStatus("rented")
  document.getElementById("reportAvgMileage").textContent = analyticsAPI.getAverageMileage() + " km"
}

function drawVehicleCharts() {
  const statuses = ["Available", "Rented", "Maintenance", "Damaged"]
  const statusCounts = [
    analyticsAPI.getVehiclesByStatus("available"),
    analyticsAPI.getVehiclesByStatus("rented"),
    analyticsAPI.getVehiclesByStatus("maintenance"),
    analyticsAPI.getVehiclesByStatus("damaged"),
  ]

  SimpleCharts.drawPieChart("vehicleStatusChart", statuses, statusCounts)

  const types = ["Sedan", "SUV", "Van", "Truck", "Sports"]
  const typeCounts = [
    vehicleAPI.getAll().filter((v) => v.type === "sedan").length,
    vehicleAPI.getAll().filter((v) => v.type === "suv").length,
    vehicleAPI.getAll().filter((v) => v.type === "van").length,
    vehicleAPI.getAll().filter((v) => v.type === "truck").length,
    vehicleAPI.getAll().filter((v) => v.type === "sports").length,
  ]

  SimpleCharts.drawPieChart("vehicleTypeChart", types, typeCounts)
}

function displayVehicleDetails() {
  const tbody = document.getElementById("vehicleReportTableBody")
  const vehicles = vehicleAPI.getAll()

  tbody.innerHTML = vehicles
    .map(
      (vehicle) => `
        <tr>
            <td>${vehicle.plate}</td>
            <td>${vehicle.model}</td>
            <td>${vehicle.type}</td>
            <td>${vehicle.year}</td>
            <td>${vehicle.mileage.toLocaleString()}</td>
            <td>${getStatusBadge(vehicle.status)}</td>
            <td>${formatCurrency(vehicle.dailyRate)}</td>
            <td>${vehicle.totalRentals}</td>
        </tr>
    `,
    )
    .join("")
}

// REVENUE REPORT
function initRevenueReport() {
  updateRevenueMetrics()
  drawRevenueCharts()
  displayPaymentMethods()
  displayRevenueTransactions()
}

function updateRevenueMetrics() {
  document.getElementById("reportTotalRevenue").textContent = formatCurrency(analyticsAPI.getTotalRevenue())
  document.getElementById("reportMonthRevenue").textContent = formatCurrency(analyticsAPI.getMonthlyRevenue())

  const avgDaily = analyticsAPI.getTotalRevenue() / 30
  document.getElementById("reportAvgDailyRevenue").textContent = formatCurrency(avgDaily)
  document.getElementById("reportTransactions").textContent = billingAPI
    .getAll()
    .filter((b) => b.status === "paid").length
}

function drawRevenueCharts() {
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

  SimpleCharts.drawLineChart("revenueChart", last30Days, revenueData)

  const types = ["Sedan", "SUV", "Van", "Truck", "Sports"]
  const typeRevenue = types.map((type) => {
    return reservationAPI
      .getAll()
      .filter((r) => {
        const vehicle = vehicleAPI.getById(r.vehicleId)
        return vehicle && vehicle.type === type.toLowerCase() && r.status === "completed"
      })
      .reduce((sum, r) => sum + r.amount, 0)
  })

  SimpleCharts.drawPieChart("revenueTypeChart", types, typeRevenue)
}

function displayPaymentMethods() {
  const methods = analyticsAPI.getRevenueByPaymentMethod()
  const total = Object.values(methods).reduce((a, b) => a + b, 0)

  document.getElementById("paymentCard").textContent = formatCurrency(methods.card)
  document.getElementById("paymentCash").textContent = formatCurrency(methods.cash)
  document.getElementById("paymentTransfer").textContent = formatCurrency(methods.transfer)
}

function displayRevenueTransactions() {
  const tbody = document.getElementById("revenueTableBody")
  const billing = billingAPI
    .getAll()
    .filter((b) => b.status === "paid")
    .slice(-10)

  tbody.innerHTML = billing
    .map((bill) => {
      const user = userAPI.getById(bill.userId)
      const res = reservationAPI.getAll().find((r) => r.id === bill.id)
      const vehicle = res ? vehicleAPI.getById(res.vehicleId) : null

      return `
            <tr>
                <td>${bill.id}</td>
                <td>${user?.name || "N/A"}</td>
                <td>${vehicle?.model || "N/A"}</td>
                <td>${formatCurrency(bill.amount)}</td>
                <td>${formatDate(bill.date)}</td>
                <td>${getStatusBadge(bill.status)}</td>
                <td>${bill.paymentMethod}</td>
            </tr>
        `
    })
    .join("")
}

// BOOKING REPORT
function initBookingReport() {
  updateBookingMetrics()
  drawBookingCharts()
  displayCustomerSegments()
  displayBookingDetails()
}

function updateBookingMetrics() {
  document.getElementById("reportTotalBookings").textContent = analyticsAPI.getTotalReservations()
  document.getElementById("reportActiveBookings").textContent = analyticsAPI.getActiveReservations()
  document.getElementById("reportCompletedBookings").textContent = analyticsAPI.getCompletedReservations()

  const totalDays = reservationAPI.getAll().reduce((sum, r) => sum + r.days, 0)
  const avgDays = totalDays / (reservationAPI.getAll().length || 1)
  document.getElementById("reportAvgDuration").textContent = Math.round(avgDays)
}

function drawBookingCharts() {
  const statuses = ["Pending", "Active", "Completed", "Cancelled"]
  const counts = [
    analyticsAPI.getPendingReservations(),
    analyticsAPI.getActiveReservations(),
    analyticsAPI.getCompletedReservations(),
    reservationAPI.getAll().filter((r) => r.status === "cancelled").length,
  ]

  SimpleCharts.drawPieChart("bookingStatusChart", statuses, counts)

  const last30Days = []
  const bookingData = []

  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    last30Days.push(date.toLocaleDateString("en-US", { month: "short", day: "numeric" }))

    const dayBookings = reservationAPI
      .getAll()
      .filter((r) => new Date(r.startDate).toDateString() === date.toDateString()).length

    bookingData.push(dayBookings)
  }

  SimpleCharts.drawLineChart("bookingTrendChart", last30Days, bookingData)
}

function displayCustomerSegments() {
  const allUsers = userAPI.getAll()

  const newCustomers = allUsers.filter((u) => {
    const bookingCount = reservationAPI.getAll().filter((r) => r.userId === u.id).length
    return bookingCount === 1
  }).length

  const repeatCustomers = allUsers.filter((u) => {
    const bookingCount = reservationAPI.getAll().filter((r) => r.userId === u.id).length
    return bookingCount > 1
  }).length

  const highValueCustomers = allUsers.filter((u) => {
    const total = reservationAPI
      .getAll()
      .filter((r) => r.userId === u.id)
      .reduce((sum, r) => sum + r.amount, 0)
    return total > 50000
  }).length

  document.getElementById("newCustomers").textContent = newCustomers
  document.getElementById("repeatCustomers").textContent = repeatCustomers
  document.getElementById("highValueCustomers").textContent = highValueCustomers
}

function displayBookingDetails() {
  const tbody = document.getElementById("bookingTableBody")
  const reservations = reservationAPI.getAll().slice(-10).reverse()

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
                <td>${formatDate(res.endDate)}</td>
                <td>${res.days}</td>
                <td>${formatCurrency(res.amount)}</td>
                <td>${getStatusBadge(res.status)}</td>
            </tr>
        `
    })
    .join("")
}

function downloadReportPDF() {
  showNotification("PDF download initiated - saving as simulated file")
}

document.addEventListener("DOMContentLoaded", initReports)
