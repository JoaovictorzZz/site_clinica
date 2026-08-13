// Como o <script> está com "defer", o DOM já está pronto quando este arquivo roda —
// não precisamos de DOMContentLoaded.

document.getElementById('ano').textContent = new Date().getFullYear();

// ============================================================
// MENU MOBILE
// ============================================================
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
  const isHidden = mobileMenu.classList.toggle('hidden');
  menuBtn.setAttribute('aria-expanded', String(!isHidden));
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

// ============================================================
// NAV — muda de estilo ao rolar
// ============================================================
const nav = document.querySelector('[data-nav]');

function updateNav() {
  const scrolled = window.scrollY > 40;
  nav.classList.toggle('bg-sand/90', scrolled);
  nav.classList.toggle('backdrop-blur', scrolled);
  nav.classList.toggle('shadow-sm', scrolled);
}

// ============================================================
// DIFERENCIAIS — carrossel controlado pelo scroll
// ============================================================
const diffSection = document.querySelector('#diferenciais');
const slides = document.querySelectorAll('.diff-slide');
const dots = document.querySelectorAll('.diff-dot');

function updateDifferences() {
  if (!diffSection) return;

  const rect = diffSection.getBoundingClientRect();
  const scrollable = diffSection.offsetHeight - window.innerHeight;

  let progress = scrollable > 0 ? -rect.top / scrollable : 0;
  progress = Math.max(0, Math.min(1, progress));

  const index = Math.min(Math.floor(progress * slides.length), slides.length - 1);

  slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
  dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
}

// ============================================================
// UM ÚNICO LISTENER DE SCROLL, THROTTLED VIA requestAnimationFrame
// (evita rodar várias funções pesadas várias vezes por frame)
// ============================================================
let scrollTicking = false;

function onScroll() {
  if (!scrollTicking) {
    window.requestAnimationFrame(() => {
      updateNav();
      updateDifferences();
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });

// estado inicial (sem esperar o primeiro scroll)
updateNav();
updateDifferences();

// ============================================================
// REVEAL AO ROLAR (IntersectionObserver — já é performático,
// pois não depende do evento de scroll)
// ============================================================
const revealTargets = document.querySelectorAll('.reveal');

if (revealTargets.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealTargets.forEach(el => io.observe(el));
}

// ============================================================
// CARD "NOSSO CUIDADO" — troca automática de etapas
// Só roda o setInterval enquanto o card estiver visível na tela,
// economizando trabalho em segundo plano quando o usuário
// já rolou para longe dessa seção.
// ============================================================
const careItems = document.querySelectorAll('.care-stage-item');
const carePoints = document.querySelectorAll('.care-point');
const careProgress = document.querySelector('.care-line-progress');
const careCounter = document.querySelector('.care-counter');
const careCard = document.querySelector('.care-card');

if (careItems.length && careCard) {
  let careIndex = 0;

  // IDs separados: um setTimeout (largada) e um setInterval (loop contínuo).
  // Misturar os dois numa única variável era a causa do bug de timing.
  let careStartTimeoutId = null;
  let careLoopIntervalId = null;

  const CARE_STEP_MS = 3200; // tempo confortável de leitura entre as trocas
  const CARE_PROGRESS = [25, 50, 75, 100];

  function changeCareStage() {
    careItems.forEach((item, index) => item.classList.toggle('is-active', index === careIndex));
    carePoints.forEach((point, index) => point.classList.toggle('is-active', index === careIndex));

    careProgress.style.width = CARE_PROGRESS[careIndex] + '%';
    careCounter.textContent = `0${careIndex + 1} / 04`;

    careIndex = (careIndex + 1) % careItems.length;
  }

  function startCareLoop() {
    if (careLoopIntervalId !== null) return; // já está rodando, não duplica
    careLoopIntervalId = setInterval(changeCareStage, CARE_STEP_MS);
  }

  function stopCareLoop() {
    clearTimeout(careStartTimeoutId);
    careStartTimeoutId = null;

    clearInterval(careLoopIntervalId);
    careLoopIntervalId = null;
  }

  // estado inicial (etapa 01 já visível)
  careItems[0].classList.add('is-active');
  carePoints[0].classList.add('is-active');
  careIndex = 1;

  const careObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // evita empilhar timers se o observer disparar mais de uma vez
        if (careStartTimeoutId !== null || careLoopIntervalId !== null) return;

        careStartTimeoutId = setTimeout(() => {
          careStartTimeoutId = null;
          changeCareStage();
          startCareLoop();
        }, CARE_STEP_MS);
      } else {
        stopCareLoop();
      }
    });
  }, { threshold: 0.2 });

  careObserver.observe(careCard);
}
