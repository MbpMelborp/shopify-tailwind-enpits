/**
 * Repuestos Collections Slider
 * Maneja la navegación del slider de colecciones de repuestos
 */

class RepuestosCollectionsSlider {
  constructor(container) {
    this.container = container;
    this.sectionId = container.dataset.sectionId;
    const parent = container.parentElement;
    this.prevButton = parent
      ? parent.querySelector('.repuestos-slider-prev')
      : null;
    this.nextButton = parent
      ? parent.querySelector('.repuestos-slider-next')
      : null;

    this.isDragging = false;
    this.startX = 0;
    this.scrollLeft = 0;
    this.scrollAmount = this.calculateScrollAmount(); // Calcular dinámicamente basado en el ancho de la card

    this.init();
  }

  calculateScrollAmount() {
    if (!this.container) return 300; // Fallback

    // Buscar la primera card en el contenedor
    const firstCard = this.container.querySelector(
      '.repuestos-collection-card',
    );
    if (!firstCard) return 300; // Fallback

    // Obtener el ancho de la card + el gap (gap-2 = 8px)
    const cardWidth = firstCard.offsetWidth;
    const gap = 8; // gap-2 en Tailwind = 0.5rem = 8px

    // Scroll por el ancho de una card completa + gap para movimiento uniforme
    return cardWidth + gap;
  }

  init() {
    if (!this.container) return;

    // Recalcular scrollAmount después de que el DOM esté listo
    // Si el cálculo inicial falló, intentar de nuevo
    if (this.scrollAmount === 300) {
      this.scrollAmount = this.calculateScrollAmount();
    }

    // Botones de navegación
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => this.scrollToLeft());
    }

    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => this.scrollToRight());
    }

    // Drag to scroll (desktop)
    this.container.addEventListener('mousedown', (e) =>
      this.handleMouseDown(e),
    );
    this.container.addEventListener('mousemove', (e) =>
      this.handleMouseMove(e),
    );
    this.container.addEventListener('mouseup', () => this.handleMouseUp());
    this.container.addEventListener('mouseleave', () => this.handleMouseUp());

    // Touch events (mobile)
    this.container.addEventListener(
      'touchstart',
      (e) => this.handleTouchStart(e),
      { passive: true },
    );
    this.container.addEventListener(
      'touchmove',
      (e) => this.handleTouchMove(e),
      { passive: true },
    );
    this.container.addEventListener('touchend', () => this.handleTouchEnd());

    // Actualizar estado de botones
    this.updateButtonStates();
    this.container.addEventListener('scroll', () => this.updateButtonStates());

    // Actualizar botones y recalcular scrollAmount en resize
    window.addEventListener('resize', () => {
      this.scrollAmount = this.calculateScrollAmount();
      this.updateButtonStates();
    });
  }

  scrollToLeft() {
    if (!this.container) return;
    this.container.scrollBy({
      left: -this.scrollAmount,
      behavior: 'smooth',
    });
  }

  scrollToRight() {
    if (!this.container) return;
    this.container.scrollBy({
      left: this.scrollAmount,
      behavior: 'smooth',
    });
  }

  handleMouseDown(e) {
    if (window.innerWidth <= 749) return; // Solo en desktop
    this.isDragging = true;
    this.container.style.cursor = 'grabbing';
    this.startX = e.pageX - this.container.offsetLeft;
    this.scrollLeft = this.container.scrollLeft;
    this.container.style.userSelect = 'none';
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    const x = e.pageX - this.container.offsetLeft;
    const walk = (x - this.startX) * 2; // Scroll speed multiplier
    this.container.scrollLeft = this.scrollLeft - walk;
  }

  handleMouseUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.container.style.cursor = 'grab';
    this.container.style.userSelect = '';
  }

  handleTouchStart(e) {
    this.startX = e.touches[0].pageX - this.container.offsetLeft;
    this.scrollLeft = this.container.scrollLeft;
  }

  handleTouchMove(e) {
    const x = e.touches[0].pageX - this.container.offsetLeft;
    const walk = (x - this.startX) * 2;
    this.container.scrollLeft = this.scrollLeft - walk;
  }

  handleTouchEnd() {
    // Touch end handled by native scroll
  }

  updateButtonStates() {
    if (!this.container) return;

    const { scrollLeft, scrollWidth, clientWidth } = this.container;
    const isAtStart = scrollLeft <= 0;
    const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 1;

    if (this.prevButton) {
      this.prevButton.disabled = isAtStart;
      if (isAtStart) {
        this.prevButton.setAttribute('aria-disabled', 'true');
      } else {
        this.prevButton.removeAttribute('aria-disabled');
      }
    }

    if (this.nextButton) {
      this.nextButton.disabled = isAtEnd;
      if (isAtEnd) {
        this.nextButton.setAttribute('aria-disabled', 'true');
      } else {
        this.nextButton.removeAttribute('aria-disabled');
      }
    }
  }
}

// Inicializar todos los sliders en la página
document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.repuestos-slider-container');
  sliders.forEach((container) => {
    new RepuestosCollectionsSlider(container);
  });
});

// También inicializar si el contenido se carga dinámicamente
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.repuestos-slider-container');
    sliders.forEach((container) => {
      new RepuestosCollectionsSlider(container);
    });
  });
} else {
  const sliders = document.querySelectorAll('.repuestos-slider-container');
  sliders.forEach((container) => {
    new RepuestosCollectionsSlider(container);
  });
}
