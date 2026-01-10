// Secure Payment Processing Module

let currentViewingTransactionId = null
let configuringMethod = null
const db = {} // Declare db variable
const saveDB = () => {} // Declare saveDB variable

// Initialize payment processing data
function initPaymentDB() {
  if (!db.payments) {
    db.payments = {
      transactions: [
        {
          id: "TXN001",
          bookingId: "RES001",
          userId: 2,
          amount: 7500,
          method: "gcash",
          reference: "GC-20250110-001",
          status: "completed",
          processedBy: "Admin",
          processedAt: "2025-01-10T10:30:00",
          notes: "Payment received successfully",
        },
        {
          id: "TXN002",
          bookingId: "RES002",
          userId: 4,
          amount: 24000,
          method: "bank",
          reference: "BK-20250108-002",
          status: "completed",
          processedBy: "Admin",
          processedAt: "2025-01-08T14:15:00",
          notes: "",
        },
        {
          id: "TXN003",
          bookingId: "RES003",
          userId: 2,
          amount: 17500,
          method: "cash",
          reference: "CS-20250101-003",
          status: "completed",
          processedBy: "Staff",
          processedAt: "2025-01-01T09:00:00",
          notes: "Cash payment at counter",
        },
        {
          id: "TXN004",
          bookingId: "RES005",
          userId: 2,
          amount: 21000,
          method: "gcash",
          reference: "",
          status: "pending",
          processedBy: "",
          processedAt: "",
          notes: "Awaiting payment confirmation",
        },
      ],
      config: {
        gcash: {
          enabled: true,
          accountNumber: "09171234789",
          accountName: "MVRS Rentals",
        },
        bank: {
          enabled: true,
          bankName: "BDO",
          accountNumber: "001234567890",
          accountName: "Motor Vehicle Rental Services Inc.",
        },
        cash: {
          enabled: true,
          acceptedDenominations: "All PHP denominations",
          requiresReceipt: true,
        },
        card: {
          enabled: false,
          gateway: "",
          merchantId: "",
        },
      },
      nextTransactionId: 5,
    }
    saveDB()
  }
}

// Format currency
function formatCurrency(amount) {
  return "₱" + Number(amount).toLocaleString("en-PH", { minimumFractionDigits: 2 })
}

// Format date/time
function formatDateTime(dateString) {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Get status badge
function getStatusBadge(status) {
  const badges = {
    completed: '<span class="badge badge-success">Completed</span>',
    pending: '<span class="badge badge-warning">Pending</span>',
    failed: '<span class="badge badge-danger">Failed</span>',
    refunded: '<span class="badge badge-info">Refunded</span>',
  }
  return badges[status] || '<span class="badge">' + status + "</span>"
}

// Get method label
function getMethodLabel(method) {
  const labels = {
    gcash: "GCash",
    bank: "Bank Transfer",
    cash: "Cash",
    card: "Card",
  }
  return labels[method] || method
}

// Generate transaction reference
function generateReference(method) {
  const prefixes = {
    gcash: "GC",
    bank: "BK",
    cash: "CS",
    card: "CD",
  }
  const prefix = prefixes[method] || "TX"
  const date = new Date().toISOString().split("T")[0].replace(/-/g, "")
  const num = String(db.payments.nextTransactionId).padStart(3, "0")
  return prefix + "-" + date + "-" + num
}

// Get user by ID
function getUserById(userId) {
  return db.users.find((u) => u.id === userId)
}

// Initialize page
function initPaymentProcessing() {
  initPaymentDB()
  loadTransactions()
  updateKPIs()
  populatePendingPayments()
  updatePaymentMethodStats()
  setupEventListeners()
}

// Setup event listeners
function setupEventListeners() {
  const searchInput = document.getElementById("searchTransactions")
  const filterStatus = document.getElementById("filterTransactionStatus")
  const filterMethod = document.getElementById("filterTransactionMethod")

  if (searchInput) searchInput.addEventListener("input", filterTransactions)
  if (filterStatus) filterStatus.addEventListener("change", filterTransactions)
  if (filterMethod) filterMethod.addEventListener("change", filterTransactions)
}

// Update KPIs
function updateKPIs() {
  const transactions = db.payments.transactions
  const today = new Date().toISOString().split("T")[0]

  // Today's collections
  const todayTotal = transactions
    .filter((t) => t.status === "completed" && t.processedAt && t.processedAt.startsWith(today))
    .reduce((sum, t) => sum + t.amount, 0)
  document.getElementById("todayCollections").textContent = formatCurrency(todayTotal)

  // Pending payments
  const pendingCount = transactions.filter((t) => t.status === "pending").length
  document.getElementById("pendingPayments").textContent = pendingCount

  // Total processed this month
  const currentMonth = new Date().toISOString().slice(0, 7)
  const monthTotal = transactions
    .filter((t) => t.status === "completed" && t.processedAt && t.processedAt.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0)
  document.getElementById("totalProcessed").textContent = formatCurrency(monthTotal)

  // Failed transactions
  const failedCount = transactions.filter((t) => t.status === "failed").length
  document.getElementById("failedTransactions").textContent = failedCount
}

// Update payment method stats
function updatePaymentMethodStats() {
  const transactions = db.payments.transactions.filter((t) => t.status === "completed")

  document.getElementById("gcashTransactions").textContent = transactions.filter((t) => t.method === "gcash").length
  document.getElementById("bankTransactions").textContent = transactions.filter((t) => t.method === "bank").length
  document.getElementById("cashTransactions").textContent = transactions.filter((t) => t.method === "cash").length
  document.getElementById("cardTransactions").textContent = transactions.filter((t) => t.method === "card").length

  // Update status badges
  const config = db.payments.config
  document.getElementById("gcashStatus").className =
    "badge " + (config.gcash.enabled ? "badge-success" : "badge-danger")
  document.getElementById("gcashStatus").textContent = config.gcash.enabled ? "Active" : "Disabled"

  document.getElementById("bankStatus").className = "badge " + (config.bank.enabled ? "badge-success" : "badge-danger")
  document.getElementById("bankStatus").textContent = config.bank.enabled ? "Active" : "Disabled"

  document.getElementById("cashStatus").className = "badge " + (config.cash.enabled ? "badge-success" : "badge-danger")
  document.getElementById("cashStatus").textContent = config.cash.enabled ? "Active" : "Disabled"

  document.getElementById("cardStatus").className = "badge " + (config.card.enabled ? "badge-success" : "badge-warning")
  document.getElementById("cardStatus").textContent = config.card.enabled ? "Active" : "Setup Required"
}

// Populate pending payments dropdown
function populatePendingPayments() {
  const select = document.getElementById("paymentBooking")
  if (!select) return

  select.innerHTML = '<option value="">Select pending payment...</option>'

  // Get pending billing
  const pendingBilling = db.billing.filter((b) => b.status === "pending")
  pendingBilling.forEach((bill) => {
    const user = getUserById(bill.userId)
    const option = document.createElement("option")
    option.value = bill.id
    option.textContent = bill.id + " - " + (user ? user.name : "Unknown") + " - " + formatCurrency(bill.amount)
    option.dataset.amount = bill.amount
    option.dataset.userId = bill.userId
    select.appendChild(option)
  })
}

// Update payment amount when booking selected
function updatePaymentAmount() {
  const select = document.getElementById("paymentBooking")
  const amountInput = document.getElementById("paymentAmount")
  const selectedOption = select.options[select.selectedIndex]

  if (selectedOption && selectedOption.dataset.amount) {
    amountInput.value = selectedOption.dataset.amount
  } else {
    amountInput.value = ""
  }
}

// Load transactions
function loadTransactions() {
  displayTransactions(db.payments.transactions)
}

// Display transactions
function displayTransactions(transactions) {
  const tbody = document.getElementById("transactionsTableBody")
  if (!tbody) return

  if (transactions.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px;">No transactions found</td></tr>'
    return
  }

  // Sort by date descending
  const sorted = [...transactions].sort((a, b) => new Date(b.processedAt || 0) - new Date(a.processedAt || 0))

  tbody.innerHTML = sorted
    .map((txn) => {
      const user = getUserById(txn.userId)
      return `
            <tr>
                <td><strong>${txn.id}</strong></td>
                <td>${formatDateTime(txn.processedAt)}</td>
                <td>${user ? user.name : "N/A"}</td>
                <td>${txn.bookingId}</td>
                <td>${formatCurrency(txn.amount)}</td>
                <td>${getMethodLabel(txn.method)}</td>
                <td>${txn.reference || "-"}</td>
                <td>${getStatusBadge(txn.status)}</td>
                <td>
                    <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="viewTransaction('${txn.id}')">View</button>
                    ${
                      txn.status === "pending"
                        ? `<button class="btn btn-success" style="padding: 6px 12px; font-size: 12px;" onclick="confirmPayment('${txn.id}')">Confirm</button>`
                        : ""
                    }
                </td>
            </tr>
        `
    })
    .join("")
}

// Filter transactions
function filterTransactions() {
  const search = document.getElementById("searchTransactions").value.toLowerCase()
  const statusFilter = document.getElementById("filterTransactionStatus").value
  const methodFilter = document.getElementById("filterTransactionMethod").value

  let filtered = db.payments.transactions

  if (search) {
    filtered = filtered.filter((t) => {
      const user = getUserById(t.userId)
      return (
        t.id.toLowerCase().includes(search) ||
        t.bookingId.toLowerCase().includes(search) ||
        (t.reference && t.reference.toLowerCase().includes(search)) ||
        (user && user.name.toLowerCase().includes(search))
      )
    })
  }

  if (statusFilter) {
    filtered = filtered.filter((t) => t.status === statusFilter)
  }

  if (methodFilter) {
    filtered = filtered.filter((t) => t.method === methodFilter)
  }

  displayTransactions(filtered)
}

// Process new payment
function processNewPayment(e) {
  e.preventDefault()

  const bookingSelect = document.getElementById("paymentBooking")
  const selectedOption = bookingSelect.options[bookingSelect.selectedIndex]

  if (!selectedOption || !selectedOption.value) {
    alert("Please select a booking/invoice")
    return
  }

  const method = document.getElementById("paymentMethod").value
  const reference = document.getElementById("paymentReference").value || generateReference(method)
  const notes = document.getElementById("paymentNotes").value
  const amount = Number.parseFloat(document.getElementById("paymentAmount").value)

  // Create transaction
  const transaction = {
    id: "TXN" + String(db.payments.nextTransactionId++).padStart(3, "0"),
    bookingId: selectedOption.value,
    userId: Number.parseInt(selectedOption.dataset.userId),
    amount: amount,
    method: method,
    reference: reference,
    status: "completed",
    processedBy: "Admin",
    processedAt: new Date().toISOString(),
    notes: notes,
  }

  db.payments.transactions.push(transaction)

  // Update billing status
  const billing = db.billing.find((b) => b.id === selectedOption.value)
  if (billing) {
    billing.status = "paid"
    billing.paymentMethod = method
  }

  saveDB()

  // Reset form and reload
  document.getElementById("processPaymentForm").reset()
  loadTransactions()
  updateKPIs()
  populatePendingPayments()
  updatePaymentMethodStats()

  alert("Payment processed successfully!\nTransaction ID: " + transaction.id + "\nReference: " + reference)
}

// Confirm pending payment
function confirmPayment(transactionId) {
  const transaction = db.payments.transactions.find((t) => t.id === transactionId)
  if (!transaction) return

  if (confirm("Confirm payment of " + formatCurrency(transaction.amount) + "?")) {
    transaction.status = "completed"
    transaction.processedBy = "Admin"
    transaction.processedAt = new Date().toISOString()
    transaction.reference = transaction.reference || generateReference(transaction.method)

    // Update billing
    const billing = db.billing.find((b) => b.id === transaction.bookingId)
    if (billing) {
      billing.status = "paid"
    }

    saveDB()
    loadTransactions()
    updateKPIs()
    populatePendingPayments()
    updatePaymentMethodStats()

    alert("Payment confirmed successfully!")
  }
}

// View transaction details
function viewTransaction(transactionId) {
  const transaction = db.payments.transactions.find((t) => t.id === transactionId)
  if (!transaction) return

  currentViewingTransactionId = transactionId
  const user = getUserById(transaction.userId)

  const content = document.getElementById("transactionDetails")
  content.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
                <p style="margin-bottom: 12px;"><strong>Transaction ID:</strong> ${transaction.id}</p>
                <p style="margin-bottom: 12px;"><strong>Booking/Invoice:</strong> ${transaction.bookingId}</p>
                <p style="margin-bottom: 12px;"><strong>Customer:</strong> ${user ? user.name : "N/A"}</p>
                <p style="margin-bottom: 12px;"><strong>Amount:</strong> ${formatCurrency(transaction.amount)}</p>
            </div>
            <div>
                <p style="margin-bottom: 12px;"><strong>Payment Method:</strong> ${getMethodLabel(transaction.method)}</p>
                <p style="margin-bottom: 12px;"><strong>Reference:</strong> ${transaction.reference || "-"}</p>
                <p style="margin-bottom: 12px;"><strong>Status:</strong> ${getStatusBadge(transaction.status)}</p>
                <p style="margin-bottom: 12px;"><strong>Processed:</strong> ${formatDateTime(transaction.processedAt)}</p>
            </div>
        </div>
        ${transaction.notes ? `<div style="margin-top: 16px; padding: 12px; background: #f9fafb; border-radius: 6px;"><strong>Notes:</strong> ${transaction.notes}</div>` : ""}
    `

  // Show/hide refund button based on status
  const refundBtn = document.getElementById("refundBtn")
  refundBtn.style.display = transaction.status === "completed" ? "inline-block" : "none"

  document.getElementById("transactionModal").classList.add("active")
}

// Close transaction modal
function closeTransactionModal() {
  document.getElementById("transactionModal").classList.remove("active")
  currentViewingTransactionId = null
}

// Initiate refund
function initiateRefund() {
  if (!currentViewingTransactionId) return

  const transaction = db.payments.transactions.find((t) => t.id === currentViewingTransactionId)
  if (!transaction || transaction.status !== "completed") return

  if (
    confirm(
      "Are you sure you want to refund " + formatCurrency(transaction.amount) + "?\nThis action cannot be undone.",
    )
  ) {
    transaction.status = "refunded"
    transaction.notes = (transaction.notes || "") + " | Refunded on " + new Date().toLocaleDateString()

    // Update billing
    const billing = db.billing.find((b) => b.id === transaction.bookingId)
    if (billing) {
      billing.status = "refunded"
    }

    saveDB()
    closeTransactionModal()
    loadTransactions()
    updateKPIs()
    updatePaymentMethodStats()

    alert("Refund processed successfully!")
  }
}

// Configure payment method
function configurePaymentMethod(method) {
  configuringMethod = method
  const config = db.payments.config[method]
  const formFields = document.getElementById("configFormFields")

  let fieldsHtml = `
        <div class="form-group">
            <label>
                <input type="checkbox" id="configEnabled" ${config.enabled ? "checked" : ""}>
                Enable this payment method
            </label>
        </div>
    `

  switch (method) {
    case "gcash":
      document.getElementById("configModalTitle").textContent = "Configure GCash"
      fieldsHtml += `
                <div class="form-group">
                    <label>Account Number</label>
                    <input type="text" id="configField1" value="${config.accountNumber || ""}" placeholder="09XXXXXXXXX">
                </div>
                <div class="form-group">
                    <label>Account Name</label>
                    <input type="text" id="configField2" value="${config.accountName || ""}" placeholder="Account holder name">
                </div>
            `
      break
    case "bank":
      document.getElementById("configModalTitle").textContent = "Configure Bank Transfer"
      fieldsHtml += `
                <div class="form-group">
                    <label>Bank Name</label>
                    <input type="text" id="configField1" value="${config.bankName || ""}" placeholder="e.g., BDO, BPI">
                </div>
                <div class="form-group">
                    <label>Account Number</label>
                    <input type="text" id="configField2" value="${config.accountNumber || ""}" placeholder="Bank account number">
                </div>
                <div class="form-group">
                    <label>Account Name</label>
                    <input type="text" id="configField3" value="${config.accountName || ""}" placeholder="Account holder name">
                </div>
            `
      break
    case "cash":
      document.getElementById("configModalTitle").textContent = "Configure Cash Payment"
      fieldsHtml += `
                <div class="form-group">
                    <label>Accepted Denominations</label>
                    <input type="text" id="configField1" value="${config.acceptedDenominations || ""}" placeholder="e.g., All PHP denominations">
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="configField2" ${config.requiresReceipt ? "checked" : ""}>
                        Require receipt for cash payments
                    </label>
                </div>
            `
      break
    case "card":
      document.getElementById("configModalTitle").textContent = "Configure Card Payment"
      fieldsHtml += `
                <div class="form-group">
                    <label>Payment Gateway</label>
                    <select id="configField1">
                        <option value="">Select Gateway</option>
                        <option value="paymongo" ${config.gateway === "paymongo" ? "selected" : ""}>PayMongo</option>
                        <option value="dragonpay" ${config.gateway === "dragonpay" ? "selected" : ""}>DragonPay</option>
                        <option value="xendit" ${config.gateway === "xendit" ? "selected" : ""}>Xendit</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Merchant ID</label>
                    <input type="text" id="configField2" value="${config.merchantId || ""}" placeholder="Your merchant ID">
                </div>
                <div class="form-group">
                    <label>API Key (Secret)</label>
                    <input type="password" id="configField3" placeholder="Enter API key">
                </div>
            `
      break
  }

  formFields.innerHTML = fieldsHtml
  document.getElementById("configModal").classList.add("active")
}

// Close config modal
function closeConfigModal() {
  document.getElementById("configModal").classList.remove("active")
  configuringMethod = null
}

// Save payment config
function savePaymentConfig(e) {
  e.preventDefault()

  if (!configuringMethod) return

  const enabled = document.getElementById("configEnabled").checked

  switch (configuringMethod) {
    case "gcash":
      db.payments.config.gcash = {
        enabled: enabled,
        accountNumber: document.getElementById("configField1").value,
        accountName: document.getElementById("configField2").value,
      }
      break
    case "bank":
      db.payments.config.bank = {
        enabled: enabled,
        bankName: document.getElementById("configField1").value,
        accountNumber: document.getElementById("configField2").value,
        accountName: document.getElementById("configField3").value,
      }
      break
    case "cash":
      db.payments.config.cash = {
        enabled: enabled,
        acceptedDenominations: document.getElementById("configField1").value,
        requiresReceipt: document.getElementById("configField2").checked,
      }
      break
    case "card":
      db.payments.config.card = {
        enabled: enabled,
        gateway: document.getElementById("configField1").value,
        merchantId: document.getElementById("configField2").value,
      }
      break
  }

  saveDB()
  closeConfigModal()
  updatePaymentMethodStats()
  alert("Configuration saved successfully!")
}

// Print receipt
function printReceipt() {
  if (!currentViewingTransactionId) return

  const transaction = db.payments.transactions.find((t) => t.id === currentViewingTransactionId)
  if (!transaction) return

  const user = getUserById(transaction.userId)

  const receiptWindow = window.open("", "_blank")
  receiptWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Receipt - ${transaction.id}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; max-width: 400px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 30px; }
                .header h1 { margin: 0; font-size: 24px; }
                .header p { margin: 5px 0; color: #666; }
                .divider { border-top: 1px dashed #ccc; margin: 20px 0; }
                .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                .total { font-size: 18px; font-weight: bold; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>MVRS</h1>
                <p>Motor Vehicle Rental Services</p>
                <p>Official Receipt</p>
            </div>
            <div class="divider"></div>
            <div class="row"><span>Transaction ID:</span><span>${transaction.id}</span></div>
            <div class="row"><span>Date:</span><span>${formatDateTime(transaction.processedAt)}</span></div>
            <div class="row"><span>Customer:</span><span>${user ? user.name : "N/A"}</span></div>
            <div class="row"><span>Booking:</span><span>${transaction.bookingId}</span></div>
            <div class="row"><span>Payment Method:</span><span>${getMethodLabel(transaction.method)}</span></div>
            <div class="row"><span>Reference:</span><span>${transaction.reference || "-"}</span></div>
            <div class="divider"></div>
            <div class="row total"><span>TOTAL PAID:</span><span>${formatCurrency(transaction.amount)}</span></div>
            <div class="divider"></div>
            <div class="footer">
                <p>Thank you for your business!</p>
                <p>This is a computer-generated receipt.</p>
            </div>
        </body>
        </html>
    `)
  receiptWindow.document.close()
  receiptWindow.print()
}

// Export transactions
function exportTransactions() {
  const transactions = db.payments.transactions
  const data = transactions.map((t) => {
    const user = getUserById(t.userId)
    return {
      "Transaction ID": t.id,
      Date: formatDateTime(t.processedAt),
      Customer: user ? user.name : "N/A",
      Booking: t.bookingId,
      Amount: t.amount,
      Method: getMethodLabel(t.method),
      Reference: t.reference || "",
      Status: t.status,
      "Processed By": t.processedBy || "",
      Notes: t.notes || "",
    }
  })

  const headers = Object.keys(data[0]).join(",")
  const rows = data.map((row) =>
    Object.values(row)
      .map((v) => '"' + v + '"')
      .join(","),
  )
  const csv = headers + "\n" + rows.join("\n")

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "transactions-" + new Date().toISOString().split("T")[0] + ".csv"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  alert("Transactions exported successfully!")
}

// Logout function
function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "/client/pages/login.html"
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", initPaymentProcessing)
