function setLang(lang) {
  document.documentElement.lang = lang === 'fr' ? 'fr' : 'ar';
  document.documentElement.dir  = lang === 'fr' ? 'ltr' : 'rtl';

  if (lang === 'fr') {
    document.body.classList.add('fr');
  } else {
    document.body.classList.remove('fr');
  }

  localStorage.setItem('lang', lang);

  // Update WhatsApp links for all model buttons when language changes
  updateModelButtons();
}

function updateModelButtons() {
  const isFR = document.body.classList.contains('fr');

  document.querySelectorAll('.model-btn').forEach(btn => {
    const title = btn.getAttribute('data-model') || '';
    const msgFR = encodeURIComponent("Bonjour, je veux commander le modèle: " + title);
    const msgAR = encodeURIComponent("مرحبا، بغيت نطلب موديل: " + title);
    btn.href = "https://wa.me/212660609353?text=" + (isFR ? msgFR : msgAR);
  });
}

function ensureButtonsExist() {
  // Add button to both old tiles and new cards
  document.querySelectorAll('.tile, .card').forEach(card => {
    if (card.querySelector('.model-btn')) return;

    const h3 = card.querySelector('h3');
    if (!h3) return;

    const title = (h3.innerText || '').trim();

    const btn = document.createElement('a');
    btn.className = 'model-btn';
    btn.target = '_blank';
    btn.rel = 'noopener';
    btn.setAttribute('data-model', title);

    btn.innerHTML = `
      <span class="lang-fr">Commander ce modèle</span>
      <span class="lang-ar">اطلب هذا الموديل</span>
    `;

    card.appendChild(btn);
  });

  updateModelButtons();
}

window.addEventListener('load', () => {
  const saved = localStorage.getItem('lang');
  if (saved) {
    setLang(saved);
  } else {
    setLang('fr'); // Default French
  }

  ensureButtonsExist();
});
