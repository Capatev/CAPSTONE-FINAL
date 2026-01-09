// MVRS Backend Database
const db = {
  vehicles: [
    {
      id: 1,
      plate: "ABC-1234",
      model: "Toyota Corolla",
      type: "sedan",
      year: 2022,
      mileage: 15000,
      status: "available",
      dailyRate: 1500,
      totalRentals: 45,
    },
    {
      id: 2,
      plate: "ABC-1235",
      model: "Honda CR-V",
      type: "suv",
      year: 2023,
      mileage: 8000,
      status: "rented",
      dailyRate: 2000,
      totalRentals: 32,
    },
    {
      id: 3,
      plate: "ABC-1236",
      model: "Toyota Innova",
      type: "van",
      year: 2022,
      mileage: 22000,
      status: "available",
      dailyRate: 2500,
      totalRentals: 68,
    },
    {
      id: 4,
      plate: "ABC-1237",
      model: "Mitsubishi Montero",
      type: "suv",
      year: 2021,
      mileage: 35000,
      status: "maintenance",
      dailyRate: 2200,
      totalRentals: 55,
    },
    {
      id: 5,
      plate: "ABC-1238",
      model: "Ford Ranger",
      type: "truck",
      year: 2022,
      mileage: 12000,
      status: "available",
      dailyRate: 1800,
      totalRentals: 28,
    },
    {
      id: 6,
      plate: "ABC-1239",
      model: "BMW 3 Series",
      type: "sports",
      year: 2023,
      mileage: 3000,
      status: "rented",
      dailyRate: 3500,
      totalRentals: 15,
    },
  ],

  users: [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      phone: "09123456789",
      role: "admin",
      status: "active",
      joined: "2023-01-15",
    },
    {
      id: 2,
      name: "Maria Garcia",
      email: "maria@example.com",
      phone: "09123456790",
      role: "customer",
      status: "active",
      joined: "2023-02-20",
    },
    {
      id: 3,
      name: "Robert Martinez",
      email: "robert@example.com",
      phone: "09123456791",
      role: "staff",
      status: "active",
      joined: "2023-03-10",
    },
    {
      id: 4,
      name: "Jennifer Lee",
      email: "jennifer@example.com",
      phone: "09123456792",
      role: "customer",
      status: "active",
      joined: "2023-04-05",
    },
    {
      id: 5,
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "09123456793",
      role: "admin",
      status: "active",
      joined: "2023-01-01",
    },
    {
      id: 6,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "09123456794",
      role: "customer",
      status: "inactive",
      joined: "2022-12-25",
    },
  ],

  reservations: [
    {
      id: "RES001",
      userId: 2,
      vehicleId: 1,
      startDate: "2025-01-10",
      endDate: "2025-01-15",
      days: 5,
      amount: 7500,
      status: "active",
    },
    {
      id: "RES002",
      userId: 4,
      vehicleId: 2,
      startDate: "2025-01-08",
      endDate: "2025-01-20",
      days: 12,
      amount: 24000,
      status: "active",
    },
    {
      id: "RES003",
      userId: 2,
      vehicleId: 3,
      startDate: "2025-01-01",
      endDate: "2025-01-08",
      days: 7,
      amount: 17500,
      status: "completed",
    },
    {
      id: "RES004",
      userId: 4,
      vehicleId: 5,
      startDate: "2025-01-05",
      endDate: "2025-01-07",
      days: 2,
      amount: 3600,
      status: "completed",
    },
    {
      id: "RES005",
      userId: 2,
      vehicleId: 6,
      startDate: "2025-01-12",
      endDate: "2025-01-18",
      days: 6,
      amount: 21000,
      status: "pending",
    },
    {
      id: "RES006",
      userId: 4,
      vehicleId: 1,
      startDate: "2024-12-20",
      endDate: "2024-12-27",
      days: 7,
      amount: 10500,
      status: "completed",
    },
  ],

  pricing: [
    { id: 1, tierName: "Economy", dailyRate: 1500, weeklyRate: 9000, monthlyRate: 35000 },
    { id: 2, tierName: "Standard", dailyRate: 2000, weeklyRate: 12000, monthlyRate: 45000 },
    { id: 3, tierName: "Premium", dailyRate: 3500, weeklyRate: 21000, monthlyRate: 80000 },
  ],

  billing: [
    {
      id: "INV001",
      userId: 2,
      amount: 7500,
      date: "2025-01-15",
      dueDate: "2025-01-20",
      status: "paid",
      paymentMethod: "card",
    },
    {
      id: "INV002",
      userId: 4,
      amount: 24000,
      date: "2025-01-08",
      dueDate: "2025-01-15",
      status: "paid",
      paymentMethod: "transfer",
    },
    {
      id: "INV003",
      userId: 2,
      amount: 17500,
      date: "2025-01-08",
      dueDate: "2025-01-15",
      status: "paid",
      paymentMethod: "cash",
    },
    {
      id: "INV004",
      userId: 4,
      amount: 3600,
      date: "2025-01-07",
      dueDate: "2025-01-12",
      status: "pending",
      paymentMethod: "card",
    },
    {
      id: "INV005",
      userId: 2,
      amount: 21000,
      date: "2025-01-18",
      dueDate: "2025-01-25",
      status: "pending",
      paymentMethod: "transfer",
    },
  ],

  vehicleHistory: [
    { id: 1, vehicleId: 1, event: "Rental", description: "Rented to John Doe", date: "2025-01-10", type: "rental" },
    {
      id: 2,
      vehicleId: 1,
      event: "Return",
      description: "Returned in good condition",
      date: "2025-01-08",
      type: "return",
    },
    {
      id: 3,
      vehicleId: 2,
      event: "Maintenance",
      description: "Oil change and filter replacement",
      date: "2024-12-28",
      type: "maintenance",
    },
    {
      id: 4,
      vehicleId: 2,
      event: "Damage Report",
      description: "Minor dent on right side",
      date: "2024-12-22",
      type: "damage",
    },
    { id: 5, vehicleId: 3, event: "Rental", description: "Rented to Jane Smith", date: "2025-01-01", type: "rental" },
    {
      id: 6,
      vehicleId: 3,
      event: "Inspection",
      description: "Monthly safety inspection passed",
      date: "2024-12-31",
      type: "inspection",
    },
  ],

  nextId: {
    vehicles: 7,
    users: 7,
    reservations: 7,
    pricing: 4,
    billing: 6,
    vehicleHistory: 7,
  },
}

// Initialize data from localStorage
function initializeDB() {
  const savedData = localStorage.getItem("mvrsData")
  if (savedData) {
    const parsedData = JSON.parse(savedData)
    Object.assign(db, parsedData)
  } else {
    saveDB()
  }
}

// Save data to localStorage
function saveDB() {
  localStorage.setItem("mvrsData", JSON.stringify(db))
}

// VEHICLES CRUD
const vehicleAPI = {
  getAll() {
    return db.vehicles
  },
  getById(id) {
    return db.vehicles.find((v) => v.id === id)
  },
  add(vehicle) {
    vehicle.id = db.nextId.vehicles++
    db.vehicles.push(vehicle)
    saveDB()
    return vehicle
  },
  update(id, updates) {
    const vehicle = db.vehicles.find((v) => v.id === id)
    if (vehicle) {
      Object.assign(vehicle, updates)
      saveDB()
    }
    return vehicle
  },
  delete(id) {
    db.vehicles = db.vehicles.filter((v) => v.id !== id)
    saveDB()
  },
  search(query) {
    return db.vehicles.filter((v) => v.plate.toLowerCase().includes(query) || v.model.toLowerCase().includes(query))
  },
  filterByStatus(status) {
    return status ? db.vehicles.filter((v) => v.status === status) : db.vehicles
  },
}

// USERS CRUD
const userAPI = {
  getAll() {
    return db.users
  },
  getById(id) {
    return db.users.find((u) => u.id === id)
  },
  add(user) {
    user.id = db.nextId.users++
    user.joined = new Date().toISOString().split("T")[0]
    db.users.push(user)
    saveDB()
    return user
  },
  update(id, updates) {
    const user = db.users.find((u) => u.id === id)
    if (user) {
      Object.assign(user, updates)
      saveDB()
    }
    return user
  },
  delete(id) {
    db.users = db.users.filter((u) => u.id !== id)
    saveDB()
  },
  search(query) {
    return db.users.filter((u) => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query))
  },
  filterByRole(role) {
    return role ? db.users.filter((u) => u.role === role) : db.users
  },
}

// RESERVATIONS CRUD
const reservationAPI = {
  getAll() {
    return db.reservations
  },
  getById(id) {
    return db.reservations.find((r) => r.id === id)
  },
  add(reservation) {
    const id = "RES" + String(db.nextId.reservations++).padStart(3, "0")
    reservation.id = id
    db.reservations.push(reservation)
    saveDB()
    return reservation
  },
  update(id, updates) {
    const reservation = db.reservations.find((r) => r.id === id)
    if (reservation) {
      Object.assign(reservation, updates)
      saveDB()
    }
    return reservation
  },
  delete(id) {
    db.reservations = db.reservations.filter((r) => r.id !== id)
    saveDB()
  },
  search(query) {
    return db.reservations.filter((r) => r.id.toLowerCase().includes(query))
  },
  filterByStatus(status) {
    return status ? db.reservations.filter((r) => r.status === status) : db.reservations
  },
}

// PRICING CRUD
const pricingAPI = {
  getAll() {
    return db.pricing
  },
  getById(id) {
    return db.pricing.find((p) => p.id === id)
  },
  add(pricing) {
    pricing.id = db.nextId.pricing++
    db.pricing.push(pricing)
    saveDB()
    return pricing
  },
  update(id, updates) {
    const pricing = db.pricing.find((p) => p.id === id)
    if (pricing) {
      Object.assign(pricing, updates)
      saveDB()
    }
    return pricing
  },
  delete(id) {
    db.pricing = db.pricing.filter((p) => p.id !== id)
    saveDB()
  },
}

// BILLING CRUD
const billingAPI = {
  getAll() {
    return db.billing
  },
  getById(id) {
    return db.billing.find((b) => b.id === id)
  },
  add(billing) {
    const id = "INV" + String(db.nextId.billing++).padStart(3, "0")
    billing.id = id
    billing.date = new Date().toISOString().split("T")[0]
    db.billing.push(billing)
    saveDB()
    return billing
  },
  update(id, updates) {
    const billing = db.billing.find((b) => b.id === id)
    if (billing) {
      Object.assign(billing, updates)
      saveDB()
    }
    return billing
  },
  delete(id) {
    db.billing = db.billing.filter((b) => b.id !== id)
    saveDB()
  },
  search(query) {
    return db.billing.filter((b) => b.id.toLowerCase().includes(query))
  },
  filterByStatus(status) {
    return status ? db.billing.filter((b) => b.status === status) : db.billing
  },
}

// VEHICLE HISTORY CRUD
const vehicleHistoryAPI = {
  getAll() {
    return db.vehicleHistory
  },
  getByVehicleId(vehicleId) {
    return db.vehicleHistory.filter((h) => h.vehicleId === vehicleId)
  },
  add(history) {
    history.id = db.nextId.vehicleHistory++
    history.date = new Date().toISOString().split("T")[0]
    db.vehicleHistory.push(history)
    saveDB()
    return history
  },
}

// ANALYTICS
const analyticsAPI = {
  getTotalVehicles() {
    return db.vehicles.length
  },
  getTotalUsers() {
    return db.users.length
  },
  getTotalReservations() {
    return db.reservations.length
  },
  getActiveReservations() {
    return db.reservations.filter((r) => r.status === "active").length
  },
  getCompletedReservations() {
    return db.reservations.filter((r) => r.status === "completed").length
  },
  getPendingReservations() {
    return db.reservations.filter((r) => r.status === "pending").length
  },

  getTotalRevenue() {
    return db.billing.reduce((sum, b) => sum + (b.status === "paid" ? b.amount : 0), 0)
  },

  getMonthlyRevenue() {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    return db.billing
      .filter((b) => {
        const date = new Date(b.date)
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear && b.status === "paid"
      })
      .reduce((sum, b) => sum + b.amount, 0)
  },

  getVehiclesByStatus(status) {
    return db.vehicles.filter((v) => v.status === status).length
  },

  getAverageMileage() {
    const total = db.vehicles.reduce((sum, v) => sum + v.mileage, 0)
    return Math.round(total / db.vehicles.length)
  },

  getRevenueByPaymentMethod() {
    return {
      card: db.billing
        .filter((b) => b.paymentMethod === "card" && b.status === "paid")
        .reduce((sum, b) => sum + b.amount, 0),
      cash: db.billing
        .filter((b) => b.paymentMethod === "cash" && b.status === "paid")
        .reduce((sum, b) => sum + b.amount, 0),
      transfer: db.billing
        .filter((b) => b.paymentMethod === "transfer" && b.status === "paid")
        .reduce((sum, b) => sum + b.amount, 0),
    }
  },
}

// Initialize on load
initializeDB()
