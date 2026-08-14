// Como o <script> está com "defer", o DOM já está pronto quando este arquivo roda —
// não precisamos de DOMContentLoaded.

document.getElementById('ano').textContent = new Date().getFullYear();

// ============================================================
// MENU MOBILE
/* =========================================================
   MENU RESPONSIVO — BREAKPOINT 1200px
========================================================= */

(function () {

  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!menuBtn || !mobileMenu) return;


  /* -------------------------------------------------------
     ABRIR
  ------------------------------------------------------- */

  function openMenu() {

    menuBtn.classList.add("is-open");
    mobileMenu.classList.add("is-open");

    document.documentElement.classList.add("menu-open");
    document.body.classList.add("menu-open");

    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.setAttribute("aria-label", "Fechar menu");

    mobileMenu.setAttribute("aria-hidden", "false");
  }


  /* -------------------------------------------------------
     FECHAR
  ------------------------------------------------------- */

  function closeMenu() {

    menuBtn.classList.remove("is-open");
    mobileMenu.classList.remove("is-open");

    document.documentElement.classList.remove("menu-open");
    document.body.classList.remove("menu-open");

    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Abrir menu");

    mobileMenu.setAttribute("aria-hidden", "true");
  }


  /* -------------------------------------------------------
     TOGGLE
  ------------------------------------------------------- */

  menuBtn.addEventListener("click", function () {

    const aberto = mobileMenu.classList.contains("is-open");

    if (aberto) {
      closeMenu();
    } else {
      openMenu();
    }

  });


  /* -------------------------------------------------------
     LINKS DO MENU
     Fecha primeiro e depois navega
  ------------------------------------------------------- */

  const menuLinks = mobileMenu.querySelectorAll("a[href^='#']");

  menuLinks.forEach(function (link) {

    link.addEventListener("click", function () {

      closeMenu();

    });

  });


  /* -------------------------------------------------------
     ESC
  ------------------------------------------------------- */

  document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
      closeMenu();
    }

  });


  /* -------------------------------------------------------
     REDIMENSIONAMENTO
     
     Se passar de 1200px, fecha o menu e volta para desktop.
  ------------------------------------------------------- */

  function checkBreakpoint() {

    if (window.innerWidth > 1200) {
      closeMenu();
    }

  }

  window.addEventListener("resize", checkBreakpoint);


  /* -------------------------------------------------------
     ESTADO INICIAL
  ------------------------------------------------------- */

  closeMenu();

})();

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
(function(){
  // ===================================================================
  // DADOS: respostas do passo 2 por grupo, e resultado de cada uma.
  // Ajuste títulos, descrições e o texto do WhatsApp livremente aqui.
  // ===================================================================
  const NUMERO_WHATSAPP = "5515997579428";
 
  const especialidades = {
    "fisio-infantil": {
      titulo: "Fisioterapia Infantil",
      inicial: "F",
      desc: "Atuação em desenvolvimento infantil, assimetria craniana, torcicolo, crianças atípicas e fisioterapia respiratória, com atendimento lúdico e acolhedor."
    },
    "fisio-adulto": {
      titulo: "Fisioterapia Adulto",
      inicial: "F",
      desc: "Reabilitação, pós-operatório, ortopedia e neurologia adulto, com acompanhamento individualizado para cada necessidade — incluindo cuidados voltados ao idoso."
    },
    "psicologia-infantil": {
      titulo: "Psicologia Infantil",
      inicial: "P",
      desc: "Cuidado do desenvolvimento emocional, comportamental e social de crianças e adolescentes, com intervenções individualizadas — incluindo abordagem ABA quando indicada."
    },
    "osteopatia": {
      titulo: "Osteopatia",
      inicial: "O",
      desc: "Técnicas manuais para disfunções musculoesqueléticas e viscerais, podendo auxiliar em refluxo, disquesia, constipação, cólicas e desconfortos corporais."
    },
    "psicopedagogia": {
      titulo: "Psicopedagogia",
      inicial: "P",
      desc: "Avaliação e intervenção nas dificuldades de aprendizagem, com estímulo de atenção, memória e funções executivas ao longo do processo escolar."
    },
  };
 
  // Passo 1 -> define o rótulo usado na mensagem do WhatsApp
  const grupos = {
    "crianca-pequena":     { rotulo: "meu bebê/filho(a) pequeno(a)" },
    "crianca-adolescente": { rotulo: "meu filho(a)" },
    "adulto":               { rotulo: "eu mesmo(a)" },
    "idoso":                { rotulo: "um idoso da família" },
  };
 
  // Passo 2: opções por grupo -> cada uma aponta para uma especialidade
  const perguntasPasso2 = {
    "crianca-pequena": [
      { label: "Desenvolvimento motor, postura ou torcicolo", sub: "engatinhar, sentar, andar", especialidade: "fisio-infantil" },
      { label: "Cólicas, refluxo ou desconforto", sub: "sono, digestão", especialidade: "osteopatia" },
      { label: "Comportamento ou emoções", sub: "choro, rotina, apego", especialidade: "psicologia-infantil" },
    ],
    "crianca-adolescente": [
      { label: "Dificuldade escolar ou de aprendizagem", sub: "leitura, atenção, memória", especialidade: "psicopedagogia" },
      { label: "Comportamento ou emocional", sub: "ansiedade, autorregulação", especialidade: "psicologia-infantil" },
      { label: "Postura, movimento ou atividade física", sub: "reabilitação, esporte", especialidade: "fisio-infantil" },
      { label: "Dores ou desconforto físico", sub: "musculoesquelético", especialidade: "osteopatia" },
    ],
    "adulto": [
      { label: "Dor, lesão ou pós-operatório", sub: "reabilitação, ortopedia", especialidade: "fisio-adulto" },
      { label: "Tensão ou desconforto estrutural", sub: "abordagem manual", especialidade: "osteopatia" },
    ],
    "idoso": [
      { label: "Mobilidade, equilíbrio ou reabilitação", sub: "autonomia no dia a dia", especialidade: "fisio-adulto" },
      { label: "Dor ou desconforto estrutural", sub: "abordagem manual", especialidade: "osteopatia" },
    ],
  };
 
  // ===================================================================
  // LÓGICA (não precisa mexer daqui pra baixo)
  // ===================================================================
  const root = document.getElementById("quiz");
  const steps = root.querySelectorAll(".quiz-step");
  const dots = root.querySelectorAll(".quiz-dot");
  let grupoAtual = null;
 
  function irPara(stepName){
    steps.forEach(s => s.classList.toggle("hidden", s.dataset.step !== stepName));
    const idx = { "1":1, "2":2, "result":3 }[stepName];
    dots.forEach((d,i) => {
      d.classList.toggle("is-active", i === idx-1);
      d.classList.toggle("is-done", i < idx-1);
    });
  }
 
  function montarPasso2(grupo){
    grupoAtual = grupo;
    const wrap = document.getElementById("quizStep2Options");
    wrap.innerHTML = "";
    perguntasPasso2[grupo].forEach(op => {
      const btn = document.createElement("button");
      btn.className = "quiz-option";
      btn.dataset.especialidade = op.especialidade;
      btn.innerHTML = `<span class="quiz-option-title">${op.label}</span><span class="quiz-option-sub">${op.sub}</span>`;
      btn.addEventListener("click", () => mostrarResultado(op.especialidade));
      wrap.appendChild(btn);
    });
    irPara("2");
  }
 
  function mostrarResultado(chaveEspecialidade){
    const esp = especialidades[chaveEspecialidade];
    const rotuloPessoa = grupos[grupoAtual].rotulo;
 
    document.getElementById("quizResultTitle").textContent = esp.titulo;
    document.getElementById("quizResultInitial").textContent = esp.inicial;
    document.getElementById("quizResultDesc").textContent = esp.desc;
 
    const mensagem = `Olá! Fiz o quiz do site do Instituto Vivar e, pelo resultado, o indicado para ${rotuloPessoa} é ${esp.titulo}. Gostaria de agendar uma consulta.`;
    const link = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
    document.getElementById("quizWhatsappBtn").setAttribute("href", link);
 
    irPara("result");
  }
 
  root.querySelectorAll('[data-group]').forEach(btn => {
    btn.addEventListener("click", () => montarPasso2(btn.dataset.group));
  });
 
  root.querySelector('[data-action="back"]').addEventListener("click", () => irPara("1"));
  root.querySelector('[data-action="restart"]').addEventListener("click", () => irPara("1"));
 
})();