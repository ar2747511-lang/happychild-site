import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const loginBox = document.getElementById("loginBox");
const adminPanel = document.getElementById("adminPanel");
const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");

const ordersList = document.getElementById("ordersList");

btnLogin.onclick = async () => {
  const email = document.getElementById("adminEmail").value;
  const pass = document.getElementById("adminPass").value;

  try {
    await signInWithEmailAndPassword(auth, email, pass);

    loginBox.style.display = "none";
    adminPanel.style.display = "block";

    loadOrders();
  } catch (e) {
    alert("Login error");
  }
};

btnLogout.onclick = () => {
  signOut(auth);
  location.reload();
};

async function loadOrders() {
  ordersList.innerHTML = "Loading...";

  const q = query(collection(db, "orders"), orderBy("status"));

  const snap = await getDocs(q);

  let html = "";

  snap.forEach(doc => {
    const d = doc.data();

    html += `
      <div style="padding:10px;border-bottom:1px solid #ddd">
        <b>${d.name}</b><br>
        📞 ${d.phone}<br>
        📍 ${d.city}<br>
        Status: ${d.status}
      </div>
    `;
  });

  ordersList.innerHTML = html || "No orders";
}
