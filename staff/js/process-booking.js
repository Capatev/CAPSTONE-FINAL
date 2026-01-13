/**
 * Process Booking Page Logic
 * Uses global db + backend.js functions
 */

document.addEventListener("DOMContentLoaded", async () => {
  await initializeStaffDB()

  populateVehicleSelect()
  populateBookings()

  setupSearch?.("searchBooking", "bookingsTable", filterBookings)
  setupFilter?.("filterStatus", "bookingsTable", filterBookings)

  document.getElementById("pickupDate")?.addEventListener("change", calculateCost)
  document.getElementById("returnDate")?.addEventListener("change", calculateCost)
  document.getElementById("vehicleSelect")?.addEventListener("change", calculateCost)

  document
    .getElementById("bookingForm")
    ?.addEventListener("submit", submitBooking) // ✅ FIX
})

/* ===============================
   VEHICLE SELECT
================================ */
function populateVehicleSelect() {
  const select = document.getElementById("vehicleSelect")
  if (!select) return

  select.innerHTML = `<option value="">Choose a vehicle...</option>`

  getAvailableVehicles().forEach((v) => {
    const opt = document.createElement("option")
    opt.value = v.id
    opt.textContent = `${v.model} (${v.plate}) – ₱${v.dailyRate}/day`
    select.appendChild(opt)
  })
}

/* ===============================
   COST CALCULATION
================================ */
function calculateCost() {
  const vehicleId = document.getElementById("vehicleSelect")?.value
  const pickupDate = document.getElementById("pickupDate")?.value
  const returnDate = document.getElementById("returnDate")?.value

  if (!vehicleId || !pickupDate || !returnDate) return

  const vehicle = db.vehicles.find((v) => v.id == vehicleId)
  if (!vehicle) return

  const start = new Date(pickupDate)
  const end = new Date(returnDate)
  const days = Math.ceil((end - start) / 86400000) + 1

  document.getElementById("rentalDays").value = days
  document.getElementById("totalCost").value =
    formatCurrency(days * vehicle.dailyRate)
}

/* ===============================
   BOOKINGS TABLE
================================ */
function populateBookings() {
  const tbody = document.getElementById("bookingsTable")
  if (!tbody) return

  tbody.innerHTML = ""

  db.bookings.forEach((b) => {
    const tr = document.createElement("tr")
    tr.innerHTML = `
      <td>${b.id}</td>
      <td>${b.clientName}</td>
      <td>${b.vehicle}</td>
      <td>${formatDate(b.pickupDate)} - ${formatDate(b.returnDate)}</td>
      <td>${createBadge(b.status)}</td>
      <td>${formatCurrency(b.totalAmount)}</td>
      <td>
        <button class="btn btn-sm btn-success"
          onclick="approveBooking('${b.id}')">Approve</button>
        <button class="btn btn-sm btn-danger"
          onclick="rejectBooking('${b.id}')">Reject</button>
      </td>
    `
    tbody.appendChild(tr)
  })
}

/* ===============================
   FILTERING
================================ */
function filterBookings(searchTerm = "") {
  const tbody = document.getElementById("bookingsTable")
  const status = document.getElementById("filterStatus")?.value || ""

  tbody.innerHTML = ""

  db.bookings
    .filter((b) => {
      const s = searchTerm.toLowerCase()
      return (
        (b.id.toLowerCase().includes(s) ||
          b.clientName.toLowerCase().includes(s)) &&
        (!status || b.status === status)
      )
    })
    .forEach((b) => {
      const tr = document.createElement("tr")
      tr.innerHTML = `
        <td>${b.id}</td>
        <td>${b.clientName}</td>
        <td>${b.vehicle}</td>
        <td>${formatDate(b.pickupDate)} - ${formatDate(b.returnDate)}</td>
        <td>${createBadge(b.status)}</td>
        <td>${formatCurrency(b.totalAmount)}</td>
        <td>
          <button class="btn btn-sm btn-success"
            onclick="approveBooking('${b.id}')">Approve</button>
          <button class="btn btn-sm btn-danger"
            onclick="rejectBooking('${b.id}')">Reject</button>
        </td>
      `
      tbody.appendChild(tr)
    })
}

/* ===============================
   CREATE BOOKING (FORM HANDLER)
================================ */
async function submitBooking(e) {
  e.preventDefault()

  const vehicleId = document.getElementById("vehicleSelect").value
  const pickupDate = document.getElementById("pickupDate").value
  const returnDate = document.getElementById("returnDate").value
  const notes = document.getElementById("notes").value

  const vehicle = db.vehicles.find((v) => v.id == vehicleId)
  if (!vehicle) return alert("Invalid vehicle")

  const days =
    Math.ceil((new Date(returnDate) - new Date(pickupDate)) / 86400000) + 1

  // 👉 THIS calls the backend.js function
  const res = await window.createBooking({
    clientId: 1, // TODO: replace with selected client
    vehicleId,
    pickupDate,
    returnDate,
    totalAmount: days * vehicle.dailyRate,
    notes,
  })

  if (res.success) {
    alert("Booking created")
    closeBookingModal()
    populateBookings()
    e.target.reset()
  } else {
    alert(res.message || "Failed to create booking")
  }
}

/* ===============================
   STATUS ACTIONS
================================ */
async function approveBooking(id) {
  await updateBookingStatus(id, "approved")
  populateBookings()
}

async function rejectBooking(id) {
  await updateBookingStatus(id, "rejected")
  populateBookings()
}

/* ===============================
   MODAL
================================ */
function showNewBookingModal() {
  openModal("bookingModal")
}

function closeBookingModal() {
  closeModal("bookingModal")
}
