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

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name) || "";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const city = document.getElementById("city").value.trim();

  const product = getParam("product");

  if (!name || !phone || !city) {
    alert("عمر الاسم/الهاتف/المدينة");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "orders"), {
      name,
      phone,
      city,
      product,
      status: "NEW",
      createdAt: serverTimestamp()
    });

    const orderCode = "ORD-" + docRef.id.slice(0, 6).toUpperCase();
    alert("✅ تم إرسال الطلب بنجاح\n" + orderCode);
    form.reset();
  } catch (err) {
    console.error(err);
    alert("❌ وقع خطأ، عاود جرّب");
  }
});
