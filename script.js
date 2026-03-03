// ✅ بدّل هاد الرقم لرقم واتساب ديالكم (مع كود الدولة) مثال المغرب: 2126xxxxxxx
const WHATSAPP_NUMBER = "212660609353";

/** Simple i18n */
const I18N = {
  ar: {
    topbar_hint: "✨ فضاء كيخلي الخيال يولي حقيقة",
    topbar_cta: "اطلب عرض السعر",
    nav_services: "الخدمات",
    nav_models: "الموديلات",
    nav_portfolio: "أعمالنا",
    nav_contact: "تواصل معنا",
    brand_tagline: "عالم الطفل السعيد",
    hero_badge: "تصميم • تصنيع • تركيب",
    hero_h1: 'نصمّم غرف أطفال <span class="accent">راقية وناعمة</span> حسب الطلب',
    hero_lead: "كنخدمو غير بالموديلات اللي كنصايبوهم فعلاً.<br>تصميم 3D قبل التنفيذ + جودة عالية + تركيب احترافي.",
    hero_cta_primary: "اطلب تصميمك الآن",
    hero_cta_secondary: "شوف الأعمال",
    trust_1: "✅ موديلات حقيقية",
    trust_2: "✅ تشطيب راقي",
    trust_3: "✅ خدمة 3D",
    hero_card_title: "3D قبل التنفيذ",
    hero_card_sub: "باش تشوف النتيجة قبل ما نبداو الخدمة",
    services_h2: "الخدمات ديالنا",
    services_p: "من الفكرة حتى التركيب… كلشي عندنا.",
    svc1_h3: "تصميم 3D",
    svc1_p: "كنصايبو تصور شامل للغرفة باش تكون مطمّن قبل التنفيذ.",
    svc2_h3: "تصنيع حسب القياس",
    svc2_p: "أسِرّة، خزانات، مكاتب، ديكور جداري… حسب المساحة والستايل.",
    svc3_h3: "تركيب احترافي",
    svc3_p: "تركيب نظيف ومحترم للسلامة، ونتيجة فخمة.",
    models_h2: "موديلات من خدمتنا",
    models_p: "هاد الصور من مشاريع/موديلات Happy Child.",
    model_01_title: "غرفة الأرنب",
    model_01_desc: "موديل سرير أرنب بتفاصيل ناعمة وتشطيب راقي.",
    model_02_title: "غرفة ميكي",
    model_02_desc: "موديل سرير ميكي (ستايل هادئ) مع إمكانيات تخصيص.",
    model_03_title: "غرفة بابلّي",
    model_03_desc: "موديل سرير ستايل سحابة بألوان منعشة.",
    model_04_title: "سرير البيت",
    model_04_desc: "موديل سرير على شكل بيت مع درج/سلم عملي.",
    model_05_title: "سرير ستايل ناعم",
    model_05_desc: "ألوان دافئة + راحة + تفاصيل راقية.",
    model_06_title: "ستايل البيت بإضاءة",
    model_06_desc: "ديكور House مع لمسة مضيئة ساحرة.",
    model_07_title: "خزانة شكل دار",
    model_07_desc: "تنظيم + شكل جميل للأطفال.",
    model_08_title: "مكتب + ديكور جداري",
    model_08_desc: "حل عملي للدراسة بستايل عصري.",
    model_09_title: "غرفة متكاملة (ستايل ناعم)",
    model_09_desc: "سرير + خزانة + مكتب بنفس الستايل.",
    model_10_title: "غرفة بإضاءة ديكور",
    model_10_desc: "تفاصيل راقية وإضاءة كتزيد جمال الغرفة.",
    model_11_title: "خزانة + رفوف تنظيم",
    model_11_desc: "حل ذكي للتخزين مع شكل كيعجب الأطفال.",
    model_12_title: "ديكور House + رفوف",
    model_12_desc: "ستايل عصري للأطفال ولمسة ديكور فخمة.",
    portfolio_h2: "أعمالنا",
    portfolio_p: "نماذج من غرف منجزة بلمسة Happy Child.",
    port_cap1: "غرفة فاخرة بألوان ناعمة + مكتب + رفوف",
    port_cap2: "تصميم متكامل + إضاءة + تفاصيل ديكور راقية",
    portfolio_cta: "بغيتي نفس الستايل؟ تواصل معنا",
    contact_h2: "اطلب عرض السعر",
    contact_p: "عمر المعلومات وغادي نحيدو عليك الحيرة 👇",
    form_name_label: "الاسم",
    form_name_ph: "مثال: Anouar",
    form_city_label: "المدينة",
    form_city_ph: "مثال: Casablanca",
    form_phone_label: "رقم الهاتف",
    form_phone_ph: "06xxxxxxxx",
    form_msg_label: "شنو باغي؟",
    form_msg_ph: "نوع الموديل + القياسات + اللون...",
    form_submit: "إرسال عبر واتساب",
    form_note: "كيتحل واتساب برسالة جاهزة.",
    wa_title: "واتساب مباشر",
    wa_p: "بدّل الرقم فـ <b>script.js</b>",
    wa_open: "فتح واتساب",
    ig_title: "إنستغرام",
    ig_visit: "زيارة الحساب",
    footer_muted: "مشاريع حقيقية فقط",
    wa_direct_msg: "سلام، بغيت معلومات على تصميم غرفة أطفال حسب الطلب.",
    wa_form_template:
`سلام، بغيت Devis 👇
الاسم: {name}
المدينة: {city}
الهاتف: {phone}
الطلب: {message}`,
    wa_float_msg: "سلام، بغيت نطلب تصميم من Happy Child."
  },
  fr: {
    topbar_hint: "✨ Un espace où l’imagination prend vie",
    topbar_cta: "Demander un devis",
    nav_services: "Services",
    nav_models: "Modèles",
    nav_portfolio: "Réalisations",
    nav_contact: "Contact",
    brand_tagline: "L’univers de l’enfant heureux",
    hero_badge: "Design • Fabrication • Installation",
    hero_h1: 'Nous créons des chambres enfant <span class="accent">douces & premium</span> sur mesure',
    hero_lead: "Des modèles réels, réalisés par notre équipe.<br>3D avant fabrication + qualité premium + installation professionnelle.",
    hero_cta_primary: "Demander mon design",
    hero_cta_secondary: "Voir les réalisations",
    trust_1: "✅ Modèles réels",
    trust_2: "✅ Finition premium",
    trust_3: "✅ Service 3D",
    hero_card_title: "3D avant fabrication",
    hero_card_sub: "Pour voir le rendu final avant de commencer",
    services_h2: "Nos services",
    services_p: "De l’idée à l’installation… on s’occupe de tout.",
    svc1_h3: "Design 3D",
    svc1_p: "Visualisation complète de la chambre avant fabrication.",
    svc2_h3: "Fabrication sur mesure",
    svc2_p: "Lits, armoires, bureaux, déco murale… selon vos dimensions.",
    svc3_h3: "Installation pro",
    svc3_p: "Pose propre, sécurisée, et résultat haut de gamme.",
    models_h2: "Nos modèles",
    models_p: "Exemples de modèles / projets Happy Child.",
    model_01_title: "Chambre Lapinou",
    model_01_desc: "Lit tête lapin, détails doux et finition premium.",
    model_02_title: "Chambre Mickey",
    model_02_desc: "Lit style Mickey, ambiance calme avec options de personnalisation.",
    model_03_title: "Chambre Bubbly",
    model_03_desc: "Lit style nuage, couleurs fraîches et design moderne.",
    model_04_title: "Lit Maison",
    model_04_desc: "Lit en forme de maison avec escalier/tiroirs pratiques.",
    model_05_title: "Lit style doux",
    model_05_desc: "Couleurs chaleureuses, confort et finitions élégantes.",
    model_06_title: "Style maison avec éclairage",
    model_06_desc: "Déco House avec une touche lumineuse magique.",
    model_07_title: "Armoire forme maison",
    model_07_desc: "Rangement + design adorable pour enfants.",
    model_08_title: "Bureau + déco murale",
    model_08_desc: "Espace étude pratique au style moderne.",
    model_09_title: "Chambre complète (style doux)",
    model_09_desc: "Lit + armoire + bureau dans le même style.",
    model_10_title: "Chambre avec éclairage déco",
    model_10_desc: "Détails premium avec éclairage qui sublime la chambre.",
    model_11_title: "Armoire + étagères",
    model_11_desc: "Solution rangement intelligente, appréciée des enfants.",
    model_12_title: "Déco House + étagères",
    model_12_desc: "Style moderne avec une touche déco premium.",
    portfolio_h2: "Nos réalisations",
    portfolio_p: "Quelques exemples de chambres réalisées.",
    port_cap1: "Chambre premium + bureau + rangements",
    port_cap2: "Design complet + éclairage + détails déco",
    portfolio_cta: "Vous aimez ce style ? Contactez-nous",
    contact_h2: "Demander un devis",
    contact_p: "Remplissez le formulaire et on vous répond sur WhatsApp 👇",
    form_name_label: "Nom",
    form_name_ph: "Ex: Anouar",
    form_city_label: "Ville",
    form_city_ph: "Ex: Casablanca",
    form_phone_label: "Téléphone",
    form_phone_ph: "06xxxxxxxx",
    form_msg_label: "Votre demande",
    form_msg_ph: "Modèle + dimensions + couleur…",
    form_submit: "Envoyer sur WhatsApp",
    form_note: "WhatsApp s’ouvre avec un message prêt.",
    wa_title: "WhatsApp direct",
    wa_p: "Modifiez le numéro dans <b>script.js</b>",
    wa_open: "Ouvrir WhatsApp",
    ig_title: "Instagram",
    ig_visit: "Voir le compte",
    footer_muted: "Projets réels uniquement",
    wa_direct_msg: "Bonjour, je souhaite des infos sur une chambre enfant sur mesure.",
    wa_form_template:
`Bonjour, je souhaite un devis 👇
Nom: {name}
Ville: {city}
Téléphone: {phone}
Demande: {message}`,
    wa_float_msg: "Bonjour, je souhaite commander un design chez Happy Child."
  }
};

function waLink(message){
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

function applyI18n(lang){
  const dict = I18N[lang] || I18N.ar;

  // direction + html lang
  document.documentElement.lang = (lang === "fr") ? "fr" : "ar";
  document.documentElement.dir = (lang === "fr") ? "ltr" : "rtl";
  document.body.classList.toggle("fr", lang === "fr");

  // buttons active
  document.getElementById("langAr")?.classList.toggle("active", lang !== "fr");
  document.getElementById("langFr")?.classList.toggle("active", lang === "fr");

  // text nodes
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if(dict[key] != null) el.textContent = dict[key];
  });

  // html nodes
  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    const key = el.getAttribute("data-i18n-html");
    if(dict[key] != null) el.innerHTML = dict[key];
  });

  // placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if(dict[key] != null) el.setAttribute("placeholder", dict[key]);
  });

  // WhatsApp links
  const waDirect = document.getElementById("waDirect");
  const waFloat = document.getElementById("waFloat");
  if(waDirect) waDirect.href = waLink(dict.wa_direct_msg);
  if(waFloat) waFloat.href = waLink(dict.wa_float_msg);

  // Update submit behavior template in form handler
  window.__HC_LANG = lang;
}

function getLang(){
  return localStorage.getItem("lang") || "ar";
}

function setLang(lang){
  localStorage.setItem("lang", lang);
  applyI18n(lang);
}

/** Burger menu */
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
burger?.addEventListener("click", () => nav.classList.toggle("open"));

/** Year */
document.getElementById("year").textContent = new Date().getFullYear();

/** Form -> WhatsApp */
const form = document.getElementById("quoteForm");
form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const lang = window.__HC_LANG || getLang();
  const dict = I18N[lang] || I18N.ar;

  const data = new FormData(form);
  const name = (data.get("name") || "").toString().trim();
  const city = (data.get("city") || "").toString().trim();
  const phone = (data.get("phone") || "").toString().trim();
  const message = (data.get("message") || "").toString().trim();

  const text = dict.wa_form_template
    .replace("{name}", name)
    .replace("{city}", city)
    .replace("{phone}", phone)
    .replace("{message}", message);

  window.open(waLink(text), "_blank");
});

/** Language switch init */
document.getElementById("langAr")?.addEventListener("click", () => setLang("ar"));
document.getElementById("langFr")?.addEventListener("click", () => setLang("fr"));

applyI18n(getLang());
