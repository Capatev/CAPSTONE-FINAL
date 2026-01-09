// Asset Management

// Declare necessary variables and functions
const db = {
  assets: [
    { id: "ASSET001", name: "Laptop", type: "Electronics", value: 1000, condition: "good", lastUpdated: "2023-01-01" },
    { id: "ASSET002", name: "Chair", type: "Furniture", value: 200, condition: "fair", lastUpdated: "2023-02-01" },
    // Add more assets as needed
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
    filterFunction(null, e.target.value)
  })
}

function formatCurrency(value) {
  return `$${value.toLocaleString()}`
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

function createBadge(condition) {
  const badgeClasses = {
    good: "badge bg-success",
    excellent: "badge bg-success",
    fair: "badge bg-warning",
    poor: "badge bg-danger",
  }
  return `<span class="${badgeClasses[condition]}">${condition}</span>`
}

function openModal(modalId) {
  document.getElementById(modalId).style.display = "block"
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none"
}

document.addEventListener("DOMContentLoaded", () => {
  populateAssets()
  updateAssetSummary()
  setupSearch("searchAssets", "assetsTable", filterAssets)
  setupFilter("filterAssetType", "assetsTable", filterAssets)

  document.getElementById("assetForm")?.addEventListener("submit", addAsset)
})

function populateAssets() {
  const tbody = document.getElementById("assetsTable")
  tbody.innerHTML = ""

  db.assets.forEach((asset) => {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td>${asset.id}</td>
      <td>${asset.name}</td>
      <td>${asset.type}</td>
      <td>${formatCurrency(asset.value)}</td>
      <td>${createBadge(asset.condition)}</td>
      <td>${formatDate(asset.lastUpdated)}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editAsset('${asset.id}')">Edit</button>
      </td>
    `
    tbody.appendChild(row)
  })
}

function filterAssets(searchTerm, filterValue) {
  const tbody = document.getElementById("assetsTable")

  tbody.innerHTML = ""

  db.assets
    .filter((asset) => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm) || asset.id.includes(searchTerm)
      const matchesFilter = !filterValue || asset.type === filterValue
      return matchesSearch && matchesFilter
    })
    .forEach((asset) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${asset.id}</td>
        <td>${asset.name}</td>
        <td>${asset.type}</td>
        <td>${formatCurrency(asset.value)}</td>
        <td>${createBadge(asset.condition)}</td>
        <td>${formatDate(asset.lastUpdated)}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="editAsset('${asset.id}')">Edit</button>
        </td>
      `
      tbody.appendChild(row)
    })
}

function updateAssetSummary() {
  const totalAssets = db.assets.length
  const totalValue = db.assets.reduce((sum, asset) => sum + asset.value, 0)
  const goodCondition = db.assets.filter((a) => a.condition === "good" || a.condition === "excellent").length
  const needsRepair = db.assets.filter((a) => a.condition === "poor" || a.condition === "fair").length

  document.getElementById("totalAssets").textContent = totalAssets
  document.getElementById("totalAssetValue").textContent = formatCurrency(totalValue)
  document.getElementById("goodCondition").textContent = goodCondition
  document.getElementById("needsRepair").textContent = needsRepair
}

function addAsset(e) {
  e.preventDefault()

  const asset = {
    id: `ASSET${String(db.assets.length + 1).padStart(3, "0")}`,
    name: document.getElementById("assetName").value,
    type: document.getElementById("assetType").value,
    value: Number.parseInt(document.getElementById("assetValue").value),
    condition: document.getElementById("assetCondition").value,
    lastUpdated: new Date().toISOString().split("T")[0],
  }

  db.assets.push(asset)
  alert("Asset added successfully!")
  closeAddAssetModal()
  populateAssets()
  updateAssetSummary()
  e.target.reset()
}

function editAsset(assetId) {
  alert("Edit functionality coming soon for " + assetId)
}

function showAddAssetModal() {
  openModal("assetModal")
}

function closeAddAssetModal() {
  closeModal("assetModal")
}
