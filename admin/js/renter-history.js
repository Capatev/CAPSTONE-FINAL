// Comprehensive Renter History Module

// Declare db variable
const db = {
  users: [],
  reservations: [],
  vehicles: [],
  renterIncidents: [],
  renterNotes: [],
}

let currentViewingRenterId = null
let blacklistingRenterId = null

// Declare saveDB function
function saveDB() {
  localStorage.setItem("renterHistoryDB", JSON.stringify(db))
}

// Initialize renter history data
function initRenterHistoryDB() {
  // Add renter profile data to users if not present
  db.users.forEach((user) => {
    if (user.role === "customer" && !user.renterProfile) {
      user.renterProfile = {
        idVerified: Math.random() > 0.3, // 70% verified
        verificationDate: user.idVerified ? "2024-06-15" : null,
        idType: "national-id",
        idNumber: "ID-" + Math.floor(Math.random() * 1000000),
        rating: (3 + Math.random() * 2).toFixed(1), // 3.0 - 5.0
        totalRentals: Math.floor(Math.random() * 20),
        totalSpent: Math.floor(Math.random() * 100000),
        accountStatus: "active",
        incidents: [],
        notes: [],
        lastRentalDate: "2025-01-05",
        memberSince: user.joined,
      }
    }
  })

  // Initialize renter incidents if not present
  if (!db.renterIncidents) {
    db.renterIncidents = [
      {
        id: "INC001",
        renterId: 2,
        type: "late-return",
        description: "Vehicle returned 2 days late without prior notice",
        date: "2024-11-15",
        severity: "minor",
        resolved: true,
        resolution: "Charged late fee",
      },
      {
        id: "INC002",
        renterId: 4,
        type: "minor-damage",
        description: "Small scratch on rear bumper",
        date: "2024-12-20",
        severity: "minor",
        resolved: true,
        resolution: "Deducted from deposit",
      },
    ]
  }

  // Initialize renter notes if not present
  if (!db.renterNotes) {
    db.renterNotes = [
      {
        id: "NOTE001",
        renterId: 2,
        note: "Preferred customer - always returns vehicles in good condition",
        addedBy: "Admin",
        date: "2024-10-01",
      },
    ]
  }

  saveDB()
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
    inactive: '<span class="badge badge-secondary">Inactive</span>',
    blacklisted: '<span class="badge badge-danger">Blacklisted</span>',
  }
  return badges[status] || '<span class="badge">' + status + "</span>"
}

// Get rating stars
function getRatingStars(rating) {
  const numRating = Number.parseFloat(rating) || 0
  const fullStars = Math.floor(numRating)
  const hasHalf = numRating % 1 >= 0.5
  let stars = ""

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars += "★"
    } else if (i === fullStars && hasHalf) {
      stars += "☆"
    } else {
      stars += "☆"
    }
  }

  return '<span style="color: #f59e0b;">' + stars + "</span> (" + numRating.toFixed(1) + ")"
}

// Get verification badge
function getVerificationBadge(verified) {
  if (verified) {
    return '<span class="badge badge-success">Verified</span>'
  }
  return '<span class="badge badge-warning">Unverified</span>'
}

// Get all renters (customers)
function getAllRenters() {
  return db.users.filter((u) => u.role === "customer")
}

// Get renter by ID
function getRenterById(id) {
  return db.users.find((u) => u.id === id)
}

// Get renter's reservations
function getRenterReservations(renterId) {
  return db.reservations.filter((r) => r.userId === renterId)
}

// Get renter's incidents
function getRenterIncidents(renterId) {
  return db.renterIncidents ? db.renterIncidents.filter((i) => i.renterId === renterId) : []
}

// Get renter's notes
function getRenterNotes(renterId) {
  return db.renterNotes ? db.renterNotes.filter((n) => n.renterId === renterId) : []
}

// Initialize page
function initRenterHistory() {
  initRenterHistoryDB()
  loadRenters()
  updateKPIs()
  setupEventListeners()
}

// Setup event listeners
function setupEventListeners() {
  const searchInput = document.getElementById("searchRenters")
  const filterStatus = document.getElementById("filterRenterStatus")
  const filterRating = document.getElementById("filterRenterRating")

  if (searchInput) {
    searchInput.addEventListener("input", filterRenters)
  }

  if (filterStatus) {
    filterStatus.addEventListener("change", filterRenters)
  }

  if (filterRating) {
    filterRating.addEventListener("change", filterRenters)
  }
}

// Update KPIs
function updateKPIs() {
  const renters = getAllRenters()

  // Total renters
  document.getElementById("totalRenters").textContent = renters.length

  // Active renters (with active reservations)
  const activeReservationUserIds = db.reservations.filter((r) => r.status === "active").map((r) => r.userId)
  const activeRenters = renters.filter((r) => activeReservationUserIds.includes(r.id)).length
  document.getElementById("activeRenters").textContent = activeRenters

  // Blacklisted renters
  const blacklisted = renters.filter((r) => r.renterProfile && r.renterProfile.accountStatus === "blacklisted").length
  document.getElementById("blacklistedRenters").textContent = blacklisted

  // Total lifetime value
  const totalValue = renters.reduce((sum, r) => sum + (r.renterProfile ? r.renterProfile.totalSpent : 0), 0)
  document.getElementById("totalLifetimeValue").textContent = formatCurrency(totalValue)
}

// Load renters
function loadRenters() {
  displayRenters(getAllRenters())
}

// Display renters
function displayRenters(renters) {
  const tbody = document.getElementById("rentersTableBody")
  if (!tbody) return

  if (renters.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px;">No renters found</td></tr>'
    return
  }

  tbody.innerHTML = renters
    .map((renter) => {
      const profile = renter.renterProfile || {}
      const reservations = getRenterReservations(renter.id)
      const totalSpent = reservations.reduce((sum, r) => sum + r.amount, 0)

      return `
            <tr>
                <td><strong>R${String(renter.id).padStart(3, "0")}</strong></td>
                <td>${renter.name}</td>
                <td>
                    <div>${renter.email}</div>
                    <div style="font-size: 12px; color: #6b7280;">${renter.phone}</div>
                </td>
                <td>${reservations.length}</td>
                <td>${formatCurrency(totalSpent || profile.totalSpent || 0)}</td>
                <td>${getRatingStars(profile.rating || 0)}</td>
                <td>${getVerificationBadge(profile.idVerified)}</td>
                <td>${getStatusBadge(profile.accountStatus || "active")}</td>
                <td>
                    <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="viewRenterDetails(${renter.id})">View</button>
                    ${
                      profile.accountStatus !== "blacklisted"
                        ? `<button class="btn btn-danger" style="padding: 6px 12px; font-size: 12px;" onclick="openBlacklistModal(${renter.id})">Blacklist</button>`
                        : `<button class="btn btn-success" style="padding: 6px 12px; font-size: 12px;" onclick="removeBlacklist(${renter.id})">Restore</button>`
                    }
                </td>
            </tr>
        `
    })
    .join("")
}

// Filter renters
function filterRenters() {
  const search = document.getElementById("searchRenters").value.toLowerCase()
  const statusFilter = document.getElementById("filterRenterStatus").value
  const ratingFilter = document.getElementById("filterRenterRating").value

  let renters = getAllRenters()

  if (search) {
    renters = renters.filter(
      (r) =>
        r.name.toLowerCase().includes(search) ||
        r.email.toLowerCase().includes(search) ||
        r.phone.toLowerCase().includes(search),
    )
  }

  if (statusFilter) {
    renters = renters.filter((r) => {
      const status = r.renterProfile ? r.renterProfile.accountStatus : "active"
      return status === statusFilter
    })
  }

  if (ratingFilter) {
    renters = renters.filter((r) => {
      const rating = r.renterProfile ? Number.parseFloat(r.renterProfile.rating) : 0
      switch (ratingFilter) {
        case "excellent":
          return rating === 5
        case "good":
          return rating >= 4
        case "average":
          return rating >= 3
        case "poor":
          return rating < 3
        default:
          return true
      }
    })
  }

  displayRenters(renters)
}

// View renter details
function viewRenterDetails(renterId) {
  const renter = getRenterById(renterId)
  if (!renter) return

  currentViewingRenterId = renterId
  const profile = renter.renterProfile || {}
  const reservations = getRenterReservations(renterId)
  const incidents = getRenterIncidents(renterId)
  const notes = getRenterNotes(renterId)

  // Update header
  document.getElementById("renterDetailName").textContent = renter.name

  // Personal Information
  document.getElementById("renterPersonalInfo").innerHTML = `
        <div style="background: #f9fafb; padding: 16px; border-radius: 8px;">
            <p style="margin-bottom: 12px;"><strong>Email:</strong> ${renter.email}</p>
            <p style="margin-bottom: 12px;"><strong>Phone:</strong> ${renter.phone}</p>
            <p style="margin-bottom: 12px;"><strong>Member Since:</strong> ${formatDate(profile.memberSince || renter.joined)}</p>
            <p style="margin-bottom: 12px;"><strong>ID Type:</strong> ${profile.idType || "Not Provided"}</p>
            <p style="margin-bottom: 12px;"><strong>ID Number:</strong> ${profile.idNumber || "Not Provided"}</p>
            <p style="margin-bottom: 12px;"><strong>ID Status:</strong> ${getVerificationBadge(profile.idVerified)}</p>
            <p style="margin-bottom: 0;"><strong>Account Status:</strong> ${getStatusBadge(profile.accountStatus || "active")}</p>
        </div>
    `

  // Rental Statistics
  const totalSpent = reservations.reduce((sum, r) => sum + r.amount, 0)
  const completedRentals = reservations.filter((r) => r.status === "completed").length
  const cancelledRentals = reservations.filter((r) => r.status === "cancelled").length

  document.getElementById("renterStats").innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div style="background: #f9fafb; padding: 16px; border-radius: 8px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #1e40af;">${reservations.length}</div>
                <div style="font-size: 12px; color: #6b7280;">Total Rentals</div>
            </div>
            <div style="background: #f9fafb; padding: 16px; border-radius: 8px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #10b981;">${formatCurrency(totalSpent)}</div>
                <div style="font-size: 12px; color: #6b7280;">Total Spent</div>
            </div>
            <div style="background: #f9fafb; padding: 16px; border-radius: 8px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #059669;">${completedRentals}</div>
                <div style="font-size: 12px; color: #6b7280;">Completed</div>
            </div>
            <div style="background: #f9fafb; padding: 16px; border-radius: 8px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #ef4444;">${cancelledRentals}</div>
                <div style="font-size: 12px; color: #6b7280;">Cancelled</div>
            </div>
        </div>
        <div style="margin-top: 16px; background: #f9fafb; padding: 16px; border-radius: 8px;">
            <p style="margin-bottom: 8px;"><strong>Customer Rating:</strong> ${getRatingStars(profile.rating || 0)}</p>
            <p style="margin-bottom: 0;"><strong>Last Rental:</strong> ${formatDate(profile.lastRentalDate)}</p>
        </div>
    `

  // Rental History Timeline
  const historyHtml =
    reservations.length > 0
      ? reservations
          .map((r) => {
            const vehicle = db.vehicles.find((v) => v.id === r.vehicleId)
            return `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <h4>${vehicle ? vehicle.model : "Vehicle #" + r.vehicleId}</h4>
                    <p>${formatDate(r.startDate)} - ${formatDate(r.endDate)} (${r.days} days)</p>
                    <p>Amount: ${formatCurrency(r.amount)}</p>
                    <div class="timeline-date">${getStatusBadge(r.status)}</div>
                </div>
            </div>
        `
          })
          .join("")
      : '<p style="color: #6b7280;">No rental history</p>'

  document.getElementById("renterRentalHistory").innerHTML = historyHtml

  // Incidents
  const incidentsHtml =
    incidents.length > 0
      ? incidents
          .map(
            (i) => `
        <div style="background: ${i.resolved ? "#f0fdf4" : "#fef2f2"}; padding: 12px; border-radius: 6px; margin-bottom: 8px; border-left: 4px solid ${i.resolved ? "#10b981" : "#ef4444"};">
            <div style="font-weight: 600;">${i.type.replace("-", " ").toUpperCase()}</div>
            <div style="font-size: 14px; color: #374151;">${i.description}</div>
            <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">
                ${formatDate(i.date)} - ${i.resolved ? "Resolved: " + i.resolution : "Pending"}
            </div>
        </div>
    `,
          )
          .join("")
      : '<p style="color: #6b7280;">No incidents recorded</p>'

  document.getElementById("renterIncidents").innerHTML = incidentsHtml

  // Notes
  const notesHtml =
    notes.length > 0
      ? notes
          .map(
            (n) => `
        <div style="background: #fffbeb; padding: 12px; border-radius: 6px; margin-bottom: 8px; border-left: 4px solid #f59e0b;">
            <div style="font-size: 14px; color: #374151;">${n.note}</div>
            <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">
                Added by ${n.addedBy} on ${formatDate(n.date)}
            </div>
        </div>
    `,
          )
          .join("")
      : '<p style="color: #6b7280;">No notes</p>'

  document.getElementById("renterNotes").innerHTML = notesHtml

  // Show panel
  document.getElementById("renterDetailsPanel").style.display = "block"
  document.getElementById("renterDetailsPanel").scrollIntoView({ behavior: "smooth" })
}

// Close renter details
function closeRenterDetails() {
  document.getElementById("renterDetailsPanel").style.display = "none"
  currentViewingRenterId = null
}

// Add renter note
function addRenterNote() {
  if (!currentViewingRenterId) return

  const noteText = document.getElementById("newRenterNote").value.trim()
  if (!noteText) {
    alert("Please enter a note")
    return
  }

  if (!db.renterNotes) db.renterNotes = []

  const newNote = {
    id: "NOTE" + String(db.renterNotes.length + 1).padStart(3, "0"),
    renterId: currentViewingRenterId,
    note: noteText,
    addedBy: "Admin",
    date: new Date().toISOString().split("T")[0],
  }

  db.renterNotes.push(newNote)
  saveDB()

  document.getElementById("newRenterNote").value = ""
  viewRenterDetails(currentViewingRenterId)
  alert("Note added successfully!")
}

// Open blacklist modal
function openBlacklistModal(renterId) {
  const renter = getRenterById(renterId)
  if (!renter) return

  blacklistingRenterId = renterId
  document.getElementById("blacklistRenterName").textContent = renter.name
  document.getElementById("blacklistForm").reset()
  document.getElementById("blacklistModal").classList.add("active")
}

// Close blacklist modal
function closeBlacklistModal() {
  document.getElementById("blacklistModal").classList.remove("active")
  blacklistingRenterId = null
}

// Confirm blacklist
function confirmBlacklist(e) {
  e.preventDefault()

  if (!blacklistingRenterId) return

  const renter = getRenterById(blacklistingRenterId)
  if (!renter) return

  const reason = document.getElementById("blacklistReason").value
  const details = document.getElementById("blacklistDetails").value

  // Update renter status
  if (!renter.renterProfile) {
    renter.renterProfile = {}
  }
  renter.renterProfile.accountStatus = "blacklisted"
  renter.renterProfile.blacklistDate = new Date().toISOString().split("T")[0]
  renter.renterProfile.blacklistReason = reason

  // Add incident
  if (!db.renterIncidents) db.renterIncidents = []
  db.renterIncidents.push({
    id: "INC" + String(db.renterIncidents.length + 1).padStart(3, "0"),
    renterId: blacklistingRenterId,
    type: "blacklist",
    description: "Account blacklisted. Reason: " + reason + ". Details: " + details,
    date: new Date().toISOString().split("T")[0],
    severity: "major",
    resolved: false,
  })

  saveDB()
  closeBlacklistModal()
  loadRenters()
  updateKPIs()
  alert("Renter has been blacklisted")
}

// Remove from blacklist
function removeBlacklist(renterId) {
  if (!confirm("Are you sure you want to restore this renter from blacklist?")) return

  const renter = getRenterById(renterId)
  if (!renter || !renter.renterProfile) return

  renter.renterProfile.accountStatus = "active"
  delete renter.renterProfile.blacklistDate
  delete renter.renterProfile.blacklistReason

  // Add note
  if (!db.renterNotes) db.renterNotes = []
  db.renterNotes.push({
    id: "NOTE" + String(db.renterNotes.length + 1).padStart(3, "0"),
    renterId: renterId,
    note: "Account restored from blacklist",
    addedBy: "Admin",
    date: new Date().toISOString().split("T")[0],
  })

  saveDB()
  loadRenters()
  updateKPIs()
  alert("Renter has been restored")
}

// Export renter data
function exportRenterData() {
  const renters = getAllRenters()
  const data = renters.map((r) => {
    const profile = r.renterProfile || {}
    const reservations = getRenterReservations(r.id)
    const totalSpent = reservations.reduce((sum, res) => sum + res.amount, 0)

    return {
      "Renter ID": "R" + String(r.id).padStart(3, "0"),
      Name: r.name,
      Email: r.email,
      Phone: r.phone,
      "Total Rentals": reservations.length,
      "Total Spent": totalSpent,
      Rating: profile.rating || "N/A",
      "ID Verified": profile.idVerified ? "Yes" : "No",
      Status: profile.accountStatus || "active",
      "Member Since": profile.memberSince || r.joined,
    }
  })

  // Convert to CSV
  const headers = Object.keys(data[0]).join(",")
  const rows = data.map((row) =>
    Object.values(row)
      .map((v) => '"' + v + '"')
      .join(","),
  )
  const csv = headers + "\n" + rows.join("\n")

  // Download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "renter-history-" + new Date().toISOString().split("T")[0] + ".csv"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  alert("Data exported successfully!")
}

// Logout function
function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "/client/pages/login.html"
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", initRenterHistory)
