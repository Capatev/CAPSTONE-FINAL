// Oversee Reservations Script

// Declare necessary APIs and functions
const reservationAPI = {
  search: (query) => {
    // Implementation for searching reservations
  },
  getAll: () => {
    // Implementation for getting all reservations
  },
  filterByStatus: (status) => {
    // Implementation for filtering reservations by status
  },
  update: (id, data) => {
    // Implementation for updating a reservation
  },
}

const analyticsAPI = {
  getTotalReservations: () => {
    // Implementation for getting total reservations
  },
  getActiveReservations: () => {
    // Implementation for getting active reservations
  },
  getPendingReservations: () => {
    // Implementation for getting pending reservations
  },
  getCompletedReservations: () => {
    // Implementation for getting completed reservations
  },
}

const userAPI = {
  getById: (id) => {
    // Implementation for getting user by ID
  },
}

const vehicleAPI = {
  getById: (id) => {
    // Implementation for getting vehicle by ID
  },
}

function formatDate(date) {
  // Implementation for formatting date
  return new Date(date).toLocaleDateString()
}

function formatCurrency(amount) {
  // Implementation for formatting currency
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" })
}

function getStatusBadge(status) {
  // Implementation for getting status badge
  return `<span class="badge bg-${status === "active" ? "success" : status === "pending" ? "warning" : status === "completed" ? "info" : "danger"}">${status}</span>`
}

function showNotification(message) {
  // Implementation for showing notification
  alert(message)
}

function initReservations() {
  loadReservations()
  updateReservationStats()
  setupEventListeners()
}

function setupEventListeners() {
  const searchInput = document.getElementById("searchReservations")
  const filterStatus = document.getElementById("filterReservationStatus")

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value
      const reservations = query ? reservationAPI.search(query) : reservationAPI.getAll()
      displayReservations(reservations)
    })
  }

  if (filterStatus) {
    filterStatus.addEventListener("change", (e) => {
      const status = e.target.value
      const reservations = reservationAPI.filterByStatus(status)
      displayReservations(reservations)
    })
  }
}

function updateReservationStats() {
  document.getElementById("totalReservations").textContent = analyticsAPI.getTotalReservations()
  document.getElementById("activeRes").textContent = analyticsAPI.getActiveReservations()
  document.getElementById("pendingRes").textContent = analyticsAPI.getPendingReservations()
  document.getElementById("completedRes").textContent = analyticsAPI.getCompletedReservations()
}

function loadReservations() {
  displayReservations(reservationAPI.getAll())
}

function displayReservations(reservations) {
  const tbody = document.getElementById("reservationsTableBody")

  if (reservations.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px;">No reservations found</td></tr>'
    return
  }

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
                <td>
                    <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="updateReservationStatus('${res.id}')">Update</button>
                </td>
            </tr>
        `
    })
    .join("")
}

function updateReservationStatus(id) {
  const newStatus = prompt("Enter new status (pending/active/completed/cancelled):")
  if (newStatus && ["pending", "active", "completed", "cancelled"].includes(newStatus)) {
    reservationAPI.update(id, { status: newStatus })
    showNotification("Reservation updated successfully")
    loadReservations()
    updateReservationStats()
  }
}

document.addEventListener("DOMContentLoaded", initReservations)
