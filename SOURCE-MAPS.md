# 🗺️ Source Maps para CSS

## ✅ **Configuración Completada**

Se ha configurado correctamente el proyecto para generar **source maps** de CSS, lo que te permite debuggear los estilos desde el navegador y ver exactamente dónde están definidos en tu archivo fuente `app-tailwind.css`.

---

## 📦 **¿Qué se instaló?**

- `postcss-cli` - Herramienta CLI para procesar CSS con PostCSS
- Source maps configurados en `postcss.config.js`

---

## 🚀 **Comandos Disponibles**

### **Desarrollo (con source maps)**

```bash
# Compilar CSS una vez con source maps
npm run build:css:dev

# Compilar CSS en modo watch con source maps
npm run dev:css
```

### **Producción (sin source maps)**

```bash
# Compilar CSS para producción (minificado, sin source maps)
npm run build:css
```

---

## 🔍 **Cómo usar Source Maps en el Browser**

### **Chrome DevTools**

1. Abre Chrome DevTools (`F12` o `Cmd+Option+I`)
2. Ve a la pestaña **Sources**
3. En el panel izquierdo, busca `app-tailwind.css`
4. Cuando inspecciones un elemento, los estilos mostrarán el archivo y línea original

### **Inspeccionar Elementos**

1. Click derecho en cualquier elemento → **Inspect**
2. En el panel **Styles**, verás algo como:
   ```
   .header__search-mega-menu - app-tailwind.css:1482
   ```
3. Click en el enlace te llevará directamente a la línea en `app-tailwind.css`

---

## 📁 **Archivos Generados**

```
assets/
├── app.css            # CSS compilado (usar en producción)
└── app.css.map        # Source map (solo para desarrollo)
```

⚠️ **Nota**: El archivo `app.css.map` es solo para desarrollo. No es necesario subirlo a producción.

---

## ⚙️ **Configuración**

### `postcss.config.js`

```javascript
module.exports = (ctx) => ({
  map: ctx.options.map ? { inline: false, annotation: true } : false,
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
});
```

### `package.json` - Scripts actualizados

```json
{
  "scripts": {
    "dev:css": "postcss ./assets/app-tailwind.css -o ./assets/app.css --watch --map",
    "build:css": "NODE_ENV=production postcss ./assets/app-tailwind.css -o ./assets/app.css",
    "build:css:dev": "postcss ./assets/app-tailwind.css -o ./assets/app.css --map"
  }
}
```

---

## 🎯 **Ventajas de Source Maps**

✅ **Debugging más fácil**: Ve el código fuente original, no el compilado
✅ **Desarrollo rápido**: Encuentra y modifica estilos más rápido
✅ **Mejor organización**: Mantén tu código organizado por componentes
✅ **Inspección precisa**: Sabe exactamente qué línea de CSS está afectando qué elemento

---

## 🔧 **Workflow Recomendado**

### Durante el Desarrollo

1. Ejecuta `npm run dev:css` para compilar CSS con source maps en modo watch
2. Los cambios en `app-tailwind.css` se reflejarán automáticamente en `app.css`
3. Usa Chrome DevTools para inspeccionar y debuggear

### Antes de Subir a Producción

1. Ejecuta `npm run build:css` para compilar sin source maps y minificar
2. Sube solo `app.css` a Shopify (no `app.css.map`)

---

## 📝 **Notas Importantes**

### Warning de CSS Nesting

Si ves este warning:
```
Nested CSS was detected, but CSS nesting has not been configured correctly.
```

Esto es porque tienes CSS anidado (línea 1482-1502 en `app-tailwind.css`):

```css
.header__search-mega-menu {
  @apply flex justify-between items-center;
  .header__search-mega-menu-search {
    @apply flex;
  }
  /* ... más anidamiento */
}
```

**Solución**: Instalar el plugin de nesting (opcional):

```bash
npm install --save-dev postcss-nesting
```

Y actualizar `postcss.config.js`:

```javascript
module.exports = (ctx) => ({
  map: ctx.options.map ? { inline: false, annotation: true } : false,
  plugins: {
    'postcss-nesting': {},  // ← Agregar antes de tailwindcss
    tailwindcss: {},
    autoprefixer: {},
  },
});
```

---

## 🎓 **Recursos**

- [PostCSS Source Maps](https://github.com/postcss/postcss/blob/main/docs/source-maps.md)
- [Chrome DevTools CSS](https://developer.chrome.com/docs/devtools/css/)
- [Tailwind with Preprocessors](https://tailwindcss.com/docs/using-with-preprocessors)

