(function () {
  'use strict';

  /* ---------- Mobile menu (instant toggle — no transition) ---------- */
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');
  if (toggle && menu) {
    var setMenu = function (open) {
      if (open) {
        menu.removeAttribute('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Close menu');
      } else {
        menu.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      }
    };
    toggle.addEventListener('click', function () {
      setMenu(menu.hasAttribute('hidden'));
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hasAttribute('hidden')) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Scroll-spy for desktop nav ---------- */
  var navLinks = document.querySelectorAll('.site-nav a');
  var sections = Array.prototype.slice.call(navLinks).map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  }).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        navLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === id);
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.accordion-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.closest('.accordion-item').querySelector('.accordion-panel');
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      if (open) { panel.setAttribute('hidden', ''); }
      else { panel.removeAttribute('hidden'); }
    });
  });

  /* ---------- Lightbox ---------- */
  var tiles = Array.prototype.slice.call(document.querySelectorAll('.gallery-tile'));
  var lightbox = document.getElementById('lightbox');
  var lbImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  var current = 0;
  var show = function (i) {
    current = (i + tiles.length) % tiles.length;
    var tile = tiles[current];
    lbImg.src = tile.getAttribute('data-full');
    lbImg.alt = tile.getAttribute('data-alt') || '';
  };
  var openLb = function (i) {
    show(i);
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox-close').focus();
  };
  var closeLb = function () {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
    if (tiles[current]) tiles[current].focus();
  };
  if (lightbox && tiles.length) {
    tiles.forEach(function (tile, i) {
      tile.addEventListener('click', function () { openLb(i); });
    });
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLb);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', function () { show(current - 1); });
    lightbox.querySelector('.lightbox-next').addEventListener('click', function () { show(current + 1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLb();
    });
    document.addEventListener('keydown', function (e) {
      if (lightbox.hasAttribute('hidden')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  /* ---------- Reveal on scroll (subtle, motion-safe) ---------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var revealEls = document.querySelectorAll('.food-card, .why-card, .step, .gallery-tile');
    revealEls.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      el.style.transition = 'opacity .5s ease, transform .5s ease';
    });
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        ro.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    revealEls.forEach(function (el) { ro.observe(el); });
    // Safety: never leave content hidden if the observer stalls.
    setTimeout(function () {
      revealEls.forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }, 4000);
  }
})();
