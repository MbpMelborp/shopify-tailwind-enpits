# 🔍 Búsqueda Inline Responsive - Documentación

## 📋 **Overview**

Implementación de búsqueda adaptativa que cambia su comportamiento según el dispositivo:

- **📱 Mobile/Tablet**: Modal con ícono de búsqueda
- **💻 Desktop**: Input inline visible en el header (mega-menu)

---

## 🎯 **Comportamiento**

### **Mobile (< 990px)**
```
Usuario ve: 🔍 (ícono)
         ↓
     Click en ícono
         ↓
   Se abre modal
         ↓
  Input de búsqueda
```

### **Desktop (≥ 990px)**
```
Usuario ve: [────── Buscar productos... 🔍 ──────]
                    ↓
            Input siempre visible
                    ↓
        Usuario escribe directamente
                    ↓
    Resultados predictivos aparecen abajo
```

---

## 📁 **Archivos Modificados**

### 1. **`snippets/header-search-mega-menu.liquid`**

```liquid
<details-modal class='header__search header__search-inline'>
  <details>
    {%- comment -%} Mobile: Botón con ícono {%- endcomment -%}
    <summary class='header__icon ... large-up-hide'>
      <!-- Ícono de búsqueda -->
    </summary>

    {%- comment -%} Desktop: Input inline {%- endcomment -%}
    <div class='header__search-inline-form small-hide medium-hide'>
      <form>
        <input class='search__input--inline' />
        <!-- Búsqueda predictiva inline -->
      </form>
    </div>

    {%- comment -%} Mobile: Modal {%- endcomment -%}
    <div class='search-modal ... large-up-hide'>
      <!-- Modal completo para mobile -->
    </div>
  </details>
</details-modal>
```

**Cambios clave:**
- ✅ Agregada clase `header__search-inline`
- ✅ Input inline para desktop con clase `small-hide medium-hide`
- ✅ Summary (ícono) con clase `large-up-hide` para ocultar en desktop
- ✅ Modal con clase `large-up-hide` para ocultar en desktop
- ✅ IDs únicos para desktop (`{{ input_id }}-desktop`)

---

### 2. **`assets/app-tailwind.css`**

#### **Estructura CSS**

```css
.header__search-mega-menu {
  /* Contenedor principal - flex con gap */
  
  .header__search-mega-menu-search {
    /* Input de búsqueda - flex-1 */
    
    .header__search-inline-form {
      /* Formulario inline desktop */
      
      .search__input--inline {
        /* Estilos del input:
           - Rounded
           - Border gray
           - Focus ring blue
           - Shadow on focus
        */
      }
      
      .predictive-search--inline {
        /* Dropdown de resultados predictivos */
      }
    }
  }
  
  .header__search-mega-menu-help {
    /* WhatsApp help section */
  }
}
```

#### **Media Queries**

```css
/* Mobile (< 990px) */
@media screen and (max-width: 989px) {
  .header__search-inline .header__search-inline-form {
    display: none; /* Ocultar input inline */
  }
  
  .header__search-inline .header__icon--search {
    display: flex; /* Mostrar ícono */
  }
}

/* Desktop (≥ 990px) */
@media screen and (min-width: 990px) {
  .header__search-inline .header__icon--search.large-up-hide {
    display: none; /* Ocultar ícono */
  }
  
  .header__search-inline .header__search-inline-form {
    display: block; /* Mostrar input */
  }
  
  .header__search-inline .search-modal.large-up-hide {
    display: none; /* Ocultar modal */
  }
}
```

---

## 🎨 **Estilos del Input Inline**

### **Estados del Input**

```css
/* Normal */
.search__input--inline {
  width: 100%;
  height: 3rem (48px);
  padding: 1rem 3rem 1rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db; /* gray-300 */
  background: white;
}

/* Focus */
.search__input--inline:focus {
  outline: none;
  box-shadow: 0 0 0 2px #3b82f6; /* ring-blue-500 */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); /* shadow-lg */
}

/* Hover en botón de búsqueda */
.field__button:hover {
  opacity: 0.7;
}
```

---

## 🔧 **Características**

### ✅ **Búsqueda Predictiva**

Si `settings.predictive_search_enabled` está activo:

```liquid
<predictive-search class='search-inline__form' data-loading-text='...'>
  <form>
    <input role='combobox' aria-expanded='false' ... />
  </form>
  
  <div class='predictive-search--inline' id='predictive-search-results-inline'>
    <!-- Resultados aparecen aquí -->
  </div>
</predictive-search>
```

**Resultados aparecen:**
- Posición: Absoluta, debajo del input
- Ancho: 100% del input
- Estilo: Shadow-xl, rounded, border
- Z-index: 50 (encima de otros elementos)
- Max-height: 24rem con scroll

---

### ✅ **Accesibilidad**

#### **Desktop Input**
```html
<input
  role='combobox'
  aria-expanded='false'
  aria-owns='predictive-search-results-inline'
  aria-controls='predictive-search-results-inline'
  aria-haspopup='listbox'
  aria-autocomplete='list'
/>
```

#### **Mobile Modal**
```html
<div
  role='dialog'
  aria-modal='true'
  aria-label='Buscar'
/>
```

---

## 📱 **Responsive Breakpoints**

| Dispositivo | Breakpoint | Comportamiento |
|-------------|------------|----------------|
| **Mobile** | < 750px | Modal con ícono |
| **Tablet** | 750px - 989px | Modal con ícono |
| **Desktop** | ≥ 990px | Input inline visible |

**Clases Shopify usadas:**
- `small-hide` - Oculta en < 750px
- `medium-hide` - Oculta en 750px-989px
- `large-up-hide` - Oculta en ≥ 990px

---

## 🎯 **Layout del Mega Menu**

```
Desktop (≥ 990px):
┌────────────────────────────────────────────────────┐
│  Nav Links...    [────── Search ──────]  WhatsApp │
└────────────────────────────────────────────────────┘
     flex-1              flex-1 max-w-2xl    shrink-0
```

```css
.header__inline-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
  
  .list-menu--inline {
    flex: 1; /* Links ocupan espacio disponible */
  }
  
  .header__search-mega-menu {
    flex: 1;
    max-width: 48rem; /* 2xl = 672px */
  }
}
```

---

## 🚀 **Cómo Usar**

### **1. En el Header**

```liquid
<!-- snippets/header-mega-menu.liquid -->
<div class='header__search-mega-menu'>
  <div class='header__search-mega-menu-search'>
    {% render 'header-search-mega-menu', input_id: 'Search-In-Line' %}
  </div>
  <div class='header__search-mega-menu-help'>
    <!-- WhatsApp help section -->
  </div>
</div>
```

### **2. Compilar CSS**

```bash
# Desarrollo con source maps
npm run build:css:dev

# Producción minificado
npm run build:css
```

### **3. Subir a Shopify**

```bash
# Subir al tema de desarrollo
npm run push
```

---

## 🎨 **Personalización**

### **Cambiar colores del input**

```css
.search__input--inline {
  /* Cambiar border normal */
  @apply border-gray-300; /* → border-blue-300 */
  
  /* Cambiar focus ring */
  @apply focus:ring-blue-500; /* → focus:ring-green-500 */
  
  /* Cambiar background */
  @apply bg-white; /* → bg-gray-50 */
}
```

### **Ajustar tamaño del input**

```css
.search__input--inline {
  @apply h-12; /* → h-10 o h-14 */
  @apply px-4;  /* → px-6 para más padding */
}
```

### **Cambiar ancho máximo en desktop**

```css
.header__search-mega-menu {
  @apply max-w-2xl; /* 672px */
  /* Opciones: max-w-xl (576px), max-w-3xl (768px), max-w-4xl (896px) */
}
```

---

## 🐛 **Troubleshooting**

### **Problema: El input no aparece en desktop**

**Solución:**
1. Verifica que el CSS esté compilado: `npm run build:css:dev`
2. Verifica que la clase `small-hide medium-hide` esté en el div correcto
3. Verifica que el navegador tenga ancho ≥ 990px

### **Problema: El modal no se abre en mobile**

**Solución:**
1. Verifica que la clase `large-up-hide` esté en el `<summary>`
2. Verifica que el JavaScript de `<details-modal>` esté cargado
3. Checa la consola del navegador por errores

### **Problema: Los resultados predictivos no aparecen**

**Solución:**
1. Verifica que `settings.predictive_search_enabled` esté activo en Shopify
2. Verifica que el web component `<predictive-search>` esté definido
3. Checa que el JavaScript de búsqueda predictiva esté cargado

---

## 📊 **Flujo de Datos**

### **Desktop Search**
```
Usuario escribe en input inline
         ↓
predictive-search web component detecta cambio
         ↓
Hace fetch a /search/suggest.json?q=...
         ↓
Muestra resultados en .predictive-search--inline
         ↓
Usuario selecciona resultado o presiona Enter
         ↓
Navega a producto o página de resultados
```

### **Mobile Search**
```
Usuario click en 🔍
         ↓
<details> se abre
         ↓
Modal aparece con overlay
         ↓
Usuario escribe en input del modal
         ↓
(Mismo flujo de búsqueda predictiva)
```

---

## 🔗 **Archivos Relacionados**

```
snippets/
├── header-search-mega-menu.liquid   ← Componente principal
├── header-mega-menu.liquid           ← Contenedor del mega menu
└── loading-spinner.liquid            ← Spinner de carga

assets/
├── app-tailwind.css                  ← Estilos (líneas 1482-1604)
├── app.css                           ← CSS compilado
└── app.css.map                       ← Source map

sections/
└── header.liquid                     ← Header principal
```

---

## 💡 **Mejores Prácticas**

1. ✅ **Siempre compila CSS después de cambios**
   ```bash
   npm run build:css:dev
   ```

2. ✅ **Prueba en diferentes tamaños de pantalla**
   - Mobile: < 750px
   - Tablet: 750px - 989px
   - Desktop: ≥ 990px

3. ✅ **Verifica accesibilidad**
   - Navegación por teclado (Tab, Enter, Esc)
   - Screen readers (NVDA, VoiceOver)
   - ARIA attributes correctos

4. ✅ **Optimiza búsqueda predictiva**
   - Debounce de 300ms en el input
   - Máximo 5-7 resultados
   - Lazy load de imágenes

---

## 🎯 **Next Steps**

- [ ] Agregar animación de transición entre mobile/desktop
- [ ] Implementar búsqueda por voz
- [ ] Agregar filtros rápidos (categorías, precio)
- [ ] Optimizar resultados predictivos
- [ ] A/B testing de posicionamiento del input

---

## 📝 **Changelog**

### v1.0.0 - 2024-10-20
- ✅ Implementación inicial de búsqueda inline responsive
- ✅ Estilos CSS con Tailwind
- ✅ Soporte para búsqueda predictiva
- ✅ Accesibilidad completa (ARIA)
- ✅ Source maps para debugging

