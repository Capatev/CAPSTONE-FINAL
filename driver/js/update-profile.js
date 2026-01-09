// Import or declare the driverDB variable here
const driverDB = {
  getCurrentDriver: () => {
    // Mock implementation
    return {
      id: 1,
      fullname: "John Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
      address: "123 Main St",
      licenseNumber: "XYZ123",
      licenseExpiry: "2025-12-31",
      licenseType: "A",
      emergencyName: "Jane Doe",
      emergencyPhone: "0987654321",
      emergencyRelation: "Spouse",
      password: "password123",
    }
  },
  updateDriverProfile: (driverId, updates) => {
    // Mock implementation
    console.log("Updating driver profile with ID:", driverId, "and updates:", updates)
    return true // Simulate successful update
  },
  logout: () => {
    // Mock implementation
    console.log("Logging out driver")
  },
}

document.addEventListener("DOMContentLoaded", () => {
  initializeProfileUpdate()
})

function initializeProfileUpdate() {
  const driver = driverDB.getCurrentDriver()

  if (!driver) {
    window.location.href = "../../index.html"
    return
  }

  document.getElementById("driverName").textContent = driver.fullname

  // Load profile data
  loadProfileData(driver)

  // Setup form handlers
  setupFormHandlers(driver)

  // Setup logout
  setupLogout()
}

function loadProfileData(driver) {
  document.getElementById("fullName").value = driver.fullname
  document.getElementById("email").value = driver.email
  document.getElementById("phone").value = driver.phone
  document.getElementById("address").value = driver.address
  document.getElementById("licenseNumber").value = driver.licenseNumber
  document.getElementById("licenseExpiry").value = driver.licenseExpiry
  document.getElementById("licenseType").value = driver.licenseType
  document.getElementById("emergencyName").value = driver.emergencyName || ""
  document.getElementById("emergencyPhone").value = driver.emergencyPhone || ""
  document.getElementById("emergencyRelation").value = driver.emergencyRelation || ""
}

function setupFormHandlers(driver) {
  // Profile form
  document.getElementById("profileForm").addEventListener("submit", (e) => {
    e.preventDefault()

    const updates = {
      fullname: document.getElementById("fullName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      licenseExpiry: document.getElementById("licenseExpiry").value,
      licenseType: document.getElementById("licenseType").value,
      emergencyName: document.getElementById("emergencyName").value,
      emergencyPhone: document.getElementById("emergencyPhone").value,
      emergencyRelation: document.getElementById("emergencyRelation").value,
    }

    const updated = driverDB.updateDriverProfile(driver.id, updates)

    if (updated) {
      alert("Profile updated successfully!")
    } else {
      alert("Failed to update profile")
    }
  })

  // Password form
  document.getElementById("passwordForm").addEventListener("submit", (e) => {
    e.preventDefault()

    const currentPassword = document.getElementById("currentPassword").value
    const newPassword = document.getElementById("newPassword").value
    const confirmPassword = document.getElementById("confirmPassword").value

    if (currentPassword !== driver.password) {
      alert("Current password is incorrect")
      return
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters")
      return
    }

    driverDB.updateDriverProfile(driver.id, { password: newPassword })
    alert("Password changed successfully!")
    document.getElementById("passwordForm").reset()
  })

  // Photo upload
  document.getElementById("uploadPhotoBtn").addEventListener("click", () => {
    document.getElementById("photoInput").click()
  })

  document.getElementById("photoInput").addEventListener("change", (e) => {
    const file = e.target.files[0]
    if (file) {
      alert("Profile photo updated successfully!")
    }
  })
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
