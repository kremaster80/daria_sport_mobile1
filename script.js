const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const modal = document.getElementById('videoModal');
const frame = document.getElementById('videoFrame');
const closeButton = modal.querySelector('.modal__close');

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  frame.innerHTML = '';
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-youtube]').forEach((button) => {
  button.addEventListener('click', () => {
    const id = button.dataset.youtube;
    frame.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1" title="Видео с Дарьей" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

closeButton.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });

const stage = document.getElementById('plansStage');
const cards = Array.from(stage?.querySelectorAll('.plan-card') || []);
const dots = Array.from(document.querySelectorAll('.carousel-dot'));
const prevButton = document.querySelector('.carousel-arrow--left');
const nextButton = document.querySelector('.carousel-arrow--right');
let activeIndex = 1;

function wrapIndex(index) {
  return (index + cards.length) % cards.length;
}

function updateCarousel() {
  cards.forEach((card, index) => {
    card.classList.remove('is-active', 'is-prev', 'is-next', 'is-hidden');
    if (index === activeIndex) {
      card.classList.add('is-active');
      card.setAttribute('aria-hidden', 'false');
      card.tabIndex = 0;
    } else if (index === wrapIndex(activeIndex - 1)) {
      card.classList.add('is-prev');
      card.setAttribute('aria-hidden', 'false');
      card.tabIndex = -1;
    } else if (index === wrapIndex(activeIndex + 1)) {
      card.classList.add('is-next');
      card.setAttribute('aria-hidden', 'false');
      card.tabIndex = -1;
    } else {
      card.classList.add('is-hidden');
      card.setAttribute('aria-hidden', 'true');
      card.tabIndex = -1;
    }
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle('is-active', index === activeIndex);
  });
}

if (cards.length) {
  updateCarousel();

  prevButton?.addEventListener('click', () => {
    activeIndex = wrapIndex(activeIndex - 1);
    updateCarousel();
  });

  nextButton?.addEventListener('click', () => {
    activeIndex = wrapIndex(activeIndex + 1);
    updateCarousel();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      activeIndex = index;
      updateCarousel();
    });
  });

  cards.forEach((card, index) => {
    card.addEventListener('click', (event) => {
      if (index !== activeIndex && !event.target.closest('a, button')) {
        activeIndex = index;
        updateCarousel();
      }
    });
  });

  let startX = 0;
  let endX = 0;

  stage.addEventListener('touchstart', (event) => {
    startX = event.changedTouches[0].clientX;
  }, { passive: true });

  stage.addEventListener('touchend', (event) => {
    endX = event.changedTouches[0].clientX;
    const diff = endX - startX;
    if (Math.abs(diff) < 30) return;
    if (diff < 0) {
      activeIndex = wrapIndex(activeIndex + 1);
    } else {
      activeIndex = wrapIndex(activeIndex - 1);
    }
    updateCarousel();
  }, { passive: true });

  document.addEventListener('keydown', (event) => {
    const formatsVisible = stage.getBoundingClientRect().top < window.innerHeight && stage.getBoundingClientRect().bottom > 0;
    if (!formatsVisible) return;
    if (event.key === 'ArrowLeft') {
      activeIndex = wrapIndex(activeIndex - 1);
      updateCarousel();
    }
    if (event.key === 'ArrowRight') {
      activeIndex = wrapIndex(activeIndex + 1);
      updateCarousel();
    }
  });
}
