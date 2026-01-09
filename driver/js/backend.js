// Mock Database for Driver Interface
const driverDB = {
  // Current logged-in driver
  currentDriver: null,

  // Registered drivers
  drivers: {
    driver1: {
      id: "DRV001",
      username: "driver1",
      password: "password123",
      fullname: "Juan Dela Cruz",
      email: "juan@email.com",
      phone: "09123456789",
      address: "123 Driver St, Manila",
      licenseNumber: "DL-12345678",
      licenseExpiry: "2026-12-31",
      licenseType: "Manual",
      emergencyName: "Maria Dela Cruz",
      emergencyPhone: "09111111111",
      emergencyRelation: "Sister",
      role: "driver",
      memberSince: "2024-01-15",
      status: "Active",
    },
    demo_driver: {
      id: "DRV002",
      username: "demo_driver",
      password: "demo123",
      fullname: "Demo Driver",
      email: "demo@email.com",
      phone: "09987654321",
      address: "456 Driver Ave, Cebu",
      licenseNumber: "DL-87654321",
      licenseExpiry: "2025-12-31",
      licenseType: "Manual",
      emergencyName: "Demo Contact",
      emergencyPhone: "09222222222",
      emergencyRelation: "Friend",
      role: "driver",
      memberSince: "2024-03-20",
      status: "Active",
    },
  },

  // Driver Bookings
  bookings: [
    {
      id: "BK001",
      driverId: "DRV001",
      vehicleId: "VEH001",
      vehicleName: "125cc Honda",
      clientName: "John Doe",
      bookingDate: "2026-01-08",
      startDate: "2026-01-08",
      endDate: "2026-01-10",
      status: "active",
      pickupLocation: "Main Branch",
      dropoffLocation: "Airport",
      totalAmount: 1500,
    },
    {
      id: "BK002",
      driverId: "DRV001",
      vehicleId: "VEH002",
      vehicleName: "150cc Suzuki",
      clientName: "Jane Smith",
      bookingDate: "2026-01-09",
      startDate: "2026-01-10",
      endDate: "2026-01-12",
      status: "pending",
      pickupLocation: "Main Branch",
      dropoffLocation: "Hotel",
      totalAmount: 1800,
    },
    {
      id: "BK003",
      driverId: "DRV001",
      vehicleId: "VEH003",
      vehicleName: "Honda Civic",
      clientName: "Robert Johnson",
      bookingDate: "2026-01-07",
      startDate: "2026-01-05",
      endDate: "2026-01-07",
      status: "completed",
      pickupLocation: "Main Branch",
      dropoffLocation: "City Center",
      totalAmount: 5000,
    },
  ],

  // Vehicle Fleet
  vehicles: [
    {
      id: "VEH001",
      name: "125cc Honda",
      type: "motorcycle",
      model: "CB125",
      year: 2024,
      specs: "125cc, 4-stroke",
      dailyRate: 500,
      availability: "available",
    },
    {
      id: "VEH002",
      name: "150cc Suzuki",
      type: "motorcycle",
      model: "GSX-S150",
      year: 2023,
      specs: "150cc, 4-stroke",
      dailyRate: 600,
      availability: "available",
    },
    {
      id: "VEH003",
      name: "Honda Civic",
      type: "sedan",
      model: "Civic 2024",
      year: 2024,
      specs: "2.0L, Auto",
      dailyRate: 2500,
      availability: "available",
    },
  ],

  // Check In/Out Records
  checkInOutRecords: [
    {
      id: "CHK001",
      bookingId: "BK001",
      vehicleId: "VEH001",
      type: "checkout",
      mileage: 5000,
      fuel: "full",
      condition: "Good condition, no damages",
      timestamp: "2026-01-08 08:00 AM",
    },
    {
      id: "CHK002",
      bookingId: "BK001",
      vehicleId: "VEH001",
      type: "checkin",
      mileage: 5050,
      fuel: "3/4",
      condition: "Good condition, no new damages",
      timestamp: "2026-01-10 05:30 PM",
    },
  ],

  // Driver Issues
  issues: [
    {
      id: "ISS001",
      driverId: "DRV001",
      bookingId: "BK001",
      vehicleId: "VEH001",
      severity: "medium",
      category: "electrical",
      description: "Headlight flickering occasionally",
      location: "Main Branch",
      immediateAction: "Reduced speed, used backup light",
      status: "reported",
      timestamp: "2026-01-08 10:30 AM",
    },
  ],

  // Authentication Methods
  login: function (username, password, role) {
    if (role === "driver") {
      const driver = this.drivers[username]
      if (driver && driver.password === password) {
        this.currentDriver = driver
        return { success: true, driver: driver }
      }
    }
    return { success: false, error: "Invalid credentials" }
  },

  logout: function () {
    this.currentDriver = null
  },

  // Get Driver Methods
  getCurrentDriver: function () {
    return this.currentDriver
  },

  getBookingsByDriver: function (driverId, status = null) {
    let filtered = this.bookings.filter((b) => b.driverId === driverId)
    if (status) {
      filtered = filtered.filter((b) => b.status === status)
    }
    return filtered
  },

  getVehicleById: function (vehicleId) {
    return this.vehicles.find((v) => v.id === vehicleId)
  },

  // Check In/Out Methods
  addCheckInOut: function (checkInOutData) {
    const id = "CHK" + String(this.checkInOutRecords.length + 1).padStart(3, "0")
    const record = {
      id: id,
      ...checkInOutData,
      timestamp: new Date().toLocaleString(),
    }
    this.checkInOutRecords.push(record)
    return record
  },

  getCheckInOutRecords: function (vehicleId = null) {
    if (vehicleId) {
      return this.checkInOutRecords.filter((r) => r.vehicleId === vehicleId)
    }
    return this.checkInOutRecords
  },

  // Issue Reporting Methods
  reportIssue: function (issueData) {
    const id = "ISS" + String(this.issues.length + 1).padStart(3, "0")
    const issue = {
      id: id,
      ...issueData,
      status: "reported",
      timestamp: new Date().toLocaleString(),
    }
    this.issues.push(issue)
    return issue
  },

  getIssuesByDriver: function (driverId) {
    return this.issues.filter((i) => i.driverId === driverId)
  },

  // Profile Update Method
  updateDriverProfile: function (driverId, updates) {
    if (this.drivers[driverId]) {
      this.drivers[driverId] = {
        ...this.drivers[driverId],
        ...updates,
      }
      this.currentDriver = this.drivers[driverId]
      return this.drivers[driverId]
    }
    return null
  },

  // KPI Methods
  getTodayBookingsCount: function (driverId) {
    const today = new Date().toISOString().split("T")[0]
    return this.bookings.filter((b) => b.driverId === driverId && b.bookingDate === today).length
  },

  getActiveBooking: function (driverId) {
    return this.bookings.find((b) => b.driverId === driverId && b.status === "active")
  },

  getPendingCheckIns: function (driverId) {
    const activeBooking = this.getActiveBooking(driverId)
    if (!activeBooking) return 0
    const checkIn = this.checkInOutRecords.find((r) => r.bookingId === activeBooking.id && r.type === "checkin")
    return checkIn ? 0 : 1
  },
}
