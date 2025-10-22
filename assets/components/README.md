/* ==========================================================================
   COMPONENT ORGANIZATION GUIDE - Guía de organización modular con Tailwind
   ========================================================================== */

/*
ESTRUCTURA RECOMENDADA:

assets/
├── app-tailwind.css          (Archivo principal con imports)
├── components/               (Componentes modulares)
│   ├── mega-menu-search.css  (Búsqueda del mega menu)
│   ├── header-navigation.css (Navegación del header)
│   ├── product-card.css      (Tarjetas de productos)
│   ├── cart-drawer.css       (Drawer del carrito)
│   ├── forms.css             (Formularios)
│   └── buttons.css           (Botones personalizados)
├── layouts/                  (Layouts específicos)
│   ├── homepage.css          (Estilos específicos del homepage)
│   ├── product-page.css      (Estilos específicos de producto)
│   └── collection-page.css   (Estilos específicos de colección)
└── utilities/                (Utilidades personalizadas)
    ├── animations.css        (Animaciones personalizadas)
    ├── spacing.css           (Espaciado personalizado)
    └── typography.css        (Tipografía personalizada)

EJEMPLO DE app-tailwind.css:

@tailwind base;
@tailwind components;
@tailwind utilities;

// Component Imports
@import './components/mega-menu-search.css';
@import './components/header-navigation.css';
@import './components/product-card.css';
@import './components/cart-drawer.css';
@import './components/forms.css';
@import './components/buttons.css';

// Layout Imports
@import './layouts/homepage.css';
@import './layouts/product-page.css';
@import './layouts/collection-page.css';

// Utility Imports
@import './utilities/animations.css';
@import './utilities/spacing.css';
@import './utilities/typography.css';

// Base styles aquí...
*/
