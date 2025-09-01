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
  
  // Add smooth animation
  if (next) {
    mobile.style.opacity = '0';
    mobile.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      mobile.style.transition = 'all 0.3s ease';
      mobile.style.opacity = '1';
      mobile.style.transform = 'translateY(0)';
    }, 10);
  }
}

menuBtn.addEventListener('click', () => toggleMenu());

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) mobile.style.display = 'none';
});

// Theme toggle
const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {
  const isLight = document.documentElement.classList.toggle("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  
  // Add smooth transition effect
  document.body.style.transition = 'all 0.3s ease';
  setTimeout(() => {
    document.body.style.transition = '';
  }, 300);
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

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all cards and sections for animation
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.card, .section-head, .hero-card, .tl-item');
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
  });
});

// Enhanced horizontal scrolling for project cards
document.querySelectorAll('.grid').forEach(grid => {
  let isScrolling = false;
  let startX = 0;
  let scrollLeft = 0;
  
  // Smooth scroll on wheel
  grid.addEventListener('wheel', (e) => {
    e.preventDefault();
    grid.scrollLeft += e.deltaY;
  });
  
  // Touch scrolling for mobile
  grid.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX - grid.offsetLeft;
    scrollLeft = grid.scrollLeft;
  });
  
  grid.addEventListener('touchmove', (e) => {
    if (!isScrolling) return;
    e.preventDefault();
    const x = e.touches[0].pageX - grid.offsetLeft;
    const walk = (x - startX) * 2;
    grid.scrollLeft = scrollLeft - walk;
  });
  
  grid.addEventListener('touchend', () => {
    isScrolling = false;
  });
  
  // Add scroll indicators
  const addScrollIndicators = () => {
    const canScrollLeft = grid.scrollLeft > 0;
    const canScrollRight = grid.scrollLeft < (grid.scrollWidth - grid.clientWidth);
    
    // Remove existing indicators
    const existingIndicators = grid.parentElement.querySelectorAll('.scroll-indicator');
    existingIndicators.forEach(indicator => indicator.remove());
    
    // Add left indicator
    if (canScrollLeft) {
      const leftIndicator = document.createElement('div');
      leftIndicator.className = 'scroll-indicator left';
      leftIndicator.innerHTML = '‹';
      leftIndicator.style.cssText = `
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        width: 40px;
        height: 40px;
        background: rgba(0,0,0,0.7);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        cursor: pointer;
        z-index: 10;
        transition: all 0.3s ease;
      `;
      leftIndicator.addEventListener('click', () => {
        grid.scrollBy({ left: -400, behavior: 'smooth' });
      });
      grid.parentElement.style.position = 'relative';
      grid.parentElement.appendChild(leftIndicator);
    }
    
    // Add right indicator
    if (canScrollRight) {
      const rightIndicator = document.createElement('div');
      rightIndicator.className = 'scroll-indicator right';
      rightIndicator.innerHTML = '›';
      rightIndicator.style.cssText = `
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        width: 40px;
        height: 40px;
        background: rgba(0,0,0,0.7);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        cursor: pointer;
        z-index: 10;
        transition: all 0.3s ease;
      `;
      rightIndicator.addEventListener('click', () => {
        grid.scrollBy({ left: 400, behavior: 'smooth' });
      });
      grid.parentElement.style.position = 'relative';
      grid.parentElement.appendChild(rightIndicator);
    }
  };
  
  // Check scroll indicators on scroll
  grid.addEventListener('scroll', addScrollIndicators);
  
  // Initial check
  addScrollIndicators();
});

// Parallax effect for side images (subtle)
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const sideImages = document.querySelectorAll('.side-img');
  
  sideImages.forEach((img, index) => {
    const speed = 0.1 + (index * 0.05);
    img.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();