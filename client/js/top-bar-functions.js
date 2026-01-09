// Toggle Notification Panel
document.addEventListener("DOMContentLoaded", () => {
  const notificationBtn = document.getElementById("notificationBell")
  const notificationPanel = document.getElementById("notificationPanel")
  const settingsBtn = document.getElementById("settingsBtn")
  const settingsPanel = document.getElementById("settingsPanel")
  const profileBtn = document.getElementById("profileBtn")
  const profilePanel = document.getElementById("profilePanel")

  if (notificationBtn) {
    notificationBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      closeSettings()
      closeProfile()
      notificationPanel.classList.toggle("active")
    })
  }

  if (settingsBtn) {
    settingsBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      closeNotifications()
      closeProfile()
      settingsPanel.classList.toggle("active")
    })
  }

  if (profileBtn) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      closeNotifications()
      closeSettings()
      profilePanel.classList.toggle("active")
    })
  }

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(".notification-container") &&
      !e.target.closest(".settings-container") &&
      !e.target.closest(".user-profile-container")
    ) {
      closeNotifications()
      closeSettings()
      closeProfile()
    }
  })

  // Load user data
  loadUserData()
  loadNotifications()
  setupSettings()
})

// Close Notification Panel
function closeNotifications() {
  const notificationPanel = document.getElementById("notificationPanel")
  if (notificationPanel) {
    notificationPanel.classList.remove("active")
  }
}

// Close Settings Panel
function closeSettings() {
  const settingsPanel = document.getElementById("settingsPanel")
  if (settingsPanel) {
    settingsPanel.classList.remove("active")
  }
}

// Close Profile Panel
function closeProfile() {
  const profilePanel = document.getElementById("profilePanel")
  if (profilePanel) {
    profilePanel.classList.remove("active")
  }
}

// View All Notifications
function viewAllNotifications() {
  alert("Viewing all notifications...")
  closeNotifications()
}

// Open Account Settings
function openAccountSettings(e) {
  e.preventDefault()
  alert("Opening Account Settings...")
  closeSettings()
}

// Open Privacy & Security
function openPrivacy(e) {
  e.preventDefault()
  alert("Opening Privacy & Security settings...")
  closeSettings()
}

// Open Help & Support
function openHelp(e) {
  e.preventDefault()
  alert("Opening Help & Support...")
  closeSettings()
}

// View Profile
function viewProfile(e) {
  e.preventDefault()
  alert("Viewing profile...")
  closeProfile()
}

// Edit Profile
function editProfile(e) {
  e.preventDefault()
  alert("Opening profile editor...")
  closeProfile()
}

// Change Password
function changePassword(e) {
  e.preventDefault()
  alert("Opening password change dialog...")
  closeProfile()
}

// Logout
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("currentUser")
    window.location.href = "../../pages/login.html?role=client"
  }
}

// Load User Data
function loadUserData() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  if (currentUser) {
    const username = document.getElementById("currentUsername")
    const profileUsername = document.querySelector("#profileUsername")
    const profileName = document.querySelector("#profileName")

    if (username) {
      username.textContent = currentUser.username
    }
    if (profileUsername) {
      profileUsername.textContent = currentUser.username
    }
    if (profileName) {
      profileName.textContent = currentUser.fullName || "Client User"
    }
  }
}

// Load Notifications
function loadNotifications() {
  const notificationBadge = document.getElementById("notificationBadge")
  if (notificationBadge) {
    notificationBadge.textContent = notificationBadge.textContent || "0"
  }
}

// Setup Settings
function setupSettings() {
  const emailNotifications = document.getElementById("emailNotifications")
  const darkMode = document.getElementById("darkMode")
  const soundAlerts = document.getElementById("soundAlerts")

  if (emailNotifications) {
    emailNotifications.addEventListener("change", function () {
      localStorage.setItem("emailNotifications", this.checked)
    })
  }

  if (darkMode) {
    darkMode.addEventListener("change", function () {
      localStorage.setItem("darkMode", this.checked)
      if (this.checked) {
        document.body.classList.add("dark-mode")
      } else {
        document.body.classList.remove("dark-mode")
      }
    })
  }

  if (soundAlerts) {
    soundAlerts.addEventListener("change", function () {
      localStorage.setItem("soundAlerts", this.checked)
    })
  }

  // Restore saved settings
  if (localStorage.getItem("emailNotifications")) {
    emailNotifications.checked = JSON.parse(localStorage.getItem("emailNotifications"))
  }
  if (localStorage.getItem("darkMode")) {
    darkMode.checked = JSON.parse(localStorage.getItem("darkMode"))
  }
  if (localStorage.getItem("soundAlerts")) {
    soundAlerts.checked = JSON.parse(localStorage.getItem("soundAlerts"))
  }
}