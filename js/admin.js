import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// UI
const loginBox = document.getElementById("loginBox");
const adminPanel = document.getElementById("adminPanel");
const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");
const ordersList = document.getElementById("ordersList");
const loginMsg = document.getElementById("loginMsg");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const dateFilter = document.getElementById("dateFilter");
const btnExport = document.getElementById("btnExport");
const btnNotify = document.getElementById("btnNotify");
const stats = document.getElementById("stats");

const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalContent = document.getElementById("modalContent");

const ding = document.getElementById("ding");

let ALL_ORDERS = [];
let notificationsOn = false;
let lastCount = 0;

function escapeHtml(str) {
  return (str ?? "").toString()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeStatus(s) {
  const v = (s || "").toString().trim().toUpperCase();
  if (!v) return "NEW";
  if (["NEW", "CONFIRMED", "DELIVERED", "CANCELED"].includes(v)) return v;
  return "NEW";
}

function getOrderStatus(data) {
  // support old field "statu"
  return normalizeStatus(data.status ?? data.statu);
}

function openModal(html) {
  modalContent.innerHTML = html;
  modalOverlay.style.display = "block";
}
function closeModal() {
  modalOverlay.style.display = "none";
  modalContent.innerHTML = "";
}

modalClose?.addEventListener("click", closeModal);
modalOverlay?.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

// LOGIN
btnLogin.onclick = async () => {
  const email = document.getElementById("adminEmail").value.trim();
  const pass = document.getElementById("adminPass").value;

  loginMsg.textContent = "";

  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch (e) {
    console.error(e);
    loginMsg.textContent = "Login error";
    alert("Login error");
  }
};

btnLogout.onclick = async () => {
  await signOut(auth);
  location.reload();
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBox.style.display = "none";
    adminPanel.style.display = "block";
    loadOrders();
    startAutoRefresh();
  } else {
    loginBox.style.display = "block";
    adminPanel.style.display = "none";
  }
});

// FILTER EVENTS
searchInput?.addEventListener("input", renderOrders);
statusFilter?.addEventListener("change", renderOrders);
dateFilter?.addEventListener("change", renderOrders);

btnExport?.addEventListener("click", exportCSV);

btnNotify?.addEventListener("click", async () => {
  notificationsOn = !notificationsOn;
  btnNotify.textContent = notificationsOn ? "Notifications ON ✅" : "Enable notifications";
  if (notificationsOn) {
    try { await ding?.play(); ding?.pause(); ding.currentTime = 0; } catch {}
  }
});

async function loadOrders() {
  ordersList.innerHTML = "Loading...";

  // Order by status (works always)
  const q = query(collection(db, "orders"), orderBy("status"));
  const snap = await getDocs(q);

  ALL_ORDERS = snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      status: getOrderStatus(data)
    };
  });

  renderOrders();
}

function applyFilters(list) {
  const term = (searchInput?.value ?? "").trim().toLowerCase();
  const st = statusFilter?.value ?? "ALL";

  return list.filter((o) => {
    const s = getOrderStatus(o);

    if (st !== "ALL" && s !== st) return false;

    if (!term) return true;

    const name = (o.name ?? "").toString().toLowerCase();
    const phone = (o.phone ?? "").toString().toLowerCase();
    const city = (o.city ?? "").toString().toLowerCase();
    const ord = (o.ord ?? o.ORD ?? o.orderId ?? o.id ?? "").toString().toLowerCase();

    return (
      name.includes(term) ||
      phone.includes(term) ||
      city.includes(term) ||
      ord.includes(term)
    );
  });
}

function renderOrders() {
  const filtered = applyFilters(ALL_ORDERS);

  const counts = { NEW: 0, CONFIRMED: 0, DELIVERED: 0, CANCELED: 0 };
  filtered.forEach((o) => {
    const s = getOrderStatus(o);
    counts[s] = (counts[s] ?? 0) + 1;
  });

  if (stats) {
    stats.textContent = `Total: ${filtered.length} | NEW: ${counts.NEW} | CONFIRMED: ${counts.CONFIRMED} | DELIVERED: ${counts.DELIVERED} | CANCELED: ${counts.CANCELED}`;
  }

  if (!filtered.length) {
    ordersList.innerHTML = "No orders";
    return;
  }

  ordersList.innerHTML = filtered.map(orderCard).join("");

  filtered.forEach((o) => {
    document.getElementById(`view_${o.id}`)?.addEventListener("click", () => showOrder(o.id));
    document.getElementById(`set_${o.id}`)?.addEventListener("change", (e) => {
      setStatus(o.id, e.target.value);
    });
  });
}

function orderCard(o) {
  const s = getOrderStatus(o);
  return `
    <div style="padding:12px;border:1px solid #eee;border-radius:12px;margin:10px 0;background:#fff">
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap">
        <div>
          <b>${escapeHtml(o.name || "(No name)")}</b><br>
          📞 ${escapeHtml(o.phone || "-")}<br>
          📍 ${escapeHtml(o.city || "-")}<br>
          <small style="color:#666">ID: ${escapeHtml(o.id)}</small>
        </div>

        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <select id="set_${o.id}">
            <option value="NEW" ${s === "NEW" ? "selected" : ""}>NEW</option>
            <option value="CONFIRMED" ${s === "CONFIRMED" ? "selected" : ""}>CONFIRMED</option>
            <option value="DELIVERED" ${s === "DELIVERED" ? "selected" : ""}>DELIVERED</option>
            <option value="CANCELED" ${s === "CANCELED" ? "selected" : ""}>CANCELED</option>
          </select>
          <button id="view_${o.id}">View</button>
        </div>
      </div>
    </div>
  `;
}

function showOrder(id) {
  const o = ALL_ORDERS.find(x => x.id === id);
  if (!o) return;

  const s = getOrderStatus(o);

  openModal(`
    <div style="line-height:1.8">
      <div><b>Name:</b> ${escapeHtml(o.name || "-")}</div>
      <div><b>Phone:</b> ${escapeHtml(o.phone || "-")}</div>
      <div><b>City:</b> ${escapeHtml(o.city || "-")}</div>
      <div><b>Status:</b> ${escapeHtml(s)}</div>
      <div><b>ID:</b> ${escapeHtml(o.id)}</div>
      <hr/>
      <div style="font-size:12px;color:#666">
        Fields: name / phone / city / status
      </div>
    </div>
  `);
}

async function setStatus(id, newStatus) {
  newStatus = normalizeStatus(newStatus);

  try {
    const ref = doc(db, "orders", id);
    await updateDoc(ref, { status: newStatus });

    // update cache
    const i = ALL_ORDERS.findIndex(x => x.id === id);
    if (i >= 0) ALL_ORDERS[i].status = newStatus;

    renderOrders();
  } catch (e) {
    console.error(e);
    alert("Error updating status");
  }
}

function exportCSV() {
  const filtered = applyFilters(ALL_ORDERS);

  const rows = [
    ["id", "name", "phone", "city", "status"].join(",")
  ];

  filtered.forEach(o => {
    const s = getOrderStatus(o);
    const line = [
      `"${(o.id ?? "").toString().replaceAll('"', '""')}"`,
      `"${(o.name ?? "").toString().replaceAll('"', '""')}"`,
      `"${(o.phone ?? "").toString().replaceAll('"', '""')}"`,
      `"${(o.city ?? "").toString().replaceAll('"', '""')}"`,
      `"${s}"`
    ].join(",");
    rows.push(line);
  });

  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "orders.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

function startAutoRefresh() {
  setInterval(async () => {
    try {
      const before = ALL_ORDERS.length;
      await loadOrders();
      const after = ALL_ORDERS.length;

      if (notificationsOn && after > before && before !== 0) {
        try { await ding?.play(); } catch {}
      }

      lastCount = after;
    } catch {}
  }, 12000);
}
