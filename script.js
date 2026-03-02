// ✅ بدّل هاد الرقم لرقم واتساب ديالكم (مع كود الدولة) مثال المغرب: 2126xxxxxxx
const WHATSAPP_NUMBER = "212660609353";

const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
burger?.addEventListener("click", () => nav.classList.toggle("open"));

document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("quoteForm");
const waDirect = document.getElementById("waDirect");

function waLink(message){
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

waDirect.href = waLink("سلام، بغيت معلومات على تصميم غرفة أطفال حسب الطلب.");

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const name = (data.get("name") || "").toString().trim();
  const city = (data.get("city") || "").toString().trim();
  const phone = (data.get("phone") || "").toString().trim();
  const message = (data.get("message") || "").toString().trim();

  const text =
`سلام، بغيت Devis 👇
الاسم: ${name}
المدينة: ${city}
الهاتف: ${phone}
الطلب: ${message}`;

  window.open(waLink(text), "_blank");
});
