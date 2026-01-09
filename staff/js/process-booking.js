// Declare variables and functions that are used but not defined in this script
const db = {} // Placeholder for database object
const setupSearch = () => {} // Placeholder for setupSearch function
const setupFilter = () => {} // Placeholder for setupFilter function
const getAvailableVehicles = () => [] // Placeholder for getAvailableVehicles function
const formatCurrency = (amount) => amount.toString() // Placeholder for formatCurrency function
const formatDate = (date) => date.toString() // Placeholder for formatDate function
const createBadge = (status) => status.toString() // Placeholder for createBadge function
const openModal = (modalId) => {} // Placeholder for openModal function
const closeModal = (modalId) => {} // Placeholder for closeModal function

// These functions are defined in those files and loaded before this script

// Process Booking Page
document.addEventListener("DOMContentLoaded", () => {
  populateVehicleSelect()
  populateBookings()
  setupSearch("searchBooking", "bookingsTable", filterBookings)
  setupFilter("filterStatus", "bookingsTable", filterBookings)

  // Auto-calculate rental days and cost
  document.getElementById("pickupDate")?.addEventListener("change", calculateCost)
  document.getElementById("returnDate")?.addEventListener("change", calculateCost)
  document.getElementById("vehicleSelect")?.addEventListener("change", calculateCost)

  // Form submission
  document.getElementById("bookingForm")?.addEventListener("submit", createBooking)
})

function populateVehicleSelect() {
  const select = document.getElementById("vehicleSelect")
  if (!select) return

  select.innerHTML = '<option value="">Choose a vehicle...</option>'
  getAvailableVehicles().forEach((vehicle) => {
    const option = document.createElement("option")
    option.value = vehicle.id
    option.textContent = `${vehicle.model} (${vehicle.plate}) - ₱${vehicle.dailyRate}/day`
    select.appendChild(option)
  })
}

function calculateCost() {
  const vehicleId = document.getElementById("vehicleSelect").value
  const pickupDate = document.getElementById("pickupDate").value
  const returnDate = document.getElementById("returnDate").value

  if (!vehicleId || !pickupDate || !returnDate) return

  const vehicle = db.vehicles.find((v) => v.id == vehicleId)
  const pickup = new Date(pickupDate)
  const returnDt = new Date(returnDate)
  const days = Math.ceil((returnDt - pickup) / (1000 * 60 * 60 * 24)) + 1

  document.getElementById("rentalDays").value = days
  document.getElementById("totalCost").value = formatCurrency(days * vehicle.dailyRate)
}

function populateBookings() {
  const tbody = document.getElementById("bookingsTable")
  tbody.innerHTML = ""

  db.bookings.forEach((booking) => {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td>${booking.id}</td>
      <td>${booking.clientName}</td>
      <td>${booking.vehicle}</td>
      <td>${formatDate(booking.pickupDate)} - ${formatDate(booking.returnDate)}</td>
      <td>${createBadge(booking.status)}</td>
      <td>${formatCurrency(booking.totalAmount)}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editBooking('${booking.id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteBooking('${booking.id}')">Cancel</button>
      </td>
    `
    tbody.appendChild(row)
  })
}

function filterBookings(searchTerm) {
  const tbody = document.getElementById("bookingsTable")
  const filterValue = document.getElementById("filterStatus").value

  tbody.innerHTML = ""

  db.bookings
    .filter((booking) => {
      const matchesSearch =
        booking.id.toLowerCase().includes(searchTerm) || booking.clientName.toLowerCase().includes(searchTerm)
      const matchesFilter = !filterValue || booking.status === filterValue
      return matchesSearch && matchesFilter
    })
    .forEach((booking) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${booking.id}</td>
        <td>${booking.clientName}</td>
        <td>${booking.vehicle}</td>
        <td>${formatDate(booking.pickupDate)} - ${formatDate(booking.returnDate)}</td>
        <td>${createBadge(booking.status)}</td>
        <td>${formatCurrency(booking.totalAmount)}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="editBooking('${booking.id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteBooking('${booking.id}')">Cancel</button>
        </td>
      `
      tbody.appendChild(row)
    })
}

function createBooking(e) {
  e.preventDefault()

  const clientName = document.getElementById("clientName").value
  const clientEmail = document.getElementById("clientEmail").value
  const clientPhone = document.getElementById("clientPhone").value
  const vehicleId = document.getElementById("vehicleSelect").value
  const pickupDate = document.getElementById("pickupDate").value
  const returnDate = document.getElementById("returnDate").value
  const notes = document.getElementById("notes").value

  const vehicle = db.vehicles.find((v) => v.id == vehicleId)
  const pickup = new Date(pickupDate)
  const returnDt = new Date(returnDate)
  const days = Math.ceil((returnDt - pickup) / (1000 * 60 * 60 * 24)) + 1
  const totalAmount = days * vehicle.dailyRate

  const booking = {
    id: `BK${String(db.bookings.length + 1).padStart(3, "0")}`,
    clientId: db.clients.length + 1,
    vehicleId: vehicleId,
    clientName: clientName,
    vehicle: vehicle.model,
    pickupDate: pickupDate,
    returnDate: returnDate,
    status: "pending",
    totalAmount: totalAmount,
    notes: notes,
  }

  db.bookings.push(booking)
  alert("Booking created successfully!")
  closeBookingModal()
  populateBookings()
  document.getElementById("bookingForm").reset()
}

function editBooking(bookingId) {
  alert("Edit functionality coming soon for " + bookingId)
}

function deleteBooking(bookingId) {
  if (confirm("Are you sure you want to cancel this booking?")) {
    db.bookings = db.bookings.filter((b) => b.id !== bookingId)
    alert("Booking cancelled")
    populateBookings()
  }
}

function showNewBookingModal() {
  openModal("bookingModal")
}

function closeBookingModal() {
  closeModal("bookingModal")
}
