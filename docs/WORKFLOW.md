# 🚀 Guía de Flujo de Trabajo - EnPits Shopify Theme

Esta guía detalla el flujo completo de trabajo para desarrollar y publicar cambios en el tema de Shopify con Tailwind CSS.

---

## 📋 Tabla de Contenidos

1. [Setup Inicial](#-setup-inicial)
2. [Desarrollo Local](#-desarrollo-local)
3. [Trabajar con Tailwind CSS](#-trabajar-con-tailwind-css)
4. [Sincronización con Shopify](#-sincronización-con-shopify)
5. [Publicar Cambios](#-publicar-cambios)
6. [Comandos Útiles](#-comandos-útiles)
7. [Best Practices](#-best-practices)
8. [Troubleshooting](#-troubleshooting)

---

## 🔧 Setup Inicial

### Prerequisitos

- Node.js instalado (v14 o superior)
- Shopify CLI instalado
- Git configurado
- Acceso a la tienda: https://enpits.myshopify.com

### Primera Vez

```bash
# 1. Clonar el repositorio (si aún no lo has hecho)
cd /Users/juanosoriocano/Documents/DEV/ENPITS/shopify-tailwind-enpits

# 2. Instalar dependencias
npm install

# 3. Autenticar con Shopify CLI
shopify auth login

# 4. Conectar con la tienda
shopify theme dev --store=enpits.myshopify.com
```

### Configurar Git Upstream (Opcional)

Para recibir actualizaciones del tema Dawn original:

```bash
# Agregar upstream para actualizaciones de Dawn
git remote add upstream https://github.com/Shopify/dawn.git

# O para actualizaciones del starter de Trellis
git remote add upstream https://github.com/TrellisCommerce/shopify-tailwind-starter-base.git
```

---

## 💻 Desarrollo Local

### Iniciar Ambiente de Desarrollo

**Necesitas 2 terminales abiertas:**

#### Terminal 1: Compilador de Tailwind CSS
```bash
npm run dev:css
```
Este comando:
- ✅ Compila automáticamente las clases de Tailwind
- ✅ Observa cambios en archivos `.liquid`
- ✅ Genera `/assets/app.css`
- ⚠️ **NO CERRAR** - debe estar corriendo siempre

#### Terminal 2: Servidor de Desarrollo Shopify
```bash
npm run dev:shopify
```
Este comando:
- ✅ Inicia servidor local de desarrollo
- ✅ Sincroniza cambios en tiempo real
- ✅ Proporciona URL de preview
- ⚠️ **NO CERRAR** - debe estar corriendo siempre

### Flujo de Trabajo Diario

1. **Abrir 2 terminales**
2. **Terminal 1**: `npm run dev:css`
3. **Terminal 2**: `npm run dev:shopify`
4. **Copiar URL** del preview que aparece en Terminal 2
5. **Desarrollar** - Los cambios se reflejan automáticamente
6. **Guardar archivos** - Prettier formatea automáticamente en cada commit

---

## 🎨 Trabajar con Tailwind CSS

### Regla de Oro: Clases Directas

**TODAS** las clases de Tailwind se usan **directamente**, sin prefijo:

#### ✅ Correcto
```liquid
<div class="flex items-center gap-4">
  <h1 class="text-2xl font-bold">Título</h1>
  <p class="text-gray-600">Descripción</p>
</div>
```

#### ❌ Incorrecto (prefijo obsoleto)
```liquid
<div class="twcss-flex twcss-items-center twcss-gap-4">
  <h1 class="twcss-text-2xl twcss-font-bold">Título</h1>
</div>
```

### Espacios con Tags Liquid

**SIEMPRE** deja un espacio antes de tags Liquid:

#### ✅ Correcto
```liquid
<div class="px-4 {% if mobile %}py-8{% endif %}">
<button class="bg-blue-500 hover:bg-blue-600 ">
```

#### ❌ Incorrecto (causa errores de compilación)
```liquid
<div class="px-4{% if mobile %}py-8{% endif %}">
<button class="bg-blue-500 hover:bg-blue-600">
```

### Breakpoints Disponibles

```css
sm: '320px'      /* Mobile */
md: '750px'      /* Tablet */
lg: '990px'      /* Desktop */
xlg: '1440px'    /* Large Desktop */
x2lg: '1920px'   /* Extra Large */
```

#### Ejemplo de Uso
```liquid
<div class="w-full md:w-1/2 lg:w-1/3 xlg:w-1/4">
  Responsive box
</div>
```

### Source Maps para Debugging

El proyecto está configurado para generar **source maps** en desarrollo, lo que permite debuggear CSS directamente desde el navegador y ver exactamente dónde están definidos los estilos en los archivos fuente.

#### Comandos con Source Maps

```bash
# Desarrollo (con source maps)
npm run dev:css           # Watch mode con source maps
npm run build:css:dev    # Compilación única con source maps

# Producción (sin source maps, minificado)
npm run build:css        # Compilación para producción
```

#### Usar Source Maps en Chrome DevTools

1. Abre Chrome DevTools (`F12` o `Cmd+Option+I`)
2. Ve a la pestaña **Sources**
3. Busca `app-tailwind.css` en el panel izquierdo
4. Al inspeccionar elementos, los estilos mostrarán el archivo y línea original:
   ```
   .header__search-mega-menu - app-tailwind.css:1482
   ```
5. Click en el enlace te llevará directamente a la línea en `app-tailwind.css`

#### Archivos Generados

```
assets/
├── app.css            # CSS compilado (usar en producción)
└── app.css.map        # Source map (solo para desarrollo)
```

⚠️ **Nota**: El archivo `app.css.map` es solo para desarrollo. No es necesario subirlo a producción.

#### Ventajas de Source Maps

✅ **Debugging más fácil**: Ve el código fuente original, no el compilado  
✅ **Desarrollo rápido**: Encuentra y modifica estilos más rápido  
✅ **Mejor organización**: Mantén tu código organizado por componentes  
✅ **Inspección precisa**: Sabe exactamente qué línea de CSS está afectando qué elemento

### Agregar Estilos Personalizados

Para estilos que usarás frecuentemente, crea un nuevo archivo en `/assets/tailwind/`:

```css
/* assets/tailwind/mi-componente-tailwind.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600;
  }
}
```

El archivo se compilará automáticamente cuando ejecutes `npm run dev:css`.

---

## 🔄 Sincronización con Shopify

### Bajar Cambios del Theme Editor

Si haces cambios desde el admin de Shopify:

```bash
# Bajar cambios del tema de producción (con confirmación)
shopify theme pull --theme=140509413491

# Bajar cambios del tema de producción automáticamente (sin confirmación)
shopify theme pull -d --theme=140509413491

# Bajar cambios del tema de desarrollo
shopify theme pull -d --theme=140507480179
```

⚠️ **Importante**: Siempre haz commit de tus cambios locales antes de hacer pull.

### Subir Cambios a Shopify

```bash
# Subir al tema de desarrollo
shopify theme push --theme=140507480179

# Subir al tema de producción (⚠️ cuidado)
shopify theme push --theme=140509413491

# Subir y publicar directamente (⚠️ usar con precaución)
shopify theme push --theme=140509413491 --publish
```

### Ver Temas Disponibles

```bash
shopify theme list
```

### IDs de Temas Importantes

- **Producción (Live)**: `140509413491` - EnPits fresh
- **Desarrollo**: `140507480179` - Development (c89ecf-JUANMMACBOOKPROM4)
- **Horizon**: `140506595443` - Horizon (unpublished)
- **En Pits Theme**: `140507578483` - En Pits Theme (unpublished)

### Comandos con IDs Específicos

```bash
# Descargar cambios del tema de producción
shopify theme pull -d --theme=140509413491

# Subir cambios al tema de desarrollo
shopify theme push -d --theme=140507480179

# Publicar tema de desarrollo a producción (⚠️ cuidado)
shopify theme push --theme=140509413491 --publish
```

---

## 📦 Publicar Cambios

### 1. Preparar para Producción

```bash
# 1. Asegúrate de que todo esté commiteado
git status

# 2. Compila CSS optimizado para producción
npm run build:css

# 3. Commit del CSS compilado
git add assets/app.css
git commit -m "Build: Compile Tailwind CSS for production"

# 4. Push a GitHub
git push origin main
```

### 2. Opciones de Publicación

#### Opción A: Via GitHub (Recomendado)

1. Ve a: `https://enpits.myshopify.com/admin/themes`
2. Si tienes el tema conectado a GitHub:
   - Los cambios se sincronizan automáticamente
   - Publica desde el admin cuando estés listo

#### Opción B: Via Shopify CLI

```bash
# Subir a tema de desarrollo
shopify theme push

# O publicar directamente (⚠️ usar con precaución)
shopify theme push --publish
```

#### Opción C: Crear Nuevo Tema

```bash
# Subir como nuevo tema
shopify theme push --unpublished --theme="EnPits v1.1"
```

### 3. Verificación Post-Publicación

- [ ] Verificar página de inicio
- [ ] Verificar página de producto
- [ ] Verificar página de colección
- [ ] Verificar carrito de compras
- [ ] Verificar checkout
- [ ] Probar en mobile
- [ ] Verificar velocidad (Google PageSpeed)

---

## 🛠️ Comandos Útiles

### NPM Scripts

```bash
# Desarrollo
npm run dev:css           # Compilar Tailwind en modo watch
npm run dev:shopify       # Servidor de desarrollo Shopify
npm run build:css         # Compilar y minificar CSS para producción

# Formateo (automático en commits)
npx prettier --write "**/*.{js,css}"
```

### Shopify CLI

```bash
# Temas
shopify theme list                    # Ver todos los temas
shopify theme dev                     # Servidor de desarrollo
shopify theme push                    # Subir cambios
shopify theme pull                    # Bajar cambios
shopify theme share                   # Obtener link de preview
shopify theme delete --theme=ID       # Eliminar tema

# Autenticación
shopify auth login                    # Iniciar sesión
shopify auth logout                   # Cerrar sesión
```

### Git

```bash
# Actualizar desde Dawn upstream
git fetch upstream
git pull upstream main

# Ver cambios
git status
git diff

# Commit y push
git add .
git commit -m "Descripción del cambio"
git push origin main
```

---

## ✨ Best Practices

### Estructura de Commits

```bash
# Formato recomendado
git commit -m "Tipo: Descripción breve

Detalles adicionales si es necesario"

# Tipos:
# - Feature: Nueva funcionalidad
# - Fix: Corrección de bug
# - Style: Cambios de estilos
# - Refactor: Refactorización de código
# - Docs: Cambios en documentación
# - Build: Compilación de assets
```

### Organización de Archivos

```
sections/     → Secciones grandes (header, footer, product)
snippets/     → Componentes reutilizables pequeños
templates/    → Plantillas de páginas
assets/       → CSS, JS, imágenes
config/       → Configuraciones del tema
```

### Testing Antes de Publicar

1. **Local**: Probar en `http://127.0.0.1:9292`
2. **Preview**: Usar `shopify theme share` para link público
3. **Staging**: Subir a tema no publicado para pruebas
4. **Production**: Solo después de verificar todo

### Mantener Código Limpio

- ✅ Usar nombres descriptivos para secciones y snippets
- ✅ Comentar código complejo
- ✅ Eliminar código comentado innecesario
- ✅ Mantener consistencia en formato (Prettier lo hace automáticamente)
- ✅ Usar componentes reutilizables (snippets)

---

## 🔥 Troubleshooting

### Tailwind no compila / Clases no funcionan

```bash
# 1. Verifica que el proceso esté corriendo
npm run dev:css

# 2. Si hay error, mata el proceso y reinicia
Ctrl + C
npm run dev:css

# 3. Verifica que uses clases directamente (sin prefijo)
# ✅ class="flex"
# ❌ class="twcss-flex" (obsoleto)
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

### Conflictos al hacer Pull

```bash
# 1. Guarda tus cambios
git stash

# 2. Baja los cambios
shopify theme pull

# 3. Recupera tus cambios
git stash pop

# 4. Resuelve conflictos manualmente si los hay
```

### Husky/Prettier causan problemas en commits

```bash
# Bypass temporal (solo si es absolutamente necesario)
git commit -m "mensaje" --no-verify

# Mejor: Arregla los errores que Prettier señala
npx prettier --write archivo-con-error.js
```

### CSS muy grande / Demasiadas clases Tailwind

```bash
# Usa el build minificado para producción
npm run build:css

# Revisa tailwind.config.js para purgar clases no usadas
```

---

## 📚 Recursos Adicionales

- [Documentación Shopify Themes](https://shopify.dev/themes)
- [Shopify CLI Docs](https://shopify.dev/themes/tools/cli)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Dawn Theme Docs](https://github.com/Shopify/dawn)
- [Liquid Cheat Sheet](https://www.shopify.com/partners/shopify-cheat-sheet)

---

## 🎯 Quick Start Checklist

Para iniciar desarrollo hoy:

- [ ] `npm install` (solo primera vez)
- [ ] Abrir Terminal 1: `npm run dev:css`
- [ ] Abrir Terminal 2: `npm run dev:shopify`
- [ ] Copiar URL del preview
- [ ] Empezar a desarrollar con clases de Tailwind directamente (sin prefijo)
- [ ] Commits automáticamente formateados
- [ ] Cuando termines: `npm run build:css`
- [ ] Push a GitHub: `git push origin main`

---

**¿Preguntas o problemas?** Revisa la sección de Troubleshooting o consulta la documentación oficial.

**Última actualización**: Octubre 2025

