import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("orderForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "Sending...";

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const city = document.getElementById("city").value.trim();

  try {
    await addDoc(collection(db, "orders"), {
      name,
      phone,
      city,
      status: "NEW",
      createdAt: serverTimestamp()
    });

    form.reset();
    msg.textContent = "✅ Sent!";
  } catch (err) {
    console.error(err);
    msg.textContent = "❌ Error";
  }
});
