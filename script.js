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
  // Smooth scroll on wheel
  grid.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      grid.scrollLeft += e.deltaY;
    }
  });
});

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

    smoothScrollTo(targetY, 1100); // ← tune duration (ms)
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