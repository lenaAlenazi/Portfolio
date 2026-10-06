const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach((el) => observer.observe(el));

const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* Experience map: click a node -> the grid zooms toward it and the
   role detail panel opens; [ CLOSE ] or Escape returns to the map. */
const mapShell = document.getElementById('mapShell');
const mapPanel = document.getElementById('mapPanel');
const mapDetail = document.getElementById('mapDetail');

if (mapShell && mapPanel && mapDetail) {
  const detailId = document.getElementById('detailId');
  const detailTitle = document.getElementById('detailTitle');
  const detailLines = document.getElementById('detailLines');
  const mapClose = document.getElementById('mapClose');
  let lastNode = null;

  const openNode = (btn) => {
    mapPanel.style.transformOrigin = `${btn.style.left} ${btn.style.top}`;
    detailId.textContent = `${btn.dataset.node} / OPERATIONS`;
    detailTitle.textContent = btn.dataset.title;
    detailLines.innerHTML = '';
    btn.dataset.lines.split('|').forEach((line) => {
      const li = document.createElement('li');
      li.textContent = line;
      detailLines.appendChild(li);
    });
    lastNode = btn;
    mapShell.classList.add('zoomed');
    document.documentElement.classList.add('scroll-locked');
    requestAnimationFrame(() => mapDetail.classList.add('open'));
    mapClose.focus();
  };

  const closeMap = () => {
    mapDetail.classList.remove('open');
    mapShell.classList.remove('zoomed');
    document.documentElement.classList.remove('scroll-locked');
    if (lastNode) lastNode.focus();
  };

  mapShell.querySelectorAll('.map-node').forEach((btn) => {
    btn.addEventListener('click', () => openNode(btn));
  });

  mapClose.addEventListener('click', closeMap);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mapShell.classList.contains('zoomed')) closeMap();
  });
}

/* Timeline: click a milestone header to expand/collapse its detail. */
document.querySelectorAll('.tl-item .tl-head').forEach((head) => {
  head.addEventListener('click', () => {
    const item = head.closest('.tl-item');
    const open = item.classList.toggle('open');
    head.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
});


/* Mobile navigation */
const navToggle = document.querySelector('.nav-toggle');
if (nav && navToggle) {
  const closeMobileNav = () => {
    nav.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('menu-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  nav.querySelectorAll('.nav-links a').forEach((link) => link.addEventListener('click', closeMobileNav));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 640) closeMobileNav();
  });
}
