// Vehicle Availability Management

// Declare necessary variables and functions
const db = {
  vehicles: [
    {
      id: 1,
      plate: "ABC123",
      model: "Toyota Camry",
      type: "Sedan",
      status: "Available",
      mileage: 15000,
      dailyRate: 50,
    },
    { id: 2, plate: "XYZ789", model: "Honda Accord", type: "Sedan", status: "Rented", mileage: 20000, dailyRate: 60 },
    // Add more vehicles as needed
  ],
}

function setupSearch(searchInputId, tableId, filterFunction) {
  const searchInput = document.getElementById(searchInputId)
  searchInput.addEventListener("input", (e) => {
    filterFunction(e.target.value.toLowerCase())
  })
}

function setupFilter(filterSelectId, tableId, filterFunction) {
  const filterSelect = document.getElementById(filterSelectId)
  filterSelect.addEventListener("change", (e) => {
    filterFunction(document.getElementById("searchVehicles").value.toLowerCase())
  })
}

function createBadge(status) {
  const badgeClasses = {
    Available: "badge bg-success",
    Rented: "badge bg-danger",
    Maintenance: "badge bg-warning",
  }
  return `<span class="${badgeClasses[status]}">${status}</span>`
}

function formatCurrency(amount) {
  return `$${amount.toLocaleString()}`
}

function openModal(modalId) {
  document.getElementById(modalId).classList.add("show")
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("show")
}

document.addEventListener("DOMContentLoaded", () => {
  populateVehicles()
  setupSearch("searchVehicles", "vehiclesTable", filterVehicles)
  setupFilter("filterStatus", "vehiclesTable", filterVehicles)

  document.getElementById("updateVehicleForm")?.addEventListener("submit", updateVehicleStatus)
})

function populateVehicles() {
  const tbody = document.getElementById("vehiclesTable")
  tbody.innerHTML = ""

  db.vehicles.forEach((vehicle) => {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td>${vehicle.plate}</td>
      <td>${vehicle.model}</td>
      <td>${vehicle.type}</td>
      <td>${createBadge(vehicle.status)}</td>
      <td>${vehicle.mileage.toLocaleString()} km</td>
      <td>${formatCurrency(vehicle.dailyRate)}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="showUpdateVehicleModal('${vehicle.id}')">Update</button>
      </td>
    `
    tbody.appendChild(row)
  })
}

function filterVehicles(searchTerm) {
  const tbody = document.getElementById("vehiclesTable")
  const filterValue = document.getElementById("filterStatus").value

  tbody.innerHTML = ""

  db.vehicles
    .filter((vehicle) => {
      const matchesSearch =
        vehicle.plate.toLowerCase().includes(searchTerm) || vehicle.model.toLowerCase().includes(searchTerm)
      const matchesFilter = !filterValue || vehicle.status === filterValue
      return matchesSearch && matchesFilter
    })
    .forEach((vehicle) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${vehicle.plate}</td>
        <td>${vehicle.model}</td>
        <td>${vehicle.type}</td>
        <td>${createBadge(vehicle.status)}</td>
        <td>${vehicle.mileage.toLocaleString()} km</td>
        <td>${formatCurrency(vehicle.dailyRate)}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="showUpdateVehicleModal('${vehicle.id}')">Update</button>
        </td>
      `
      tbody.appendChild(row)
    })
}

function showUpdateVehicleModal(vehicleId) {
  const vehicle = db.vehicles.find((v) => v.id == vehicleId)
  if (vehicle) {
    document.getElementById("vehiclePlate").value = vehicle.plate
    document.getElementById("newStatus").value = vehicle.status
    document.getElementById("mileageUpdate").value = vehicle.mileage
    document.getElementById("updateVehicleForm").dataset.vehicleId = vehicleId
    openModal("updateVehicleModal")
  }
}

function closeUpdateVehicleModal() {
  closeModal("updateVehicleModal")
}

function updateVehicleStatus(e) {
  e.preventDefault()

  const vehicleId = e.target.dataset.vehicleId
  const newStatus = document.getElementById("newStatus").value
  const mileage = document.getElementById("mileageUpdate").value

  const vehicle = db.vehicles.find((v) => v.id == vehicleId)
  if (vehicle) {
    vehicle.status = newStatus
    if (mileage) {
      vehicle.mileage = Number.parseInt(mileage)
    }
    alert("Vehicle status updated successfully!")
    closeUpdateVehicleModal()
    populateVehicles()
  }
}