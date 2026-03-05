import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ordersList = document.getElementById("ordersList");

// newest first
const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
  ordersList.innerHTML = "";

  snapshot.forEach((doc) => {
    const data = doc.data();
    const created =
      data.createdAt?.toDate ? data.createdAt.toDate().toLocaleString() : "";

    const div = document.createElement("div");
    div.style.padding = "10px 0";
    div.innerHTML = `
      <b>${data.name ?? ""}</b> — <small>${data.product ?? ""}</small><br>
      📞 ${data.phone ?? ""}<br>
      📍 ${data.city ?? ""}<br>
      <small>${created}</small>
      <hr>
    `;
    ordersList.appendChild(div);
  });
});
