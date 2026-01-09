// MVRS Staff Backend Database
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
  ],

  clients: [
    {
      id: 1,
      name: "Maria Garcia",
      email: "maria@example.com",
      phone: "09123456789",
      idType: "passport",
      status: "verified",
      joined: "2023-02-20",
    },
    {
      id: 2,
      name: "Robert Martinez",
      email: "robert@example.com",
      phone: "09123456790",
      idType: "driver_license",
      status: "pending",
      joined: "2024-01-10",
    },
    {
      id: 3,
      name: "Ana Santos",
      email: "ana@example.com",
      phone: "09123456791",
      idType: "national_id",
      status: "verified",
      joined: "2023-06-15",
    },
    {
      id: 4,
      name: "Luis Fernandez",
      email: "luis@example.com",
      phone: "09123456792",
      idType: "passport",
      status: "rejected",
      joined: "2024-02-01",
    },
  ],

  bookings: [
    {
      id: "BK001",
      clientId: 1,
      vehicleId: 1,
      clientName: "Maria Garcia",
      vehicle: "Toyota Corolla",
      pickupDate: "2025-01-15",
      returnDate: "2025-01-18",
      status: "pending",
      totalAmount: 4500,
      notes: "Airport pickup",
    },
    {
      id: "BK002",
      clientId: 3,
      vehicleId: 3,
      clientName: "Ana Santos",
      vehicle: "Toyota Innova",
      pickupDate: "2025-01-16",
      returnDate: "2025-01-20",
      status: "confirmed",
      totalAmount: 10000,
      notes: "Family trip",
    },
  ],

  invoices: [
    {
      id: "INV001",
      clientId: 1,
      bookingId: "BK001",
      clientName: "Maria Garcia",
      amount: 4500,
      dueDate: "2025-01-25",
      status: "pending",
      paymentMethod: null,
      createdDate: "2025-01-15",
    },
    {
      id: "INV002",
      clientId: 3,
      bookingId: "BK002",
      clientName: "Ana Santos",
      amount: 10000,
      dueDate: "2025-01-30",
      status: "paid",
      paymentMethod: "gcash",
      createdDate: "2025-01-16",
    },
  ],

  assets: [
    {
      id: "ASSET001",
      name: "Toyota Corolla (ABC-1234)",
      type: "vehicle",
      value: 850000,
      condition: "good",
      lastUpdated: "2025-01-08",
    },
    {
      id: "ASSET002",
      name: "Honda CR-V (ABC-1235)",
      type: "vehicle",
      value: 1200000,
      condition: "excellent",
      lastUpdated: "2025-01-07",
    },
  ],

  paymentMethods: [
    {
      id: "pm_cash",
      name: "Cash",
      status: "active",
      config: {},
    },
    {
      id: "pm_gcash",
      name: "GCash",
      status: "active",
      config: { accountNumber: "639123456789" },
    },
    {
      id: "pm_bank",
      name: "Bank Transfer",
      status: "active",
      config: { bankName: "BDO", accountNumber: "12345678", accountName: "MVRS" },
    },
    {
      id: "pm_credit",
      name: "Credit Card",
      status: "inactive",
      config: {},
    },
    {
      id: "pm_check",
      name: "Check",
      status: "active",
      config: {},
    },
  ],

  activities: [
    {
      type: "booking",
      details: "New booking processed - BK001",
      status: "completed",
      time: "09:30 AM",
    },
    {
      type: "verification",
      details: "Client ID verified - Maria Garcia",
      status: "completed",
      time: "08:45 AM",
    },
    {
      type: "payment",
      details: "Payment received - INV002",
      status: "completed",
      time: "03:15 PM",
    },
  ],
}

// Utility Functions
function getAvailableVehicles() {
  return db.vehicles.filter((v) => v.status === "available")
}

function getRentedVehicles() {
  return db.vehicles.filter((v) => v.status === "rented")
}

function getMaintenanceVehicles() {
  return db.vehicles.filter((v) => v.status === "maintenance")
}

function getDamagedVehicles() {
  return db.vehicles.filter((v) => v.status === "damaged")
}

function getPendingVerifications() {
  return db.clients.filter((c) => c.status === "pending")
}

function getPendingInvoices() {
  return db.invoices.filter((i) => i.status === "pending")
}

function getTodayBookings() {
  const today = new Date().toISOString().split("T")[0]
  return db.bookings.filter((b) => b.pickupDate === today || b.status === "pending")
}

function getTotalReceivable() {
  return db.invoices.filter((i) => i.status === "pending").reduce((sum, inv) => sum + inv.amount, 0)
}

function getTotalRevenue() {
  return db.invoices.filter((i) => i.status === "paid").reduce((sum, inv) => sum + inv.amount, 0)
}
