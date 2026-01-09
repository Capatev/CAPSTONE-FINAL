// Client Verification Management

const db = {
  clients: [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      idType: "Passport",
      status: "Pending",
      joined: new Date("2023-01-01"),
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "0987654321",
      idType: "Driver's License",
      status: "Verified",
      joined: new Date("2023-02-01"),
    },
  ],
}

function createBadge(status) {
  return `<span class="badge bg-${status === "Verified" ? "success" : "warning"}">${status}</span>`
}

function formatDate(date) {
  return date.toLocaleDateString()
}

function openModal(modalId) {
  document.getElementById(modalId).style.display = "block"
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none"
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
    filterFunction("", e.target.value)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  populateClients()
  setupSearch("searchClient", "clientsTable", filterClients)
  setupFilter("filterVerification", "clientsTable", filterClients)

  document.getElementById("verificationForm")?.addEventListener("submit", submitVerification)
})

function populateClients() {
  const tbody = document.getElementById("clientsTable")
  tbody.innerHTML = ""

  db.clients.forEach((client) => {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td>${client.name}</td>
      <td>${client.email}</td>
      <td>${client.phone}</td>
      <td>${client.idType}</td>
      <td>${createBadge(client.status)}</td>
      <td>${formatDate(client.joined)}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="showVerificationModal('${client.id}')">Review</button>
      </td>
    `
    tbody.appendChild(row)
  })
}

function filterClients(searchTerm, filterValue) {
  const tbody = document.getElementById("clientsTable")

  tbody.innerHTML = ""

  db.clients
    .filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm) ||
        client.phone.includes(searchTerm)
      const matchesFilter = !filterValue || client.status === filterValue
      return matchesSearch && matchesFilter
    })
    .forEach((client) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${client.name}</td>
        <td>${client.email}</td>
        <td>${client.phone}</td>
        <td>${client.idType}</td>
        <td>${createBadge(client.status)}</td>
        <td>${formatDate(client.joined)}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="showVerificationModal('${client.id}')">Review</button>
        </td>
      `
      tbody.appendChild(row)
    })
}

function showVerificationModal(clientId) {
  const client = db.clients.find((c) => c.id == clientId)
  if (client) {
    const content = document.getElementById("verificationContent")
    content.innerHTML = `
      <div style="padding: 20px; border-bottom: 1px solid #e5e7eb;">
        <h3>${client.name}</h3>
        <p><strong>Email:</strong> ${client.email}</p>
        <p><strong>Phone:</strong> ${client.phone}</p>
        <p><strong>ID Type:</strong> ${client.idType}</p>
        <p><strong>Status:</strong> ${createBadge(client.status)}</p>
        <p><strong>Joined:</strong> ${formatDate(client.joined)}</p>
      </div>
    `
    document.getElementById("verificationForm").dataset.clientId = clientId
    openModal("verificationModal")
  }
}

function closeVerificationModal() {
  closeModal("verificationModal")
}

function submitVerification(e) {
  e.preventDefault()

  const clientId = e.target.dataset.clientId
  const status = document.getElementById("verificationStatus").value
  const notes = document.getElementById("verificationNotes").value

  const client = db.clients.find((c) => c.id == clientId)
  if (client) {
    client.status = status
    alert(`Client verification ${status} successfully!`)
    closeVerificationModal()
    populateClients()
  }
}
