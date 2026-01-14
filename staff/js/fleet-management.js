let vehicles = [];
let selectedVehicleId = null;

// ==========================
// LOAD VEHICLES FROM DB
// ==========================
function loadVehicles() {
  fetch("/MVRMS/api/get-vehicles.php")
    .then(res => res.json())
    .then(data => {
      vehicles = data;
      renderVehicles();
    });
}

// ==========================
// RENDER TABLE
// ==========================
function renderVehicles() {
  const tbody = document.getElementById("vehiclesTable");
  tbody.innerHTML = "";

  vehicles.forEach(v => {
    tbody.innerHTML += `
      <tr>
        <td>${v.plate_no}</td>
        <td>${v.model}</td>
        <td>${v.type}</td>
        <td>${v.status}</td>
        <td>${v.mileage.toLocaleString()} km</td>
        <td>$${Number(v.daily_rate).toFixed(2)}</td>
        <td>
          <button onclick="openUpdateModal(${v.id})">Update</button>
        </td>
      </tr>
    `;
  });
}

// ==========================
// OPEN MODAL
// ==========================
function openUpdateModal(id) {
  const v = vehicles.find(x => x.id === id);
  if (!v) return;

  selectedVehicleId = id;

  document.getElementById("vehicleId").value = id;
  document.getElementById("vehicleStatus").value = v.status;
  document.getElementById("vehicleMileage").value = v.mileage;
  document.getElementById("vehicleRate").value = v.daily_rate;

  document.getElementById("updateVehicleModal").style.display = "flex";
}

function closeUpdateModal() {
  document.getElementById("updateVehicleModal").style.display = "none";
}

// ==========================
// SAVE UPDATE → DB
// ==========================
function saveVehicleUpdate() {
  const form = new FormData();
  form.append("id", selectedVehicleId);
  form.append("status", document.getElementById("vehicleStatus").value);
  form.append("mileage", document.getElementById("vehicleMileage").value);
  form.append("daily_rate", document.getElementById("vehicleRate").value);

  fetch("/MVRMS/api/update-vehicle.php", {
    method: "POST",
    body: form
  })
  .then(res => res.json())
  .then(() => {
    closeUpdateModal();
    loadVehicles();
  });
}

// ==========================
// INIT
// ==========================
document.addEventListener("DOMContentLoaded", loadVehicles);
