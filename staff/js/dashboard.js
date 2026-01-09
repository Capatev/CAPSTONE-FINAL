// Staff Dashboard

document.addEventListener("DOMContentLoaded", () => {
  updateDashboard()
})

function updateDashboard() {
  // Update KPI Cards
  document.getElementById("todayBookings").textContent = getTodayBookings().length
  document.getElementById("availableVehicles").textContent = getAvailableVehicles().length
  document.getElementById("pendingVerification").textContent = getPendingVerifications().length
  document.getElementById("pendingPayments").textContent = formatCurrency(getTotalReceivable())

  // Fleet Status
  document.getElementById("fleetAvailable").textContent = getAvailableVehicles().length
  document.getElementById("fleetRented").textContent = getRentedVehicles().length
  document.getElementById("fleetMaintenance").textContent = getMaintenanceVehicles().length
  document.getElementById("fleetDamaged").textContent = getDamagedVehicles().length

  // Activities
  populateActivities()
}

function populateActivities() {
  const tbody = document.getElementById("activitiesTable")
  tbody.innerHTML = ""

  db.activities.forEach((activity) => {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td>${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}</td>
      <td>${activity.details}</td>
      <td>${createBadge(activity.status)}</td>
      <td>${activity.time}</td>
    `
    tbody.appendChild(row)
  })
}

// Declare variables and functions
const db = {
  activities: [
    { type: "booking", details: "Vehicle 1", status: "pending", time: "10:00 AM" },
    { type: "verification", details: "Vehicle 2", status: "approved", time: "11:00 AM" },
    { type: "payment", details: "Vehicle 3", status: "paid", time: "12:00 PM" },
  ],
}

function getTodayBookings() {
  return db.activities.filter((activity) => activity.type === "booking")
}

function getAvailableVehicles() {
  return db.activities.filter((activity) => activity.status === "available")
}

function getPendingVerifications() {
  return db.activities.filter((activity) => activity.status === "pending")
}

function getTotalReceivable() {
  return 1000 // Placeholder value
}

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`
}

function getRentedVehicles() {
  return db.activities.filter((activity) => activity.status === "rented")
}

function getMaintenanceVehicles() {
  return db.activities.filter((activity) => activity.status === "maintenance")
}

function getDamagedVehicles() {
  return db.activities.filter((activity) => activity.status === "damaged")
}

function createBadge(status) {
  let badgeClass = ""
  switch (status) {
    case "pending":
      badgeClass = "badge-warning"
      break
    case "approved":
      badgeClass = "badge-success"
      break
    case "paid":
      badgeClass = "badge-primary"
      break
    case "rented":
      badgeClass = "badge-info"
      break
    case "maintenance":
      badgeClass = "badge-secondary"
      break
    case "damaged":
      badgeClass = "badge-danger"
      break
    default:
      badgeClass = "badge-light"
  }
  return `<span class="badge ${badgeClass}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`
}
