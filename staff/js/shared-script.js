// Shared Functions for Staff Interface

// Modal Functions
function openModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.add("active")
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.remove("active")
  }
}

// Format Currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
  }).format(amount)
}

// Format Date
function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" }
  return new Date(dateString).toLocaleDateString("en-US", options)
}

// Create Badge
function createBadge(status) {
  const badgeMap = {
    pending: "badge-warning",
    confirmed: "badge-info",
    active: "badge-primary",
    completed: "badge-success",
    paid: "badge-success",
    unpaid: "badge-danger",
    verified: "badge-success",
    rejected: "badge-danger",
    available: "badge-success",
    rented: "badge-info",
    maintenance: "badge-warning",
    damaged: "badge-danger",
  }

  return `<span class="badge ${badgeMap[status] || "badge-primary"}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`
}

// Logout
document.querySelectorAll(".logout-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (confirm("Are you sure you want to logout?")) {
      alert("Logged out successfully")
      // Redirect to login page
      // window.location.href = '/login.html';
    }
  })
})

// Search Function
function setupSearch(inputId, tableId, searchFunction) {
  const searchInput = document.getElementById(inputId)
  if (searchInput) {
    searchInput.addEventListener("keyup", () => {
      const searchTerm = searchInput.value.toLowerCase()
      searchFunction(searchTerm)
    })
  }
}

// Filter Function
function setupFilter(filterId, tableId, filterFunction) {
  const filterSelect = document.getElementById(filterId)
  if (filterSelect) {
    filterSelect.addEventListener("change", () => {
      const filterValue = filterSelect.value
      filterFunction(filterValue)
    })
  }
}
