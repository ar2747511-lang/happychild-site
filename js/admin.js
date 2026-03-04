import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// عناصر الصفحة
const loginBox = document.getElementById("loginBox");
const adminPanel = document.getElementById("adminPanel");
const loginMsg = document.getElementById("loginMsg");
const ordersList = document.getElementById("ordersList");

// تسجيل الدخول
document.getElementById("btnLogin").addEventListener("click", async () => {

  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPass").value;

  loginMsg.textContent = "Connexion...";

  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginMsg.textContent = "Connecté ✅";
  } catch (error) {
    loginMsg.textContent = "Erreur login ❌";
  }

});

// تسجيل الخروج
document.getElementById("btnLogout").addEventListener("click", async () => {
  await signOut(auth);
});

// مراقبة حالة تسجيل الدخول
onAuthStateChanged(auth, (user) => {

  if (!user) {
    loginBox.style.display = "block";
    adminPanel.style.display = "none";
    return;
  }

  loginBox.style.display = "none";
  adminPanel.style.display = "block";

  // جلب الطلبات
  const ordersRef = collection(db, "orders");

  onSnapshot(ordersRef, (snapshot) => {

    ordersList.innerHTML = "";

    snapshot.forEach((doc) => {

      const data = doc.data();

      const div = document.createElement("div");

      div.style.border = "1px solid #ddd";
      div.style.padding = "10px";
      div.style.margin = "10px 0";

      div.innerHTML = `
      <b>${data.name}</b><br>
      📞 ${data.phone}<br>
      📍 ${data.city}
      `;

      ordersList.appendChild(div);

    });

  });

});
