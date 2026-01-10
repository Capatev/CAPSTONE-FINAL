// Insurance Management Module

let editingPolicyId = null
let editingClaimId = null
const db = {} // Declare db variable
const saveDB = () => {} // Declare saveDB variable

// Initialize insurance data in the database
function initInsuranceDB() {
  if (!db.insurance) {
    db.insurance = {
      policies: [
        {
          id: "POL001",
          vehicleId: 1,
          provider: "Standard Insurance Co.",
          policyNumber: "STD-2025-001234",
          type: "comprehensive",
          coverage: 500000,
          premium: 15000,
          deductible: 5000,
          startDate: "2025-01-01",
          endDate: "2026-01-01",
          status: "active",
          notes: "Full coverage including natural disasters",
        },
        {
          id: "POL002",
          vehicleId: 2,
          provider: "Pioneer Insurance",
          policyNumber: "PIO-2025-005678",
          type: "third-party",
          coverage: 300000,
          premium: 8000,
          deductible: 3000,
          startDate: "2025-01-15",
          endDate: "2026-01-15",
          status: "active",
          notes: "",
        },
        {
          id: "POL003",
          vehicleId: 3,
          provider: "Malayan Insurance",
          policyNumber: "MAL-2024-009012",
          type: "comprehensive",
          coverage: 750000,
          premium: 22000,
          deductible: 7500,
          startDate: "2024-06-01",
          endDate: "2025-06-01",
          status: "active",
          notes: "Premium vehicle coverage",
        },
      ],
      claims: [
        {
          id: "CLM001",
          policyId: "POL001",
          vehicleId: 1,
          incidentDate: "2025-01-05",
          type: "accident",
          amount: 25000,
          status: "pending",
          description: "Minor collision in parking lot. Rear bumper damage.",
          policeReport: "PR-2025-001234",
          filedDate: "2025-01-06",
        },
        {
          id: "CLM002",
          policyId: "POL002",
          vehicleId: 2,
          incidentDate: "2024-12-20",
          type: "vandalism",
          amount: 15000,
          status: "approved",
          description: "Vehicle scratched while parked overnight.",
          policeReport: "PR-2024-098765",
          filedDate: "2024-12-21",
        },
      ],
      nextPolicyId: 4,
      nextClaimId: 3,
    }
    saveDB()
  }
}

// Format currency
function formatCurrency(amount) {
  return "₱" + Number(amount).toLocaleString("en-PH", { minimumFractionDigits: 2 })
}

// Format date
function formatDate(dateString) {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Get status badge
function getStatusBadge(status) {
  const badges = {
    active: '<span class="badge badge-success">Active</span>',
    expired: '<span class="badge badge-danger">Expired</span>',
    pending: '<span class="badge badge-warning">Pending</span>',
    approved: '<span class="badge badge-info">Approved</span>',
    rejected: '<span class="badge badge-danger">Rejected</span>',
    settled: '<span class="badge badge-success">Settled</span>',
  }
  return badges[status] || '<span class="badge badge-secondary">' + status + "</span>"
}

// Get insurance type label
function getInsuranceTypeLabel(type) {
  const labels = {
    comprehensive: "Comprehensive",
    "third-party": "Third Party",
    collision: "Collision",
  }
  return labels[type] || type
}

// Get claim type label
function getClaimTypeLabel(type) {
  const labels = {
    accident: "Accident",
    theft: "Theft",
    vandalism: "Vandalism",
    "natural-disaster": "Natural Disaster",
    fire: "Fire",
    other: "Other",
  }
  return labels[type] || type
}

// Get vehicle by ID
function getVehicleById(vehicleId) {
  return db.vehicles.find((v) => v.id === vehicleId)
}

// Initialize page
function initInsuranceManagement() {
  initInsuranceDB()
  loadPolicies()
  loadClaims()
  updateKPIs()
  populateVehicleSelects()
  populatePolicySelect()
  setupEventListeners()
}

// Setup event listeners
function setupEventListeners() {
  // Policy search
  const searchPolicies = document.getElementById("searchPolicies")
  if (searchPolicies) {
    searchPolicies.addEventListener("input", () => {
      filterPolicies()
    })
  }

  // Policy filters
  const filterPolicyStatus = document.getElementById("filterPolicyStatus")
  const filterInsuranceType = document.getElementById("filterInsuranceType")
  if (filterPolicyStatus) filterPolicyStatus.addEventListener("change", filterPolicies)
  if (filterInsuranceType) filterInsuranceType.addEventListener("change", filterPolicies)

  // Claims search
  const searchClaims = document.getElementById("searchClaims")
  if (searchClaims) {
    searchClaims.addEventListener("input", () => {
      filterClaims()
    })
  }

  // Claims filter
  const filterClaimStatus = document.getElementById("filterClaimStatus")
  if (filterClaimStatus) filterClaimStatus.addEventListener("change", filterClaims)
}

// Update KPIs
function updateKPIs() {
  const policies = db.insurance.policies
  const claims = db.insurance.claims

  // Total active policies
  const activePolicies = policies.filter((p) => p.status === "active").length
  document.getElementById("totalPolicies").textContent = activePolicies

  // Expiring soon (within 30 days)
  const today = new Date()
  const thirtyDays = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
  const expiringSoon = policies.filter((p) => {
    const endDate = new Date(p.endDate)
    return p.status === "active" && endDate <= thirtyDays && endDate >= today
  }).length
  document.getElementById("expiringSoon").textContent = expiringSoon

  // Active claims
  const activeClaims = claims.filter((c) => c.status === "pending" || c.status === "approved").length
  document.getElementById("activeClaims").textContent = activeClaims

  // Total coverage
  const totalCoverage = policies.filter((p) => p.status === "active").reduce((sum, p) => sum + Number(p.coverage), 0)
  document.getElementById("totalCoverage").textContent = formatCurrency(totalCoverage)
}

// Populate vehicle selects
function populateVehicleSelects() {
  const select = document.getElementById("policyVehicle")
  if (!select) return

  select.innerHTML = '<option value="">Select Vehicle</option>'
  db.vehicles.forEach((vehicle) => {
    const option = document.createElement("option")
    option.value = vehicle.id
    option.textContent = vehicle.plate + " - " + vehicle.model
    select.appendChild(option)
  })
}

// Populate policy select for claims
function populatePolicySelect() {
  const select = document.getElementById("claimPolicy")
  if (!select) return

  select.innerHTML = '<option value="">Select Policy</option>'
  db.insurance.policies
    .filter((p) => p.status === "active")
    .forEach((policy) => {
      const vehicle = getVehicleById(policy.vehicleId)
      const option = document.createElement("option")
      option.value = policy.id
      option.textContent = policy.policyNumber + " (" + (vehicle ? vehicle.plate : "N/A") + ")"
      option.dataset.vehicleId = policy.vehicleId
      select.appendChild(option)
    })
}

// Update claim vehicle field based on selected policy
function updateClaimVehicle() {
  const policySelect = document.getElementById("claimPolicy")
  const vehicleInput = document.getElementById("claimVehicle")
  const selectedOption = policySelect.options[policySelect.selectedIndex]

  if (selectedOption && selectedOption.dataset.vehicleId) {
    const vehicle = getVehicleById(Number(selectedOption.dataset.vehicleId))
    vehicleInput.value = vehicle ? vehicle.plate + " - " + vehicle.model : ""
  } else {
    vehicleInput.value = ""
  }
}

// Load policies
function loadPolicies() {
  displayPolicies(db.insurance.policies)
}

// Display policies
function displayPolicies(policies) {
  const tbody = document.getElementById("policiesTableBody")
  if (!tbody) return

  if (policies.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 20px;">No policies found</td></tr>'
    return
  }

  tbody.innerHTML = policies
    .map((policy) => {
      const vehicle = getVehicleById(policy.vehicleId)
      return `
            <tr>
                <td><strong>${policy.id}</strong></td>
                <td>${vehicle ? vehicle.plate + " - " + vehicle.model : "N/A"}</td>
                <td>${policy.provider}</td>
                <td>${getInsuranceTypeLabel(policy.type)}</td>
                <td>${formatCurrency(policy.coverage)}</td>
                <td>${formatCurrency(policy.premium)}/yr</td>
                <td>${formatDate(policy.startDate)}</td>
                <td>${formatDate(policy.endDate)}</td>
                <td>${getStatusBadge(policy.status)}</td>
                <td>
                    <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="viewPolicy('${policy.id}')">View</button>
                    <button class="btn btn-primary" style="padding: 6px 12px; font-size: 12px;" onclick="editPolicy('${policy.id}')">Edit</button>
                    <button class="btn btn-danger" style="padding: 6px 12px; font-size: 12px;" onclick="deletePolicy('${policy.id}')">Delete</button>
                </td>
            </tr>
        `
    })
    .join("")
}

// Filter policies
function filterPolicies() {
  const search = document.getElementById("searchPolicies").value.toLowerCase()
  const statusFilter = document.getElementById("filterPolicyStatus").value
  const typeFilter = document.getElementById("filterInsuranceType").value

  let filtered = db.insurance.policies

  if (search) {
    filtered = filtered.filter((p) => {
      const vehicle = getVehicleById(p.vehicleId)
      return (
        p.policyNumber.toLowerCase().includes(search) ||
        p.provider.toLowerCase().includes(search) ||
        (vehicle && (vehicle.plate.toLowerCase().includes(search) || vehicle.model.toLowerCase().includes(search)))
      )
    })
  }

  if (statusFilter) {
    filtered = filtered.filter((p) => p.status === statusFilter)
  }

  if (typeFilter) {
    filtered = filtered.filter((p) => p.type === typeFilter)
  }

  displayPolicies(filtered)
}

// Load claims
function loadClaims() {
  displayClaims(db.insurance.claims)
}

// Display claims
function displayClaims(claims) {
  const tbody = document.getElementById("claimsTableBody")
  if (!tbody) return

  if (claims.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">No claims found</td></tr>'
    return
  }

  tbody.innerHTML = claims
    .map((claim) => {
      const vehicle = getVehicleById(claim.vehicleId)
      const policy = db.insurance.policies.find((p) => p.id === claim.policyId)
      return `
            <tr>
                <td><strong>${claim.id}</strong></td>
                <td>${policy ? policy.policyNumber : "N/A"}</td>
                <td>${vehicle ? vehicle.plate : "N/A"}</td>
                <td>${formatDate(claim.incidentDate)}</td>
                <td>${getClaimTypeLabel(claim.type)}</td>
                <td>${formatCurrency(claim.amount)}</td>
                <td>${getStatusBadge(claim.status)}</td>
                <td>
                    <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="viewClaim('${claim.id}')">View</button>
                    <button class="btn btn-primary" style="padding: 6px 12px; font-size: 12px;" onclick="editClaim('${claim.id}')">Edit</button>
                </td>
            </tr>
        `
    })
    .join("")
}

// Filter claims
function filterClaims() {
  const search = document.getElementById("searchClaims").value.toLowerCase()
  const statusFilter = document.getElementById("filterClaimStatus").value

  let filtered = db.insurance.claims

  if (search) {
    filtered = filtered.filter((c) => {
      const vehicle = getVehicleById(c.vehicleId)
      const policy = db.insurance.policies.find((p) => p.id === c.policyId)
      return (
        c.id.toLowerCase().includes(search) ||
        (policy && policy.policyNumber.toLowerCase().includes(search)) ||
        (vehicle && vehicle.plate.toLowerCase().includes(search))
      )
    })
  }

  if (statusFilter) {
    filtered = filtered.filter((c) => c.status === statusFilter)
  }

  displayClaims(filtered)
}

// Open add policy modal
function openAddPolicyModal() {
  editingPolicyId = null
  document.getElementById("policyModalTitle").textContent = "Add Insurance Policy"
  document.getElementById("policyForm").reset()
  document.getElementById("policyModal").classList.add("active")
}

// Close policy modal
function closePolicyModal() {
  document.getElementById("policyModal").classList.remove("active")
  editingPolicyId = null
}

// Edit policy
function editPolicy(id) {
  const policy = db.insurance.policies.find((p) => p.id === id)
  if (!policy) return

  editingPolicyId = id
  document.getElementById("policyModalTitle").textContent = "Edit Insurance Policy"
  document.getElementById("policyVehicle").value = policy.vehicleId
  document.getElementById("policyProvider").value = policy.provider
  document.getElementById("policyNumber").value = policy.policyNumber
  document.getElementById("policyType").value = policy.type
  document.getElementById("policyCoverage").value = policy.coverage
  document.getElementById("policyPremium").value = policy.premium
  document.getElementById("policyDeductible").value = policy.deductible || ""
  document.getElementById("policyStartDate").value = policy.startDate
  document.getElementById("policyEndDate").value = policy.endDate
  document.getElementById("policyStatus").value = policy.status
  document.getElementById("policyNotes").value = policy.notes || ""

  document.getElementById("policyModal").classList.add("active")
}

// Save policy
function savePolicy(e) {
  e.preventDefault()

  const policyData = {
    vehicleId: Number(document.getElementById("policyVehicle").value),
    provider: document.getElementById("policyProvider").value,
    policyNumber: document.getElementById("policyNumber").value,
    type: document.getElementById("policyType").value,
    coverage: Number(document.getElementById("policyCoverage").value),
    premium: Number(document.getElementById("policyPremium").value),
    deductible: Number(document.getElementById("policyDeductible").value) || 0,
    startDate: document.getElementById("policyStartDate").value,
    endDate: document.getElementById("policyEndDate").value,
    status: document.getElementById("policyStatus").value,
    notes: document.getElementById("policyNotes").value,
  }

  if (editingPolicyId) {
    // Update existing policy
    const index = db.insurance.policies.findIndex((p) => p.id === editingPolicyId)
    if (index !== -1) {
      db.insurance.policies[index] = { ...db.insurance.policies[index], ...policyData }
    }
    alert("Policy updated successfully!")
  } else {
    // Add new policy
    policyData.id = "POL" + String(db.insurance.nextPolicyId++).padStart(3, "0")
    db.insurance.policies.push(policyData)
    alert("Policy added successfully!")
  }

  saveDB()
  closePolicyModal()
  loadPolicies()
  updateKPIs()
  populatePolicySelect()
}

// Delete policy
function deletePolicy(id) {
  if (confirm("Are you sure you want to delete this policy?")) {
    db.insurance.policies = db.insurance.policies.filter((p) => p.id !== id)
    saveDB()
    loadPolicies()
    updateKPIs()
    populatePolicySelect()
    alert("Policy deleted successfully!")
  }
}

// View policy details
function viewPolicy(id) {
  const policy = db.insurance.policies.find((p) => p.id === id)
  if (!policy) return

  const vehicle = getVehicleById(policy.vehicleId)
  const content = document.getElementById("policyDetailsContent")

  content.innerHTML = `
        <div style="margin-bottom: 16px;">
            <strong>Policy Number:</strong> ${policy.policyNumber}
        </div>
        <div style="margin-bottom: 16px;">
            <strong>Vehicle:</strong> ${vehicle ? vehicle.plate + " - " + vehicle.model : "N/A"}
        </div>
        <div style="margin-bottom: 16px;">
            <strong>Provider:</strong> ${policy.provider}
        </div>
        <div style="margin-bottom: 16px;">
            <strong>Type:</strong> ${getInsuranceTypeLabel(policy.type)}
        </div>
        <div style="margin-bottom: 16px;">
            <strong>Coverage:</strong> ${formatCurrency(policy.coverage)}
        </div>
        <div style="margin-bottom: 16px;">
            <strong>Annual Premium:</strong> ${formatCurrency(policy.premium)}
        </div>
        <div style="margin-bottom: 16px;">
            <strong>Deductible:</strong> ${formatCurrency(policy.deductible || 0)}
        </div>
        <div style="margin-bottom: 16px;">
            <strong>Period:</strong> ${formatDate(policy.startDate)} - ${formatDate(policy.endDate)}
        </div>
        <div style="margin-bottom: 16px;">
            <strong>Status:</strong> ${getStatusBadge(policy.status)}
        </div>
        ${policy.notes ? `<div style="margin-bottom: 16px;"><strong>Notes:</strong> ${policy.notes}</div>` : ""}
    `

  document.getElementById("policyDetailsModal").classList.add("active")
}

// Close policy details modal
function closePolicyDetailsModal() {
  document.getElementById("policyDetailsModal").classList.remove("active")
}

// Open add claim modal
function openAddClaimModal() {
  editingClaimId = null
  document.getElementById("claimModalTitle").textContent = "File Insurance Claim"
  document.getElementById("claimForm").reset()
  document.getElementById("claimVehicle").value = ""
  document.getElementById("claimModal").classList.add("active")
}

// Close claim modal
function closeClaimModal() {
  document.getElementById("claimModal").classList.remove("active")
  editingClaimId = null
}

// Edit claim
function editClaim(id) {
  const claim = db.insurance.claims.find((c) => c.id === id)
  if (!claim) return

  editingClaimId = id
  document.getElementById("claimModalTitle").textContent = "Edit Insurance Claim"
  document.getElementById("claimPolicy").value = claim.policyId
  updateClaimVehicle()
  document.getElementById("claimIncidentDate").value = claim.incidentDate
  document.getElementById("claimType").value = claim.type
  document.getElementById("claimAmount").value = claim.amount
  document.getElementById("claimStatus").value = claim.status
  document.getElementById("claimDescription").value = claim.description
  document.getElementById("claimPoliceReport").value = claim.policeReport || ""

  document.getElementById("claimModal").classList.add("active")
}

// Save claim
function saveClaim(e) {
  e.preventDefault()

  const policy = db.insurance.policies.find((p) => p.id === document.getElementById("claimPolicy").value)

  const claimData = {
    policyId: document.getElementById("claimPolicy").value,
    vehicleId: policy ? policy.vehicleId : null,
    incidentDate: document.getElementById("claimIncidentDate").value,
    type: document.getElementById("claimType").value,
    amount: Number(document.getElementById("claimAmount").value),
    status: document.getElementById("claimStatus").value,
    description: document.getElementById("claimDescription").value,
    policeReport: document.getElementById("claimPoliceReport").value,
    filedDate: new Date().toISOString().split("T")[0],
  }

  if (editingClaimId) {
    // Update existing claim
    const index = db.insurance.claims.findIndex((c) => c.id === editingClaimId)
    if (index !== -1) {
      db.insurance.claims[index] = { ...db.insurance.claims[index], ...claimData }
    }
    alert("Claim updated successfully!")
  } else {
    // Add new claim
    claimData.id = "CLM" + String(db.insurance.nextClaimId++).padStart(3, "0")
    db.insurance.claims.push(claimData)
    alert("Claim submitted successfully!")
  }

  saveDB()
  closeClaimModal()
  loadClaims()
  updateKPIs()
}

// View claim details
function viewClaim(id) {
  const claim = db.insurance.claims.find((c) => c.id === id)
  if (!claim) return

  const vehicle = getVehicleById(claim.vehicleId)
  const policy = db.insurance.policies.find((p) => p.id === claim.policyId)

  alert(
    "Claim Details:\n\n" +
      "Claim ID: " +
      claim.id +
      "\n" +
      "Policy: " +
      (policy ? policy.policyNumber : "N/A") +
      "\n" +
      "Vehicle: " +
      (vehicle ? vehicle.plate + " - " + vehicle.model : "N/A") +
      "\n" +
      "Incident Date: " +
      formatDate(claim.incidentDate) +
      "\n" +
      "Type: " +
      getClaimTypeLabel(claim.type) +
      "\n" +
      "Amount: " +
      formatCurrency(claim.amount) +
      "\n" +
      "Status: " +
      claim.status +
      "\n" +
      "Description: " +
      claim.description +
      "\n" +
      (claim.policeReport ? "Police Report: " + claim.policeReport : ""),
  )
}

// Logout function
function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "/client/pages/login.html"
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", initInsuranceManagement)
