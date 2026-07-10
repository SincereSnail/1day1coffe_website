/* ============================================
   1일1잔 - Main JavaScript
   ============================================ */

(function () {
  'use strict';

  // ------------------------------------------
  // Navigation
  // ------------------------------------------
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  function updateNavScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavScroll, { passive: true });
  updateNavScroll();

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close mobile menu on outside click
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !navToggle.contains(e.target)) {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // ------------------------------------------
  // Menu Filtering
  // ------------------------------------------
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuItems = document.querySelectorAll('.menu-item');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      menuTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.dataset.category;

      menuItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          item.style.transform = 'translateY(12px)';
          requestAnimationFrame(() => {
            item.style.transition =
              'opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // ------------------------------------------
  // Scroll Reveal Animations
  // ------------------------------------------
  function setupScrollReveal() {
    const revealElements = document.querySelectorAll(
      '.about-card, .menu-item, .interior-card, .info-row, .transport-card, .contact-card > *'
    );

    // Add reveal class if not present
    revealElements.forEach(el => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Stagger delay based on element position within its parent
            const parent = entry.target.parentElement;
            const siblings = Array.from(parent.children).filter(
              child => child.classList.contains('reveal')
            );
            const idx = siblings.indexOf(entry.target);
            const delay = idx * 80;

            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach(el => observer.observe(el));
  }

  // ------------------------------------------
  // Smooth scroll for anchor links
  // ------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // ------------------------------------------
  // Active nav link highlight on scroll
  // ------------------------------------------
  function setupActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinkElements = document.querySelectorAll('.nav-link[href^="#"]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinkElements.forEach(link => {
              link.style.color = '';
              if (link.getAttribute('href') === `#${id}`) {
                link.style.color = 'var(--color-text)';
              }
            });
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-52px 0px -40% 0px',
      }
    );

    sections.forEach(section => observer.observe(section));
  }

  // ------------------------------------------
  // Initialize
  // ------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    setupScrollReveal();
    setupActiveNavLink();
  });

  // Also run on load in case DOMContentLoaded already fired
  if (document.readyState !== 'loading') {
    setupScrollReveal();
    setupActiveNavLink();
  }
})();
