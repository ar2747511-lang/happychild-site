import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("orderForm");
const statusEl = document.getElementById("orderStatus");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name")?.value?.trim() || "";
  const phone = document.getElementById("phone")?.value?.trim() || "";
  const city = document.getElementById("city")?.value?.trim() || "";

  if (!name || !phone || !city) {
    alert("عافاك كمّل: الاسم + الهاتف + المدينة");
    return;
  }

  try {
    await addDoc(collection(db, "orders"), {
      name,
      phone,
      city,
      status: "new",
      createdAt: serverTimestamp(),
      createdAtMs: Date.now(),
    });

    if (statusEl) statusEl.textContent = "✅ تم إرسال الطلب";
    form.reset();
  } catch (err) {
    console.error(err);
    alert("وقع خطأ");
  }
});
