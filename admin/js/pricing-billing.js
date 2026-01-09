// Pricing & Billing Script

// Declare necessary variables or import them here
const billingAPI = {} // Placeholder for billingAPI
const pricingAPI = {} // Placeholder for pricingAPI
const userAPI = {} // Placeholder for userAPI
const formatCurrency = (amount) => `$${amount.toFixed(2)}` // Placeholder for formatCurrency
const formatDate = (date) => new Date(date).toLocaleDateString() // Placeholder for formatDate
const getStatusBadge = (status) =>
  `<span class="badge ${status === "Paid" ? "bg-success" : "bg-danger"}">${status}</span>` // Placeholder for getStatusBadge
const openModal = (id) => (document.getElementById(id).style.display = "block") // Placeholder for openModal
const closeModal = (id) => (document.getElementById(id).style.display = "none") // Placeholder for closeModal
const showNotification = (message) => alert(message) // Placeholder for showNotification

function initPricingBilling() {
  loadPricingTiers()
  loadBillingHistory()
  setupEventListeners()
}

function setupEventListeners() {
  const searchInput = document.getElementById("searchBilling")
  const filterStatus = document.getElementById("filterPaymentStatus")

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value
      const billing = query ? billingAPI.search(query) : billingAPI.getAll()
      displayBillingHistory(billing)
    })
  }

  if (filterStatus) {
    filterStatus.addEventListener("change", (e) => {
      const status = e.target.value
      const billing = billingAPI.filterByStatus(status)
      displayBillingHistory(billing)
    })
  }
}

function loadPricingTiers() {
  const container = document.getElementById("pricingTiersContainer")
  const tiers = pricingAPI.getAll()

  container.innerHTML = tiers
    .map(
      (tier) => `
        <div class="pricing-card">
            <h3>${tier.tierName}</h3>
            <div class="price">${formatCurrency(tier.dailyRate)}<span class="period">/day</span></div>
            <div class="pricing-features">
                <p><strong>Weekly:</strong> ${formatCurrency(tier.weeklyRate)}</p>
                <p><strong>Monthly:</strong> ${formatCurrency(tier.monthlyRate)}</p>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-primary" style="flex: 1; font-size: 12px;" onclick="editPricingTier(${tier.id})">Edit</button>
                <button class="btn btn-danger" style="flex: 1; font-size: 12px;" onclick="deletePricingTier(${tier.id})">Delete</button>
            </div>
        </div>
    `,
    )
    .join("")
}

function loadBillingHistory() {
  displayBillingHistory(billingAPI.getAll())
}

function displayBillingHistory(billing) {
  const tbody = document.getElementById("billingTableBody")

  if (billing.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" style="text-align: center; padding: 20px;">No billing records found</td></tr>'
    return
  }

  tbody.innerHTML = billing
    .map((bill) => {
      const user = userAPI.getById(bill.userId)
      return `
            <tr>
                <td>${bill.id}</td>
                <td>${user?.name || "N/A"}</td>
                <td>${formatCurrency(bill.amount)}</td>
                <td>${formatDate(bill.date)}</td>
                <td>${formatDate(bill.dueDate)}</td>
                <td>${getStatusBadge(bill.status)}</td>
                <td>
                    <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="viewBillingDetails(${bill.id})">View</button>
                </td>
            </tr>
        `
    })
    .join("")
}

function openAddPricingModal() {
  document.getElementById("pricingForm").reset()
  openModal("pricingModal")
}

function closePricingModal() {
  closeModal("pricingModal")
}

function savePricing(e) {
  e.preventDefault()

  const pricingData = {
    tierName: document.getElementById("tierName").value,
    dailyRate: Number.parseFloat(document.getElementById("dailyRate").value),
    weeklyRate: Number.parseFloat(document.getElementById("weeklyRate").value),
    monthlyRate: Number.parseFloat(document.getElementById("monthlyRate").value),
  }

  pricingAPI.add(pricingData)
  showNotification("Pricing tier added successfully")
  closePricingModal()
  loadPricingTiers()
}

function editPricingTier(id) {
  const tier = pricingAPI.getById(id)
  if (!tier) return

  document.getElementById("tierName").value = tier.tierName
  document.getElementById("dailyRate").value = tier.dailyRate
  document.getElementById("weeklyRate").value = tier.weeklyRate
  document.getElementById("monthlyRate").value = tier.monthlyRate

  openAddPricingModal()
}

function deletePricingTier(id) {
  if (confirm("Are you sure you want to delete this pricing tier?")) {
    pricingAPI.delete(id)
    showNotification("Pricing tier deleted successfully")
    loadPricingTiers()
  }
}

function viewBillingDetails(id) {
  const bill = billingAPI.getById(id)
  const user = userAPI.getById(bill.userId)

  alert(`Invoice: ${bill.id}\nCustomer: ${user.name}\nAmount: ${formatCurrency(bill.amount)}\nStatus: ${bill.status}`)
}

document.addEventListener("DOMContentLoaded", initPricingBilling)
