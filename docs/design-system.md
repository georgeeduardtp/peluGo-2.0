# 🎨 PeluGo 2.0 - Sistema de Diseño con Variables CSS

## 📖 Documentación del Sistema de Variables

Este documento explica cómo usar el sistema de variables CSS implementado en PeluGo 2.0 para mantener consistencia visual y facilitar el mantenimiento.

## 🎯 Estructura del Sistema

### 🌈 Colores

#### Paleta Principal (Azul Oscuro)
```css
--color-primary-50   /* #eff6ff - Más claro */
--color-primary-100  /* #dbeafe */
--color-primary-200  /* #bfdbfe */
--color-primary-300  /* #93c5fd */
--color-primary-400  /* #60a5fa */
--color-primary-500  /* #1e40af - Base */
--color-primary-600  /* #1d4ed8 */
--color-primary-700  /* #1e3a8a */
--color-primary-800  /* #1e293b */
--color-primary-900  /* #0f172a - Más oscuro */
```

#### Paleta Secundaria (Azul Medio)
```css
--color-secondary-50   /* #f0f9ff - Más claro */
--color-secondary-100  /* #e0f2fe */
--color-secondary-200  /* #bae6fd */
--color-secondary-300  /* #7dd3fc */
--color-secondary-400  /* #38bdf8 */
--color-secondary-500  /* #0ea5e9 - Base */
--color-secondary-600  /* #0284c7 */
--color-secondary-700  /* #0369a1 */
--color-secondary-800  /* #075985 */
--color-secondary-900  /* #0c4a6e - Más oscuro */
```

#### Colores de Estado
```css
/* Éxito */
--color-success-50, --color-success-100, --color-success-500, etc.

/* Error */
--color-error-50, --color-error-100, --color-error-500, etc.

/* Advertencia */
--color-warning-50, --color-warning-100, --color-warning-500, etc.

/* Información */
--color-info-50, --color-info-100, --color-info-500, etc.
```

### 🎨 Gradientes Predefinidos

```css
--gradient-primary        /* Gradiente principal azul oscuro → azul medio */
--gradient-primary-hover  /* Gradiente para hover más oscuro */
--gradient-primary-light  /* Gradiente suave para fondos */
--gradient-hero          /* Gradiente para secciones hero */
```

**Uso:**
```css
.my-button {
    background: var(--gradient-primary);
}

.my-button:hover {
    background: var(--gradient-primary-hover);
}
```

### 📏 Espaciado

```css
--spacing-xs: 0.25rem;    /* 4px */
--spacing-sm: 0.5rem;     /* 8px */
--spacing-md: 1rem;       /* 16px */
--spacing-lg: 1.5rem;     /* 24px */
--spacing-xl: 2rem;       /* 32px */
--spacing-2xl: 3rem;      /* 48px */
--spacing-3xl: 4rem;      /* 64px */
```

**Uso:**
```css
.my-card {
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
}
```

### 🔤 Tipografía

```css
/* Tamaños */
--font-size-xs: 0.75rem;     /* 12px */
--font-size-sm: 0.875rem;    /* 14px */
--font-size-base: 1rem;      /* 16px */
--font-size-lg: 1.125rem;    /* 18px */
--font-size-xl: 1.25rem;     /* 20px */
--font-size-2xl: 1.5rem;     /* 24px */
--font-size-3xl: 1.875rem;   /* 30px */
--font-size-4xl: 2.25rem;    /* 36px */
--font-size-5xl: 3rem;       /* 48px */

/* Pesos */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* Alturas de línea */
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

### 🔘 Border Radius

```css
--radius-sm: 0.25rem;      /* 4px */
--radius-md: 0.375rem;     /* 6px */
--radius-lg: 0.5rem;       /* 8px */
--radius-xl: 0.75rem;      /* 12px */
--radius-2xl: 1rem;        /* 16px */
--radius-3xl: 1.5rem;      /* 24px */
--radius-full: 9999px;     /* Circular */
```

### 🌫️ Sombras

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
--shadow-primary: 0 10px 25px rgba(139, 92, 246, 0.3);
--shadow-secondary: 0 10px 25px rgba(236, 72, 153, 0.3);
```

### ⚡ Transiciones

```css
--transition-fast: all 0.15s ease;
--transition-normal: all 0.3s ease;
--transition-slow: all 0.5s ease;
--transition-bounce: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

## 🛠️ Clases de Utilidad Disponibles

### Colores de Texto
```css
.text-primary    /* Color azul oscuro principal */
.text-secondary  /* Color azul medio secundario */
.text-success    /* Color verde de éxito */
.text-error      /* Color rojo de error */
.text-warning    /* Color amarillo de advertencia */
.text-info       /* Color azul de información */
```

### Fondos
```css
.bg-primary      /* Fondo azul oscuro */
.bg-secondary    /* Fondo azul medio */
.bg-success      /* Fondo verde */
.bg-error        /* Fondo rojo */
.bg-warning      /* Fondo amarillo */
.bg-info         /* Fondo azul claro */
```

### Gradientes
```css
.gradient-primary       /* Gradiente principal */
.gradient-primary-light /* Gradiente suave */
```

## 🎛️ Componentes Predefinidos

### Botones
```css
.btn             /* Estilos base para botones */
.btn-primary     /* Botón con gradiente principal */
.btn-secondary   /* Botón secundario gris */
```

**Ejemplo HTML:**
```html
<button class="btn btn-primary">Botón Principal</button>
<button class="btn btn-secondary">Botón Secundario</button>
```

### Inputs
```css
.input           /* Estilos base para campos de entrada */
```

**Ejemplo HTML:**
```html
<input type="text" class="input" placeholder="Nombre">
```

### Tarjetas
```css
.card            /* Estilos base para tarjetas */
```

**Ejemplo HTML:**
```html
<div class="card">
    <h3>Título de la tarjeta</h3>
    <p>Contenido de la tarjeta</p>
</div>
```

### Notificaciones
```css
.notification         /* Estilos base */
.notification.success /* Notificación de éxito */
.notification.error   /* Notificación de error */
.notification.warning /* Notificación de advertencia */
.notification.info    /* Notificación informativa */
```

**Ejemplo HTML:**
```html
<div class="notification success">
    ¡Operación exitosa!
</div>
```

## 🌙 Soporte para Modo Oscuro

El sistema incluye variables automáticas para modo oscuro:

```css
@media (prefers-color-scheme: dark) {
    :root {
        --bg-primary: var(--color-gray-900);
        --text-primary: var(--color-gray-50);
        /* etc... */
    }
}
```

## ♿ Accesibilidad

### Alto Contraste
```css
@media (prefers-contrast: high) {
    :root {
        --color-primary-500: #4c1d95;
        --color-secondary-500: #831843;
    }
}
```

### Focus Visible
Todos los elementos interactivos tienen estilos de focus automáticos usando `--border-focus`.

## 💡 Ejemplos Prácticos

### Crear un Botón Personalizado
```css
.my-custom-button {
    background: var(--gradient-primary);
    color: var(--text-on-primary);
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--radius-lg);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    transition: var(--transition-bounce);
    box-shadow: var(--shadow-md);
}

.my-custom-button:hover {
    background: var(--gradient-primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-primary);
}
```

### Crear una Tarjeta de Producto
```css
.product-card {
    background: var(--bg-primary);
    border-radius: var(--radius-2xl);
    padding: var(--spacing-lg);
    box-shadow: var(--shadow-lg);
    transition: var(--transition-bounce);
}

.product-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-2xl);
}

.product-title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
}

.product-price {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-primary-600);
}
```

## 🔄 Actualizar Colores Globalmente

Para cambiar la paleta de colores completa, solo modifica las variables en `:root`:

```css
:root {
    /* Cambiar de azul a verde */
    --color-primary-500: #059669;
    --color-primary-600: #047857;
    /* etc... */
}
```

¡Todos los componentes se actualizarán automáticamente! 🎉

## 📱 Responsive Design

Utiliza las variables de breakpoint para mantener consistencia:

```css
@media (max-width: var(--breakpoint-md)) {
    .my-component {
        padding: var(--spacing-sm);
        font-size: var(--font-size-sm);
    }
}
```

---

**🚀 ¡Listo para usar!** Este sistema te permite crear interfaces consistentes y fáciles de mantener en PeluGo 2.0. 