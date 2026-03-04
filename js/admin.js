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

// helpers
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

function normalizeStatus(s) {
  const v = String(s || "NEW").toUpperCase();
  if (["NEW","CONFIRMED","DELIVERED","CANCELED"].includes(v)) return v;
  return "NEW";
}

function dateText(val) {
  try {
    if (!val) return "";
    if (val.toDate) return val.toDate().toLocaleString();
    if (val instanceof Date) return val.toLocaleString();
    return String(val);
  } catch {
    return "";
  }
}

// data cache
let allOrders = []; // {id, name, phone, city, status, date}

// render
function render() {
  const q = (searchInput.value || "").trim().toLowerCase();
  const filterStatus = statusFilter.value;

  let list = allOrders.slice();

  // sort by date desc (client-side)
  list.sort((a, b) => {
    const ad = a._ms || 0;
    const bd = b._ms || 0;
    return bd - ad;
  });

  // status filter
  if (filterStatus !== "ALL") {
    list = list.filter(o => normalizeStatus(o.status) === filterStatus);
  }

  // search filter
  if (q) {
    list = list.filter(o => {
      return (
        String(o.name || "").toLowerCase().includes(q) ||
        String(o.phone || "").toLowerCase().includes(q) ||
        String(o.city || "").toLowerCase().includes(q)
      );
    });
  }

  stats.textContent = `Total: ${allOrders.length} | Showing: ${list.length}`;

  if (!list.length) {
    ordersList.innerHTML = "<p>Ma kayn 7tta order.</p>";
    return;
  }

  ordersList.innerHTML = list.map(o => {
    const st = normalizeStatus(o.status);
    const dt = o.dateText || "";
    const phone = String(o.phone || "").replace(/\s+/g, "");

    return `
      <div style="border:1px solid #ddd;padding:12px;margin:10px 0;border-radius:10px;">
        <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;">
          <div>
            <b>${esc(o.name)}</b> — ${esc(o.phone)} — ${esc(o.city)}
            <div style="font-size:12px;color:#666;margin-top:4px;">${esc(dt)}</div>
            <div style="margin-top:6px;">
              <span style="font-size:12px;padding:3px 8px;border-radius:999px;border:1px solid #ccc;">
                Status: <b>${st}</b>
              </span>
            </div>
          </div>

          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-start;">
            <a href="tel:${esc(phone)}" style="padding:8px 10px;border:1px solid #ccc;border-radius:8px;text-decoration:none;">📞 Call</a>

            <button data-action="status" data-id="${esc(o.id)}" data-status="CONFIRMED" style="padding:8px 10px;border:1px solid #ccc;border-radius:8px;background:#fff;">✅ Confirm</button>
            <button data-action="status" data-id="${esc(o.id)}" data-status="DELIVERED" style="padding:8px 10px;border:1px solid #ccc;border-radius:8px;background:#fff;">📦 Delivered</button>
            <button data-action="status" data-id="${esc(o.id)}" data-status="CANCELED" style="padding:8px 10px;border:1px solid #ccc;border-radius:8px;background:#fff;">⛔ Cancel</button>

            <button data-action="delete" data-id="${esc(o.id)}" style="padding:8px 10px;border:1px solid #e99;border-radius:8px;background:#fff;">🗑 Delete</button>
          </div>
        </div>

        <div style="font-size:12px;color:#888;margin-top:8px;">ID: ${esc(o.id)}</div>
      </div>
    `;
  }).join("");
}

// actions
ordersList.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.getAttribute("data-action");
  const id = btn.getAttribute("data-id");
  if (!action || !id) return;

  const ref = doc(db, "orders", id);

  try {
    if (action === "status") {
      const newStatus = btn.getAttribute("data-status");
      await updateDoc(ref, { status: newStatus });
    }

    if (action === "delete") {
      const ok = confirm("Bghiti t7yd had order?");
      if (!ok) return;
      await deleteDoc(ref);
    }
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
  }
});

// filter changes
searchInput.addEventListener("input", render);
statusFilter.addEventListener("change", render);

// auth state
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
    allOrders = [];
    snapshot.forEach((d) => {
      const data = d.data();
      const st = normalizeStatus(data.status);
      const dt = data.date;
      const dtTxt = dateText(dt);

      // milliseconds for sorting
      let ms = 0;
      try {
        if (dt?.toMillis) ms = dt.toMillis();
        else if (dt instanceof Date) ms = dt.getTime();
      } catch {}

      allOrders.push({
        id: d.id,
        name: data.name || "",
        phone: data.phone || "",
        city: data.city || "",
        status: st,
        dateText: dtTxt,
        _ms: ms
      });
    });

    render();
  }, (err) => {
    console.error(err);
    ordersList.innerHTML = `<p style="color:red;">Error: ${esc(err.message)}</p>`;
  });
});
