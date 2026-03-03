// Happy Child Universe - WhatsApp helpers (FR)
(function () {
  const IG_URL = 'https://www.instagram.com/happy_child_universe?igsh=dXhqNmhlaDdkdXRi';
  const FB_URL = 'https://www.facebook.com/share/17GgU48R9d/?mibextid=wwXIfr';
  const PHONE = '212660609353';

  function buildWhatsApp(text) {
    if (!PHONE) return 'https://wa.me/212660609353?text=%D8%B3%D9%84%D8%A7%D9%85%20%D8%8C%20%D8%A8%D8%BA%D9%8A%D8%AA%20%D9%86%D8%B7%D9%84%D8%A8%20%D8%AA%D8%B5%D9%85%D9%8A%D9%85%20%D9%85%D9%86%20Happy%20Child.';
    const encoded = encodeURIComponent(text);
    return `https://wa.me/${PHONE}?text=${encoded}`;
  }

  // Social links
  const ig = document.getElementById('igLink');
  const fb = document.getElementById('fbLink');
  if (ig && IG_URL && IG_URL !== '#') ig.href = IG_URL;
  if (fb && FB_URL && FB_URL !== '#') fb.href = FB_URL;

  // Direct WA buttons
  const waMsgDefault = "Bonjour, je souhaite un devis pour une chambre d’enfant sur mesure (Happy Child Universe).";
  const waDirect = document.getElementById('waDirect');
  const waTop = document.getElementById('waTop');
  const waHero = document.getElementById('waHero');
  const waFooter = document.getElementById('waFooter');

  const directUrl = buildWhatsApp(waMsgDefault);
  if (waDirect) waDirect.href = directUrl;
  if (waTop) waTop.href = directUrl;
  if (waHero) waHero.href = directUrl;
  if (waFooter) waFooter.href = directUrl;

  // Quote form -> WhatsApp message
  const form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const fd = new FormData(form);
      const name = (fd.get('name') || '').toString().trim();
      const city = (fd.get('city') || '').toString().trim();
      const phoneInput = (fd.get('phone') || '').toString().trim();
      const message = (fd.get('message') || '').toString().trim();

      const lines = [
        "Bonjour, je souhaite un devis :",
        name ? `- Nom : ${name}` : "",
        city ? `- Ville : ${city}` : "",
        phoneInput ? `- Téléphone : ${phoneInput}` : "",
        message ? `- Détails : ${message}` : ""
      ].filter(Boolean);

      const url = buildWhatsApp(lines.join("\n"));
      window.open(url, '_blank');
    });
  }
})();
