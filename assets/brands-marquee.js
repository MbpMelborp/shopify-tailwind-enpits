/**
 * Brands Marquee
 * Maneja la marquesina infinita de marcas con pausa en hover
 */

class BrandsMarquee {
  constructor(container) {
    this.container = container;
    this.track = container.querySelector('.brands-marquee-track');
    this.sectionId = container.dataset.sectionId;

    if (!this.track) return;

    // Obtener velocidad desde el schema (default: 5)
    const speed = this.getSpeedFromSettings();

    this.init(speed);
  }

  getSpeedFromSettings() {
    // Intentar obtener la velocidad desde el atributo data-speed del contenedor
    // Por defecto, usar velocidad 5 (12s para completar un ciclo)
    try {
      const speedAttr = this.container.getAttribute('data-speed');
      if (speedAttr) {
        const speed = parseInt(speedAttr, 10);
        if (!isNaN(speed) && speed > 0) {
          return speed;
        }
      }
    } catch (e) {
      console.warn(
        'No se pudo obtener velocidad del schema, usando default:',
        e,
      );
    }
    return 5;
  }

  init(speed) {
    // Calcular duración basada en velocidad (más rápido = menor duración)
    // Velocidad 1 = 60s, velocidad 5 = 12s, velocidad 10 = 6s
    const baseDuration = 60;
    const duration = baseDuration / speed;

    // Aplicar duración de animación
    this.track.style.animationDuration = `${duration}s`;

    // Asegurar que el contenido esté duplicado correctamente
    this.ensureDuplication();

    // Los eventos de hover ya están manejados por CSS
    // Solo necesitamos asegurar que el contenido esté correctamente duplicado
  }

  ensureDuplication() {
    // El contenido ya está duplicado en Liquid (2 veces)
    // Verificar que el ancho del track sea suficiente para el efecto infinito
    // Esto se hace automáticamente por la animación CSS que mueve -50%
    // No necesitamos duplicar más en JavaScript
  }
}

// Inicializar todos los marquees en la página
document.addEventListener('DOMContentLoaded', () => {
  const marquees = document.querySelectorAll('.brands-marquee-container');
  marquees.forEach((container) => {
    new BrandsMarquee(container);
  });
});

// También inicializar si el contenido se carga dinámicamente
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const marquees = document.querySelectorAll('.brands-marquee-container');
    marquees.forEach((container) => {
      new BrandsMarquee(container);
    });
  });
} else {
  const marquees = document.querySelectorAll('.brands-marquee-container');
  marquees.forEach((container) => {
    new BrandsMarquee(container);
  });
}
