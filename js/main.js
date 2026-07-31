import { incidents, timeline } from './data.js';

/* ============================================
   FINTECH FAILURE MUSEUM — Main Application
   ============================================ */

// ---------- Lenis Smooth Scroll ----------
let lenis;
function initLenis() {
  if (typeof Lenis === 'undefined') return;
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }
}

// ---------- Custom Cursor ----------
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .gallery-card, .stat-card, .timeline-node, .filter-btn').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
  });
}

// ---------- Hero Canvas (subtle world map dots + routes) ----------
function initMapCanvas() {
  const canvas = document.getElementById('mapCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  const dots = [];
  const routes = [];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  // Approximate financial hubs (normalized 0-1)
  const hubs = [
    { x: 0.22, y: 0.38 }, // NYC
    { x: 0.48, y: 0.32 }, // London
    { x: 0.52, y: 0.35 }, // Frankfurt
    { x: 0.78, y: 0.42 }, // Tokyo
    { x: 0.72, y: 0.48 }, // Singapore
    { x: 0.68, y: 0.55 }, // Hong Kong
    { x: 0.18, y: 0.55 }, // SF
    { x: 0.55, y: 0.58 }, // Dubai
    { x: 0.82, y: 0.68 }, // Sydney
    { x: 0.45, y: 0.28 }, // Stockholm
  ];

  hubs.forEach((h) => {
    dots.push({
      x: h.x,
      y: h.y,
      r: 1.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.4,
    });
  });

  // Create subtle routes between hubs
  for (let i = 0; i < 8; i++) {
    const a = hubs[Math.floor(Math.random() * hubs.length)];
    const b = hubs[Math.floor(Math.random() * hubs.length)];
    if (a !== b) {
      routes.push({
        x1: a.x, y1: a.y,
        x2: b.x, y2: b.y,
        progress: Math.random(),
        speed: 0.0008 + Math.random() * 0.0012,
      });
    }
  }

  // Background stars / noise dots
  for (let i = 0; i < 80; i++) {
    dots.push({
      x: Math.random(),
      y: Math.random(),
      r: 0.4 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      speed: 0.2 + Math.random() * 0.5,
      faint: true,
    });
  }

  let time = 0;
  function draw() {
    time += 0.016;
    ctx.clearRect(0, 0, width, height);

    // Routes
    routes.forEach((r) => {
      r.progress += r.speed;
      if (r.progress > 1) r.progress = 0;
      const x1 = r.x1 * width;
      const y1 = r.y1 * height;
      const x2 = r.x2 * width;
      const y2 = r.y2 * height;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = 'rgba(205, 163, 73, 0.06)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Moving particle on route
      const px = x1 + (x2 - x1) * r.progress;
      const py = y1 + (y2 - y1) * r.progress;
      ctx.beginPath();
      ctx.arc(px, py, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(205, 163, 73, 0.5)';
      ctx.fill();
    });

    // Dots
    dots.forEach((d) => {
      const alpha = d.faint
        ? 0.15 + Math.sin(time * d.speed + d.phase) * 0.1
        : 0.4 + Math.sin(time * d.speed + d.phase) * 0.25;
      ctx.beginPath();
      ctx.arc(d.x * width, d.y * height, d.r, 0, Math.PI * 2);
      ctx.fillStyle = d.faint
        ? `rgba(174, 182, 194, ${alpha})`
        : `rgba(205, 163, 73, ${alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
}

// ---------- Navigation ----------
function initNav() {
  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }
}

// ---------- Stats Number Animation ----------
function initStats() {
  const numberEl = document.querySelector('.stat-number');
  if (!numberEl || typeof gsap === 'undefined') return;

  ScrollTrigger.create({
    trigger: '#stats',
    start: 'top 70%',
    once: true,
    onEnter: () => {
      gsap.to(numberEl, {
        innerText: 700,
        duration: 2.2,
        snap: { innerText: 1 },
        ease: 'power2.out',
        onUpdate: function () {
          numberEl.innerText = Math.floor(numberEl.innerText);
        },
      });
    },
  });
}

// ---------- Timeline ----------
function initTimeline() {
  const track = document.getElementById('timelineTrack');
  const detail = document.getElementById('timelineDetail');
  const detailContent = document.getElementById('timelineDetailContent');
  const closeBtn = document.getElementById('timelineClose');
  if (!track) return;

  timeline.forEach((item, i) => {
    const node = document.createElement('div');
    node.className = 'timeline-node';
    node.innerHTML = `
      <div class="dot"></div>
      <div class="year">${item.year}</div>
      <div class="label">${item.label}</div>
    `;
    node.addEventListener('click', () => {
      document.querySelectorAll('.timeline-node').forEach((n) => n.classList.remove('active'));
      node.classList.add('active');
      const inc = incidents.find((x) => x.id === item.id);
      if (inc) {
        detailContent.innerHTML = `
          <h3 style="font-family:var(--font-serif);font-size:1.75rem;margin-bottom:0.5rem">${inc.title}</h3>
          <p style="color:var(--accent);margin-bottom:1rem">${inc.year} · ${inc.loss} · ${inc.duration}</p>
          <p style="color:var(--text-secondary);line-height:1.7;max-width:60ch">${inc.short}</p>
          <button class="btn-secondary" style="margin-top:1.25rem" data-open="${inc.id}">View Artifact</button>
        `;
        detail.classList.add('open');
        detailContent.querySelector('[data-open]')?.addEventListener('click', () => {
          openIncident(inc.id);
          detail.classList.remove('open');
        });
      }
    });
    track.appendChild(node);

    // Spacer between nodes
    if (i < timeline.length - 1) {
      const spacer = document.createElement('div');
      spacer.style.width = '120px';
      spacer.style.flexShrink = '0';
      track.appendChild(spacer);
    }
  });

  closeBtn?.addEventListener('click', () => detail.classList.remove('open'));
}

// ---------- Gallery ----------
function initGallery() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;

  const heights = ['h1', 'h2', 'h3', 'h4'];

  function render(filter = 'all') {
    gallery.innerHTML = '';
    const list = filter === 'all'
      ? incidents
      : incidents.filter((i) => i.category === filter || i.tag.toLowerCase() === filter);

    list.forEach((inc, idx) => {
      const card = document.createElement('article');
      card.className = `gallery-card ${heights[idx % heights.length]}`;
      card.dataset.category = inc.category;
      card.innerHTML = `
        <div class="card-media">
          <span class="card-year">${inc.year}</span>
        </div>
        <div class="card-body">
          <div class="card-cat">${inc.tag}</div>
          <h3>${inc.title}</h3>
          <div class="card-loss">${inc.loss}</div>
          <p class="card-desc">${inc.short}</p>
        </div>
      `;
      card.addEventListener('click', () => openIncident(inc.id));
      gallery.appendChild(card);
    });
  }

  render();

  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.filter);
    });
  });

  document.getElementById('surpriseBtn')?.addEventListener('click', () => {
    const random = incidents[Math.floor(Math.random() * incidents.length)];
    openIncident(random.id);
  });

  document.getElementById('randomIncidentBtn')?.addEventListener('click', () => {
    const random = incidents[Math.floor(Math.random() * incidents.length)];
    openIncident(random.id);
  });
}

// ---------- Incident Overlay ----------
function openIncident(id) {
  const inc = incidents.find((x) => x.id === id);
  if (!inc) return;
  const overlay = document.getElementById('incidentOverlay');
  const content = document.getElementById('overlayContent');

  content.innerHTML = `
    <div class="overlay-hero">
      <p class="eyebrow">${inc.tag} · ${inc.year}</p>
      <h1>${inc.title}</h1>
      <div class="overlay-meta">
        <div><strong>${inc.loss}</strong> Lost</div>
        <div><strong>${inc.duration}</strong> Duration</div>
      </div>
    </div>
    <div class="overlay-story">
      ${inc.story.map((p) => `<p>${p}</p>`).join('')}
    </div>
    <div class="overlay-section">
      <h3>Lessons Learned</h3>
      <ul class="hard-lessons">
        ${inc.lessons.map((l) => `<li>${l}</li>`).join('')}
      </ul>
    </div>
    ${inc.references.length ? `
      <div class="overlay-section">
        <h3>References</h3>
        <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:1rem">
          ${inc.references.map((r) => `<a href="${r.url}" target="_blank" rel="noopener" class="btn-secondary">${r.label}</a>`).join('')}
        </div>
      </div>
    ` : ''}
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (lenis) lenis.stop();
}

function closeIncident() {
  const overlay = document.getElementById('incidentOverlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  if (lenis) lenis.start();
}

document.getElementById('overlayClose')?.addEventListener('click', closeIncident);
document.getElementById('incidentOverlay')?.addEventListener('click', (e) => {
  if (e.target.id === 'incidentOverlay') closeIncident();
});

// ---------- Root Cause Rings ----------
function initRootCause() {
  document.querySelectorAll('.root-ring').forEach((ring) => {
    const pct = ring.dataset.pct;
    const label = ring.dataset.label;
    const color = ring.dataset.color;
    ring.style.borderColor = color;
    ring.innerHTML = `<span class="pct" style="color:${color}">${pct}%</span><span class="lbl">${label}</span>`;
  });
}

// ---------- Featured Stories / Loss Counters ----------
function initFeaturedStory() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Knight Capital loss counter
  const lossEl = document.querySelector('#lossCounter .loss-value');
  if (lossEl) {
    ScrollTrigger.create({
      trigger: '#lossCounter',
      start: 'top 70%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 440,
          duration: 3.5,
          ease: 'power2.inOut',
          onUpdate: () => {
            lossEl.textContent = '$' + Math.floor(obj.val) + 'M';
          },
        });
      },
    });
  }

  // SVB deposit withdrawal counter
  const svbEl = document.querySelector('#svbCounter .loss-value');
  if (svbEl) {
    ScrollTrigger.create({
      trigger: '#svbCounter',
      start: 'top 70%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 42,
          duration: 3.2,
          ease: 'power2.inOut',
          onUpdate: () => {
            svbEl.textContent = '$' + Math.floor(obj.val) + 'B';
          },
        });
      },
    });
  }

  // Subtle fade of sticky headers for both featured sections
  document.querySelectorAll('.featured').forEach((section) => {
    const sticky = section.querySelector('.featured-sticky');
    if (!sticky) return;
    gsap.to(sticky, {
      opacity: 0.05,
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    });
  });
}

// ---------- Engineer Mode ----------
function initEngineerMode() {
  const toggles = [
    document.getElementById('engineerToggle'),
    document.getElementById('engineerToggleMobile'),
  ];
  const panel = document.getElementById('engineerPanel');

  toggles.forEach((btn) => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      document.body.classList.toggle('engineer-mode');
      const active = document.body.classList.contains('engineer-mode');
      toggles.forEach((b) => b?.classList.toggle('active', active));
      if (active && panel) {
        panel.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  document.querySelectorAll('.eng-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.eng-tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.eng-pane').forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      const pane = document.getElementById('pane-' + tab.dataset.tab);
      if (pane) pane.classList.add('active');
    });
  });
}

// ---------- Museum Mode (guided exhibition auto-scroll) ----------
function initMuseumMode() {
  const btn = document.getElementById('museumModeBtn');
  if (!btn) return;

  // Ordered stops through the museum
  const stops = [
    '#hero',
    '#stats',
    '#timeline',
    '#collection',
    '#why',
    '#featured',
    '#featured-svb',
    '#cta',
  ];

  let running = false;
  let currentIndex = 0;
  let timer = null;

  function getScrollY() {
    return lenis ? lenis.scroll : window.scrollY || window.pageYOffset;
  }

  function scrollToStop(index) {
    const el = document.querySelector(stops[index]);
    if (!el) return;

    if (lenis) {
      lenis.scrollTo(el, {
        offset: -40,
        duration: 2.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function tick() {
    if (!running) return;
    currentIndex += 1;

    if (currentIndex >= stops.length) {
      // Reached the end — stop cleanly
      stopMuseum();
      return;
    }

    scrollToStop(currentIndex);
    timer = setTimeout(tick, 4500);
  }

  function startMuseum() {
    running = true;
    btn.textContent = 'Stop Exhibition';
    btn.classList.add('active');

    // Start from the nearest upcoming section
    const y = getScrollY();
    currentIndex = 0;
    for (let i = 0; i < stops.length; i++) {
      const el = document.querySelector(stops[i]);
      if (el && el.offsetTop - 80 <= y) currentIndex = i;
    }

    // Move to the next stop immediately
    currentIndex = Math.min(currentIndex + 1, stops.length - 1);
    scrollToStop(currentIndex);
    timer = setTimeout(tick, 4500);
  }

  function stopMuseum() {
    running = false;
    btn.textContent = 'Museum Mode';
    btn.classList.remove('active');
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  btn.addEventListener('click', () => {
    if (running) stopMuseum();
    else startMuseum();
  });

  // Safety: stop if user scrolls manually with intent
  let userScrollTimeout;
  window.addEventListener(
    'wheel',
    () => {
      if (!running) return;
      clearTimeout(userScrollTimeout);
      userScrollTimeout = setTimeout(() => {
        // If user keeps scrolling, exit museum mode
        stopMuseum();
      }, 800);
    },
    { passive: true }
  );
}

// ---------- Hero Animations ----------
function initHeroAnimations() {
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-title .line', {
    y: 80,
    opacity: 0,
    duration: 1.1,
    stagger: 0.12,
  })
    .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.9 }, '-=0.5')
    .from('.btn-enter', { y: 20, opacity: 0, duration: 0.7 }, '-=0.4')
    .from('.scroll-hint', { opacity: 0, duration: 0.8 }, '-=0.3');

  // Parallax / zoom on scroll
  gsap.to('.hero-bg', {
    scale: 1.15,
    opacity: 0.2,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
  gsap.to('.hero-content', {
    y: -80,
    opacity: 0,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '60% top',
      scrub: true,
    },
  });
}

// ---------- Section Reveals ----------
function initReveals() {
  if (typeof gsap === 'undefined') return;

  gsap.utils.toArray('.stat-card, .why-card, .gallery-card, .lesson-card').forEach((el) => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });
}

// ---------- Init ----------
function init() {
  initLenis();
  initCursor();
  initMapCanvas();
  initNav();
  initStats();
  initTimeline();
  initGallery();
  initRootCause();
  initFeaturedStory();
  initEngineerMode();
  initMuseumMode();
  initHeroAnimations();
  initReveals();

  // Stat cards open incident
  document.querySelectorAll('.stat-card').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.dataset.incident;
      if (id) openIncident(id);
    });
  });
}

// Wait for GSAP / Lenis
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(init, 50);
  });
} else {
  setTimeout(init, 50);
}
