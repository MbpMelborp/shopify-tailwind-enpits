# 🔍 Debug - Búsqueda Inline

## ✅ **Nuevas Clases Creadas (No afectan header-search.liquid)**

### **Clases con prefijo `inline-search-`:**

| Clase | Propósito | Responsive |
|-------|-----------|------------|
| `.inline-search-wrapper` | Contenedor del input inline | `hidden` en mobile, `block` en desktop |
| `.inline-search-icon` | Ícono de búsqueda (summary) | `flex` en mobile, `hidden` en desktop |
| `.inline-search-modal` | Modal de búsqueda | Visible en mobile, `hidden` en desktop |
| `.inline-search-form` | Formulario inline | Wrapper del form |
| `.inline-search-input` | Input de búsqueda | Estilos del input |
| `.inline-search-button` | Botón submit | Botón de lupa |
| `.inline-search-results` | Resultados predictivos | Dropdown de resultados |

---

## 🎯 **Estructura HTML Generada**

### **Desktop (≥ 990px)**

```html
<details-modal class="header__search">
  <details>
    <!-- Ícono: OCULTO en desktop -->
    <summary class="... inline-search-icon" style="display: none !important;">
      🔍
    </summary>

    <!-- Input Inline: VISIBLE en desktop -->
    <div class="inline-search-wrapper" style="display: block !important;">
      <form class="inline-search-form">
        <input class="inline-search-input" placeholder="Buscar..." />
        <button class="inline-search-button">🔍</button>
      </form>
    </div>

    <!-- Modal: OCULTO en desktop -->
    <div class="inline-search-modal" style="display: none !important;">
      ...
    </div>
  </details>
</details-modal>
```

### **Mobile (< 990px)**

```html
<details-modal class="header__search">
  <details>
    <!-- Ícono: VISIBLE en mobile -->
    <summary class="... inline-search-icon" style="display: flex !important;">
      🔍
    </summary>

    <!-- Input Inline: OCULTO en mobile -->
    <div class="inline-search-wrapper" style="display: none !important;">
      ...
    </div>

    <!-- Modal: VISIBLE cuando se abre -->
    <div class="inline-search-modal">
      <form>
        <input placeholder="Buscar..." />
      </form>
    </div>
  </details>
</details-modal>
```

---

## 🔍 **Cómo Verificar en el Navegador**

### **1. Abre Chrome DevTools (F12)**

### **2. Ve a la pestaña Elements**

### **3. Busca el elemento:**
```javascript
document.querySelector('.inline-search-wrapper')
```

### **4. Verifica el computed style:**
```javascript
// En consola:
const wrapper = document.querySelector('.inline-search-wrapper');
console.log('Display:', window.getComputedStyle(wrapper).display);
console.log('Visibility:', window.getComputedStyle(wrapper).visibility);
console.log('Width:', wrapper.offsetWidth);
console.log('Height:', wrapper.offsetHeight);
```

### **5. Verifica el ancho de la ventana:**
```javascript
console.log('Window width:', window.innerWidth);
// Debe ser ≥ 990px para ver el input
```

---

## 🚨 **Checklist de Troubleshooting**

### ✅ **Verificar que todo está bien:**

- [ ] CSS compilado: `npm run build:css:dev` ejecutado
- [ ] Archivo `app.css` actualizado (verifica timestamp)
- [ ] Navegador en desktop (width ≥ 990px)
- [ ] Cache del navegador limpio (`Cmd+Shift+R` o `Ctrl+Shift+F5`)
- [ ] Shopify theme actualizado (si trabajas con `shopify theme dev`)

### 🔍 **Comandos de Debug:**

```bash
# Verificar que el CSS tiene las clases
grep "inline-search-wrapper" assets/app.css

# Verificar timestamp del CSS
ls -lh assets/app.css

# Verificar que el CSS compiló correctamente
tail -1 assets/app.css  # Debe mostrar: /*# sourceMappingURL=app.css.map */
```

---

## 📱 **Breakpoints**

```css
/* Mobile: < 990px */
.inline-search-wrapper { display: none !important; }
.inline-search-icon { display: flex !important; }

/* Desktop: ≥ 990px */
.inline-search-wrapper { display: block !important; }
.inline-search-icon { display: none !important; }
.inline-search-modal { display: none !important; }
```

---

## 🎨 **Estilos Aplicados al Input**

```css
.inline-search-input {
  width: 100%;
  height: 3rem (48px);
  padding: 1rem 3rem 1rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db (gray-300);
  background: white;
  color: #111827 (gray-900);
  font-size: 1rem;
}

.inline-search-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px #3b82f6 (blue-500);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

---

## 🔗 **Archivos Afectados**

✅ **Solo afecta mega-menu:**
- `snippets/header-search-mega-menu.liquid`
- Clases con prefijo `inline-search-*`

❌ **NO afecta:**
- `snippets/header-search.liquid` (funcionamiento original intacto)
- Otros componentes de búsqueda

---

## 🚀 **Si aún no aparece:**

### **Opción 1: Verificar en el navegador**
1. Abre DevTools
2. Busca: `<div class="inline-search-wrapper">`
3. Verifica si existe en el DOM
4. Verifica computed styles

### **Opción 2: Agregar estilos inline temporales**
```liquid
<!-- En header-search-mega-menu.liquid, línea 31 -->
<div class='inline-search-wrapper' style='background: red; min-height: 50px;'>
```

Si ves un bloque rojo, el HTML está renderizando pero los estilos no aplican.
Si no ves nada, el HTML no se está generando.

### **Opción 3: Verificar que el snippet se llama**
```liquid
<!-- En header-mega-menu.liquid, línea 98 -->
{% render 'header-search-mega-menu', input_id: 'Search-In-Line' %}
```

Asegúrate de que esta línea esté presente.

---

## 📝 **Resumen de Cambios**

### **Antes:**
- Usaba clases genéricas que podían afectar otros componentes
- Clases Shopify: `small-hide`, `medium-hide`, `large-up-hide`

### **Ahora:**
- ✅ Clases únicas con prefijo `inline-search-*`
- ✅ No afecta `header-search.liquid` original
- ✅ Estilos aislados solo para mega-menu
- ✅ Media queries con `!important` para sobrescribir

---

## 🎯 **Expected Result**

### **Desktop (≥ 990px):**
```
┌──────────────────────────────────────────────────────┐
│ Nav  [────────── 🔍 Buscar ──────────]  📱 WhatsApp │
└──────────────────────────────────────────────────────┘
```

### **Mobile (< 990px):**
```
┌──────────────────────────────────────────────────────┐
│                    📱 WhatsApp    🔍                 │
└──────────────────────────────────────────────────────┘
```

Click en 🔍 abre modal fullscreen.

