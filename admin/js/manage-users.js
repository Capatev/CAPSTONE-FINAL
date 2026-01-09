// Manage Users Script

let editingUserId = null
const userAPI = {
  getAll: () => [],
  search: (query) => [],
  filterByRole: (role) => [],
  getById: (id) => null,
  add: (userData) => {},
  update: (id, userData) => {},
  delete: (id) => {},
}
const getStatusBadge = (status) => ""
const formatDate = (date) => ""
const openModal = (modalId) => {}
const closeModal = (modalId) => {}
const showNotification = (message) => {}

function initUsers() {
  loadUsers()
  setupEventListeners()
}

function setupEventListeners() {
  const searchInput = document.getElementById("searchUsers")
  const filterRole = document.getElementById("filterRole")

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value
      const users = query ? userAPI.search(query) : userAPI.getAll()
      displayUsers(users)
    })
  }

  if (filterRole) {
    filterRole.addEventListener("change", (e) => {
      const role = e.target.value
      const users = userAPI.filterByRole(role)
      displayUsers(users)
    })
  }
}

function loadUsers() {
  displayUsers(userAPI.getAll())
}

function displayUsers(users) {
  const tbody = document.getElementById("usersTableBody")

  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">No users found</td></tr>'
    return
  }

  tbody.innerHTML = users
    .map(
      (user) => `
        <tr>
            <td>USR${user.id.toString().padStart(3, "0")}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td><span class="badge badge-info">${user.role}</span></td>
            <td>${getStatusBadge(user.status)}</td>
            <td>${formatDate(user.joined)}</td>
            <td>
                <button class="btn btn-primary" style="padding: 6px 12px; font-size: 12px;" onclick="editUser(${user.id})">Edit</button>
                <button class="btn btn-danger" style="padding: 6px 12px; font-size: 12px;" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        </tr>
    `,
    )
    .join("")
}

function openAddUserModal() {
  editingUserId = null
  document.getElementById("modalTitle").textContent = "Add User"
  document.getElementById("userForm").reset()
  openModal("userModal")
}

function closeUserModal() {
  closeModal("userModal")
  editingUserId = null
}

function editUser(id) {
  const user = userAPI.getById(id)
  if (!user) return

  editingUserId = id
  document.getElementById("modalTitle").textContent = "Edit User"
  document.getElementById("userName").value = user.name
  document.getElementById("userEmail").value = user.email
  document.getElementById("userPhone").value = user.phone
  document.getElementById("userRole").value = user.role
  document.getElementById("userStatus").value = user.status

  openModal("userModal")
}

function saveUser(e) {
  e.preventDefault()

  const userData = {
    name: document.getElementById("userName").value,
    email: document.getElementById("userEmail").value,
    phone: document.getElementById("userPhone").value,
    role: document.getElementById("userRole").value,
    status: document.getElementById("userStatus").value,
  }

  if (editingUserId) {
    userAPI.update(editingUserId, userData)
    showNotification("User updated successfully")
  } else {
    userAPI.add(userData)
    showNotification("User added successfully")
  }

  closeUserModal()
  loadUsers()
}

function deleteUser(id) {
  if (confirm("Are you sure you want to delete this user?")) {
    userAPI.delete(id)
    showNotification("User deleted successfully")
    loadUsers()
  }
}

document.addEventListener("DOMContentLoaded", initUsers)
