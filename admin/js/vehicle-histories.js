// Vehicle Histories Script

// Declare variables before using them
const vehicleAPI = {
  getAll: () => [
    { id: 1, model: "Toyota Camry", plate: "ABC123" },
    { id: 2, model: "Honda Civic", plate: "DEF456" },
  ],
}

const vehicleHistoryAPI = {
  getByVehicleId: (id) => [
    { event: "Service", description: "Oil change", date: "2023-01-01", type: "Maintenance" },
    { event: "Accident", description: "Minor damage", date: "2023-02-15", type: "Incident" },
  ],
}

const formatDate = (date) => new Date(date).toLocaleDateString()

const showNotification = (message) => {
  alert(message)
}

function initVehicleHistories() {
  loadVehicleHistories()
  setupEventListeners()
}

function setupEventListeners() {
  const searchInput = document.getElementById("searchHistory")
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase()
      const container = document.getElementById("historyContainer")
      const items = container.querySelectorAll(".vehicle-history-group")

      items.forEach((item) => {
        const vehicleModel = item.getAttribute("data-vehicle").toLowerCase()
        item.style.display = vehicleModel.includes(query) ? "block" : "none"
      })
    })
  }
}

function loadVehicleHistories() {
  const container = document.getElementById("historyContainer")
  const vehicles = vehicleAPI.getAll()

  let html = ""
  vehicles.forEach((vehicle) => {
    const histories = vehicleHistoryAPI.getByVehicleId(vehicle.id)

    html += `
            <div class="vehicle-history-group" data-vehicle="${vehicle.model}">
                <div class="section" style="margin-bottom: 30px;">
                    <h3 style="margin-bottom: 20px; color: #1f2937;">
                        ${vehicle.model} <span style="color: #6b7280;">(${vehicle.plate})</span>
                    </h3>
                    <div class="timeline">
                        ${histories
                          .map(
                            (history) => `
                            <div class="timeline-item">
                                <div class="timeline-dot"></div>
                                <div class="timeline-content">
                                    <h4>${history.event}</h4>
                                    <p>${history.description}</p>
                                    <div class="timeline-date">${formatDate(history.date)}</div>
                                </div>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                </div>
            </div>
        `
  })

  container.innerHTML = html
}

function exportToCSV() {
  const data = []
  const vehicles = vehicleAPI.getAll()

  vehicles.forEach((vehicle) => {
    const histories = vehicleHistoryAPI.getByVehicleId(vehicle.id)
    histories.forEach((history) => {
      data.push({
        Vehicle: vehicle.model,
        Plate: vehicle.plate,
        Event: history.event,
        Description: history.description,
        Date: history.date,
        Type: history.type,
      })
    })
  })

  // Function to export data to CSV
  function exportToCSV(data, filename) {
    const csvRows = []
    const headers = Object.keys(data[0]).join(",")
    csvRows.push(headers)

    data.forEach((item) => {
      const values = Object.values(item).map((value) => `"${value}"`)
      csvRows.push(values.join(","))
    })

    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  exportToCSV(data, "vehicle-histories.csv")
  showNotification("Data exported successfully")
}

document.addEventListener("DOMContentLoaded", initVehicleHistories)
