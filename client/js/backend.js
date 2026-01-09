// Vehicles Database
const vehiclesDB = [
  { id: "v1", name: "Honda CB150", type: "Motorcycle", dailyRate: 500, available: true },
  { id: "v2", name: "Yamaha YZF-R15", type: "Motorcycle", dailyRate: 600, available: true },
  { id: "v3", name: "Suzuki Raider", type: "Motorcycle", dailyRate: 550, available: false },
  { id: "v4", name: "Honda PCX", type: "Scooter", dailyRate: 400, available: true },
  { id: "v5", name: "Yamaha Mio", type: "Scooter", dailyRate: 380, available: true },
  { id: "v6", name: "Vespa LX125", type: "Scooter", dailyRate: 700, available: true },
]

// Admin Database
const staffDB = [
  { id: "s1", username: "staff1", name: "John Smith", email: "john@rental.com", role: "Staff" },
  { id: "s2", username: "staff2", name: "Maria Garcia", email: "maria@rental.com", role: "Staff" },
]

const adminDB = [{ id: "a1", username: "admin", name: "Admin User", email: "admin@rental.com", role: "Admin" }]

const driverDB = [
  {
    id: "d1",
    username: "driver1",
    name: "Alex Johnson",
    email: "alex@rental.com",
    role: "Driver",
    licenseId: "DL-123456",
  },
  {
    id: "d2",
    username: "driver2",
    name: "Sarah Williams",
    email: "sarah@rental.com",
    role: "Driver",
    licenseId: "DL-789012",
  },
]

// Helper Functions
function getVehicles() {
  return vehiclesDB
}

function getStaffMembers() {
  return staffDB
}

function getAdmins() {
  return adminDB
}

function getDrivers() {
  return driverDB
}

function createBooking(clientUsername, vehicleId, pickupDate, returnDate, pickupLocation, dropoffLocation, totalCost) {
  const booking = {
    id: "BK-" + Date.now(),
    clientUsername: clientUsername,
    vehicleId: vehicleId,
    vehicleName: vehiclesDB.find((v) => v.id === vehicleId).name,
    pickupDate: pickupDate,
    returnDate: returnDate,
    pickupLocation: pickupLocation,
    dropoffLocation: dropoffLocation,
    totalCost: totalCost,
    status: "Active",
    createdAt: new Date().toISOString(),
  }

  const bookings = JSON.parse(localStorage.getItem("bookings")) || []
  bookings.push(booking)
  localStorage.setItem("bookings", JSON.stringify(bookings))

  return booking
}

function updateVehicleAvailability(vehicleId, available) {
  const vehicle = vehiclesDB.find((v) => v.id === vehicleId)
  if (vehicle) {
    vehicle.available = available
  }
}

function recordCheckIn(bookingId, mileage, fuelLevel, condition) {
  const checkIn = {
    id: "CI-" + Date.now(),
    bookingId: bookingId,
    mileage: mileage,
    fuelLevel: fuelLevel,
    condition: condition,
    timestamp: new Date().toISOString(),
  }

  const checkIns = JSON.parse(localStorage.getItem("checkIns")) || []
  checkIns.push(checkIn)
  localStorage.setItem("checkIns", JSON.stringify(checkIns))

  return checkIn
}

function recordCheckOut(bookingId, mileage, fuelLevel, condition) {
  const checkOut = {
    id: "CO-" + Date.now(),
    bookingId: bookingId,
    mileage: mileage,
    fuelLevel: fuelLevel,
    condition: condition,
    timestamp: new Date().toISOString(),
  }

  const checkOuts = JSON.parse(localStorage.getItem("checkOuts")) || []
  checkOuts.push(checkOut)
  localStorage.setItem("checkOuts", JSON.stringify(checkOuts))

  return checkOut
}

function reportIssue(driverId, vehicleId, severity, category, description) {
  const issue = {
    id: "ISS-" + Date.now(),
    driverId: driverId,
    vehicleId: vehicleId,
    severity: severity,
    category: category,
    description: description,
    status: "Open",
    createdAt: new Date().toISOString(),
  }

  const issues = JSON.parse(localStorage.getItem("issues")) || []
  issues.push(issue)
  localStorage.setItem("issues", JSON.stringify(issues))

  return issue
}

function processPayment(bookingId, amount, method, transactionDetails) {
  const payment = {
    id: "PAY-" + Date.now(),
    bookingId: bookingId,
    amount: amount,
    method: method,
    transactionDetails: transactionDetails,
    status: "Completed",
    timestamp: new Date().toISOString(),
  }

  const payments = JSON.parse(localStorage.getItem("payments")) || []
  payments.push(payment)
  localStorage.setItem("payments", JSON.stringify(payments))

  return payment
}
