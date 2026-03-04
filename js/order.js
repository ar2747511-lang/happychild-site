import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCEITs1736SdHkZKpcaUVCvXgp5-Fd-s2E",
  authDomain: "happychild-orders.firebaseapp.com",
  projectId: "happychild-orders",
  storageBucket: "happychild-orders.firebasestorage.app",
  messagingSenderId: "902705815946",
  appId: "1:902705815946:web:933764455a820464046873"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const product = document.getElementById("product").value;

  await addDoc(collection(db, "orders"), {
    name: name,
    phone: phone,
    address: address,
    product: product,
    date: new Date()
  });

  alert("Commande envoyée !");
});
