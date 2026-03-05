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

// كنرتبو بالأفضل: createdAt وإذا ماكانش نستعملو date
const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

onSnapshot(
  q,
  (snapshot) => {
    ordersList.innerHTML = "";

    snapshot.forEach((docu) => {
      const data = docu.data();
      const t =
        (data.createdAt?.toDate && data.createdAt.toDate()) ||
        (data.date?.toDate && data.date.toDate()) ||
        null;

      const div = document.createElement("div");
      div.style.padding = "10px 0";
      div.innerHTML = `
        <b>${data.name ?? ""}</b> (${data.orderCode ?? ""})<br>
        📞 ${data.phone ?? ""}<br>
        📍 ${data.city ?? ""}<br>
        🧾 ${data.productName || data.product || ""}<br>
        <small>${t ? t.toLocaleString() : ""}</small>
        <hr>
      `;
      ordersList.appendChild(div);
    });
  },
  (error) => {
    console.error("onSnapshot error:", error);
    ordersList.innerHTML = "⚠️ Error loading orders (شوف console)";
  }
);
