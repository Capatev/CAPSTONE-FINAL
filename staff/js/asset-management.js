let allAssets = [];

/* CALL THIS AFTER FETCHING ASSETS FROM DB */
function renderAssets(data) {
    const tbody = document.getElementById("assetsTable");
    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;">No assets found</td>
            </tr>
        `;
        return;
    }

    data.forEach(a => {
        tbody.innerHTML += `
            <tr>
                <td>${a.id}</td>
                <td>${a.name}</td>
                <td>${a.type}</td>
                <td>₱${Number(a.value).toLocaleString()}</td>
                <td>${a.condition}</td>
                <td>${a.updated_at}</td>
                <td>
                    <button class="btn btn-sm">Edit</button>
                </td>
            </tr>
        `;
    });
}

/* FILTER LOGIC */
function applyFilters() {
    const search = document.getElementById("searchAssets").value.toLowerCase();
    const type = document.getElementById("filterAssetType").value;

    const filtered = allAssets.filter(a => {
        const matchesSearch =
            a.id.toString().includes(search) ||
            a.name.toLowerCase().includes(search) ||
            a.type.toLowerCase().includes(search) ||
            a.condition.toLowerCase().includes(search);

        const matchesType =
            !type || a.type === type;

        return matchesSearch && matchesType;
    });

    renderAssets(filtered);
}

/* EVENT LISTENERS */
document.getElementById("searchAssets")
    .addEventListener("input", applyFilters);

document.getElementById("filterAssetType")
    .addEventListener("change", applyFilters);

    // ==========================
// ADD ASSET MODAL
// ==========================
function showAddAssetModal() {
  const modal = document.getElementById("assetModal");
  if (!modal) return console.error("assetModal not found");
  modal.style.display = "flex";
}

function closeAddAssetModal() {
  const modal = document.getElementById("assetModal");
  if (modal) modal.style.display = "none";
}

// ==========================
// ASSET ACTION MODAL
// ==========================
function openAssetModal(type) {
  const modal = document.getElementById("assetActionModal");
  const title = document.getElementById("assetModalTitle");

  if (!modal) return console.error("assetActionModal not found");

  // Hide all sections first
  document.querySelectorAll(".modal-section").forEach(section => {
    section.style.display = "none";
  });

  // Show selected section
  const activeSection = document.querySelector(
    `.modal-section[data-type="${type}"]`
  );

  if (activeSection) {
    activeSection.style.display = "block";
  }

  // Set title
  const titles = {
    maintenance: "Log Maintenance",
    condition: "Update Asset Condition",
    issues: "Report Asset Issue"
  };

  title.textContent = titles[type] || "Asset Action";

  modal.style.display = "flex";
}

function closeAssetModal() {
  const modal = document.getElementById("assetActionModal");
  if (modal) modal.style.display = "none";
}

