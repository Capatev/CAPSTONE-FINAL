// Shared Utilities

// Modal Functions
function openModal(modalId) {
  document.getElementById(modalId).classList.add("active")
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active")
}

// Close modal when clicking outside
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    e.target.classList.remove("active")
  }
})

// Format Currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount)
}

// Format Date
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Get Status Badge HTML
function getStatusBadge(status) {
  const badges = {
    active: '<span class="badge badge-success">Active</span>',
    rented: '<span class="badge badge-primary">Rented</span>',
    available: '<span class="badge badge-success">Available</span>',
    maintenance: '<span class="badge badge-warning">Maintenance</span>',
    damaged: '<span class="badge badge-danger">Damaged</span>',
    completed: '<span class="badge badge-success">Completed</span>',
    pending: '<span class="badge badge-warning">Pending</span>',
    paid: '<span class="badge badge-success">Paid</span>',
    failed: '<span class="badge badge-danger">Failed</span>',
    inactive: '<span class="badge badge-danger">Inactive</span>',
    suspended: '<span class="badge badge-danger">Suspended</span>',
    cancelled: '<span class="badge badge-danger">Cancelled</span>',
  }
  return badges[status] || `<span class="badge badge-info">${status}</span>`
}

// Simple Chart Library
class SimpleCharts {
  static drawLineChart(canvasId, labels, data, title = "") {
    const canvas = document.getElementById(canvasId)
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const padding = 50
    const width = canvas.width - 2 * padding
    const height = canvas.height - 2 * padding

    // Clear canvas
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw axes
    ctx.strokeStyle = "#ccc"
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.stroke()

    // Find min and max
    const maxValue = Math.max(...data)
    const minValue = Math.min(...data)
    const range = maxValue - minValue || 1

    // Draw line
    ctx.strokeStyle = "#1e40af"
    ctx.lineWidth = 2
    ctx.beginPath()

    data.forEach((value, index) => {
      const x = padding + (index / (data.length - 1 || 1)) * width
      const y = canvas.height - padding - ((value - minValue) / range) * height

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw points
    ctx.fillStyle = "#1e40af"
    data.forEach((value, index) => {
      const x = padding + (index / (data.length - 1 || 1)) * width
      const y = canvas.height - padding - ((value - minValue) / range) * height
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw labels
    ctx.fillStyle = "#666"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    labels.forEach((label, index) => {
      const x = padding + (index / (labels.length - 1 || 1)) * width
      ctx.fillText(label, x, canvas.height - padding + 20)
    })
  }

  static drawPieChart(canvasId, labels, data, title = "") {
    const canvas = document.getElementById(canvasId)
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(canvas.width, canvas.height) / 2 - 30

    // Clear canvas
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Colors
    const colors = ["#1e40af", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

    const total = data.reduce((a, b) => a + b, 0)
    let currentAngle = -Math.PI / 2

    data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI

      ctx.fillStyle = colors[index % colors.length]
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.closePath()
      ctx.fill()

      // Draw label
      const labelAngle = currentAngle + sliceAngle / 2
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.6)
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.6)

      ctx.fillStyle = "#fff"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`${Math.round((value / total) * 100)}%`, labelX, labelY)

      currentAngle += sliceAngle
    })

    // Legend
    ctx.fillStyle = "#333"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "left"
    labels.forEach((label, index) => {
      ctx.fillStyle = colors[index % colors.length]
      ctx.fillRect(canvas.width - 140, 20 + index * 20, 12, 12)
      ctx.fillStyle = "#333"
      ctx.fillText(label, canvas.width - 120, 30 + index * 20)
    })
  }
}

// Export to CSV
function exportToCSV(data, filename) {
  if (!data || data.length === 0) return

  const headers = Object.keys(data[0])
  let csv = headers.join(",") + "\n"

  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header]
      return typeof value === "string" && value.includes(",") ? `"${value}"` : value
    })
    csv += values.join(",") + "\n"
  })

  const blob = new Blob([csv], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename || "export.csv"
  a.click()
}

// Show notification
function showNotification(message, type = "success") {
  const notification = document.createElement("div")
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 6px;
        color: white;
        font-weight: 600;
        z-index: 2000;
        animation: slideIn 0.3s ease;
        background-color: ${type === "success" ? "#10b981" : "#ef4444"};
    `
  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease"
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

// Add animation styles
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)

// Logout functionality
document.querySelectorAll(".logout-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (confirm("Are you sure you want to logout?")) {
      alert("You have been logged out.")
    }
  })
})
