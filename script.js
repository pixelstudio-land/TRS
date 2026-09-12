/* ==========================================================================
   TRS DECOR — PISOS VINÍLICOS & LAMINADOS
   Script Global, Simulador de Escopo & Conversão
   Pixel Studio
   ========================================================================== */

/* ── CONFIGURAÇÃO CENTRAL DE CONVERSÃO ───────────────────────────────────── */
const CONFIG = {
  targetUrl: 'https://form.respondi.app/RfLLVWUd',
  respondiFallback: 'https://form.respondi.app/RfLLVWUd',
  useExternalForm: true
};

document.addEventListener('DOMContentLoaded', () => {
  initCTALinks();
  initHeader();
  initMobileDrawer();
  initSimulator();
  initGallery();
  initFAQ();
  initScrollAnimations();
});

/* ── 1. ROTEAMENTO DE CTAS ───────────────────────────────────────────────── */
function getDestinationUrl(extraParams) {
  const base = CONFIG.useExternalForm ? CONFIG.respondiFallback : CONFIG.targetUrl;
  if (!extraParams) return base;
  const separator = base.includes('?') ? '&' : '?';
  return `${base}${separator}${extraParams}`;
}

function initCTALinks() {
  const currentSearch = window.location.search ? window.location.search.replace('?', '') : '';

  document.querySelectorAll('[data-cta]').forEach(el => {
    const product = el.getAttribute('data-product') || 'geral';
    const params = new URLSearchParams();
    params.set('origem', 'lp-trs');
    params.set('interesse', product);

    if (currentSearch) {
      params.set('ref', currentSearch);
    }

    el.href = getDestinationUrl(params.toString());
  });
}

/* ── 2. HEADER SCROLL & STICKY ───────────────────────────────────────────── */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const handleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* ── 3. MENU MOBILE DRAWER ───────────────────────────────────────────────── */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('menu-toggle');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const drawer = document.getElementById('mobile-drawer');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!drawer) return;

  const openDrawer = () => {
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  links.forEach(l => l.addEventListener('click', closeDrawer));
}

/* ── 4. SIMULADOR DE ESCOPO (SEM VALORES NUMÉRICOS) ───────────────────────── */
let currentSelection = {
  product: 'laminado',
  name: 'Piso Laminado Clicado Eucafloor',
  sqm: 40
};

function initSimulator() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const slider = document.getElementById('range-slider');
  const sqmDisplay = document.getElementById('sqm-display');
  const summaryProd = document.getElementById('summary-product-name');
  const summaryScope = document.getElementById('summary-scope-details');
  const btnAction = document.getElementById('btn-simulador-action');

  if (!slider || !sqmDisplay) return;

  function updateSimulator() {
    const sqm = slider.value;
    currentSelection.sqm = sqm;
    sqmDisplay.textContent = `${sqm} m²`;

    if (summaryProd) {
      summaryProd.textContent = currentSelection.name;
    }

    if (summaryScope) {
      summaryScope.textContent = `Metragem estimada: ${sqm} m² • Pacote Completo (Material + Instalação Especializada + Rodapés)`;
    }

    if (btnAction) {
      const params = new URLSearchParams({
        produto: currentSelection.product,
        metragem: sqm,
        origem: 'simulador'
      });
      btnAction.href = getDestinationUrl(params.toString());
    }
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const prod = btn.getAttribute('data-prod');
      if (prod === 'laminado') {
        currentSelection.product = 'laminado';
        currentSelection.name = 'Piso Laminado Clicado (Eucafloor)';
      } else if (prod === 'vinilico') {
        currentSelection.product = 'vinilico';
        currentSelection.name = 'Piso Vinílico Colado (Ospefloor, RUFFINO ou Vexa)';
      }

      updateSimulator();
    });
  });

  slider.addEventListener('input', updateSimulator);
  updateSimulator();
}

/* ── 5. GALERIA & LIGHTBOX ───────────────────────────────────────────────── */
const galleryData = [
  { src: 'images/IMG-20260908-WA0026.jpg', title: 'Ambiente com Acabamento Fino', sub: 'Réguas Alinhadas com Encaixe Milimétrico' },
  { src: 'images/pexels-artbovich-6489122.jpg', title: 'Sala de Estar Contemporânea', sub: 'Piso Laminado Clicado Eucafloor de Alto Padrão' },
  { src: 'images/pexels-pixabay-271624.jpg', title: 'Living Amplo & Aconchegante', sub: 'Conforto Térmico e Acústico de 1ª Linha' }
];

let currentLightboxIndex = 0;

function initGallery() {
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('lightbox-modal');
    if (!modal || !modal.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') changeLightbox(-1);
    if (e.key === 'ArrowRight') changeLightbox(1);
  });
}

function openLightbox(index) {
  currentLightboxIndex = index;
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');

  if (!modal || !img) return;

  const data = galleryData[index];
  img.src = data.src;
  img.alt = data.title;
  if (caption) caption.textContent = `${data.title} — ${data.sub}`;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

function changeLightbox(dir) {
  currentLightboxIndex += dir;
  if (currentLightboxIndex < 0) currentLightboxIndex = galleryData.length - 1;
  if (currentLightboxIndex >= galleryData.length) currentLightboxIndex = 0;

  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  const data = galleryData[currentLightboxIndex];

  if (img) {
    img.src = data.src;
    img.alt = data.title;
  }
  if (caption) {
    caption.textContent = `${data.title} — ${data.sub}`;
  }
}

/* ── 6. FAQ ACCORDION ────────────────────────────────────────────────────── */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-header-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      faqItems.forEach(i => i.classList.remove('active'));

      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

/* ── 7. ANIMAÇÕES NO SCROLL (REVEAL) ─────────────────────────────────────── */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}
