import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  runTransaction,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("orderForm");

// Anti-spam بسيط: منع إرسال بزاف فدقيقة
let lastSubmitAt = 0;

async function getNextOrderNumber() {
  const counterRef = doc(db, "meta", "counters");
  const next = await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const data = snap.exists() ? snap.data() : {};
    const current = Number(data.orders || 0);
    const newValue = current + 1;
    tx.set(counterRef, { orders: newValue }, { merge: true });
    return newValue;
  });
  return next;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const now = Date.now();
  if (now - lastSubmitAt < 60_000) {
    alert("سنى شوية ومن بعد عاود جرّب 🙏");
    return;
  }
  lastSubmitAt = now;

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const city = document.getElementById("city").value.trim();

  try {
    const n = await getNextOrderNumber();
    const orderCode = "ORD-" + String(n).padStart(5, "0");

    await addDoc(collection(db, "orders"), {
      orderNumber: n,
      orderCode: orderCode,
      name,
      phone,
      city,
      status: "NEW",
      createdAt: serverTimestamp()
    });

    alert("✅ تم إرسال الطلب بنجاح\n" + orderCode);
    form.reset();

  } catch (error) {
    console.error(error);
    alert("❌ وقع خطأ");
  }
});
