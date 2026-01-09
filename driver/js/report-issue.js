// Declare driverDB variable or import it here
const driverDB = {
  getCurrentDriver: () => {
    // Mock implementation
    return { id: 1, fullname: "John Doe" }
  },
  getBookingsByDriver: (driverId) => {
    // Mock implementation
    return [
      { id: 101, vehicleName: "Car A" },
      { id: 102, vehicleName: "Car B" },
    ]
  },
  bookings: [
    { id: 101, vehicleId: 201 },
    { id: 102, vehicleId: 202 },
  ],
  reportIssue: (issueData) => {
    // Mock implementation
    return { id: 301, ...issueData }
  },
  getIssuesByDriver: (driverId) => {
    // Mock implementation
    return [
      {
        id: 301,
        bookingId: 101,
        vehicleId: 201,
        severity: "high",
        category: "engine",
        description: "Engine noise",
        location: "Main Street",
        immediateAction: "Checked oil level",
        status: "pending",
        timestamp: new Date().toISOString(),
      },
    ]
  },
  logout: () => {
    // Mock implementation
    console.log("Logged out")
  },
}

document.addEventListener("DOMContentLoaded", () => {
  initializeReportIssue()
})

function initializeReportIssue() {
  const driver = driverDB.getCurrentDriver()

  if (!driver) {
    window.location.href = "../../index.html"
    return
  }

  document.getElementById("driverName").textContent = driver.fullname

  // Load bookings
  loadBookingsForIssueReport()

  // Setup form handler
  setupReportFormHandler(driver)

  // Load previous reports
  loadPreviousReports(driver)

  // Setup logout
  setupLogout()
}

function loadBookingsForIssueReport() {
  const driver = driverDB.getCurrentDriver()
  const bookings = driverDB.getBookingsByDriver(driver.id)

  const bookingSelect = document.getElementById("bookingId")

  bookings.forEach((booking) => {
    const option = document.createElement("option")
    option.value = booking.id
    option.textContent = `${booking.id} - ${booking.vehicleName}`
    bookingSelect.appendChild(option)
  })

  // Handle vehicle auto-populate
  bookingSelect.addEventListener("change", function () {
    const selected = bookings.find((b) => b.id === this.value)
    if (selected) {
      document.getElementById("vehicleId").value = selected.vehicleName
    }
  })
}

function setupReportFormHandler(driver) {
  document.getElementById("reportForm").addEventListener("submit", (e) => {
    e.preventDefault()

    const bookingId = document.getElementById("bookingId").value
    const severity = document.getElementById("issueSeverity").value
    const category = document.getElementById("issueCategory").value
    const description = document.getElementById("issueDescription").value
    const location = document.getElementById("location").value
    const immediateAction = document.getElementById("immediateAction").value

    if (!bookingId || !severity || !category || !description || !location) {
      alert("Please fill in all required fields")
      return
    }

    const booking = driverDB.bookings.find((b) => b.id === bookingId)

    const issueData = {
      driverId: driver.id,
      bookingId: bookingId,
      vehicleId: booking.vehicleId,
      severity: severity,
      category: category,
      description: description,
      location: location,
      immediateAction: immediateAction,
    }

    const issue = driverDB.reportIssue(issueData)

    alert(`Issue reported successfully! Issue ID: ${issue.id}`)
    document.getElementById("reportForm").reset()
    loadPreviousReports(driver)
  })
}

function loadPreviousReports(driver) {
  const issues = driverDB.getIssuesByDriver(driver.id)
  const container = document.getElementById("reportsList")

  if (issues.length === 0) {
    container.innerHTML = `<p class="empty-state">No issues reported yet</p>`
    return
  }

  container.innerHTML = issues
    .map(
      (issue) => `
    <div class="section" style="margin: 1rem 0;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div>
          <p><strong>Issue ID:</strong> ${issue.id}</p>
          <p><strong>Booking:</strong> ${issue.bookingId}</p>
          <p><strong>Category:</strong> ${issue.category}</p>
        </div>
        <div>
          <p><strong>Severity:</strong> <span class="badge badge-${issue.severity}">${issue.severity.toUpperCase()}</span></p>
          <p><strong>Status:</strong> ${issue.status}</p>
          <p><strong>Date:</strong> ${issue.timestamp}</p>
        </div>
      </div>
      <p style="margin-top: 1rem;"><strong>Description:</strong> ${issue.description}</p>
      <p><strong>Location:</strong> ${issue.location}</p>
      <p><strong>Action Taken:</strong> ${issue.immediateAction || "N/A"}</p>
    </div>
  `,
    )
    .join("")
}

function setupLogout() {
  const logoutBtn = document.querySelector(".logout-btn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout)
  }
}

function handleLogout() {
  if (confirm("Are you sure you want to logout?")) {
    driverDB.logout()
    window.location.href = "../../index.html"
  }
}
