
function initHeroSlider(){
  const slides = document.querySelectorAll('#heroSlider .slide');
  if(!slides || slides.length === 0) return;

  let i = 0;
  setInterval(() => {
    slides[i].classList.remove('active');
    i = (i + 1) % slides.length;
    slides[i].classList.add('active');
  }, 3500);
}

function ensureButtonsExist() {
  document.querySelectorAll('.tile, .card').forEach(card => {
    // If any button already exists inside card, don't add a second one
    if (card.querySelector('.model-btn')) return;

    // Also if there is an old Arabic button with different class (btn / etc), remove it
    card.querySelectorAll('a,button').forEach(el => {
      const t = (el.innerText || '').trim();
      if (t.includes('اطلب هذا') || t.includes('اطلب هذا الموديل')) {
        el.remove();
      }
    });

    const titleEl = card.querySelector('h3, h4, .title');
    if (!titleEl) return;

    const title = (titleEl.innerText || '').trim();

    const btn = document.createElement('a');
    btn.className = 'model-btn';
    btn.target = '_blank';
    btn.rel = 'noopener';

    const msg = encodeURIComponent('Bonjour, je veux commander le modèle: ' + title);
    btn.href = 'https://wa.me/212660609353?text=' + msg;

    btn.textContent = 'Commander ce modèle';
    card.appendChild(btn);
  });
}

window.addEventListener('load', () => {
  document.documentElement.lang = 'fr';
  document.documentElement.dir = 'ltr';
  document.body.classList.add('fr');

  // Clean up any Arabic button duplicates first
  document.querySelectorAll('.tile, .card').forEach(card => {
    card.querySelectorAll('a,button').forEach(el => {
      const t = (el.innerText || '').trim();
      if (t.includes('اطلب هذا') || t.includes('اطلب هذا الموديل')) {
        el.remove();
      }
    });
  });

  ensureButtonsExist();
  initHeroSlider();
});
