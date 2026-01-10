/**
 * MVRS Driver Backend - PHP Database Integration
 */

// API Configuration
const API_BASE_URL = "../php/api"

// API Request Helper
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}/${endpoint}`

  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  }

  if (options.body) {
    config.body = JSON.stringify(options.body)
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()
    return data
  } catch (error) {
    console.error("API Error:", error)
    return { success: false, message: error.message }
  }
}

// Mock Database for Driver Interface (loaded from API)
const driverDB = {
  currentDriver: null,
  drivers: {},
  bookings: [],
  vehicles: [],
  checkInOutRecords: [],
  issues: [],

  // Authentication Methods
  async login(username, password, role) {
    if (role !== "driver") {
      return { success: false, error: "Invalid role" }
    }

    const response = await apiRequest("auth.php?action=login", {
      method: "POST",
      body: { username, password, role: "driver" },
    })

    if (response.success) {
      this.currentDriver = response.data
      localStorage.setItem("mvrms_user", JSON.stringify(response.data))
      return { success: true, driver: response.data }
    }

    return { success: false, error: response.message || "Invalid credentials" }
  },

  async logout() {
    this.currentDriver = null
    localStorage.removeItem("mvrms_user")
    await apiRequest("auth.php?action=logout", { method: "POST" })
  },

  // Get Driver Methods
  getCurrentDriver() {
    if (!this.currentDriver) {
      const stored = localStorage.getItem("mvrms_user")
      if (stored) {
        this.currentDriver = JSON.parse(stored)
      }
    }
    return this.currentDriver
  },

  async loadDriverData() {
    const driver = this.getCurrentDriver()
    if (!driver) return

    // Load bookings assigned to this driver
    const bookingsRes = await apiRequest(`reservations.php?driver_id=${driver.id}`)
    if (bookingsRes.success) {
      this.bookings = (bookingsRes.data || []).map((r) => ({
        id: r.reservation_code,
        dbId: r.id,
        driverId: driver.id,
        vehicleId: r.vehicle_id,
        vehicleName: `${r.vehicle_plate} - ${r.vehicle_model}`,
        clientName: r.user_name,
        bookingDate: r.created_at?.split("T")[0],
        startDate: r.start_date,
        endDate: r.end_date,
        status: r.status,
        pickupLocation: r.pickup_location,
        dropoffLocation: r.dropoff_location,
        totalAmount: Number.parseFloat(r.total_amount),
      }))
    }

    // Load vehicles
    const vehiclesRes = await apiRequest("vehicles.php")
    if (vehiclesRes.success) {
      this.vehicles = (vehiclesRes.data || []).map((v) => ({
        id: v.id,
        name: v.model,
        type: v.type,
        model: v.model,
        year: v.year,
        specs: v.specs,
        dailyRate: Number.parseFloat(v.daily_rate),
        availability: v.status,
        plate: v.plate,
      }))
    }

    // Load check records
    const checkRes = await apiRequest("check-records.php")
    if (checkRes.success) {
      this.checkInOutRecords = (checkRes.data || []).map((c) => ({
        id: c.record_code,
        dbId: c.id,
        bookingId: c.reservation_id,
        vehicleId: c.vehicle_id,
        type: c.type,
        mileage: c.mileage,
        fuel: c.fuel_level,
        condition: c.vehicle_condition,
        timestamp: c.recorded_at,
      }))
    }

    // Load issues reported by this driver
    const issuesRes = await apiRequest(`issues.php?reporter_id=${driver.id}`)
    if (issuesRes.success) {
      this.issues = (issuesRes.data || []).map((i) => ({
        id: i.issue_code,
        dbId: i.id,
        driverId: i.reporter_id,
        bookingId: i.reservation_id,
        vehicleId: i.vehicle_id,
        severity: i.severity,
        category: i.category,
        description: i.description,
        location: i.location,
        immediateAction: i.immediate_action,
        status: i.status,
        timestamp: i.created_at,
      }))
    }
  },

  getBookingsByDriver(driverId, status = null) {
    let filtered = this.bookings.filter((b) => b.driverId == driverId)
    if (status) {
      filtered = filtered.filter((b) => b.status === status)
    }
    return filtered
  },

  getVehicleById(vehicleId) {
    return this.vehicles.find((v) => v.id == vehicleId)
  },

  // Check In/Out Methods
  async addCheckInOut(checkInOutData) {
    const response = await apiRequest("check-records.php", {
      method: "POST",
      body: {
        reservation_id: checkInOutData.bookingId,
        vehicle_id: checkInOutData.vehicleId,
        driver_id: this.currentDriver?.id,
        type: checkInOutData.type,
        mileage: checkInOutData.mileage,
        fuel_level: checkInOutData.fuel,
        vehicle_condition: checkInOutData.condition,
      },
    })

    if (response.success) {
      await this.loadDriverData()
      return {
        id: response.data.record_code,
        ...checkInOutData,
        timestamp: new Date().toLocaleString(),
      }
    }
    return null
  },

  getCheckInOutRecords(vehicleId = null) {
    if (vehicleId) {
      return this.checkInOutRecords.filter((r) => r.vehicleId == vehicleId)
    }
    return this.checkInOutRecords
  },

  // Issue Reporting Methods
  async reportIssue(issueData) {
    const response = await apiRequest("issues.php", {
      method: "POST",
      body: {
        reporter_id: this.currentDriver?.id || issueData.driverId,
        vehicle_id: issueData.vehicleId,
        reservation_id: issueData.bookingId,
        severity: issueData.severity,
        category: issueData.category,
        description: issueData.description,
        location: issueData.location,
        immediate_action: issueData.immediateAction,
      },
    })

    if (response.success) {
      await this.loadDriverData()
      return {
        id: response.data.issue_code,
        ...issueData,
        status: "reported",
        timestamp: new Date().toLocaleString(),
      }
    }
    return null
  },

  getIssuesByDriver(driverId) {
    return this.issues.filter((i) => i.driverId == driverId)
  },

  // Profile Update Method
  async updateDriverProfile(driverId, updates) {
    const response = await apiRequest(`users.php?id=${driverId}`, {
      method: "PUT",
      body: {
        name: updates.fullname,
        email: updates.email,
        phone: updates.phone,
        address: updates.address,
        license_number: updates.licenseNumber,
        license_expiry: updates.licenseExpiry,
        license_type: updates.licenseType,
        emergency_name: updates.emergencyName,
        emergency_phone: updates.emergencyPhone,
        emergency_relation: updates.emergencyRelation,
      },
    })

    if (response.success) {
      // Update local driver data
      if (this.currentDriver) {
        Object.assign(this.currentDriver, updates)
        localStorage.setItem("mvrms_user", JSON.stringify(this.currentDriver))
      }
      return this.currentDriver
    }
    return null
  },

  // KPI Methods
  getTodayBookingsCount(driverId) {
    const today = new Date().toISOString().split("T")[0]
    return this.bookings.filter((b) => b.driverId == driverId && b.bookingDate === today).length
  },

  getActiveBooking(driverId) {
    return this.bookings.find((b) => b.driverId == driverId && b.status === "active")
  },

  getPendingCheckIns(driverId) {
    const activeBooking = this.getActiveBooking(driverId)
    if (!activeBooking) return 0
    const checkIn = this.checkInOutRecords.find((r) => r.bookingId === activeBooking.dbId && r.type === "checkin")
    return checkIn ? 0 : 1
  },
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", async () => {
  const driver = driverDB.getCurrentDriver()
  if (driver) {
    await driverDB.loadDriverData()
  }
  console.log("Driver backend initialized with PHP API")
})
