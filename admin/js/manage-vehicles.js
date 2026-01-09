// Manage Vehicles Script

let editingVehicleId = null
const vehicleAPI = {} // Declare vehicleAPI variable
const getStatusBadge = (status) => {} // Declare getStatusBadge variable
const formatCurrency = (amount) => {} // Declare formatCurrency variable
const openModal = (modalId) => {} // Declare openModal variable
const closeModal = (modalId) => {} // Declare closeModal variable
const showNotification = (message) => {} // Declare showNotification variable

function initVehicles() {
  loadVehicles()
  setupEventListeners()
}

function setupEventListeners() {
  const searchInput = document.getElementById("searchVehicles")
  const filterStatus = document.getElementById("filterStatus")

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value
      const vehicles = query ? vehicleAPI.search(query) : vehicleAPI.getAll()
      displayVehicles(vehicles)
    })
  }

  if (filterStatus) {
    filterStatus.addEventListener("change", (e) => {
      const status = e.target.value
      const vehicles = vehicleAPI.filterByStatus(status)
      displayVehicles(vehicles)
    })
  }
}

function loadVehicles() {
  displayVehicles(vehicleAPI.getAll())
}

function displayVehicles(vehicles) {
  const tbody = document.getElementById("vehiclesTableBody")

  if (vehicles.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">No vehicles found</td></tr>'
    return
  }

  tbody.innerHTML = vehicles
    .map(
      (vehicle) => `
        <tr>
            <td><strong>${vehicle.plate}</strong></td>
            <td>${vehicle.model}</td>
            <td>${vehicle.type}</td>
            <td>${vehicle.year}</td>
            <td>${vehicle.mileage.toLocaleString()} km</td>
            <td>${getStatusBadge(vehicle.status)}</td>
            <td>${formatCurrency(vehicle.dailyRate)}</td>
            <td>
                <button class="btn btn-primary" style="padding: 6px 12px; font-size: 12px;" onclick="editVehicle(${vehicle.id})">Edit</button>
                <button class="btn btn-danger" style="padding: 6px 12px; font-size: 12px;" onclick="deleteVehicle(${vehicle.id})">Delete</button>
            </td>
        </tr>
    `,
    )
    .join("")
}

function openAddVehicleModal() {
  editingVehicleId = null
  document.getElementById("modalTitle").textContent = "Add Vehicle"
  document.getElementById("vehicleForm").reset()
  openModal("vehicleModal")
}

function closeVehicleModal() {
  closeModal("vehicleModal")
  editingVehicleId = null
}

function editVehicle(id) {
  const vehicle = vehicleAPI.getById(id)
  if (!vehicle) return

  editingVehicleId = id
  document.getElementById("modalTitle").textContent = "Edit Vehicle"
  document.getElementById("vehiclePlate").value = vehicle.plate
  document.getElementById("vehicleModel").value = vehicle.model
  document.getElementById("vehicleType").value = vehicle.type
  document.getElementById("vehicleYear").value = vehicle.year
  document.getElementById("vehicleMileage").value = vehicle.mileage
  document.getElementById("vehicleRate").value = vehicle.dailyRate
  document.getElementById("vehicleStatus").value = vehicle.status

  openModal("vehicleModal")
}

function saveVehicle(e) {
  e.preventDefault()

  const vehicleData = {
    plate: document.getElementById("vehiclePlate").value,
    model: document.getElementById("vehicleModel").value,
    type: document.getElementById("vehicleType").value,
    year: Number.parseInt(document.getElementById("vehicleYear").value),
    mileage: Number.parseInt(document.getElementById("vehicleMileage").value),
    dailyRate: Number.parseFloat(document.getElementById("vehicleRate").value),
    status: document.getElementById("vehicleStatus").value,
  }

  if (editingVehicleId) {
    vehicleAPI.update(editingVehicleId, vehicleData)
    showNotification("Vehicle updated successfully")
  } else {
    vehicleAPI.add(vehicleData)
    showNotification("Vehicle added successfully")
  }

  closeVehicleModal()
  loadVehicles()
}

function deleteVehicle(id) {
  if (confirm("Are you sure you want to delete this vehicle?")) {
    vehicleAPI.delete(id)
    showNotification("Vehicle deleted successfully")
    loadVehicles()
  }
}

document.addEventListener("DOMContentLoaded", initVehicles)
