// ID Scanner Module
// Handles ID verification, OCR processing, and data validation

/**
 * Validate ID format based on type
 * @param {string} idType - Type of ID
 * @param {string} idNumber - ID number to validate
 * @returns {boolean} - Whether ID format is valid
 */
function validateIDFormat(idType, idNumber) {
  const patterns = {
    drivers_license: /^[A-Z0-9-]{6,20}$/,
    passport: /^[A-Z0-9-]{6,20}$/,
    national_id: /^[0-9-]{6,20}$/,
    tin: /^[0-9-]{9,12}$/,
    sss: /^[0-9-]{10,15}$/,
    other: /.+/,
  }

  const pattern = patterns[idType] || /.+/
  return pattern.test(idNumber)
}

/**
 * Validate ID expiration
 * @param {string} expiryDate - Expiration date in YYYY-MM-DD format
 * @returns {boolean} - Whether ID is not expired
 */
function isIDValid(expiryDate) {
  const expiry = new Date(expiryDate)
  const today = new Date()
  return expiry >= today
}

/**
 * Calculate age from date of birth
 * @param {string} dob - Date of birth in YYYY-MM-DD format
 * @returns {number} - Age in years
 */
function calculateAge(dob) {
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

/**
 * Check if person is of legal age for vehicle rental
 * @param {string} dob - Date of birth in YYYY-MM-DD format
 * @param {number} minAge - Minimum age required (default: 18)
 * @returns {boolean} - Whether person meets age requirement
 */
function isLegalAge(dob, minAge = 18) {
  return calculateAge(dob) >= minAge
}

/**
 * Extract date from various formats
 * @param {string} dateString - Date string in various formats
 * @returns {string} - Date in YYYY-MM-DD format or empty string
 */
function extractDate(dateString) {
  if (!dateString) return ""

  // Try to parse MM/DD/YYYY or DD/MM/YYYY
  const dateRegex = /(\d{1,2})[/-](\d{1,2})[/-](\d{4})/
  const match = dateString.match(dateRegex)

  if (match) {
    const [, month, day, year] = match
    // Assume MM/DD/YYYY format for US IDs
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
  }

  return ""
}

/**
 * Store verification data
 * @param {object} verificationData - Verification data to store
 */
function storeVerificationData(verificationData) {
  const data = {
    ...verificationData,
    timestamp: new Date().toISOString(),
    verified: true,
  }
  localStorage.setItem("idVerification", JSON.stringify(data))
}

/**
 * Get stored verification data
 * @returns {object|null} - Stored verification data or null
 */
function getVerificationData() {
  const data = localStorage.getItem("idVerification")
  return data ? JSON.parse(data) : null
}

/**
 * Check if ID is verified
 * @returns {boolean} - Whether ID is verified
 */
function isIDVerified() {
  const verification = getVerificationData()
  if (!verification) return false
  return verification.verified && isIDValid(verification.expiry)
}

/**
 * Process and validate ID data
 * @param {object} idData - ID data to validate
 * @returns {object} - Validation result with status and messages
 */
function validateIDData(idData) {
  const result = {
    valid: true,
    messages: [],
  }

  // Check required fields
  if (!idData.fullName || idData.fullName.trim() === "") {
    result.valid = false
    result.messages.push("Full name is required")
  }

  if (!idData.idNumber || idData.idNumber.trim() === "") {
    result.valid = false
    result.messages.push("ID number is required")
  } else if (!validateIDFormat(idData.idType, idData.idNumber)) {
    result.valid = false
    result.messages.push(`Invalid ID number format for ${idData.idType}`)
  }

  if (!idData.dob) {
    result.valid = false
    result.messages.push("Date of birth is required")
  } else if (!isLegalAge(idData.dob)) {
    result.valid = false
    result.messages.push("Must be at least 18 years old to rent")
  }

  if (!idData.expiry) {
    result.valid = false
    result.messages.push("ID expiration date is required")
  } else if (!isIDValid(idData.expiry)) {
    result.valid = false
    result.messages.push("Your ID has expired. Please renew it first.")
  }

  return result
}

// Export functions for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    validateIDFormat,
    isIDValid,
    calculateAge,
    isLegalAge,
    extractDate,
    storeVerificationData,
    getVerificationData,
    isIDVerified,
    validateIDData,
  }
}