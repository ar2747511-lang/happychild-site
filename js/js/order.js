import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  runTransaction
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("orderForm");

function getParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name) || "";
}

async function getNextOrderNumber() {
  const counterRef = doc(db, "counters", "orders"); // لازم تكون دايرها فـ firestore

  const next = await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const current = snap.exists() ? (snap.data().orders || 0) : 0;
    const newValue = current + 1;
    tx.set(counterRef, { orders: newValue }, { merge: true });
    return newValue;
  });

  return next;
}

let lastSubmitAt = 0;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const now = Date.now();
  if (now - lastSubmitAt < 60000) {
    alert("صافي ثواني و عاود جرّب 🙏");
    return;
  }
  lastSubmitAt = now;

  // ⚠️ تأكد IDs فـ order.html: name, phone, city, address, notes
  const name = document.getElementById("name")?.value.trim() || "";
  const phone = document.getElementById("phone")?.value.trim() || "";
  const city = document.getElementById("city")?.value.trim() || "";
  const address = document.getElementById("address")?.value.trim() || "";
  const notes = document.getElementById("notes")?.value.trim() || "";

  const product = getParam("product");
  const productName = getParam("name");

  try {
    const n = await getNextOrderNumber();
    const orderCode = "ORD-" + String(n).padStart(5, "0");

    await addDoc(collection(db, "orders"), {
      orderNumber: n,
      orderCode: orderCode,

      product: product || "",
      productName: productName || "",

      name,
      phone,
      city,
      address,
      notes,

      status: "NEW",

      // ✅ هادي هي المهمة باش admin القديم يخدم
      date: serverTimestamp(),
      createdAt: serverTimestamp(),
    });

    alert("✅ تم إرسال الطلب بنجاح\n" + orderCode);
    form.reset();
  } catch (err) {
    console.error(err);
    alert("وقع خطأ");
  }
});
