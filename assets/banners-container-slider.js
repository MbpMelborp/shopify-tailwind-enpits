/**
 * BANNERS CONTAINER SLIDER
 * Componente moderno de banner rotador con funcionalidades avanzadas
 *
 * Características:
 * - Auto-play configurable
 * - Navegación por teclado
 * - Touch/Swipe en móviles
 * - Pausa en hover
 * - Indicadores interactivos
 * - Accesibilidad completa
 * - Intersection Observer para optimización
 */

class BannersContainerSlider {
  constructor(container) {
    this.container = container;
    this.slides = container.querySelectorAll('.banner-slide');
    this.indicators = container.querySelectorAll('.slider-indicator');
    this.prevButton = container.querySelector('.slider-controls--prev');
    this.nextButton = container.querySelector('.slider-controls--next');

    // Configuración
    this.currentIndex = 0;
    this.isPlaying = true;
    this.rotationSpeed = parseInt(container.dataset.rotationSpeed) || 5000;
    this.autoPlay = container.dataset.autoPlay === 'true';
    this.showControls = container.dataset.showControls === 'true';

    // Estado interno
    this.autoPlayInterval = null;
    this.isTransitioning = false;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.intersectionObserver = null;

    // Bind methods
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);

    this.init();
  }

  /**
   * Inicialización del slider
   */
  init() {
    if (this.slides.length === 0) return;

    this.setupInitialState();
    this.bindEvents();
    this.setupIntersectionObserver();
    this.startAutoPlay();

    // Añadir clase de inicialización
    this.container.classList.add('slider-initialized');
  }

  /**
   * Configurar estado inicial
   */
  setupInitialState() {
    // Asegurar que solo el primer slide esté activo
    this.slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === 0);
    });

    // Actualizar indicadores
    this.updateIndicators();

    // Configurar aria-labels
    this.setupAccessibility();
  }

  /**
   * Configurar accesibilidad
   */
  setupAccessibility() {
    // Configurar roles ARIA
    this.container.setAttribute('role', 'region');
    this.container.setAttribute('aria-label', 'Banner rotador');

    // Configurar slides
    this.slides.forEach((slide, index) => {
      slide.setAttribute('role', 'tabpanel');
      slide.setAttribute('aria-hidden', index !== 0);
      slide.setAttribute('aria-labelledby', `indicator-${index}`);
    });

    // Configurar indicadores
    this.indicators.forEach((indicator, index) => {
      indicator.setAttribute('role', 'tab');
      indicator.setAttribute('aria-selected', index === 0);
      indicator.setAttribute('aria-controls', `slide-${index}`);
      indicator.id = `indicator-${index}`;
    });

    // Configurar controles
    if (this.prevButton) {
      this.prevButton.setAttribute('aria-label', 'Banner anterior');
    }
    if (this.nextButton) {
      this.nextButton.setAttribute('aria-label', 'Banner siguiente');
    }
  }

  /**
   * Vincular eventos
   */
  bindEvents() {
    // Controles de navegación
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => this.prevSlide());
    }
    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => this.nextSlide());
    }

    // Indicadores
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });

    // Navegación por teclado
    this.container.addEventListener('keydown', this.handleKeyDown);

    // Touch/Swipe
    this.container.addEventListener('touchstart', this.handleTouchStart, {
      passive: true,
    });
    this.container.addEventListener('touchend', this.handleTouchEnd, {
      passive: true,
    });

    // Pausa en hover
    this.container.addEventListener('mouseenter', this.handleMouseEnter);
    this.container.addEventListener('mouseleave', this.handleMouseLeave);

    // Pausa cuando la ventana pierde el foco
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopAutoPlay();
      } else if (this.autoPlay) {
        this.startAutoPlay();
      }
    });
  }

  /**
   * Configurar Intersection Observer para optimización
   */
  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (this.autoPlay) {
                this.startAutoPlay();
              }
            } else {
              this.stopAutoPlay();
            }
          });
        },
        { threshold: 0.1 },
      );

      this.intersectionObserver.observe(this.container);
    }
  }

  /**
   * Manejar navegación por teclado
   */
  handleKeyDown(event) {
    if (!this.container.contains(document.activeElement)) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.prevSlide();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.nextSlide();
        break;
      case 'Home':
        event.preventDefault();
        this.goToSlide(0);
        break;
      case 'End':
        event.preventDefault();
        this.goToSlide(this.slides.length - 1);
        break;
      case ' ':
        event.preventDefault();
        this.toggleAutoPlay();
        break;
    }
  }

  /**
   * Manejar inicio de touch
   */
  handleTouchStart(event) {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  /**
   * Manejar fin de touch
   */
  handleTouchEnd(event) {
    if (!this.touchStartX || !this.touchStartY) return;

    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    const diffX = this.touchStartX - touchEndX;
    const diffY = this.touchStartY - touchEndY;

    // Solo procesar si el movimiento horizontal es mayor que el vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }

    // Resetear valores
    this.touchStartX = 0;
    this.touchStartY = 0;
  }

  /**
   * Manejar entrada del mouse
   */
  handleMouseEnter() {
    this.stopAutoPlay();
  }

  /**
   * Manejar salida del mouse
   */
  handleMouseLeave() {
    if (this.autoPlay) {
      this.startAutoPlay();
    }
  }

  /**
   * Ir al slide anterior
   */
  prevSlide() {
    if (this.isTransitioning) return;

    const newIndex =
      this.currentIndex === 0 ? this.slides.length - 1 : this.currentIndex - 1;
    this.goToSlide(newIndex);
  }

  /**
   * Ir al slide siguiente
   */
  nextSlide() {
    if (this.isTransitioning) return;

    const newIndex = (this.currentIndex + 1) % this.slides.length;
    this.goToSlide(newIndex);
  }

  /**
   * Ir a un slide específico
   */
  goToSlide(index) {
    if (
      this.isTransitioning ||
      index === this.currentIndex ||
      index < 0 ||
      index >= this.slides.length
    ) {
      return;
    }

    this.isTransitioning = true;
    this.currentIndex = index;

    this.updateSlides();
    this.updateIndicators();
    this.updateAccessibility();

    // Resetear flag de transición después de la animación
    setTimeout(() => {
      this.isTransitioning = false;
    }, 1000);
  }

  /**
   * Actualizar slides con efecto parallax
   */
  updateSlides() {
    this.slides.forEach((slide, index) => {
      const isActive = index === this.currentIndex;
      slide.classList.toggle('active', isActive);

      // Aplicar efecto parallax
      const backgroundImg = slide.querySelector('.banner-background img');
      const mainImg = slide.querySelector('.banner-main-image img');

      if (backgroundImg) {
        if (isActive) {
          backgroundImg.style.transform = 'scale(1) translateY(0)';
        } else {
          backgroundImg.style.transform = 'scale(1.15) translateY(10px)';
        }
      }

      if (mainImg) {
        if (isActive) {
          mainImg.style.transform = 'scale(1) translateY(0)';
        } else {
          mainImg.style.transform = 'scale(1.1) translateY(-10px)';
        }
      }
    });
  }

  /**
   * Actualizar indicadores
   */
  updateIndicators() {
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentIndex);
    });
  }

  /**
   * Actualizar accesibilidad
   */
  updateAccessibility() {
    this.slides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', index !== this.currentIndex);
    });

    this.indicators.forEach((indicator, index) => {
      indicator.setAttribute('aria-selected', index === this.currentIndex);
    });
  }

  /**
   * Iniciar auto-play
   */
  startAutoPlay() {
    if (!this.autoPlay || this.autoPlayInterval) return;

    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.rotationSpeed);
  }

  /**
   * Detener auto-play
   */
  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  /**
   * Alternar auto-play
   */
  toggleAutoPlay() {
    if (this.autoPlayInterval) {
      this.stopAutoPlay();
    } else if (this.autoPlay) {
      this.startAutoPlay();
    }
  }

  /**
   * Destruir el slider
   */
  destroy() {
    this.stopAutoPlay();

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    // Remover event listeners
    this.container.removeEventListener('keydown', this.handleKeyDown);
    this.container.removeEventListener('touchstart', this.handleTouchStart);
    this.container.removeEventListener('touchend', this.handleTouchEnd);
    this.container.removeEventListener('mouseenter', this.handleMouseEnter);
    this.container.removeEventListener('mouseleave', this.handleMouseLeave);

    // Remover clase de inicialización
    this.container.classList.remove('slider-initialized');
  }
}

/**
 * Inicialización automática cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.banners-container-slider');

  sliders.forEach((slider) => {
    try {
      new BannersContainerSlider(slider);
    } catch (error) {
      console.error('Error inicializando banner slider:', error);
    }
  });
});

/**
 * Reinicializar sliders después de cambios dinámicos
 */
window.BannersContainerSlider = BannersContainerSlider;

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BannersContainerSlider;
}
