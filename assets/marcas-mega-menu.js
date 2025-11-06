/**
 * Maneja el mega menu de MARCAS con selección de marcas y visualización de modelos
 */
class MarcasMegaMenu {
  constructor() {
    this.motoImage = document.getElementById('mega-menu-moto-image');
    this.motoTitle = document.getElementById('mega-menu-moto-title');
    this.modelosList = document.getElementById('mega-menu-modelos-list');
    this.marcaButtons = document.querySelectorAll('.mega-menu__marca-button');
    this.defaultImageSrc =
      'https://via.placeholder.com/400x300/cccccc/666666?text=Moto+Dummy';
    this.selectedMarca = null;
    this.imageCache = new Map(); // Cache de imágenes cargadas
    this.loadingImage = false; // Flag para evitar múltiples cargas simultáneas

    this.init();
  }

  init() {
    console.log('[MARCAS] Inicializando MarcasMegaMenu');
    console.log('[MARCAS] modelosList encontrado:', !!this.modelosList);
    console.log('[MARCAS] marcaButtons encontrados:', this.marcaButtons.length);

    if (!this.modelosList) {
      console.error('[MARCAS] No se encontró #mega-menu-modelos-list');
      return;
    }

    // Debug: Verificar datos de las marcas
    this.marcaButtons.forEach((button, index) => {
      const marcaItem = button.closest('.mega-menu__marca-item');
      if (marcaItem) {
        const marca = marcaItem.getAttribute('data-marca');
        const models = marcaItem.getAttribute('data-models');
        const modelsCount = models ? models.split('|||').length : 0;
        console.log(
          `[MARCAS] Marca ${index + 1}:`,
          marca,
          `| Models (${modelsCount}):`,
          models ? models.substring(0, 100) + '...' : 'VACÍO',
        );
      }
    });

    // Manejar click en botones de marca
    this.marcaButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleMarcaClick(button);
      });
    });

    // NO seleccionar automáticamente la primera marca - dejar que el usuario seleccione
    // if (this.marcaButtons.length > 0) {
    //   this.handleMarcaClick(this.marcaButtons[0]);
    // }
  }

  handleMarcaClick(button) {
    // Remover estado activo de todas las marcas
    this.marcaButtons.forEach((btn) => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });

    // Marcar la marca seleccionada como activa
    button.classList.add('active');
    button.setAttribute('aria-selected', 'true');

    // Obtener datos de la marca
    const marcaItem = button.closest('.mega-menu__marca-item');
    if (!marcaItem) {
      console.warn('[MARCAS] No se encontró .mega-menu__marca-item');
      return;
    }

    const marca = marcaItem.getAttribute('data-marca');
    const modelsString = marcaItem.getAttribute('data-models');
    const brandUrl = marcaItem.getAttribute('data-url');

    console.log('[MARCAS] Marca seleccionada:', marca);
    console.log('[MARCAS] Models string:', modelsString);
    console.log('[MARCAS] Brand URL:', brandUrl);

    this.selectedMarca = marca;

    // Si no hay modelos o solo hay uno, cargar desde el backend
    if (
      !modelsString ||
      modelsString.trim() === '' ||
      modelsString.split('|||').length <= 1
    ) {
      this.loadModelosFromBackend(marca, brandUrl);
    } else {
      // Mostrar modelos de la marca seleccionada (desde Liquid)
      this.displayModelos(modelsString, brandUrl, marca);
    }

    // Ocultar imagen y título cuando se selecciona una marca (sin modelo específico aún)
    if (this.motoImage) {
      this.motoImage.style.opacity = '0';
      this.motoImage.style.display = 'none';
    }
    if (this.motoTitle) {
      this.motoTitle.textContent = '';
      this.motoTitle.style.display = 'none';
    }
  }

  displayModelos(modelsString, brandUrl, marca) {
    if (!this.modelosList) {
      console.warn('[MARCAS] No se encontró #mega-menu-modelos-list');
      return;
    }

    // Limpiar lista de modelos
    this.modelosList.innerHTML = '';

    const modelsCount = modelsString ? modelsString.split('|||').length : 0;
    console.log('[MARCAS] displayModelos llamado con:', {
      modelsString: modelsString?.substring(0, 200),
      modelsCount,
      brandUrl,
      marca,
    });

    if (!modelsString || modelsString.trim() === '') {
      console.warn('[MARCAS] No hay modelsString para la marca:', marca);
      // Mostrar mensaje si no hay modelos
      const placeholder = document.createElement('li');
      placeholder.className = 'mega-menu__modelos-placeholder';
      placeholder.innerHTML =
        '<p class="mega-menu__modelos-empty">No hay modelos disponibles para esta marca</p>';
      this.modelosList.appendChild(placeholder);
      return;
    }

    // Dividir modelos (separados por |||)
    // Formato puede ser: "modelo" o "modelo:::handle:::image_url" o "modelo:::handle" o solo "modelo"
    const modelos = modelsString.split('|||').filter((m) => m.trim() !== '');

    console.log('[MARCAS] Modelos parseados:', modelos);

    if (modelos.length === 0) {
      console.warn('[MARCAS] No se encontraron modelos después de parsear');
      const placeholder = document.createElement('li');
      placeholder.className = 'mega-menu__modelos-placeholder';
      placeholder.innerHTML =
        '<p class="mega-menu__modelos-empty">No hay modelos disponibles para esta marca</p>';
      this.modelosList.appendChild(placeholder);
      return;
    }

    // Crear elementos de lista para cada modelo
    modelos.forEach((modeloEntry) => {
      // Parsear modelo, handle e imagen (formato: "modelo:::handle:::image_url" o "modelo:::handle" o solo "modelo")
      const parts = modeloEntry.split(':::');
      const modelo = parts[0].trim();
      const collectionHandle = parts.length > 1 ? parts[1].trim() : null;
      const collectionImageUrl = parts.length > 2 ? parts[2].trim() : null;

      const li = document.createElement('li');
      const link = document.createElement('a');

      // Usar URL de la colección del modelo si existe, sino usar filtro en la colección de marca
      if (collectionHandle) {
        link.href = `/collections/${collectionHandle}`;
      } else {
        link.href = `${brandUrl}?filter=v.meta.compatibilidad_de_moto.modelo:${encodeURIComponent(
          modelo,
        )}`;
      }

      link.className = 'mega-menu__modelo-link';
      link.setAttribute('data-modelo', modelo);
      link.setAttribute('data-marca', marca);
      if (collectionHandle) {
        link.setAttribute('data-collection-handle', collectionHandle);
      }
      if (collectionImageUrl) {
        link.setAttribute('data-collection-image', collectionImageUrl);
      }
      link.textContent = modelo;

      // Manejar hover sobre modelo para cambiar imagen y título
      link.addEventListener('mouseenter', () => {
        this.updateMotoImage(
          marca,
          modelo,
          collectionHandle,
          collectionImageUrl,
        );
      });

      // También manejar mouseleave para volver a estado inicial si es necesario
      link.addEventListener('mouseleave', () => {
        // Opcional: mantener la imagen del último modelo hovered
        // O puedes dejar que se mantenga hasta que se seleccione otro modelo
      });

      li.appendChild(link);
      this.modelosList.appendChild(li);
    });

    // Agregar enlace "Ver todos" al final de la lista
    const verTodosLi = document.createElement('li');
    verTodosLi.className = 'mega-menu__modelos-ver-todos';
    const verTodosLink = document.createElement('a');
    verTodosLink.href = brandUrl;
    verTodosLink.className = 'mega-menu__modelo-link--ver-todos';
    verTodosLink.textContent = 'Ver todos';
    verTodosLi.appendChild(verTodosLink);
    this.modelosList.appendChild(verTodosLi);
  }

  async loadModelosFromBackend(marca, brandUrl) {
    if (!this.modelosList) {
      console.warn('[MARCAS] No se encontró #mega-menu-modelos-list');
      return;
    }

    // Limpiar lista de modelos
    this.modelosList.innerHTML = '';

    // Mostrar indicador de carga
    const loadingLi = document.createElement('li');
    loadingLi.className = 'mega-menu__modelos-placeholder';
    loadingLi.innerHTML = `
      <div class="mega-menu__loading-container">
        <svg class="mega-menu__loading-spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle class="mega-menu__loading-circle" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="31.416">
            <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416;0 31.416" repeatCount="indefinite"/>
            <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416;-31.416" repeatCount="indefinite"/>
          </circle>
        </svg>
        <p class="mega-menu__modelos-loading">Cargando modelos...</p>
      </div>
    `;
    this.modelosList.appendChild(loadingLi);

    try {
      const apiUrl =
        window.ENPITS_API_URL || 'https://browny-naoma-ovate.ngrok-free.dev';
      const brandEncoded = encodeURIComponent(marca);
      const url = `${apiUrl}/api/collections/brand/${brandEncoded}/models`;

      console.log('[MARCAS] Cargando modelos desde backend:', url);

      const response = await fetch(url, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[MARCAS] Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('[MARCAS] Response no es JSON:', text.substring(0, 200));
        throw new Error('La respuesta del servidor no es JSON');
      }

      const data = await response.json();
      console.log('[MARCAS] Modelos recibidos del backend:', data);

      if (data.success && data.models && data.models.length > 0) {
        // Convertir modelos del backend al formato esperado por displayModelos
        // Formato: "modelo:::handle:::image_url" o "modelo:::handle"
        const modelsString = data.models
          .map((model) => {
            if (model.image) {
              return `${model.name}:::${model.handle}:::${model.image}`;
            } else {
              return `${model.name}:::${model.handle}`;
            }
          })
          .join('|||');

        // Mostrar modelos usando el método existente
        this.displayModelos(modelsString, brandUrl, marca);
      } else {
        // No hay modelos
        this.modelosList.innerHTML = '';
        const placeholder = document.createElement('li');
        placeholder.className = 'mega-menu__modelos-placeholder';
        placeholder.innerHTML =
          '<p class="mega-menu__modelos-empty">No hay modelos disponibles para esta marca</p>';
        this.modelosList.appendChild(placeholder);
      }
    } catch (error) {
      console.error('[MARCAS] Error cargando modelos desde backend:', error);
      this.modelosList.innerHTML = '';
      const errorLi = document.createElement('li');
      errorLi.className = 'mega-menu__modelos-placeholder';
      errorLi.innerHTML =
        '<p class="mega-menu__modelos-empty">Error al cargar modelos</p>';
      this.modelosList.appendChild(errorLi);
    }
  }

  async updateMotoImage(
    marca,
    modelo,
    collectionHandle = null,
    collectionImageUrl = null,
  ) {
    if (!this.motoImage) return;

    const altText = modelo ? `${marca} ${modelo}` : marca;
    const titleText = modelo
      ? `${marca.toUpperCase()} ${modelo.toUpperCase()}`
      : marca.toUpperCase();

    console.log('[MARCAS] updateMotoImage llamado:', {
      marca,
      modelo,
      collectionHandle,
      collectionImageUrl,
    });

    // Actualizar título
    if (this.motoTitle) {
      this.motoTitle.textContent = titleText;
      // Ocultar título si no hay modelo
      if (!modelo) {
        this.motoTitle.style.display = 'none';
      } else {
        this.motoTitle.style.display = 'block';
      }
    }

    // Mostrar imagen si hay modelo
    if (modelo) {
      this.motoImage.style.display = 'block';
    }

    // Cambiar imagen con transición suave
    this.motoImage.style.opacity = '0';

    // Si ya tenemos la URL de la imagen desde Liquid, usarla directamente
    if (collectionImageUrl) {
      setTimeout(() => {
        this.motoImage.src = collectionImageUrl;
        this.motoImage.alt = altText;
        this.motoImage.style.opacity = '1';
      }, 150);
      return;
    }

    // Si no hay imagen directa pero hay handle, intentar cargar por AJAX
    if (collectionHandle) {
      // Si ya hay una carga en progreso, esperar
      if (this.loadingImage) return;

      try {
        const imageUrl = await this.getCollectionImageUrl(collectionHandle);
        setTimeout(() => {
          this.motoImage.src = imageUrl;
          this.motoImage.alt = altText;
          this.motoImage.style.opacity = '1';
        }, 150);
      } catch (error) {
        console.warn('[MARCAS] Error cargando imagen de colección:', error);
        // En caso de error, usar imagen por defecto
        setTimeout(() => {
          this.motoImage.src = this.defaultImageSrc;
          this.motoImage.alt = altText;
          this.motoImage.style.opacity = '1';
        }, 150);
      }
    } else {
      // Si no hay handle ni imagen, usar imagen por defecto
      setTimeout(() => {
        this.motoImage.src = this.defaultImageSrc;
        this.motoImage.alt = altText;
        this.motoImage.style.opacity = '1';
      }, 150);
    }
  }

  async getCollectionImageUrl(collectionHandle) {
    // Verificar cache primero
    if (this.imageCache.has(collectionHandle)) {
      return this.imageCache.get(collectionHandle);
    }

    this.loadingImage = true;

    try {
      // Hacer petición AJAX al endpoint del backend
      // Usar la URL del API backend (ajustar según tu configuración)
      // Opción 1: Si el API está en el mismo dominio (proxy)
      // const apiUrl = `/api/collections/handle/${encodeURIComponent(collectionHandle)}?shop=enpits.myshopify.com`;

      // Opción 2: Si el API está en un servidor separado (ngrok o servidor dedicado)
      // Necesitarás configurar esta URL según tu entorno
      const apiBaseUrl =
        window.ENPITS_API_URL || 'https://browny-naoma-ovate.ngrok-free.dev';
      const apiUrl = `${apiBaseUrl}/api/collections/handle/${encodeURIComponent(
        collectionHandle,
      )}?shop=enpits.myshopify.com`;

      const response = await fetch(apiUrl, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.collection) {
        // Extraer URL de la imagen de la colección
        let imageUrl = this.defaultImageSrc;

        if (data.collection.image && data.collection.image.url) {
          imageUrl = data.collection.image.url;
        } else if (data.collection.featured_image) {
          // Si viene como featured_image, convertir a URL
          if (typeof data.collection.featured_image === 'string') {
            imageUrl = data.collection.featured_image;
          } else if (data.collection.featured_image.url) {
            imageUrl = data.collection.featured_image.url;
          }
        }

        // Guardar en cache
        this.imageCache.set(collectionHandle, imageUrl);
        return imageUrl;
      } else {
        throw new Error('No se encontró la colección o no tiene imagen');
      }
    } catch (error) {
      console.error('Error obteniendo imagen de colección:', error);
      // Guardar imagen por defecto en cache para evitar reintentos
      this.imageCache.set(collectionHandle, this.defaultImageSrc);
      return this.defaultImageSrc;
    } finally {
      this.loadingImage = false;
    }
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new MarcasMegaMenu();
  });
} else {
  new MarcasMegaMenu();
}
