# 📦 Documentación de Secciones - EnPits Theme

Documentación detallada de todas las secciones del tema Shopify.

---

## 📋 Índice

1. [Announcement Bar](#announcement-bar)
2. [Header](#header)
3. [Footer](#footer)
4. [Product](#product)
5. [Collection](#collection)

---

## 📢 Announcement Bar

**Archivo**: `sections/announcement-bar.liquid`

### Descripción
Barra superior que muestra anuncios rotativos, íconos de redes sociales y selectores de idioma/país.

### Estructura

```
┌─────────────────────────────────────────────────┐
│ [Social Icons] [Announcements] [Language/Country] │
└─────────────────────────────────────────────────┘
```

### Componentes Principales

#### 1. Íconos Sociales
- **Ubicación**: Lado izquierdo
- **Condición**: Solo si `show_social` está habilitado
- **Redes soportadas**: Facebook, Instagram, YouTube, TikTok, Twitter, Pinterest, Snapchat, Tumblr, Vimeo

#### 2. Anuncios
Dos modos de operación:

**Modo Simple** (1 anuncio):
```liquid
<p class="announcement-bar__message h5">
  <span>{{ section.blocks.first.settings.text | escape }}</span>
</p>
```

**Modo Carrusel** (múltiples anuncios):
- Navegación con botones prev/next
- Auto-rotación configurable
- Cada anuncio puede tener link

#### 3. Selectores de Localización
- **Selector de país**: Para cambiar moneda/región
- **Selector de idioma**: Para cambiar idioma de la tienda
- **Visibilidad**: Oculto en móvil (`small-hide medium-hide`)

### Configuración (Settings)

| Setting | Tipo | Default | Descripción |
|---------|------|---------|-------------|
| `color_scheme` | color_scheme | scheme-4 | Esquema de color de la barra |
| `show_line_separator` | checkbox | true | Mostrar línea separadora inferior |
| `show_social` | checkbox | false | Mostrar íconos de redes sociales |
| `auto_rotate` | checkbox | false | Rotación automática de anuncios |
| `change_slides_speed` | range (3-10) | 5 | Velocidad de rotación en segundos |
| `enable_country_selector` | checkbox | false | Habilitar selector de país |
| `enable_language_selector` | checkbox | false | Habilitar selector de idioma |

### Bloques (Blocks)

**Tipo**: `announcement`

| Setting | Tipo | Descripción |
|---------|------|-------------|
| `text` | text | Texto del anuncio |
| `link` | url | URL opcional para hacer el anuncio clickeable |

**Límite**: Máximo 12 bloques

### CSS Classes

```css
.utility-bar                    /* Contenedor principal */
.utility-bar__grid              /* Grid layout */
.announcement-bar               /* Contenedor de anuncios */
.announcement-bar__message      /* Texto del anuncio */
.announcement-bar__link         /* Link del anuncio */
.slider-button                  /* Botones de navegación */
.localization-wrapper           /* Contenedor de selectores */
```

### JavaScript

**Componente**: `slideshow-component`
- Maneja la rotación automática
- Controla la navegación entre slides
- Atributos:
  - `data-autoplay`: Habilita auto-rotación
  - `data-speed`: Velocidad en segundos

### Accesibilidad

- ✅ Roles ARIA apropiados (`region`, `group`)
- ✅ Labels descriptivos para navegación
- ✅ Live regions para anuncios dinámicos
- ✅ Navegación por teclado

### Personalización Común

#### Cambiar colores
```liquid
"color_scheme": "scheme-1"  // Cambia el esquema de color
```

#### Deshabilitar auto-rotación
```liquid
"auto_rotate": false
```

#### Agregar múltiples anuncios
```json
"blocks": [
  {
    "type": "announcement",
    "settings": {
      "text": "Envío gratis en compras mayores a $50",
      "link": "/collections/all"
    }
  },
  {
    "type": "announcement",
    "settings": {
      "text": "20% de descuento en toda la tienda",
      "link": "/collections/sale"
    }
  }
]
```

### Dependencias

- `component-slideshow.css`
- `component-slider.css`
- `component-list-social.css` (si show_social está habilitado)
- `theme-editor.js` (solo en design mode)

### Notas Técnicas

1. **Renderizado condicional**: Solo muestra componentes si están configurados
2. **Theme Editor**: Incluye fix especial para preview en el editor
3. **Grid adaptativo**: Cambia de 1 a 3 columnas según contenido activo
4. **Localización**: Usa formularios Shopify nativos para cambio de idioma/país

---

## 🎯 Header

**Archivo**: `sections/header.liquid`

### Descripción
Sección principal de navegación del sitio. Incluye logo, menú de navegación, búsqueda y carrito.

### Estructura

```
┌────────────────────────────────────────────┐
│ [Logo] [Navigation Menu] [Search] [Cart]  │
└────────────────────────────────────────────┘
```

### Componentes Principales

#### 1. Logo
- Imagen configurable desde el theme editor
- Ancho ajustable (50-300px)
- Link automático a la página de inicio

#### 2. Menú de Navegación
- Soporte para menús multi-nivel
- Mega menú opcional
- Responsive (hamburger en móvil)

#### 3. Búsqueda
- Búsqueda predictiva
- Modal o drawer según configuración
- Resultados en tiempo real

#### 4. Carrito
- Contador de items
- Drawer, page o notification según configuración
- Actualización en tiempo real

### Configuración (Settings)

| Setting | Tipo | Default | Descripción |
|---------|------|---------|-------------|
| `color_scheme` | color_scheme | scheme-1 | Esquema de color del header |
| `logo` | image_picker | - | Logo de la tienda |
| `logo_width` | range (50-300) | 100 | Ancho del logo en px |
| `menu` | link_list | main-menu | Menú principal de navegación |
| `show_line_separator` | checkbox | true | Línea separadora inferior |
| `sticky_header_type` | select | on-scroll-up | Comportamiento sticky |
| `enable_sticky_header` | checkbox | true | Habilitar header pegajoso |

### CSS Classes

```css
.header-wrapper              /* Contenedor principal */
.header                      /* Header interno */
.header__heading            /* Contenedor del logo */
.header__menu               /* Menú de navegación */
.header__icons              /* Iconos (búsqueda, carrito) */
.header__search             /* Búsqueda */
.header__cart               /* Carrito */
```

### Dependencias

- `component-menu-drawer.css`
- `component-cart-notification.css`
- `component-cart-drawer.css`
- `component-predictive-search.css`

---

## 📝 Plantilla para Nuevas Secciones

Cuando documentes una nueva sección, usa esta estructura:

```markdown
## 🎨 [Nombre de la Sección]

**Archivo**: `sections/nombre-seccion.liquid`

### Descripción
Breve descripción de qué hace la sección.

### Estructura
Diagrama visual de la estructura.

### Componentes Principales
Lista de componentes con explicación.

### Configuración (Settings)
Tabla con todos los settings disponibles.

### Bloques (Blocks)
Si la sección tiene bloques, documentarlos aquí.

### CSS Classes
Lista de clases CSS principales.

### JavaScript
Componentes JS si los hay.

### Accesibilidad
Características de accesibilidad.

### Personalización Común
Ejemplos de personalizaciones frecuentes.

### Dependencias
Assets y archivos relacionados.

### Notas Técnicas
Información técnica adicional.
```

---

**Última actualización**: Octubre 2025
**Mantenido por**: Equipo EnPits

