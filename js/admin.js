import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginBox = document.getElementById("loginBox");
const adminPanel = document.getElementById("adminPanel");
const loginMsg = document.getElementById("loginMsg");
const ordersList = document.getElementById("ordersList");

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

document.getElementById("btnLogout").addEventListener("click", async () => {
  await signOut(auth);
});

onAuthStateChanged(auth, (user) => {

  if (!user) {
    loginBox.style.display = "block";
    adminPanel.style.display = "none";
    return;
  }

  loginBox.style.display = "none";
  adminPanel.style.display = "block";

  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

  onSnapshot(q, (snapshot) => {

    ordersList.innerHTML = "";

    snapshot.forEach((doc) => {

      const data = doc.data();

      const div = document.createElement("div");

      div.innerHTML = `
      <div style="border:1px solid #ddd;padding:10px;margin:10px 0;">
      <b>${data.name}</b><br>
      📞 ${data.phone}<br>
      📍 ${data.city}
      </div>
      `;

      ordersList.appendChild(div);

    });

  });

});
