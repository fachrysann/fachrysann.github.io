// ====== UTIL ======
const $ = (q, c=document) => c.querySelector(q);
const $$ = (q, c=document) => Array.from(c.querySelectorAll(q));

// Year
$('#year').textContent = new Date().getFullYear();

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const mobile = document.getElementById('mobileMenu');

function toggleMenu(force) {
  const next = typeof force === 'boolean' ? force : mobile.style.display !== 'block';
  mobile.style.display = next ? 'block' : 'none';
}

menuBtn.addEventListener('click', () => toggleMenu());

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) mobile.style.display = 'none';
});

// Theme toggle
const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {
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
      if (mobile.style.display === 'block') {
        toggleMenu(false);
      }
    }
  });
});

// Simple horizontal scrolling for project cards
document.querySelectorAll('.grid').forEach(grid => {
  // Smooth scroll on wheel
  grid.addEventListener('wheel', (e) => {
    e.preventDefault();
    grid.scrollLeft += e.deltaY;
  });
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();