document.getElementById('ano').textContent = new Date().getFullYear();

  // menu mobile
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  document.querySelectorAll('#mobileMenu a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.add('hidden')));

  // nav muda de estilo ao rolar
  const nav = document.querySelector('[data-nav]');
  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('bg-sand/90', 'backdrop-blur', 'shadow-sm');
    } else {
      nav.classList.remove('bg-sand/90', 'backdrop-blur', 'shadow-sm');
    }
  };
  document.addEventListener('scroll', onScroll);
  onScroll();

  // reveal ao rolar
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const section = document.querySelector("#diferenciais");
const slides = document.querySelectorAll(".diff-slide");
const dots = document.querySelectorAll(".diff-dot");

function updateDifferences() {

  const rect = section.getBoundingClientRect();

  const scrollable =
    section.offsetHeight - window.innerHeight;

  let progress = -rect.top / scrollable;

  progress = Math.max(0, Math.min(1, progress));

  const index = Math.min(
    Math.floor(progress * slides.length),
    slides.length - 1
  );

  slides.forEach((slide, i) => {
    slide.classList.toggle(
      "is-active",
      i === index
    );
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle(
      "is-active",
      i === index
    );
  });
}

window.addEventListener(
  "scroll",
  updateDifferences,
  { passive: true }
);

updateDifferences();

const careItems = document.querySelectorAll(".care-stage-item");
const carePoints = document.querySelectorAll(".care-point");
const careProgress = document.querySelector(".care-line-progress");
const careCounter = document.querySelector(".care-counter");

let careIndex = 0;

function changeCareStage() {

  careItems.forEach((item, index) => {
    item.classList.toggle(
      "is-active",
      index === careIndex
    );
  });


  carePoints.forEach((point, index) => {
    point.classList.toggle(
      "is-active",
      index === careIndex
    );
  });


  const progress = [25, 50, 75, 100];

  careProgress.style.width =
    progress[careIndex] + "%";


  careCounter.textContent =
    `0${careIndex + 1} / 04`;


  careIndex++;

  if (careIndex >= careItems.length) {
    careIndex = 0;
  }
}


/* inicia */

careItems[0].classList.add("is-active");
carePoints[0].classList.add("is-active");

// primeira troca mais rápida
setTimeout(() => {
  changeCareStage();

  // depois continua normalmente a cada 2 segundos
  setInterval(changeCareStage, 2000);

}, 1000);

