import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function qs(name){
  const url = new URL(window.location.href);
  return url.searchParams.get(name) || "";
}

const product = decodeURIComponent(qs("product") || "");
const productInput = document.getElementById("product");
if(productInput) productInput.value = product;

const form = document.getElementById("orderForm");
const statusEl = document.getElementById("orderStatus");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "Sending...";
  statusEl.className = "form-status";

  const data = {
    product: form.product.value.trim(),
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    city: form.city.value.trim(),
    notes: form.notes.value.trim(),
    status: "new",
    createdAt: serverTimestamp()
  };

  try{
    await addDoc(collection(db, "orders"), data);
    form.reset();
    if(productInput) productInput.value = product; // keep product
    statusEl.textContent = "✅ Order sent successfully!";
    statusEl.className = "form-status ok";
  }catch(err){
    console.error(err);
    statusEl.textContent = "❌ Error sending order. Check Firebase config.";
    statusEl.className = "form-status err";
  }
});
