// Import or declare the driverDB variable before using it
const driverDB = {
  getCurrentDriver: () => {
    // Mock implementation for demonstration purposes
    return { fullname: "John Doe", id: "123" }
  },
  getBookingsByDriver: (driverId) => {
    // Mock implementation for demonstration purposes
    return [
      {
        id: "1",
        vehicleName: "Car A",
        clientName: "Client X",
        startDate: "2023-10-01",
        endDate: "2023-10-05",
        pickupLocation: "Location 1",
        totalAmount: 1000,
        status: "active",
      },
      {
        id: "2",
        vehicleName: "Car B",
        clientName: "Client Y",
        startDate: "2023-10-06",
        endDate: "2023-10-10",
        pickupLocation: "Location 2",
        totalAmount: 2000,
        status: "completed",
      },
    ]
  },
  bookings: [
    {
      id: "1",
      vehicleName: "Car A",
      clientName: "Client X",
      startDate: "2023-10-01",
      endDate: "2023-10-05",
      pickupLocation: "Location 1",
      dropoffLocation: "Location 3",
      totalAmount: 1000,
      status: "active",
    },
    {
      id: "2",
      vehicleName: "Car B",
      clientName: "Client Y",
      startDate: "2023-10-06",
      endDate: "2023-10-10",
      pickupLocation: "Location 2",
      dropoffLocation: "Location 4",
      totalAmount: 2000,
      status: "completed",
    },
  ],
  logout: () => {
    // Mock implementation for demonstration purposes
    console.log("Logging out...")
  },
}

document.addEventListener("DOMContentLoaded", () => {
  initializeAssignedBookings()
})

function initializeAssignedBookings() {
  const driver = driverDB.getCurrentDriver()

  if (!driver) {
    window.location.href = "../../index.html"
    return
  }

  document.getElementById("driverName").textContent = driver.fullname

  // Load bookings
  loadBookings()

  // Setup filters
  setupFilters()

  // Setup logout
  setupLogout()
}

function loadBookings() {
  const driver = driverDB.getCurrentDriver()
  const bookings = driverDB.getBookingsByDriver(driver.id)

  const container = document.getElementById("bookingsList")

  if (bookings.length === 0) {
    container.innerHTML = `<p class="empty-state">No bookings assigned yet</p>`
    return
  }

  container.innerHTML = bookings
    .map(
      (booking) => `
    <div class="booking-item" onclick="openBookingModal('${booking.id}')">
      <div class="booking-summary">
        <div class="booking-id">${booking.id} - ${booking.vehicleName}</div>
        <div class="booking-details">
          <div class="booking-detail">
            <span class="booking-detail-label">Client:</span>
            <span>${booking.clientName}</span>
          </div>
          <div class="booking-detail">
            <span class="booking-detail-label">Dates:</span>
            <span>${booking.startDate} to ${booking.endDate}</span>
          </div>
          <div class="booking-detail">
            <span class="booking-detail-label">Pickup:</span>
            <span>${booking.pickupLocation}</span>
          </div>
          <div class="booking-detail">
            <span class="booking-detail-label">Amount:</span>
            <span>₱${booking.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <span class="badge badge-${booking.status}">${booking.status.toUpperCase()}</span>
    </div>
  `,
    )
    .join("")
}

function setupFilters() {
  const filterSelect = document.getElementById("statusFilter")

  filterSelect.addEventListener("change", function () {
    const driver = driverDB.getCurrentDriver()
    const status = this.value

    const container = document.getElementById("bookingsList")
    let bookings = driverDB.getBookingsByDriver(driver.id)

    if (status) {
      bookings = bookings.filter((b) => b.status === status)
    }

    if (bookings.length === 0) {
      container.innerHTML = `<p class="empty-state">No bookings found with selected filter</p>`
      return
    }

    container.innerHTML = bookings
      .map(
        (booking) => `
      <div class="booking-item" onclick="openBookingModal('${booking.id}')">
        <div class="booking-summary">
          <div class="booking-id">${booking.id} - ${booking.vehicleName}</div>
          <div class="booking-details">
            <div class="booking-detail">
              <span class="booking-detail-label">Client:</span>
              <span>${booking.clientName}</span>
            </div>
            <div class="booking-detail">
              <span class="booking-detail-label">Dates:</span>
              <span>${booking.startDate} to ${booking.endDate}</span>
            </div>
            <div class="booking-detail">
              <span class="booking-detail-label">Pickup:</span>
              <span>${booking.pickupLocation}</span>
            </div>
            <div class="booking-detail">
              <span class="booking-detail-label">Amount:</span>
              <span>₱${booking.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <span class="badge badge-${booking.status}">${booking.status.toUpperCase()}</span>
      </div>
    `,
      )
      .join("")
  })
}

function openBookingModal(bookingId) {
  const booking = driverDB.bookings.find((b) => b.id === bookingId)

  if (!booking) return

  const modal = document.getElementById("bookingModal")
  const content = document.getElementById("bookingDetailContent")

  content.innerHTML = `
    <div class="booking-card">
      <div class="booking-info-group">
        <div class="booking-info-label">Booking ID</div>
        <div class="booking-info-value">${booking.id}</div>
      </div>
      <div class="booking-info-group">
        <div class="booking-info-label">Vehicle</div>
        <div class="booking-info-value">${booking.vehicleName}</div>
      </div>
      <div class="booking-info-group">
        <div class="booking-info-label">Client Name</div>
        <div class="booking-info-value">${booking.clientName}</div>
      </div>
      <div class="booking-info-group">
        <div class="booking-info-label">Pickup Location</div>
        <div class="booking-info-value">${booking.pickupLocation}</div>
      </div>
      <div class="booking-info-group">
        <div class="booking-info-label">Dropoff Location</div>
        <div class="booking-info-value">${booking.dropoffLocation}</div>
      </div>
      <div class="booking-info-group">
        <div class="booking-info-label">Start Date</div>
        <div class="booking-info-value">${booking.startDate}</div>
      </div>
      <div class="booking-info-group">
        <div class="booking-info-label">End Date</div>
        <div class="booking-info-value">${booking.endDate}</div>
      </div>
      <div class="booking-info-group">
        <div class="booking-info-label">Total Amount</div>
        <div class="booking-info-value">₱${booking.totalAmount.toLocaleString()}</div>
      </div>
      <div class="booking-info-group">
        <div class="booking-info-label">Status</div>
        <div class="booking-info-value"><span class="badge badge-${booking.status}">${booking.status.toUpperCase()}</span></div>
      </div>
    </div>
  `

  modal.style.display = "flex"
}

document.querySelector(".close-btn").addEventListener("click", () => {
  document.getElementById("bookingModal").style.display = "none"
})

window.addEventListener("click", (event) => {
  const modal = document.getElementById("bookingModal")
  if (event.target === modal) {
    modal.style.display = "none"
  }
})

function setupLogout() {
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
