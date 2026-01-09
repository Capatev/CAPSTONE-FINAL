// Assuming driverDB is imported or declared somewhere in the code
const driverDB = require("./driverDB") // This line should be adjusted based on the actual import method

document.addEventListener("DOMContentLoaded", () => {
  initializeCheckInOut()
})

function initializeCheckInOut() {
  const driver = driverDB.getCurrentDriver()

  if (!driver) {
    window.location.href = "../../index.html"
    return
  }

  document.getElementById("driverName").textContent = driver.fullname

  // Load bookings into dropdowns
  loadBookingsToDropdowns()

  // Load history
  loadHistory()

  // Setup form handlers
  setupFormHandlers()

  // Setup logout
  setupLogout()
}

function loadBookingsToDropdowns() {
  const driver = driverDB.getCurrentDriver()
  const bookings = driverDB.getBookingsByDriver(driver.id)

  const checkOutSelect = document.getElementById("checkOutBooking")
  const checkInSelect = document.getElementById("checkInBooking")

  bookings.forEach((booking) => {
    const option1 = document.createElement("option")
    option1.value = booking.id
    option1.textContent = `${booking.id} - ${booking.vehicleName}`
    checkOutSelect.appendChild(option1)

    const option2 = document.createElement("option")
    option2.value = booking.id
    option2.textContent = `${booking.id} - ${booking.vehicleName}`
    checkInSelect.appendChild(option2)
  })
}

function setupFormHandlers() {
  document.getElementById("checkOutForm").addEventListener("submit", (e) => {
    e.preventDefault()
    handleCheckOut()
  })

  document.getElementById("checkInForm").addEventListener("submit", (e) => {
    e.preventDefault()
    handleCheckIn()
  })
}

function handleCheckOut() {
  const bookingId = document.getElementById("checkOutBooking").value
  const mileage = document.getElementById("checkOutMileage").value
  const fuel = document.getElementById("checkOutFuel").value
  const condition = document.getElementById("checkOutCondition").value

  if (!bookingId || !mileage || !fuel) {
    alert("Please fill in all required fields")
    return
  }

  const booking = driverDB.bookings.find((b) => b.id === bookingId)

  const record = driverDB.addCheckInOut({
    bookingId: bookingId,
    vehicleId: booking.vehicleId,
    type: "checkout",
    mileage: mileage,
    fuel: fuel,
    condition: condition,
  })

  alert("Vehicle checked out successfully!")
  document.getElementById("checkOutForm").reset()
  loadHistory()
}

function handleCheckIn() {
  const bookingId = document.getElementById("checkInBooking").value
  const mileage = document.getElementById("checkInMileage").value
  const fuel = document.getElementById("checkInFuel").value
  const condition = document.getElementById("checkInCondition").value

  if (!bookingId || !mileage || !fuel) {
    alert("Please fill in all required fields")
    return
  }

  const booking = driverDB.bookings.find((b) => b.id === bookingId)

  const record = driverDB.addCheckInOut({
    bookingId: bookingId,
    vehicleId: booking.vehicleId,
    type: "checkin",
    mileage: mileage,
    fuel: fuel,
    condition: condition,
  })

  alert("Vehicle checked in successfully!")
  document.getElementById("checkInForm").reset()
  loadHistory()
}

function loadHistory() {
  const driver = driverDB.getCurrentDriver()
  const bookings = driverDB.getBookingsByDriver(driver.id)
  const bookingIds = bookings.map((b) => b.id)

  const records = driverDB.checkInOutRecords.filter((r) => bookingIds.includes(r.bookingId))

  const tbody = document.getElementById("historyTableBody")

  if (records.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-state">No check in/out records yet</td></tr>`
    return
  }

  tbody.innerHTML = records
    .map(
      (record) => `
    <tr>
      <td>${record.bookingId}</td>
      <td>${driverDB.getVehicleById(record.vehicleId)?.name || "Unknown"}</td>
      <td>${record.type === "checkout" ? "Check Out" : "Check In"}</td>
      <td>${record.mileage} km</td>
      <td>${record.fuel}</td>
      <td><span class="badge badge-${record.type === "checkout" ? "active" : "completed"}">${record.type.toUpperCase()}</span></td>
      <td>${record.timestamp}</td>
    </tr>
  `,
    )
    .join("")
}

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
