// ─── CURSOR GLOW ───
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

// ─── HAMBURGER ───
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ─── SCROLL REVEAL ───
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ─── ACTIVE NAV ───
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  navAs.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
  });
});

// ─── FORM HANDLER ───
function handleFormSubmit() {
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const status  = document.getElementById('formStatus');

  if (!name || !email || !message) {
    status.style.display = 'block';
    status.style.background = 'rgba(239,68,68,.15)';
    status.style.color = '#f87171';
    status.style.border = '1px solid rgba(239,68,68,.3)';
    status.textContent = 'Please fill in all fields.';
    return;
  }

  // Compose mailto link
  const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
  const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.open(`mailto:alcontinebenezer07@gmail.com?subject=${subject}&body=${body}`, '_blank');

  status.style.display = 'block';
  status.style.background = 'rgba(34,197,94,.12)';
  status.style.color = '#4ade80';
  status.style.border = '1px solid rgba(34,197,94,.25)';
  status.textContent = '✓ Opening your mail client…';

  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  document.getElementById('message').value = '';

  setTimeout(() => { status.style.display = 'none'; }, 4000);
}

// ─── PROFILE IMAGE LIGHTBOX ───
(function () {
  const avatarImg   = document.querySelector('.avatar-inner img');
  const overlay     = document.getElementById('avatarOverlay');
  let clone         = null;
  let isOpen        = false;

  if (!avatarImg || !overlay) return;

  avatarImg.style.cursor = 'pointer';

  function openLightbox() {
    if (isOpen) return;
    isOpen = true;

    // Measure original position
    const ring = document.querySelector('.avatar-ring');
    const rect = ring.getBoundingClientRect();
    const vw   = window.innerWidth;
    const vh   = window.innerHeight;
    const targetSize = Math.min(vw, vh) * 0.52;

    // Build clone
    clone = document.createElement('div');
    clone.className = 'avatar-clone';
    clone.style.cssText = `
      width: ${rect.width}px;
      height: ${rect.height}px;
      top: ${rect.top}px;
      left: ${rect.left}px;
    `;

    const inner = document.createElement('div');
    inner.className = 'avatar-clone-inner';

    const img = document.createElement('img');
    img.src = avatarImg.src;
    img.alt = avatarImg.alt;

    inner.appendChild(img);
    clone.appendChild(inner);
    document.body.appendChild(clone);

    // Hide original ring while clone is flying
    ring.style.opacity = '0';

    // Activate overlay
    overlay.classList.add('active');
    clone.addEventListener('click', closeLightbox);

    // Fly to center on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        clone.classList.add('expanded');
        clone.style.width  = targetSize + 'px';
        clone.style.height = targetSize + 'px';
        clone.style.top    = (vh / 2 - targetSize / 2) + 'px';
        clone.style.left   = (vw / 2 - targetSize / 2) + 'px';
      });
    });
  }

  function closeLightbox() {
    if (!isOpen || !clone) return;

    const ring = document.querySelector('.avatar-ring');
    const rect = ring.getBoundingClientRect();

    // Fly back to original position
    clone.classList.remove('expanded');
    clone.style.width  = rect.width + 'px';
    clone.style.height = rect.height + 'px';
    clone.style.top    = rect.top + 'px';
    clone.style.left   = rect.left + 'px';
    clone.style.boxShadow = 'none';

    overlay.classList.remove('active');

    clone.addEventListener('transitionend', () => {
      if (clone) { clone.remove(); clone = null; }
      ring.style.opacity = '1';
      isOpen = false;
    }, { once: true });
  }

  avatarImg.addEventListener('click', openLightbox);
  overlay.addEventListener('click', closeLightbox);
})();

// ─── PILL HOVER STAGGER ───
document.querySelectorAll('.pill').forEach((p, i) => {
  p.style.transitionDelay = (i * 30) + 'ms';
});
