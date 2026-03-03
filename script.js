function ensureButtonsExist() {
  document.querySelectorAll('.tile, .card').forEach(card => {
    if (card.querySelector('.model-btn')) return;

    const titleEl = card.querySelector('h3, h4, .title');
    if (!titleEl) return;

    const title = (titleEl.innerText || '').trim();

    const btn = document.createElement('a');
    btn.className = 'model-btn';
    btn.target = '_blank';
    btn.rel = 'noopener';

    const msg = encodeURIComponent("Bonjour, je veux commander le modèle: " + title);
    btn.href = "https://wa.me/212660609353?text=" + msg;

    btn.textContent = "Commander ce modèle";
    card.appendChild(btn);
  });
}

window.addEventListener('load', () => {
  // French only
  document.documentElement.lang = 'fr';
  document.documentElement.dir = 'ltr';
  document.body.classList.add('fr');

  ensureButtonsExist();
});
