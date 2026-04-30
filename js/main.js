/* ============================================================
   HILLIARD TIME — main.js
   ============================================================ */

'use strict';

/* ────────────────────────────────────────
   LIVE ANALOG CLOCK
   ──────────────────────────────────────── */
(function initClock() {
    const hourHand   = document.getElementById('hourHand');
    const minuteHand = document.getElementById('minuteHand');
    const secondHand = document.getElementById('secondHand');
    const markers    = document.getElementById('clockMarkers');

    if (!hourHand || !markers) return;

    // Generate 60 tick marks (major at every 5th)
    for (let i = 0; i < 60; i++) {
        const el = document.createElement('div');
        el.className = 'clock__marker ' + (i % 5 === 0 ? 'clock__marker--major' : 'clock__marker--minor');
        el.style.transform = `rotate(${i * 6}deg)`;
        markers.appendChild(el);
    }

    // Track cumulative rotation to avoid jumps at 360→0
    let prevSec = -1;
    let secOffset = 0;

    function tick() {
        const now  = new Date();
        const ms   = now.getMilliseconds();
        const s    = now.getSeconds();
        const m    = now.getMinutes();
        const h    = now.getHours() % 12;

        // Detect 59→0 rollover and add full rotation
        if (prevSec === 59 && s === 0) secOffset += 360;
        prevSec = s;

        const secDeg  = secOffset + s * 6 + ms * 0.006;
        const minDeg  = m * 6 + s * 0.1;
        const hourDeg = h * 30 + m * 0.5;

        secondHand.style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
        minuteHand.style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
        hourHand.style.transform   = `translateX(-50%) rotate(${hourDeg}deg)`;

        requestAnimationFrame(tick);
    }

    tick();
})();


/* ────────────────────────────────────────
   NAV SCROLL EFFECT
   ──────────────────────────────────────── */
(function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    function onScroll() {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
})();


/* ────────────────────────────────────────
   MOBILE MENU
   ──────────────────────────────────────── */
(function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    if (!hamburger || !mobileNav) return;

    function openMenu() {
        hamburger.classList.add('active');
        mobileNav.classList.add('open');
        mobileNav.removeAttribute('aria-hidden');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        if (mobileNav.classList.contains('open')) closeMenu();
        else openMenu();
    });

    mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMenu();
    });
})();


/* ────────────────────────────────────────
   SCROLL REVEAL (Intersection Observer)
   ──────────────────────────────────────── */
(function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // animate once only
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
})();


/* ────────────────────────────────────────
   CONTACT FORM
   ──────────────────────────────────────── */
(function initForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const original = btn.textContent;

        // Basic client-side validation
        const name  = form.querySelector('#name');
        const email = form.querySelector('#email');

        if (!name.value.trim() || !email.value.trim()) {
            [name, email].forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#c0392b';
                    field.addEventListener('input', () => {
                        field.style.borderColor = '';
                    }, { once: true });
                }
            });
            return;
        }

        // Simulate successful send (wire up to EmailJS / Formspree / backend as needed)
        btn.textContent = 'Sending…';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = 'Inquiry Sent ✓';
            btn.style.background = '#1a3a2a';
            btn.style.color = '#7ec8a0';

            setTimeout(() => {
                btn.textContent = original;
                btn.disabled = false;
                btn.style.background = '';
                btn.style.color = '';
                form.reset();
            }, 4000);
        }, 1000);
    });
})();


/* ────────────────────────────────────────
   SMOOTH ANCHOR SCROLL
   (fallback for browsers without scroll-behavior: smooth)
   ──────────────────────────────────────── */
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
})();
