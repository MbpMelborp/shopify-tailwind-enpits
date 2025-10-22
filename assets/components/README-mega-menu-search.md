# 📋 Mega Menu Search - Guía de Organización

## 🗂️ Estructura del Archivo

El archivo `mega-menu-search.css` está organizado en **8 secciones principales** para facilitar el mantenimiento y la comprensión.

---

## 📑 Índice de Secciones

```
├── 1. BASE STYLES (Líneas 7-65)
│   └── Estilos compartidos entre mobile y desktop
│
├── 2. INLINE SEARCH WRAPPER (Líneas 67-108)
│   └── Contenedor de búsqueda y elementos auxiliares
│
├── 3. INPUT STYLES (Líneas 110-156)
│   └── Campo de búsqueda y sus estados
│
├── 4. BUTTON STYLES (Líneas 158-220)
│   └── Botones de búsqueda (inline y form)
│
├── 5. PREDICTIVE SEARCH RESULTS (Líneas 222-234)
│   └── Resultados de búsqueda predictiva
│
├── 6. MOBILE STYLES (Líneas 236-256)
│   └── @media (max-width: 989px)
│
├── 7. DESKTOP STYLES (Líneas 258-288)
│   └── @media (min-width: 990px)
│
└── 8. END @layer components (Línea 289)
```

---

## 📱 **MOBILE vs 🖥️ DESKTOP**

### **MOBILE (< 990px)**

#### **Comportamiento:**
- ✅ **Modal visible** - Se muestra el ícono de búsqueda
- ❌ **Input inline oculto** - No se ve el campo de búsqueda
- 📍 **Ubicación** - Alineado a la derecha

#### **Estilos aplicados:**
```css
@media screen and (max-width: 989px) {
  .inline-search-wrapper { display: none !important; }
  .inline-search-icon { display: flex !important; }
  .header__search-mega-menu { justify-content: flex-end; }
}
```

#### **Qué se ve:**
```
┌─────────────────────────────────┐
│  Logo  [Home] [Catalog] [🔍]   │ ← Solo el ícono
└─────────────────────────────────┘
```

---

### **DESKTOP (≥ 990px)**

#### **Comportamiento:**
- ❌ **Modal oculto** - No se ve el ícono
- ✅ **Input inline visible** - Campo de búsqueda integrado
- 📏 **Ancho completo** - Ocupa todo el espacio disponible

#### **Estilos aplicados:**
```css
@media screen and (min-width: 990px) {
  .inline-search-wrapper { display: flex !important; }
  .inline-search-icon { display: none !important; }
  .inline-search-modal-wrapper { display: none !important; }
}
```

#### **Qué se ve:**
```
┌──────────────────────────────────────────────────────┐
│  Logo  [Home] [Catalog]  [Search input 🔍]  WhatsApp│
└──────────────────────────────────────────────────────┘
                           ↑ Input inline visible
```

---

## 🎨 Secciones Detalladas

### **1️⃣ BASE STYLES**
**Qué contiene:**
- Contenedor principal (`.header__search-mega-menu`)
- Sección de búsqueda (`.header__search-mega-menu-search`)
- Sección de ayuda/WhatsApp (`.header__search-mega-menu-help`)
- Layout del container

**Cuándo se aplica:** Siempre (mobile y desktop)

---

### **2️⃣ INLINE SEARCH WRAPPER**
**Qué contiene:**
- Wrapper del formulario
- Campo de formulario
- Label oculto (accesibilidad)
- Botón de reset (oculto)

**Cuándo se aplica:** Siempre, pero visible solo en desktop

---

### **3️⃣ INPUT STYLES**
**Qué contiene:**
- Estilos del input (`.inline-search-input`)
- Placeholder
- Estados de focus
- Override del padding (`.search__input.field__input`)

**Características:**
- Altura: `2.5rem`
- Padding right: `3rem` (espacio para botón)
- Border radius: `0.5rem`

---

### **4️⃣ BUTTON STYLES**
**Qué contiene:**
- Botón inline (`.inline-search-button`) - dentro del input
- Botón del form (`.search__button`) - fuera del input
- Estados hover/focus
- Estilos de iconos

**Tipos de botón:**
1. **Inline Button** - Rojo, dentro del input
2. **Search Button** - Transparente, fuera del input

---

### **5️⃣ PREDICTIVE SEARCH RESULTS**
**Qué contiene:**
- Dropdown de resultados
- Estilos de sombra
- Z-index y posicionamiento

**Características:**
- Max height: `24rem` (96 * 0.25)
- Scroll automático
- Shadow XL

---

### **6️⃣ MOBILE STYLES** 📱

```css
@media (max-width: 989px) {
  /* Ocultar inline search */
  .inline-search-wrapper → hidden
  
  /* Mostrar ícono modal */
  .inline-search-icon → flex
  
  /* Alinear a la derecha */
  .header__search-mega-menu → justify-end
}
```

**Visual:**
- ❌ Input inline → **Oculto**
- ✅ Ícono modal → **Visible**
- 📍 Alineación → **Derecha**

---

### **7️⃣ DESKTOP STYLES** 🖥️

```css
@media (min-width: 990px) {
  /* Mostrar inline search */
  .inline-search-wrapper → flex (full width)
  
  /* Ocultar ícono modal */
  .inline-search-icon → hidden
  
  /* Ocultar modal */
  .inline-search-modal-wrapper → hidden
  
  /* Ajustar grid del header */
  .header--middle-left → grid-cols-[auto_1fr_auto]
}
```

**Visual:**
- ✅ Input inline → **Visible (ancho completo)**
- ❌ Ícono modal → **Oculto**
- ❌ Modal overlay → **Oculto**
- 📏 Grid → **Optimizado para expansión**

---

## 🎯 Guía Rápida de Edición

### **Quiero cambiar el color del botón:**
```css
/* Línea 172 */
.inline-search-button {
  background-color: #ef4444; /* ← Cambia aquí */
}
```

### **Quiero cambiar el tamaño del input:**
```css
/* Línea 120 */
.inline-search-input {
  height: 2.5rem; /* ← Cambia aquí */
}
```

### **Quiero cambiar el breakpoint mobile/desktop:**
```css
/* Línea 238 - Mobile */
@media screen and (max-width: 989px) { /* ← Cambia aquí */

/* Línea 260 - Desktop */
@media screen and (min-width: 990px) { /* ← Cambia aquí */
```

### **Quiero cambiar el espaciado del mega menu:**
```css
/* Línea 10 */
.header__search-mega-menu {
  gap: 0.75rem; /* ← Cambia aquí */
}
```

---

## 🔍 Búsqueda Rápida

| Necesito cambiar... | Buscar en línea... |
|---------------------|-------------------|
| Color del botón | 172 |
| Tamaño del input | 120 |
| Breakpoint mobile | 238 |
| Breakpoint desktop | 260 |
| Gap del mega menu | 10 |
| Estilos del placeholder | 133 |
| Estilos de focus | 136 |
| Botón hover | 176 |
| Resultados predictivos | 224 |

---

## 📝 Notas Importantes

1. **Todos los estilos están dentro de `@layer components`** - Esto permite que `@apply` funcione correctamente

2. **Los media queries están al final** - Facilita encontrar diferencias mobile/desktop

3. **Comentarios claros** - Cada sección tiene un header descriptivo

4. **Clases específicas** - Todas las clases comienzan con `.header__search-mega-menu` para evitar conflictos

5. **!important solo cuando es necesario** - Para sobrescribir estilos base de Shopify

---

## 🚀 Tips de Mantenimiento

### ✅ **Hacer:**
- Mantener la estructura de secciones
- Agregar comentarios descriptivos
- Usar `@apply` para utilidades de Tailwind
- Agrupar estilos relacionados

### ❌ **Evitar:**
- Mezclar estilos mobile y desktop
- Usar selectores genéricos
- Eliminar comentarios de sección
- Cambiar el orden de las secciones

---

## 🎨 Estructura Visual

```
┌─────────────────────────────────────────────────┐
│          @layer components {                    │
├─────────────────────────────────────────────────┤
│  BASE STYLES                                    │
│  └── Compartidos (mobile + desktop)            │
├─────────────────────────────────────────────────┤
│  INLINE SEARCH WRAPPER                          │
│  └── Contenedor y elementos auxiliares         │
├─────────────────────────────────────────────────┤
│  INPUT STYLES                                   │
│  └── Campo de búsqueda                          │
├─────────────────────────────────────────────────┤
│  BUTTON STYLES                                  │
│  └── Botones de búsqueda                        │
├─────────────────────────────────────────────────┤
│  PREDICTIVE SEARCH RESULTS                      │
│  └── Dropdown de resultados                     │
├─────────────────────────────────────────────────┤
│  📱 MOBILE STYLES (@media max-width: 989px)    │
│  └── Ocultar inline, mostrar modal             │
├─────────────────────────────────────────────────┤
│  🖥️ DESKTOP STYLES (@media min-width: 990px)  │
│  └── Mostrar inline, ocultar modal             │
├─────────────────────────────────────────────────┤
│          } /* End @layer components */          │
└─────────────────────────────────────────────────┘
```

---

¡Ahora el archivo está perfectamente organizado y es fácil de entender y mantener! 🎉


