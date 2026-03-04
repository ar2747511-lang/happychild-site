import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("orderForm");

form.addEventListener("submit", async (e) => {

e.preventDefault();

const name = document.getElementById("name").value;
const phone = document.getElementById("phone").value;
const city = document.getElementById("city").value;
const address = document.getElementById("address").value;

try {

await addDoc(collection(db, "orders"), {

name: name,
phone: phone,
city: city,
address: address,
date: new Date()

});

alert("Commande envoyée ✅");

form.reset();

} catch (error) {

console.error(error);

alert("Erreur ❌");

}

});
