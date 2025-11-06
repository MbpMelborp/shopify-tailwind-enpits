/**
 * Most Sold Products Filter
 * Maneja el filtrado de productos por categoría (TODOS, LLANTAS, REPUESTOS)
 */

class MostSoldProductsFilter {
  constructor(container) {
    this.container = container;
    this.filters = this.container.querySelectorAll('.most-sold-filter');
    this.productItems = this.container.querySelectorAll(
      '.most-sold-product-item',
    );
    this.activeCategory = 'all';

    if (this.filters.length > 0 && this.productItems.length > 0) {
      this.init();
    }
  }

  init() {
    // Agregar event listeners a los filtros
    this.filters.forEach((filter) => {
      filter.addEventListener('click', this.handleFilterClick.bind(this));
    });

    // Mostrar productos de la categoría activa por defecto
    this.filterProducts('all');
  }

  handleFilterClick(event) {
    const filter = event.currentTarget;
    const category = filter.dataset.category;

    if (category && category !== this.activeCategory) {
      this.activeCategory = category;
      this.updateActiveFilter();
      this.filterProducts(category);
    }
  }

  updateActiveFilter() {
    this.filters.forEach((filter) => {
      if (filter.dataset.category === this.activeCategory) {
        filter.classList.add('most-sold-filter--active');
      } else {
        filter.classList.remove('most-sold-filter--active');
      }
    });
  }

  filterProducts(category) {
    this.productItems.forEach((item) => {
      const itemCategories = item.dataset.category;

      if (!itemCategories) {
        // Si no tiene categoría, ocultar
        item.classList.add('hidden');
        return;
      }

      // Verificar si el item pertenece a la categoría seleccionada
      const categories = itemCategories.split(' ');
      const shouldShow = category === 'all' || categories.includes(category);

      if (shouldShow) {
        item.classList.remove('hidden');
        // Agregar animación de fade-in
        item.style.opacity = '0';
        setTimeout(() => {
          item.style.opacity = '1';
        }, 10);
      } else {
        item.classList.add('hidden');
      }
    });
  }
}

// Inicializar todos los filtros en la página
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.most-sold-section');
  sections.forEach((section) => {
    new MostSoldProductsFilter(section);
  });
});
