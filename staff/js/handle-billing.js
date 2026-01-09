// Handle Billing Management

// Declare necessary variables and functions
const db = {
  clients: [],
  invoices: [],
}

function getTotalReceivable() {
  return db.invoices.reduce((total, invoice) => total + (invoice.status === "pending" ? invoice.amount : 0), 0)
}

function getTotalRevenue() {
  return db.invoices.reduce((total, invoice) => total + (invoice.status === "paid" ? invoice.amount : 0), 0)
}

function getPendingInvoices() {
  return db.invoices.filter((invoice) => invoice.status === "pending")
}

function formatCurrency(amount) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" })
}

function formatDate(date) {
  return new Date(date).toLocaleDateString()
}

function createBadge(status) {
  const badgeClasses = {
    pending: "badge bg-warning",
    paid: "badge bg-success",
  }
  return `<span class="${badgeClasses[status]}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`
}

function openModal(modalId) {
  document.getElementById(modalId).style.display = "block"
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none"
}

function setupSearch(searchInputId, tableId, filterFunction) {
  document.getElementById(searchInputId).addEventListener("input", (e) => {
    filterFunction(e.target.value.toLowerCase())
  })
}

function setupFilter(filterSelectId, tableId, filterFunction) {
  document.getElementById(filterSelectId).addEventListener("change", (e) => {
    filterFunction(null)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  updateBillingDashboard()
  populateInvoices()
  populateClientSelect()
  setupSearch("searchInvoice", "invoicesTable", filterInvoices)
  setupFilter("filterPaymentStatus", "invoicesTable", filterInvoices)

  document.getElementById("invoiceForm")?.addEventListener("submit", createInvoice)
  document.getElementById("paymentForm")?.addEventListener("submit", processPayment)
})

function updateBillingDashboard() {
  const receivable = getTotalReceivable()
  const revenue = getTotalRevenue()
  const pendingInvoices = getPendingInvoices()

  document.getElementById("totalReceivable").textContent = formatCurrency(receivable)
  document.getElementById("todayCollections").textContent = formatCurrency(0) // Calculate from today's transactions
  document.getElementById("monthRevenue").textContent = formatCurrency(revenue)
  document.getElementById("pendingCount").textContent = pendingInvoices.length
}

function populateClientSelect() {
  const select = document.getElementById("invoiceClient")
  if (!select) return

  select.innerHTML = '<option value="">Select client...</option>'
  db.clients.forEach((client) => {
    const option = document.createElement("option")
    option.value = client.id
    option.textContent = client.name
    select.appendChild(option)
  })
}

function populateInvoices() {
  const tbody = document.getElementById("invoicesTable")
  tbody.innerHTML = ""

  db.invoices.forEach((invoice) => {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td>${invoice.id}</td>
      <td>${invoice.clientName}</td>
      <td>${formatCurrency(invoice.amount)}</td>
      <td>${formatDate(invoice.dueDate)}</td>
      <td>${createBadge(invoice.status)}</td>
      <td>${invoice.paymentMethod || "N/A"}</td>
      <td>
        ${invoice.status === "pending" ? `<button class="btn btn-sm btn-success" onclick="showPaymentModal('${invoice.id}')">Receive Payment</button>` : ""}
        <button class="btn btn-sm btn-secondary" onclick="viewInvoice('${invoice.id}')">View</button>
      </td>
    `
    tbody.appendChild(row)
  })
}

function filterInvoices(searchTerm) {
  const tbody = document.getElementById("invoicesTable")
  const filterValue = document.getElementById("filterPaymentStatus").value

  tbody.innerHTML = ""

  db.invoices
    .filter((invoice) => {
      const matchesSearch =
        invoice.id.toLowerCase().includes(searchTerm) || invoice.clientName.toLowerCase().includes(searchTerm)
      const matchesFilter = !filterValue || invoice.status === filterValue
      return matchesSearch && matchesFilter
    })
    .forEach((invoice) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${invoice.id}</td>
        <td>${invoice.clientName}</td>
        <td>${formatCurrency(invoice.amount)}</td>
        <td>${formatDate(invoice.dueDate)}</td>
        <td>${createBadge(invoice.status)}</td>
        <td>${invoice.paymentMethod || "N/A"}</td>
        <td>
          ${invoice.status === "pending" ? `<button class="btn btn-sm btn-success" onclick="showPaymentModal('${invoice.id}')">Receive Payment</button>` : ""}
          <button class="btn btn-sm btn-secondary" onclick="viewInvoice('${invoice.id}')">View</button>
        </td>
      `
      tbody.appendChild(row)
    })
}

function createInvoice(e) {
  e.preventDefault()

  const invoice = {
    id: `INV${String(db.invoices.length + 1).padStart(3, "0")}`,
    clientId: document.getElementById("invoiceClient").value,
    bookingId: null,
    clientName: db.clients.find((c) => c.id == document.getElementById("invoiceClient").value)?.name,
    amount: Number.parseInt(document.getElementById("invoiceAmount").value),
    dueDate: document.getElementById("dueDate").value,
    status: "pending",
    paymentMethod: null,
    createdDate: document.getElementById("invoiceDate").value,
  }

  db.invoices.push(invoice)
  alert("Invoice created successfully!")
  closeNewInvoiceModal()
  populateInvoices()
  updateBillingDashboard()
  e.target.reset()
}

function showPaymentModal(invoiceId) {
  const invoice = db.invoices.find((i) => i.id === invoiceId)
  if (invoice) {
    document.getElementById("paymentInvoice").value = invoice.id
    document.getElementById("paymentAmount").value = invoice.amount
    document.getElementById("paymentForm").dataset.invoiceId = invoiceId
    openModal("paymentModal")
  }
}

function closePaymentModal() {
  closeModal("paymentModal")
}

function processPayment(e) {
  e.preventDefault()

  const invoiceId = e.target.dataset.invoiceId
  const amount = Number.parseInt(document.getElementById("paymentAmount").value)
  const paymentMethod = document.getElementById("paymentMethod").value

  const invoice = db.invoices.find((i) => i.id === invoiceId)
  if (invoice && amount === invoice.amount) {
    invoice.status = "paid"
    invoice.paymentMethod = paymentMethod
    alert("Payment processed successfully!")
    closePaymentModal()
    populateInvoices()
    updateBillingDashboard()
    e.target.reset()
  } else {
    alert("Payment amount does not match invoice amount!")
  }
}

function viewInvoice(invoiceId) {
  const invoice = db.invoices.find((i) => i.id === invoiceId)
  if (invoice) {
    alert(
      `Invoice Details:\n\nID: ${invoice.id}\nClient: ${invoice.clientName}\nAmount: ${formatCurrency(invoice.amount)}\nDue: ${formatDate(invoice.dueDate)}\nStatus: ${invoice.status}`,
    )
  }
}

function showNewInvoiceModal() {
  openModal("invoiceModal")
}

function closeNewInvoiceModal() {
  closeModal("invoiceModal")
}
