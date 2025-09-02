// ====== UTIL ======
const $ = (q, c=document) => c.querySelector(q);
const $$ = (q, c=document) => Array.from(c.querySelectorAll(q));

// Year
$('#year').textContent = new Date().getFullYear();

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const mobile = document.getElementById('mobileMenu');

function toggleMenu(force) {
  const next = typeof force === 'boolean' ? force : mobile && mobile.style.display !== 'block';
  if (!mobile) return;
  mobile.style.display = next ? 'block' : 'none';
}

menuBtn && menuBtn.addEventListener('click', () => toggleMenu());

window.addEventListener('resize', () => {
  if (window.innerWidth > 900 && mobile) mobile.style.display = 'none';
});

// Theme toggle
const themeBtn = document.getElementById("themeBtn");

themeBtn && themeBtn.addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      // Close mobile menu if open
      if (mobile && mobile.style.display === 'block') {
        toggleMenu(false);
      }
    }
  });
});

// Simple horizontal scrolling for project cards
document.querySelectorAll('.grid').forEach(grid => {
  // Smooth horizontal scroll with mouse wheel/trackpad on desktop
  grid.addEventListener('wheel', (e) => {
    const isScrollable = grid.scrollWidth > grid.clientWidth;
    if (!isScrollable) return; // don't intercept if there's nothing to scroll

    // Normalize deltas (deltaMode: 0=pixels, 1=lines)
    const unit = e.deltaMode === 1 ? 16 : 1;
    const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    const delta = raw * unit * 1.2; // amplify slightly for desktop wheels

    if (delta !== 0) {
      e.preventDefault();
      grid.scrollLeft += delta;
    }
  }, { passive: false });

  // Click-and-drag (pointer) panning for desktop
  let isDragging = false;
  let startX = 0;
  let startLeft = 0;

  grid.addEventListener('pointerdown', (e) => {
    if (grid.scrollWidth <= grid.clientWidth) return;
    isDragging = true;
    startX = e.clientX;
    startLeft = grid.scrollLeft;
    grid.setPointerCapture(e.pointerId);
    grid.style.cursor = 'grabbing';
  });

  grid.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const dx = e.clientX - startX;
    grid.scrollLeft = startLeft - dx;
  });

  const endDrag = (e) => {
    if (!isDragging) return;
    isDragging = false;
    try { grid.releasePointerCapture(e.pointerId); } catch (_) {}
    grid.style.cursor = '';
  };
  grid.addEventListener('pointerup', endDrag);
  grid.addEventListener('pointercancel', endDrag);
});

// Fallback: capture wheel anywhere over a .grid to ensure horizontal slide on desktop
document.addEventListener('wheel', (e) => {
  let grid = e.target && e.target.closest ? e.target.closest('.grid') : null;
  // If not directly over a grid, but inside projects section, target its grid
  if (!grid) {
    const section = e.target && e.target.closest ? e.target.closest('section') : null;
    if (section && section.querySelector && section.id === 'projects') {
      grid = section.querySelector('.grid');
    }
  }
  if (!grid) return;
  if (grid.scrollWidth <= grid.clientWidth) return;

  const unit = e.deltaMode === 1 ? 16 : 1;
  const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  const delta = raw * unit * 1.2;
  if (delta === 0) return;
  e.preventDefault();
  grid.scrollLeft += delta;
}, { passive: false });

// Hero parallax effect for decorative elements
const heroDecor = document.querySelector('.hero-decor');
window.addEventListener('scroll', () => {
  if (!heroDecor) return;
  // Make background elements move slower than the scroll
  const offset = window.scrollY * 0.1;
  heroDecor.style.transform = `translateY(${offset}px)`;
});

// Footer year already set above.
function smoothScrollTo(targetY, duration = 1000) {
  const startY = window.scrollY || window.pageYOffset;
  const distance = targetY - startY;
  const startTime = performance.now();

  // easeInOutQuad
  const ease = (t) => (t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t);

  function step(now) {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / duration);
    const eased = ease(t);
    window.scrollTo(0, startY + distance * eased);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const HEADER_H = parseInt(getComputedStyle(document.documentElement)
  .getPropertyValue('--header-h')) || 70;

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();

    const rect = target.getBoundingClientRect();
    const targetY = window.scrollY + rect.top - HEADER_H;

    smoothScrollTo(targetY, 100); // ← tune duration (ms)
    // If your mobile menu is open, close it here as you already do
  });
});

// Reveal on scroll for all sections (fade-in)
(() => {
  const sections = Array.from(document.querySelectorAll('main section'));
  if (!sections.length) return;

  sections.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  sections.forEach(el => io.observe(el));
})();