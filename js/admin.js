import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, onSnapshot, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// UI
const loginBox = document.getElementById("loginBox");
const adminPanel = document.getElementById("adminPanel");
const loginMsg = document.getElementById("loginMsg");
const ordersList = document.getElementById("ordersList");
const stats = document.getElementById("stats");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const dateFilter = document.getElementById("dateFilter");

const btnExport = document.getElementById("btnExport");
const btnNotify = document.getElementById("btnNotify");
const ding = document.getElementById("ding");

const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalContent = document.getElementById("modalContent");

// Login
document.getElementById("btnLogin").addEventListener("click", async () => {
  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPass").value.trim();

  loginMsg.textContent = "Connexion...";
  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginMsg.textContent = "Connecté ✅";
  } catch (error) {
    console.error(error);
    loginMsg.textContent = "Erreur login ❌";
  }
});

// Logout
document.getElementById("btnLogout").addEventListener("click", async () => {
  await signOut(auth);
});

// Helpers
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}
function normStatus(s) {
  const v = String(s || "NEW").toUpperCase();
  return ["NEW","CONFIRMED","DELIVERED","CANCELED"].includes(v) ? v : "NEW";
}
function phoneClean(p) {
  return String(p || "").replace(/[^\d+]/g, "");
}
function createdMs(val) {
  try {
    if (!val) return 0;
    if (val.toMillis) return val.toMillis();
    return 0;
  } catch { return 0; }
}
function formatDate(val) {
  try {
    if (!val) return "";
    if (val.toDate) return val.toDate().toLocaleString();
    return "";
  } catch { return ""; }
}

// Data
let allOrders = []; // {id, orderCode, name, phone, city, status, createdAt, _ms}
let knownIds = new Set(); // for notifications

function matchesDateFilter(o) {
  const ms = o._ms || 0;
  if (!ms) return true;
  const d = new Date(ms);
  const now = new Date();

  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startYesterday = startToday - 24*60*60*1000;
  const startLast7 = startToday - 7*24*60*60*1000;

  const f = dateFilter.value;
  if (f === "TODAY") return ms >= startToday;
  if (f === "YESTERDAY") return ms >= startYesterday && ms < startToday;
  if (f === "LAST7") return ms >= startLast7;
  return true;
}

function render() {
  const q = (searchInput.value || "").trim().toLowerCase();
  const st = statusFilter.value;

  let list = allOrders.slice();

  // sort newest first
  list.sort((a, b) => (b._ms || 0) - (a._ms || 0));

  // status filter
  if (st !== "ALL") list = list.filter(o => normStatus(o.status) === st);

  // date filter
  list = list.filter(matchesDateFilter);

  // search
  if (q) {
    list = list.filter(o => {
      return (
        String(o.orderCode || "").toLowerCase().includes(q) ||
        String(o.name || "").toLowerCase().includes(q) ||
        String(o.phone || "").toLowerCase().includes(q) ||
        String(o.city || "").toLowerCase().includes(q)
      );
    });
  }

  const countNew = allOrders.filter(o => normStatus(o.status) === "NEW").length;
  stats.textContent = `Total: ${allOrders.length} | New: ${countNew} | Showing: ${list.length}`;

  if (!list.length) {
    ordersList.innerHTML = "<p>Ma kayn 7tta order.</p>";
    return;
  }

  ordersList.innerHTML = list.map(o => {
    const status = normStatus(o.status);
    const phone = phoneClean(o.phone);
    const dt = o.createdText || "";

    return `
      <div style="border:1px solid #ddd;padding:12px;margin:10px 0;border-radius:10px;">
        <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;">
          <div>
            <b>${esc(o.orderCode || "")}</b>
            <div style="margin-top:6px;"><b>${esc(o.name)}</b> — ${esc(o.phone)} — ${esc(o.city)}</div>
            <div style="font-size:12px;color:#666;margin-top:4px;">${esc(dt)}</div>
            <div style="margin-top:8px;">
              <span style="font-size:12px;padding:3px 8px;border-radius:999px;border:1px solid #ccc;">
                Status: <b>${status}</b>
              </span>
            </div>
          </div>

          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-start;">
            <a href="tel:${esc(phone)}" style="padding:8px 10px;border:1px solid #ccc;border-radius:8px;text-decoration:none;">📞 Call</a>

            <a target="_blank" href="https://wa.me/${esc(phone.startsWith('+') ? phone.slice(1) : phone)}"
               style="padding:8px 10px;border:1px solid #ccc;border-radius:8px;text-decoration:none;">💬 WhatsApp</a>

            <button data-action="copy" data-copy="${esc(o.phone)}" style="padding:8px 10px;border:1px solid #ccc;border-radius:8px;background:#fff;">📋 Copy phone</button>

            <button data-action="details" data-id="${esc(o.id)}" style="padding:8px 10px;border:1px solid #ccc;border-radius:8px;background:#fff;">👁 Details</button>

            <button data-action="status" data-id="${esc(o.id)}" data-status="CONFIRMED" style="padding:8px 10px;border:1px solid #ccc;border-radius:8px;background:#fff;">✅ Confirm</button>
            <button data-action="status" data-id="${esc(o.id)}" data-status="DELIVERED" style="padding:8px 10px;border:1px solid #ccc;border-radius:8px;background:#fff;">📦 Delivered</button>
            <button data-action="status" data-id="${esc(o.id)}" data-status="CANCELED" style="padding:8px 10px;border:1px solid #ccc;border-radius:8px;background:#fff;">⛔ Cancel</button>

            <button data-action="delete" data-id="${esc(o.id)}" style="padding:8px 10px;border:1px solid #e99;border-radius:8px;background:#fff;">🗑 Delete</button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

ordersList.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.getAttribute("data-action");

  try {
    if (action === "copy") {
      const text = btn.getAttribute("data-copy") || "";
      await navigator.clipboard.writeText(text);
      btn.textContent = "✅ Copied";
      setTimeout(() => (btn.textContent = "📋 Copy phone"), 900);
      return;
    }

    if (action === "details") {
      const id = btn.getAttribute("data-id");
      const o = allOrders.find(x => x.id === id);
      if (!o) return;

      modalContent.innerHTML = `
        <div><b>Order:</b> ${esc(o.orderCode || "")}</div>
        <div><b>Name:</b> ${esc(o.name)}</div>
        <div><b>Phone:</b> ${esc(o.phone)}</div>
        <div><b>City:</b> ${esc(o.city)}</div>
        <div><b>Status:</b> ${esc(normStatus(o.status))}</div>
        <div><b>Date:</b> ${esc(o.createdText || "")}</div>
        <div style="margin-top:10px;font-size:12px;color:#777;"><b>ID:</b> ${esc(o.id)}</div>
      `;
      modalOverlay.style.display = "block";
      return;
    }

    const id = btn.getAttribute("data-id");
    if (!id) return;

    const ref = doc(db, "orders", id);

    if (action === "status") {
      const newStatus = btn.getAttribute("data-status");
      await updateDoc(ref, { status: newStatus });
      return;
    }

    if (action === "delete") {
      const ok = confirm("Bghiti t7yd had order?");
      if (!ok) return;
      await deleteDoc(ref);
      return;
    }
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
  }
});

modalClose.addEventListener("click", () => (modalOverlay.style.display = "none"));
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) modalOverlay.style.display = "none";
});

searchInput.addEventListener("input", render);
statusFilter.addEventListener("change", render);
dateFilter.addEventListener("change", render);

// CSV export
btnExport.addEventListener("click", () => {
  const header = ["orderCode","name","phone","city","status","createdAt"];
  const rows = allOrders
    .slice()
    .sort((a,b)=> (b._ms||0)-(a._ms||0))
    .map(o => [
      o.orderCode || "",
      o.name || "",
      o.phone || "",
      o.city || "",
      normStatus(o.status),
      o.createdText || ""
    ]);

  const csv = [header, ...rows]
    .map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "orders.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// Notifications
btnNotify.addEventListener("click", async () => {
  try {
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      btnNotify.textContent = "Notifications ✅";
    } else {
      alert("Notifications رفضتيهم");
    }
  } catch (e) {
    console.error(e);
  }
});

function notifyNewOrders(newOnes) {
  if (!newOnes.length) return;

  // sound
  try { ding?.play(); } catch {}

  // browser notification
  if (Notification.permission === "granted") {
    const o = newOnes[0];
    new Notification("New order ✅", {
      body: `${o.orderCode || ""} - ${o.name} - ${o.phone} - ${o.city}`,
    });
  }
}

// Auth state + realtime
let unsub = null;

onAuthStateChanged(auth, (user) => {
  if (unsub) { unsub(); unsub = null; }

  if (!user) {
    loginBox.style.display = "block";
    adminPanel.style.display = "none";
    ordersList.innerHTML = "Login first...";
    return;
  }

  loginBox.style.display = "none";
  adminPanel.style.display = "block";
  ordersList.innerHTML = "Loading...";

  unsub = onSnapshot(collection(db, "orders"), (snapshot) => {
    const newOrders = [];
    const nextAll = [];

    snapshot.forEach((d) => {
      const data = d.data();
      const id = d.id;

      const o = {
        id,
        orderCode: data.orderCode || "",
        name: data.name || "",
        phone: data.phone || "",
        city: data.city || "",
        status: data.status || "NEW",
        createdAt: data.createdAt,
        createdText: formatDate(data.createdAt),
        _ms: createdMs(data.createdAt)
      };

      nextAll.push(o);

      if (!knownIds.has(id)) newOrders.push(o);
    });

    // أول مرة ما نديروش notification بزاف، غير من بعد
    const firstLoad = knownIds.size === 0;
    knownIds = new Set(snapshot.docs.map(x => x.id));

    allOrders = nextAll;
    render();

    if (!firstLoad) notifyNewOrders(newOrders);
  }, (err) => {
    console.error(err);
    ordersList.innerHTML = `<p style="color:red;">Error: ${esc(err.message)}</p>`;
  });
});
