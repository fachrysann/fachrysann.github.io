// ====== UTIL ======
const $ = (q, c=document) => c.querySelector(q);
const $$ = (q, c=document) => Array.from(c.querySelectorAll(q));

// Year
$('#year').textContent = new Date().getFullYear();

// Mobile menu
const menuBtn = $('#menuBtn');
const mobile = $('#mobileMenu');
function toggleMenu(force){
  const next = typeof force === 'boolean' ? force : mobile.style.display !== 'block';
  mobile.style.display = next ? 'block' : 'none';
}
menuBtn.addEventListener('click', () => toggleMenu());
window.addEventListener('resize', () => { if (window.innerWidth > 900) mobile.style.display = 'none'; });


const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {
  const isLight = document.documentElement.classList.toggle("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();