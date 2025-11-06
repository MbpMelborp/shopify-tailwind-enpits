/**
 * Promo Banners Carousel
 * Maneja el carousel con touch/swipe para mobile
 */

class PromoBannersCarousel {
  constructor(container) {
    this.container = container;
    this.track = container.querySelector('.promo-banners-track');
    this.slides = container.querySelectorAll('.promo-banner-slide');
    this.indicators = container.parentElement.querySelectorAll(
      '.promo-banners-indicator',
    );
    this.currentIndex = 0;
    this.isDragging = false;
    this.startX = 0;
    this.scrollLeft = 0;
    this.startScrollLeft = 0;

    if (this.slides.length > 0) {
      this.init();
    }
  }

  init() {
    if (!this.track || this.slides.length <= 1) return;

    // Touch events para swipe
    this.track.addEventListener(
      'touchstart',
      this.handleTouchStart.bind(this),
      { passive: true },
    );
    this.track.addEventListener('touchmove', this.handleTouchMove.bind(this), {
      passive: false,
    });
    this.track.addEventListener('touchend', this.handleTouchEnd.bind(this));

    // Mouse events para desktop (opcional, para testing)
    this.track.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.track.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.track.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.track.addEventListener('mouseleave', this.handleMouseUp.bind(this));

    // Click en indicadores
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });

    // Auto-scroll al slide activo
    this.updateActiveSlide();
  }

  handleTouchStart(e) {
    this.isDragging = true;
    this.startX = e.touches[0].pageX - this.track.offsetLeft;
    this.startScrollLeft = this.track.scrollLeft;
    this.track.style.scrollBehavior = 'auto';
  }

  handleTouchMove(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    const x = e.touches[0].pageX - this.track.offsetLeft;
    const walk = (x - this.startX) * 2;
    this.track.scrollLeft = this.startScrollLeft - walk;
  }

  handleTouchEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.track.style.scrollBehavior = 'smooth';
    this.snapToSlide();
  }

  handleMouseDown(e) {
    this.isDragging = true;
    this.startX = e.pageX - this.track.offsetLeft;
    this.startScrollLeft = this.track.scrollLeft;
    this.track.style.cursor = 'grabbing';
    this.track.style.scrollBehavior = 'auto';
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    const x = e.pageX - this.track.offsetLeft;
    const walk = (x - this.startX) * 2;
    this.track.scrollLeft = this.startScrollLeft - walk;
  }

  handleMouseUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.track.style.cursor = 'grab';
    this.track.style.scrollBehavior = 'smooth';
    this.snapToSlide();
  }

  snapToSlide() {
    const slideWidth = this.track.offsetWidth;
    const scrollPosition = this.track.scrollLeft;
    const newIndex = Math.round(scrollPosition / slideWidth);

    if (
      newIndex !== this.currentIndex &&
      newIndex >= 0 &&
      newIndex < this.slides.length
    ) {
      this.currentIndex = newIndex;
      this.goToSlide(newIndex);
    } else {
      // Ajustar al slide más cercano
      this.goToSlide(this.currentIndex);
    }
  }

  goToSlide(index) {
    if (index < 0 || index >= this.slides.length) return;

    this.currentIndex = index;
    const slideWidth = this.track.offsetWidth;
    this.track.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth',
    });

    this.updateActiveSlide();
  }

  updateActiveSlide() {
    // Actualizar clases de slides
    this.slides.forEach((slide, index) => {
      if (index === this.currentIndex) {
        slide.classList.add('promo-banner-slide--active');
      } else {
        slide.classList.remove('promo-banner-slide--active');
      }
    });

    // Actualizar indicadores
    this.indicators.forEach((indicator, index) => {
      if (index === this.currentIndex) {
        indicator.classList.add('promo-banners-indicator--active');
      } else {
        indicator.classList.remove('promo-banners-indicator--active');
      }
    });
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll(
    '[data-carousel^="promo-banners-"]',
  );
  carousels.forEach((carousel) => {
    new PromoBannersCarousel(carousel);
  });
});

// También inicializar si el script se carga después del DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll(
      '[data-carousel^="promo-banners-"]',
    );
    carousels.forEach((carousel) => {
      new PromoBannersCarousel(carousel);
    });
  });
} else {
  const carousels = document.querySelectorAll(
    '[data-carousel^="promo-banners-"]',
  );
  carousels.forEach((carousel) => {
    new PromoBannersCarousel(carousel);
  });
}
