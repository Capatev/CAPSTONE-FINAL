// ==========================
// DASHBOARD STATS
// ==========================
function loadBillingStats() {
  fetch("/MVRMS/api/get-dashboard-stats.php")
    .then(res => res.json())
    .then(data => {
      document.getElementById("totalReceivable").textContent =
        "₱" + Number(data.total_receivable).toLocaleString();

      document.getElementById("todayCollections").textContent =
        "₱" + Number(data.todays_collections).toLocaleString();

      document.getElementById("monthRevenue").textContent =
        "₱" + Number(data.month_revenue).toLocaleString();

      document.getElementById("pendingCount").textContent =
        data.pending_payments;
    });
}

// ==========================
// LOAD INVOICES
// ==========================
function loadInvoices() {
  const search = document.getElementById("searchInvoice").value || "";
  const status = document.getElementById("filterPaymentStatus").value || "";

  fetch(`/MVRMS/api/get-invoices.php?search=${search}&status=${status}`)
    .then(res => res.json())
    .then(data => renderInvoices(data));
}

// ==========================
// RENDER TABLE
// ==========================
function renderInvoices(invoices) {
  const tbody = document.getElementById("invoicesTable");
  tbody.innerHTML = "";

  if (invoices.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">No billing records</td></tr>`;
    return;
  }

  invoices.forEach(inv => {
    tbody.innerHTML += `
      <tr>
        <td>${inv.invoice_id}</td>
        <td>User #${inv.user_id}</td>
        <td>₱${Number(inv.amount).toLocaleString()}</td>
        <td>${inv.due_date}</td>
        <td>
          <span class="status ${inv.status.toLowerCase()}">
            ${inv.status}
          </span>
        </td>
        <td>-</td>
        <td>
          ${
            inv.status === "Pending"
              ? `<button class="btn btn-sm btn-primary"
                   onclick="openPaymentModal(${inv.invoice_id}, ${inv.amount})">
                   Pay
                 </button>`
              : "-"
          }
        </td>
      </tr>
    `;
  });
}

// ==========================
// NEW INVOICE MODAL
// ==========================
function showNewInvoiceModal() {
  document.getElementById("invoiceModal").style.display = "flex";
}

function closeNewInvoiceModal() {
  document.getElementById("invoiceModal").style.display = "none";
}

// ==========================
// PAYMENT MODAL
// ==========================
function openPaymentModal(invoiceId, amount) {
  document.getElementById("paymentInvoice").value = invoiceId;
  document.getElementById("paymentAmount").value = amount;
  document.getElementById("paymentDate").value =
    new Date().toISOString().split("T")[0];

  document.getElementById("paymentModal").style.display = "flex";
}

function closePaymentModal() {
  document.getElementById("paymentModal").style.display = "none";
}

// ==========================
// PROCESS PAYMENT
// ==========================
document.getElementById("paymentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const invoiceId = document.getElementById("paymentInvoice").value;

  fetch("/MVRMS/api/mark-paid.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `invoice_id=${invoiceId}`
  })
    .then(res => res.json())
    .then(() => {
      closePaymentModal();
      loadBillingStats();
      loadInvoices();
    });
});

// ==========================
// INIT
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  loadBillingStats();
  loadInvoices();

  document.getElementById("searchInvoice")
    .addEventListener("input", loadInvoices);

  document.getElementById("filterPaymentStatus")
    .addEventListener("change", loadInvoices);
});
