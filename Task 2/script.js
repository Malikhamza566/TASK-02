/* ============================================================
   SCRIPT.JS  —  Premium Portfolio Animations
   Author: Senior Frontend Developer
   All GSAP animation logic is clearly commented.
   ============================================================ */

/* ─── Register GSAP plugins ─────────────────────────────── */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ─── Utility: DOM selector helpers ─────────────────────── */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   1. CUSTOM CURSOR
   Two-layer cursor: a tiny dot that tracks the mouse instantly,
   and a ring that follows with a slight lag (CSS transition).
============================================================ */
(function initCursor() {
  const cursor   = qs('#cursor');
  const follower = qs('#cursor-follower');
  if (!cursor || !follower) return;

  // Move cursor dot directly to mouse position
  document.addEventListener('mousemove', (e) => {
    gsap.set(cursor,   { x: e.clientX, y: e.clientY });
    gsap.to(follower,  { x: e.clientX, y: e.clientY, duration: 0.18, ease: 'power2.out' });
  });

  // Grow follower ring on interactive elements
  const hoverTargets = 'a, button, .project-card, .social-link, input, textarea';
  document.addEventListener('mouseover', (e) => {
    if (e.target.matches(hoverTargets)) {
      gsap.to(follower, { width: 60, height: 60, duration: 0.3, ease: 'power2.out' });
      gsap.to(follower, { borderColor: 'var(--clr-accent)', duration: 0.3 });
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.matches(hoverTargets)) {
      gsap.to(follower, { width: 36, height: 36, duration: 0.3, ease: 'power2.out' });
      gsap.to(follower, { borderColor: 'rgba(255,255,255,0.5)', duration: 0.3 });
    }
  });
})();

/* ============================================================
   2. PAGE LOADER
   Animate a progress bar, then reveal the page and kick off
   the hero entrance animations.
============================================================ */
(function initLoader() {
  const loader = qs('#loader');
  if (!loader) return;

  // After the bar animation finishes (1.6 s CSS), slide the
  // loader up and begin hero animations.
  const tl = gsap.timeline({ delay: 1.8 });
  tl.to(loader, {
    yPercent: -100,
    duration: 0.9,
    ease: 'power4.inOut',
    onComplete: () => {
      loader.style.display = 'none';
      document.body.style.overflow = '';
      initHeroAnimations();   // start hero only after loader leaves
    },
  });

  // Prevent scroll while loading
  document.body.style.overflow = 'hidden';
})();

/* ============================================================
   3. HEADER — scroll behaviour & active link highlight
============================================================ */
(function initHeader() {
  const header   = qs('#header');
  const navLinks = qsa('.nav__link');

  /* Add "scrolled" class to trigger glass-morphism style */
  ScrollTrigger.create({
    start: 'top -60',
    onToggle: (self) => header.classList.toggle('scrolled', self.isActive),
  });

  /* Active link highlight on scroll
     Each section gets a ScrollTrigger; when it enters the
     viewport the corresponding nav link gets .active class. */
  const sections = qsa('section[id]');
  sections.forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end:   'bottom 55%',
      onEnter:     () => setActive(section.id),
      onEnterBack: () => setActive(section.id),
    });
  });

  function setActive(id) {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.section === id);
    });
  }

  /* Smooth scroll for all anchor links */
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    e.preventDefault();
    const target = qs(anchor.getAttribute('href'));
    if (target) gsap.to(window, { scrollTo: { y: target, offsetY: 80 }, duration: 1.2, ease: 'power3.inOut' });
  });
})();

/* ============================================================
   4. MOBILE MENU
   Hamburger toggles a full-screen overlay; links inside close it.
============================================================ */
(function initMobileMenu() {
  const hamburger  = qs('#hamburger');
  const mobileMenu = qs('#mobile-menu');
  if (!hamburger || !mobileMenu) return;

  const menuLinks = qsa('.mobile-menu__link');

  hamburger.addEventListener('click', toggle);
  menuLinks.forEach((link) => link.addEventListener('click', close));

  function toggle() {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
  function close() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }
})();

/* ============================================================
   5. HERO SECTION — entrance animations
   Called by the loader after it exits.
   Uses a timeline so each element cascades in smoothly.
============================================================ */
function initHeroAnimations() {

  // ── Eyebrow line + text ──────────────────────────────────
  gsap.from('#hero-eyebrow', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.1,
  });

  // ── Title lines — staggered reveal from below ────────────
  // Each .hero__title-line acts as a clip mask so the text
  // appears to "rise" out of nothing.
  gsap.from('.hero__title-line', {
    y: '110%',
    opacity: 0,
    duration: 1,
    ease: 'power4.out',
    stagger: 0.12,
    delay: 0.3,
  });

  // ── Description paragraph ────────────────────────────────
  gsap.from('#hero-desc', {
    opacity: 0,
    y: 30,
    duration: 0.9,
    ease: 'power3.out',
    delay: 0.7,
  });

  // ── CTA buttons ──────────────────────────────────────────
  gsap.from('#hero-actions .btn', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.1,
    delay: 0.9,
  });

  // ── Stats ─────────────────────────────────────────────────
  gsap.from('#hero-stats .stat, #hero-stats .stat__divider', {
    opacity: 0,
    y: 15,
    duration: 0.7,
    ease: 'power3.out',
    stagger: 0.08,
    delay: 1.1,
  });

  // ── Profile image — scale + fade ─────────────────────────
  gsap.from('#hero-visual', {
    opacity: 0,
    scale: 0.88,
    x: 50,
    duration: 1.2,
    ease: 'power4.out',
    delay: 0.5,
  });

  // ── Floating badge ────────────────────────────────────────
  gsap.from('.hero__badge', {
    opacity: 0,
    scale: 0.7,
    duration: 0.7,
    ease: 'back.out(2)',
    delay: 1.4,
  });
}

/* ============================================================
   6. ABOUT SECTION — scroll-triggered animations
============================================================ */
(function initAboutAnimations() {

  // Left column: bio text blocks cascade in
  gsap.from('.about__lead, .about__body, .about__cta', {
    scrollTrigger: {
      trigger: '.about',
      start: 'top 70%',
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.15,
  });

  // Skills title
  gsap.from('.about__skills-title', {
    scrollTrigger: {
      trigger: '.about__skills-wrap',
      start: 'top 80%',
    },
    opacity: 0,
    y: 20,
    duration: 0.7,
    ease: 'power3.out',
  });

  // Skill bars — animate the fill width from 0 to target %
  qsa('.skill-item').forEach((item, i) => {
    const fill  = qs('.skill-item__fill', item);
    const width = fill.dataset.width + '%';

    gsap.from(item, {
      scrollTrigger: {
        trigger: '.skills-list',
        start: 'top 80%',
      },
      opacity: 0,
      x: -30,
      duration: 0.6,
      ease: 'power3.out',
      delay: i * 0.1,
    });

    // Animate bar fill separately so it flows nicely
    ScrollTrigger.create({
      trigger: '.skills-list',
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gsap.to(fill, {
          width: width,
          duration: 1.4,
          ease: 'power3.out',
          delay: 0.2 + i * 0.1,
        });
      },
    });
  });

  // Tech tags pop in with a stagger
  gsap.from('.tech-tag', {
    scrollTrigger: {
      trigger: '.tech-tags',
      start: 'top 85%',
    },
    opacity: 0,
    scale: 0.8,
    duration: 0.4,
    ease: 'back.out(1.5)',
    stagger: 0.06,
  });
})();

/* ============================================================
   7. PROJECTS — staggered card entrance with slight rotation
============================================================ */
(function initProjectAnimations() {

  gsap.from('.project-card', {
    scrollTrigger: {
      trigger: '.projects__grid',
      start: 'top 75%',
    },
    opacity: 0,
    y: 60,
    rotationX: 8,          // 3-D tilt for a premium feel
    scale: 0.95,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.15,
    transformOrigin: 'top center',
  });

  // GSAP micro-interaction: card lift on hover (adds to CSS transition)
  qsa('.project-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -10, duration: 0.4, ease: 'power3.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0,  duration: 0.5, ease: 'elastic.out(1, 0.6)' });
    });
  });
})();

/* ============================================================
   8. CONTACT SECTION — fade-in grid columns
============================================================ */
(function initContactAnimations() {

  gsap.from('.contact__info', {
    scrollTrigger: {
      trigger: '.contact__grid',
      start: 'top 75%',
    },
    opacity: 0,
    x: -50,
    duration: 0.9,
    ease: 'power3.out',
  });

  gsap.from('.contact-form', {
    scrollTrigger: {
      trigger: '.contact__grid',
      start: 'top 75%',
    },
    opacity: 0,
    x: 50,
    duration: 0.9,
    ease: 'power3.out',
  });

  // Stagger form fields
  gsap.from('.form-group, #form-submit', {
    scrollTrigger: {
      trigger: '.contact-form',
      start: 'top 80%',
    },
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power3.out',
    stagger: 0.1,
    delay: 0.3,
  });
})();

/* ============================================================
   9. SECTION HEADERS — slide-up on scroll
   Applied globally to every .section-header block.
============================================================ */
(function initSectionHeaders() {
  qsa('.section-header').forEach((header) => {
    gsap.from(header.children, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.12,
    });
  });
})();

/* ============================================================
   10. BUTTON MICRO-INTERACTIONS
   GSAP-powered squish on click for tactile feedback.
============================================================ */
(function initButtonAnimations() {
  qsa('.btn').forEach((btn) => {
    btn.addEventListener('mousedown', () => {
      gsap.to(btn, { scale: 0.95, duration: 0.12, ease: 'power2.in' });
    });
    btn.addEventListener('mouseup', () => {
      gsap.to(btn, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power2.out' });
    });
  });
})();

/* ============================================================
   11. SOCIAL LINK MICRO-INTERACTIONS
   Spring bounce on hover enter.
============================================================ */
(function initSocialAnimations() {
  qsa('.social-link').forEach((link) => {
    link.addEventListener('mouseenter', () => {
      gsap.fromTo(link, { y: 0 }, { y: -6, duration: 0.3, ease: 'power3.out' });
    });
    link.addEventListener('mouseleave', () => {
      gsap.to(link, { y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });
})();

/* ============================================================
   12. CONTACT FORM — submission feedback
============================================================ */
(function initForm() {
  const form   = qs('#contact-form');
  const submit = qs('#form-submit');
  if (!form || !submit) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Animate button to loading state
    const span = qs('span', submit);
    gsap.to(submit, {
      scale: 0.97,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        span.textContent = 'Message Sent ✓';
        submit.style.background = '#22c55e';
        gsap.from(span, { opacity: 0, y: 10, duration: 0.4, ease: 'power3.out' });

        // Reset after 3 s
        setTimeout(() => {
          span.textContent = 'Send Message';
          submit.style.background = '';
          form.reset();
        }, 3000);
      },
    });
  });
})();

/* ============================================================
   13. FOOTER — current year
============================================================ */
(function setYear() {
  const el = qs('#year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ============================================================
   14. PARALLAX HERO GLOWS
   Subtle mouse-parallax effect on the ambient glow blobs.
============================================================ */
(function initParallax() {
  const glow1 = qs('.hero__glow--1');
  const glow2 = qs('.hero__glow--2');
  if (!glow1 || !glow2) return;

  document.addEventListener('mousemove', (e) => {
    const rx = (e.clientX / window.innerWidth  - 0.5) * 40;
    const ry = (e.clientY / window.innerHeight - 0.5) * 40;

    gsap.to(glow1, { x:  rx, y:  ry, duration: 2, ease: 'power1.out' });
    gsap.to(glow2, { x: -rx, y: -ry, duration: 2, ease: 'power1.out' });
  });
})();

/* ============================================================
   15. GSAP COUNTER ANIMATION — hero stats
   Counts up from 0 to target number for visual impact.
============================================================ */
(function initCounters() {
  const statNums = qsa('.stat__num');

  ScrollTrigger.create({
    trigger: '#hero-stats',
    start: 'top 90%',
    once: true,
    onEnter: () => {
      statNums.forEach((el) => {
        // Extract just the numeric portion; keep any suffix ('+', '%')
        const text   = el.textContent.trim();
        const num    = parseFloat(text);
        const suffix = text.replace(/[\d.]/g, '');
        const obj    = { val: 0 };

        gsap.to(obj, {
          val: num,
          duration: 1.8,
          ease: 'power2.out',
          delay: 0.4,
          onUpdate: () => {
            el.textContent = Math.round(obj.val) + suffix;
          },
        });
      });
    },
  });
})();

/* ============================================================
   16. REFRESH SCROLL TRIGGER on window resize
   Prevents trigger markers getting out of sync on resize.
============================================================ */
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});
