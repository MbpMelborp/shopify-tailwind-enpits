# 🏍️ EnPits Shopify Theme

Tema personalizado de Shopify basado en Dawn v15.2.0 con integración de Tailwind CSS y sistema de compilación automático.

**Tienda**: `enpits.myshopify.com`  
**Tema Base**: Dawn 15.2.0 + Tailwind CSS  
**Mantenido por**: Equipo EnPits

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Quick Start](#-quick-start)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Desarrollo](#-desarrollo)
- [Compilación CSS](#-compilación-css)
- [Documentación](#-documentación)
- [Comandos Útiles](#-comandos-útiles)
- [Temas de Shopify](#-temas-de-shopify)

---

## ✨ Características Principales

### 🎨 Tailwind CSS

- **Clases directas**: Usa clases de Tailwind sin prefijo (`flex`, `text-2xl`, etc.)
- **Compilación automática**: Sistema que detecta y compila todos los archivos `*-tailwind.css`
- **Source maps**: Soporte para debugging en desarrollo
- **Modular**: Cada componente tiene su propio archivo CSS

### 🔍 Sistema de Filtros Avanzado

- Integración con metaobjetos de Shopify
- Filtros por compatibilidad de moto (marca/modelo)
- Filtros por taxonomía de productos
- Sincronización automática de tags

### 🔎 Búsqueda Inline Responsive

- **Mobile**: Modal con ícono de búsqueda
- **Desktop**: Input inline visible en el header
- Búsqueda predictiva integrada

### 🛠️ Herramientas de Desarrollo

- **Prettier**: Formateo automático en commits (Husky hooks)
- **Shopify CLI**: Integración completa para desarrollo local
- **Source Maps**: Debugging CSS mejorado

---

## 🚀 Quick Start

### Prerequisitos

- Node.js v14 o superior
- Shopify CLI instalado
- Git configurado
- Acceso a `enpits.myshopify.com`

### Setup Inicial

```bash
# 1. Clonar el repositorio
cd /Users/juanosoriocano/Documents/DEV/ENPITS/shopify-tailwind-enpits

# 2. Instalar dependencias
npm install

# 3. Autenticar con Shopify CLI
shopify auth login

# 4. Iniciar desarrollo (necesitas 2 terminales)
# Terminal 1: Compilador CSS
npm run dev:css

# Terminal 2: Servidor Shopify
npm run dev:shopify
```

### Primera Vez

1. Ejecuta `npm install` para instalar dependencias
2. Ejecuta `shopify auth login` para autenticarte
3. Abre 2 terminales:
   - Terminal 1: `npm run dev:css` (compilador CSS en modo watch)
   - Terminal 2: `npm run dev:shopify` (servidor de desarrollo)
4. Copia la URL del preview que aparece en Terminal 2
5. ¡Empieza a desarrollar!

---

## 🏗️ Estructura del Proyecto

```
shopify-tailwind-enpits/
├── assets/
│   ├── tailwind/              # ⭐ Archivos fuente CSS (EDITAR AQUÍ)
│   │   ├── app-tailwind.css
│   │   ├── component-card-tailwind.css
│   │   ├── promo-banners-tailwind.css
│   │   └── ... (otros componentes)
│   ├── components/            # CSS compilado para subcarpetas
│   │   ├── banners-container-slider.css
│   │   ├── mega-menu-search.css
│   │   └── predictive-search-mega-menu.css
│   ├── app.css                # CSS compilado global (auto-generado)
│   ├── component-card.css     # CSS compilado (auto-generado)
│   └── facets.js             # Lógica de filtros
├── scripts/
│   └── build-css.js           # ⭐ Script automático de compilación
├── sections/                  # Secciones del tema
│   ├── header.liquid
│   └── main-collection-product-grid.liquid
├── snippets/                  # Componentes reutilizables
│   ├── facets.liquid
│   ├── card-product.liquid
│   └── header-search-mega-menu.liquid
├── templates/                 # Plantillas de páginas
├── config/                   # Configuración del tema
└── tailwind.config.js        # Configuración de Tailwind
```

---

## 💻 Desarrollo

### Flujo de Trabajo Diario

1. **Abrir 2 terminales** (ambas deben estar corriendo)
2. **Terminal 1**: `npm run dev:css` - Compilador CSS en modo watch
3. **Terminal 2**: `npm run dev:shopify` - Servidor de desarrollo Shopify
4. **Copiar URL** del preview que aparece en Terminal 2
5. **Desarrollar** - Los cambios se reflejan automáticamente
6. **Guardar archivos** - Prettier formatea automáticamente en commits

### Usar Clases de Tailwind

**✅ Correcto** (sin prefijo):
```liquid
<div class="flex items-center gap-4">
  <h1 class="text-2xl font-bold">Título</h1>
</div>
```

**❌ Incorrecto** (prefijo obsoleto):
```liquid
<div class="twcss-flex twcss-items-center">
```

### Espacios con Tags Liquid

**SIEMPRE** deja un espacio antes/después de tags Liquid:

```liquid
✅ Correcto:
<div class="px-4 {% if mobile %}py-8{% endif %}">

❌ Incorrecto (causa errores):
<div class="px-4{% if mobile %}py-8{% endif %}">
```

### Breakpoints Disponibles

```css
sm:   320px   /* Mobile */
md:   750px   /* Tablet */
lg:   990px   /* Desktop */
xlg:  1440px  /* Large Desktop */
x2lg: 1920px  /* Extra Large */
```

---

## 🎨 Compilación CSS

### Sistema Automático

El sistema de compilación **detecta automáticamente** todos los archivos `*-tailwind.css` en `assets/tailwind/` y los compila.

**No necesitas modificar `package.json`** al agregar nuevos componentes.

### Comandos

```bash
# Desarrollo (watch mode con source maps)
npm run dev:css

# Producción (minificado, sin source maps)
npm run build:css

# Desarrollo con source maps (una vez)
npm run build:css:dev
```

### Crear un Nuevo Componente CSS

1. **Crear archivo fuente** en `assets/tailwind/`:
   ```bash
   touch assets/tailwind/mi-componente-tailwind.css
   ```

2. **Estructura del archivo**:
   ```css
   /* ==========================================================================
      MI COMPONENTE - Descripción breve
      ========================================================================== */
   
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   
   @layer components {
     .mi-componente {
       @apply relative flex items-center;
     }
   }
   ```

3. **El archivo se compilará automáticamente** cuando ejecutes `npm run dev:css`

4. **Cargar el CSS** en tu sección/snippet:
   ```liquid
   {{ 'mi-componente.css' | asset_url | stylesheet_tag }}
   ```

### ⚠️ Reglas Importantes

- ✅ **Editar** archivos en `assets/tailwind/*-tailwind.css` (archivos fuente)
- ✅ **Usar** `@apply` para componentes frecuentes
- ❌ **NO editar** archivos `.css` compilados directamente (auto-generados)
- ✅ **Compilar** CSS antes de commit (`npm run build:css`)

---

## 📚 Documentación

El proyecto incluye documentación detallada organizada en la carpeta [`docs/`](./docs/).

> 📖 **Ver índice completo**: [docs/README.md](./docs/README.md)

### 📖 Documentos Principales

| Documento | Descripción |
|-----------|-------------|
| **[📋 WORKFLOW.md](./docs/WORKFLOW.md)** | Guía completa de flujo de trabajo, comandos, y mejores prácticas. Incluye información sobre source maps y debugging. |
| **[🔍 SEARCH-INLINE-DOCS.md](./docs/SEARCH-INLINE-DOCS.md)** | Documentación detallada del sistema de búsqueda inline responsive (mobile/desktop). |
| **[📦 SECTIONS.md](./docs/SECTIONS.md)** | Documentación de todas las secciones del tema Shopify. |
| **[⚙️ .cursorrules](./.cursorrules)** | Reglas y convenciones de desarrollo para Cursor IDE. |

### 🚀 Inicio Rápido

- **¿Primera vez?** → Lee [Quick Start](#-quick-start) y luego [WORKFLOW.md](./docs/WORKFLOW.md)
- **¿Necesitas crear un componente CSS?** → Ve a [WORKFLOW.md](./docs/WORKFLOW.md#-trabajar-con-tailwind-css)
- **¿Trabajando con búsqueda?** → Consulta [SEARCH-INLINE-DOCS.md](./docs/SEARCH-INLINE-DOCS.md)
- **¿Necesitas información de una sección?** → Revisa [SECTIONS.md](./docs/SECTIONS.md)

### 📚 Documentación Externa

- **Filtros y Categorización**: `/Users/juanosoriocano/Documents/DEV/ENPITS/API/api-access-net/docs/shopify-theme-integration.md`

### 🔗 Recursos Externos

- [Shopify Liquid Docs](https://shopify.dev/docs/api/liquid)
- [Shopify Themes Docs](https://shopify.dev/themes)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Dawn Theme GitHub](https://github.com/Shopify/dawn)

---

## 🛠️ Comandos Útiles

### NPM Scripts

```bash
# Desarrollo
npm run dev:css           # Compilar CSS en modo watch
npm run dev:shopify       # Servidor de desarrollo Shopify
npm run build:css         # Compilar CSS para producción
npm run build:css:dev     # Compilar CSS con source maps

# Shopify CLI
npm run push              # Subir al tema de desarrollo
npm run pull              # Bajar cambios del tema de producción
```

### Shopify CLI

```bash
# Temas
shopify theme list                    # Ver todos los temas
shopify theme dev                     # Servidor de desarrollo
shopify theme push                    # Subir cambios
shopify theme pull                    # Bajar cambios
shopify theme share                   # Obtener link de preview

# Autenticación
shopify auth login                    # Iniciar sesión
shopify auth logout                   # Cerrar sesión
```

### Git

```bash
# Ver cambios
git status
git diff

# Commit y push
git add .
git commit -m "Tipo: Descripción"
git push origin main
```

---

## 📊 Temas de Shopify

### IDs de Temas Importantes

- **Producción (Live)**: `140509413491` - EnPits fresh
- **Desarrollo**: `140507480179` - Development
- **Horizon**: `140506595443` - Horizon (unpublished)
- **En Pits Theme**: `140507578483` - En Pits Theme (unpublished)

### Comandos con IDs Específicos

```bash
# Descargar cambios del tema de producción
shopify theme pull -d --theme=140509413491

# Subir cambios al tema de desarrollo
shopify theme push -d --theme=140507480179
```

---

## 🎯 Antes de Commit

```bash
# 1. Compilar CSS para producción
npm run build:css

# 2. Verificar cambios
git status

# 3. Commit (Prettier formatea automáticamente)
git add .
git commit -m "Tipo: Descripción"
```

---

## 🐛 Troubleshooting

### Tailwind no compila / Clases no funcionan

```bash
# 1. Verifica que el proceso esté corriendo
npm run dev:css

# 2. Si hay error, reinicia el proceso
Ctrl + C
npm run dev:css
```

### Cambios no se reflejan en Shopify

```bash
# 1. Verifica que dev server esté corriendo
npm run dev:shopify

# 2. Refresca el navegador (Cmd+Shift+R / Ctrl+Shift+R)

# 3. Si persiste, reinicia el servidor
Ctrl + C
npm run dev:shopify
```

### Error de autenticación Shopify CLI

```bash
# Cerrar sesión y volver a iniciar
shopify auth logout
shopify auth login
```

---

## 📝 Convenciones de Código

### Liquid

- Usar comillas simples para strings: `{% assign var = 'value' %}`
- Usar `{%-` y `-%}` para controlar espacios
- Comentar código complejo con `{% comment %}`
- Nombres descriptivos para variables

### JavaScript

- Usar clases ES6
- Web Components para funcionalidad reutilizable
- Event listeners con `defer` o `async`
- Nombres en camelCase

### CSS

- Editar en `assets/tailwind/*-tailwind.css` (archivos fuente)
- Usar `@apply` para componentes frecuentes
- NO editar archivos `.css` compilados directamente
- Cada componente tiene su propio archivo `*-tailwind.css`

### Archivos y Nombres

- **Snippets**: `snake-case.liquid`
- **Sections**: `snake-case.liquid`
- **Templates**: `kebab-case.json` o `.liquid`
- **Variables Liquid**: `snake_case`
- **Clases CSS**: `kebab-case` o `BEM`

---

## ⚠️ Advertencias Importantes

### ❌ NO hacer

- Editar `assets/app.css` directamente (se regenera)
- Usar prefijo `twcss-` (ya no se usa, usar clases directamente)
- Commits sin compilar CSS primero (`npm run build:css`)
- Modificar metafields desde el frontend (solo lectura)
- Hardcodear IDs de productos o colecciones

### ✅ SÍ hacer

- Editar archivos en `assets/tailwind/*-tailwind.css` (archivos fuente)
- Crear nuevos componentes en `assets/tailwind/` con formato `nombre-componente-tailwind.css`
- Usar clases de Tailwind directamente (sin prefijo)
- Compilar CSS antes de commit (`npm run build:css`)
- Probar cambios en tema de desarrollo primero
- Usar variables Liquid en lugar de valores hardcodeados

---

## 🎓 Best Practices

1. **Siempre** compila CSS antes de commit
2. **Siempre** prueba en tema de desarrollo primero
3. **Siempre** usa clases de Tailwind directamente (sin prefijo)
4. **Nunca** edites `app.css` directamente
5. **Documenta** código complejo con comentarios Liquid
6. **Mantén** consistencia en nombres de archivos
7. **Revisa** [WORKFLOW.md](./docs/WORKFLOW.md) antes de publicar cambios

---

## 📄 Licencia

Basado en [Dawn Theme](https://github.com/Shopify/dawn) de Shopify (MIT License)

---

**Última actualización**: Enero 2025  
**Mantenido por**: Equipo EnPits
