// Payment Methods Configuration

// Declare necessary variables and functions
const db = {
  invoices: [
    { id: "INV001", amount: 1000, paymentMethod: "GCash", createdDate: new Date() },
    { id: "INV002", amount: 2000, paymentMethod: "Bank", createdDate: new Date() },
  ],
  paymentMethods: [
    { id: "pm_gcash", status: "active", config: { accountNumber: "639123456789" } },
    {
      id: "pm_bank",
      status: "inactive",
      config: { bankName: "BDO", accountNumber: "123456789", accountName: "John Doe" },
    },
  ],
}

function setupSearch(searchId, tableId, filterFunction) {
  const searchInput = document.getElementById(searchId)
  searchInput.addEventListener("input", (e) => {
    filterFunction(e.target.value.toLowerCase())
  })
}

function setupFilter(filterId, tableId, filterFunction) {
  const filterSelect = document.getElementById(filterId)
  filterSelect.addEventListener("change", (e) => {
    filterFunction("", e.target.value)
  })
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount)
}

function formatDate(date) {
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function createBadge(status) {
  const badgeClasses = {
    completed: "badge-success",
    pending: "badge-warning",
    failed: "badge-danger",
  }
  return `<span class="badge ${badgeClasses[status]}">${status}</span>`
}

function openModal(modalId) {
  document.getElementById(modalId).style.display = "flex"
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none"
}

document.addEventListener("DOMContentLoaded", () => {
  populateTransactions()
  setupSearch("searchTransaction", "transactionsTable", filterTransactions)
  setupFilter("filterPaymentMethod", "transactionsTable", filterTransactions)

  document.getElementById("paymentMethodForm")?.addEventListener("submit", savePaymentMethod)
})

function populateTransactions() {
  const tbody = document.getElementById("transactionsTable")
  tbody.innerHTML = ""

  const transactions = db.invoices
    .filter((inv) => inv.paymentMethod)
    .map((inv) => ({
      id: `TXN${inv.id.substring(3)}`,
      invoiceId: inv.id,
      amount: inv.amount,
      method: inv.paymentMethod,
      date: inv.createdDate,
      status: "completed",
    }))

  transactions.forEach((txn) => {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td>${txn.id}</td>
      <td>${txn.invoiceId}</td>
      <td>${formatCurrency(txn.amount)}</td>
      <td>${txn.method}</td>
      <td>${formatDate(txn.date)}</td>
      <td>${createBadge(txn.status)}</td>
    `
    tbody.appendChild(row)
  })
}

function filterTransactions(searchTerm, filterValue) {
  const tbody = document.getElementById("transactionsTable")

  tbody.innerHTML = ""

  const transactions = db.invoices
    .filter((inv) => inv.paymentMethod)
    .map((inv) => ({
      id: `TXN${inv.id.substring(3)}`,
      invoiceId: inv.id,
      amount: inv.amount,
      method: inv.paymentMethod,
      date: inv.createdDate,
      status: "completed",
    }))

  transactions
    .filter((txn) => {
      const matchesSearch =
        txn.id.toLowerCase().includes(searchTerm) || txn.invoiceId.toLowerCase().includes(searchTerm)
      const matchesFilter = !filterValue || txn.method === filterValue
      return matchesSearch && matchesFilter
    })
    .forEach((txn) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${txn.id}</td>
        <td>${txn.invoiceId}</td>
        <td>${formatCurrency(txn.amount)}</td>
        <td>${txn.method}</td>
        <td>${formatDate(txn.date)}</td>
        <td>${createBadge(txn.status)}</td>
      `
      tbody.appendChild(row)
    })
}

function editPaymentMethod(methodId) {
  const method = db.paymentMethods.find((m) => m.id === `pm_${methodId}`)
  if (method) {
    document.getElementById("methodStatus").value = method.status
    document.getElementById("paymentMethodForm").dataset.methodId = method.id

    const fieldsContainer = document.getElementById("methodSpecificFields")
    fieldsContainer.innerHTML = ""

    if (method.id === "pm_gcash") {
      fieldsContainer.innerHTML = `
        <div class="form-group">
          <label for="gcashNumber">GCash Account Number</label>
          <input type="text" id="gcashNumber" placeholder="639xxxxxxxxx" value="${method.config.accountNumber || ""}">
        </div>
      `
    } else if (method.id === "pm_bank") {
      fieldsContainer.innerHTML = `
        <div class="form-group">
          <label for="bankName">Bank Name</label>
          <input type="text" id="bankName" placeholder="e.g., BDO, BPI" value="${method.config.bankName || ""}">
        </div>
        <div class="form-group">
          <label for="accountNumber">Account Number</label>
          <input type="text" id="accountNumber" placeholder="Account number" value="${method.config.accountNumber || ""}">
        </div>
        <div class="form-group">
          <label for="accountName">Account Name</label>
          <input type="text" id="accountName" placeholder="Account holder name" value="${method.config.accountName || ""}">
        </div>
      `
    }

    openModal("paymentMethodModal")
  }
}

function closePaymentMethodModal() {
  closeModal("paymentMethodModal")
}

function savePaymentMethod(e) {
  e.preventDefault()

  const methodId = e.target.dataset.methodId
  const status = document.getElementById("methodStatus").value
  const method = db.paymentMethods.find((m) => m.id === methodId)

  if (method) {
    method.status = status
    alert("Payment method configuration saved!")
    closePaymentMethodModal()
    location.reload()
  }
}
