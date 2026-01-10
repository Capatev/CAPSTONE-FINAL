// Manage Vehicles Script - Enhanced with Acquisition Origin

let editingVehicleId = null
const db = {} // Declare db variable
const vehicleAPI = {} // Declare vehicleAPI variable
const vehicleHistoryAPI = {} // Declare vehicleHistoryAPI variable
function saveDB() {} // Declare saveDB function

// Format currency
function formatCurrency(amount) {
  return "₱" + Number(amount).toLocaleString("en-PH", { minimumFractionDigits: 2 })
}

// Get status badge
function getStatusBadge(status) {
  const badges = {
    available: '<span class="badge badge-success">Available</span>',
    rented: '<span class="badge badge-primary">Rented</span>',
    maintenance: '<span class="badge badge-warning">Maintenance</span>',
    damaged: '<span class="badge badge-danger">Damaged</span>',
  }
  return badges[status] || '<span class="badge">' + status + "</span>"
}

function getAcquisitionBadge(acquisition) {
  const badges = {
    "brand-new": '<span class="badge badge-success">Brand New</span>',
    pawn: '<span class="badge badge-warning">Pawn</span>',
    "second-hand": '<span class="badge badge-info">Second Hand</span>',
    auction: '<span class="badge badge-primary">Auction</span>',
  }
  return badges[acquisition] || '<span class="badge">Unknown</span>'
}

// Open modal helper
function openModal(modalId) {
  document.getElementById(modalId).classList.add("active")
}

// Close modal helper
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active")
}

// Show notification
function showNotification(message) {
  alert(message)
}

// Initialize vehicles with acquisition data
function initVehiclesWithAcquisition() {
  // Add acquisition data to existing vehicles if not present
  db.vehicles.forEach((vehicle) => {
    if (!vehicle.acquisition) {
      vehicle.acquisition = {
        origin: "brand-new",
        date: "2024-01-01",
        cost: vehicle.dailyRate * 365,
        source: "Initial Fleet",
        originalOwner: "",
        notes: "Part of initial fleet inventory",
      }
    }
  })
  saveDB()
}

function initVehicles() {
  initVehiclesWithAcquisition()
  loadVehicles()
  setupEventListeners()
}

function setupEventListeners() {
  const searchInput = document.getElementById("searchVehicles")
  const filterStatus = document.getElementById("filterStatus")
  const filterAcquisition = document.getElementById("filterAcquisition")

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      filterVehicles()
    })
  }

  if (filterStatus) {
    filterStatus.addEventListener("change", (e) => {
      filterVehicles()
    })
  }

  if (filterAcquisition) {
    filterAcquisition.addEventListener("change", (e) => {
      filterVehicles()
    })
  }
}

function loadVehicles() {
  displayVehicles(vehicleAPI.getAll())
}

function displayVehicles(vehicles) {
  const tbody = document.getElementById("vehiclesTableBody")

  if (vehicles.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px;">No vehicles found</td></tr>'
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
            <td>${getAcquisitionBadge(vehicle.acquisition ? vehicle.acquisition.origin : "brand-new")}</td>
            <td>${getStatusBadge(vehicle.status)}</td>
            <td>${formatCurrency(vehicle.dailyRate)}</td>
            <td>
                <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="viewVehicleDetails(${vehicle.id})">View</button>
                <button class="btn btn-primary" style="padding: 6px 12px; font-size: 12px;" onclick="editVehicle(${vehicle.id})">Edit</button>
                <button class="btn btn-danger" style="padding: 6px 12px; font-size: 12px;" onclick="deleteVehicle(${vehicle.id})">Delete</button>
            </td>
        </tr>
    `,
    )
    .join("")
}

function filterVehicles() {
  const search = document.getElementById("searchVehicles").value.toLowerCase()
  const statusFilter = document.getElementById("filterStatus").value
  const acquisitionFilter = document.getElementById("filterAcquisition").value

  let vehicles = vehicleAPI.getAll()

  if (search) {
    vehicles = vehicles.filter((v) => v.plate.toLowerCase().includes(search) || v.model.toLowerCase().includes(search))
  }

  if (statusFilter) {
    vehicles = vehicles.filter((v) => v.status === statusFilter)
  }

  if (acquisitionFilter) {
    vehicles = vehicles.filter((v) => v.acquisition && v.acquisition.origin === acquisitionFilter)
  }

  displayVehicles(vehicles)
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

  if (vehicle.acquisition) {
    document.getElementById("vehicleAcquisition").value = vehicle.acquisition.origin || ""
    document.getElementById("vehicleAcquisitionDate").value = vehicle.acquisition.date || ""
    document.getElementById("vehicleAcquisitionCost").value = vehicle.acquisition.cost || ""
    document.getElementById("vehicleSource").value = vehicle.acquisition.source || ""
    document.getElementById("vehicleOriginalOwner").value = vehicle.acquisition.originalOwner || ""
    document.getElementById("vehicleAcquisitionNotes").value = vehicle.acquisition.notes || ""
  }

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
    acquisition: {
      origin: document.getElementById("vehicleAcquisition").value,
      date: document.getElementById("vehicleAcquisitionDate").value,
      cost: Number.parseFloat(document.getElementById("vehicleAcquisitionCost").value) || 0,
      source: document.getElementById("vehicleSource").value,
      originalOwner: document.getElementById("vehicleOriginalOwner").value,
      notes: document.getElementById("vehicleAcquisitionNotes").value,
    },
  }

  if (editingVehicleId) {
    vehicleAPI.update(editingVehicleId, vehicleData)

    vehicleHistoryAPI.add({
      vehicleId: editingVehicleId,
      event: "Vehicle Updated",
      description: "Vehicle information updated. Acquisition: " + vehicleData.acquisition.origin,
      type: "update",
    })

    showNotification("Vehicle updated successfully")
  } else {
    const newVehicle = vehicleAPI.add(vehicleData)

    vehicleHistoryAPI.add({
      vehicleId: newVehicle.id,
      event: "Vehicle Acquired",
      description:
        "New vehicle added to fleet. Origin: " +
        vehicleData.acquisition.origin +
        (vehicleData.acquisition.source ? " from " + vehicleData.acquisition.source : ""),
      type: "acquisition",
    })

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

function viewVehicleDetails(id) {
  const vehicle = vehicleAPI.getById(id)
  if (!vehicle) return

  const acq = vehicle.acquisition || {}
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-PH") : "N/A")

  let details = "Vehicle Details:\n\n"
  details += "Plate: " + vehicle.plate + "\n"
  details += "Model: " + vehicle.model + "\n"
  details += "Type: " + vehicle.type + "\n"
  details += "Year: " + vehicle.year + "\n"
  details += "Mileage: " + vehicle.mileage.toLocaleString() + " km\n"
  details += "Daily Rate: " + formatCurrency(vehicle.dailyRate) + "\n"
  details += "Status: " + vehicle.status + "\n\n"
  details += "--- Acquisition Details ---\n"
  details += "Origin: " + (acq.origin || "N/A") + "\n"
  details += "Acquisition Date: " + formatDate(acq.date) + "\n"
  details += "Acquisition Cost: " + formatCurrency(acq.cost || 0) + "\n"
  details += "Source/Seller: " + (acq.source || "N/A") + "\n"
  details += "Original Owner: " + (acq.originalOwner || "N/A") + "\n"
  if (acq.notes) {
    details += "Notes: " + acq.notes + "\n"
  }

  alert(details)
}

document.addEventListener("DOMContentLoaded", initVehicles)
