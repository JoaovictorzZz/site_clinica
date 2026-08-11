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