# Product Guidelines: Dashboard PRESEMH - Identidad Institucional y UX

## 1. Experiencia de Usuario (UX) - Mobile First
La aplicación debe sentirse nativa y fluida en dispositivos móviles, priorizando el contexto geográfico.

*   **Patrón de Navegación Principal:**
    *   **Mapa Fullscreen:** El mapa es el protagonista y ocupa el 100% de la pantalla (z-index base).
    *   **Bottom Sheet (Hoja Deslizable):** Panel inferior interactivo para mostrar detalles del municipio seleccionado.
        *   *Estado colapsado:* Muestra solo el nombre del municipio y el KPI principal (Semáforo).
        *   *Estado expandido:* Muestra el detalle completo de indicadores, gráficas y tablas.
    *   **Controles Flotantes (FABs):** Botones circulares para acciones rápidas: "Capas", "Mi Ubicación", "Filtros".

*   **Gestión de Datos (Escritorio/Tablet):**
    *   Al detectar pantallas grandes, el Bottom Sheet se transforma en un **Sidebar Flotante** elegante para aprovechar el espacio horizontal.
    *   Las tablas de administración de indicadores (ABM) deben ser responsivas (scroll horizontal en celdas o vista de tarjetas en móvil).

## 2. Identidad Visual (Gobierno de México - SENER 2025)
Se implementará fielmente la `GUIA_ESTILOS_WEB.md` proporcionada, utilizando un enfoque moderno con Tailwind CSS.

### 2.1 Paleta de Colores (Tokens Tailwind)
Se extenderá la configuración de Tailwind (`tailwind.config.js`) con los colores institucionales para uso semántico:

*   **Primario (Acción/Énfasis):** `gobmx-guinda` (#9B2247)
*   **Secundario (Apoyo/Validación):** `gobmx-verde` (#1E5B4F)
*   **Acento (Detalles):** `gobmx-dorado` (#A57F2C)
*   **Neutros:** `gobmx-gris` (#98989A) y `gobmx-gris-claro` (#E5E5E5)

### 2.2 Tipografía
Fuentes alojadas en CDN (Cloudflare) para máximo rendimiento y fidelidad en PDFs.

*   **Títulos (Headings):** `Patria` (Serif Institucional). Elegante, formal.
*   **Cuerpo (Body):** `Noto Sans` (Sans-serif). Legible, moderna, optimizada para UI.

### 2.3 Componentes UI (Shadcn/ui + Tailwind)
Utilizaremos `shadcn/ui` como base para componentes accesibles y altamente personalizables.

*   **Botones:** Rectangulares con radio de borde sutil (`rounded-md`), tipografía `Noto Sans` en negrita.
    *   *Primary:* Fondo Guinda, Texto Blanco. Hover: Guinda Oscuro.
    *   *Secondary:* Fondo Verde, Texto Blanco.
*   **Inputs/Formularios:** Bordes limpios, focus ring en color Dorado.
*   **Tarjetas (Cards):** Fondo blanco, sombra suave (`shadow-sm`), borde superior de color semántico (Guinda/Verde) para replicar el estilo "LaTeX" de la guía.
*   **Loaders:** Preloaders elegantes y minimalistas (ej. logo SENER latiendo o spinner circular dorado) durante cargas asíncronas.

## 3. Mapas y Visualización de Datos
*   **Motor de Mapa:** MapLibre GL JS / MapTiler SDK (WebGL).
    *   **Proyección:** Plana (Mercator) por defecto para compatibilidad con shapes oficiales, pero con capacidad de rotación/inclinación controlada.
    *   **Estilo Base:** Vector Tiles personalizados con la paleta de colores institucional y tipografías oficiales (`Patria`, `Noto Sans`) configuradas desde el proveedor de mapas.
*   **Gestión de Marcadores y Clusters:**
    *   **Agrupamiento (Clustering):** Si se visualizan puntos (ej. localidades), se usarán "Clusters" interactivos que se desglosan al hacer zoom, evitando saturación visual.
    *   **Marcadores:** Iconografía SVG personalizada (Lucide) o Assets oficiales.
*   **Popups y Tooltips (UX Móvil):**
    *   **Evitar Oclusión:** En móviles, **NO** usar popups estándar que cubren el mapa.
    *   **Interacción:** Al tocar un elemento, el mapa hace "padding" automático para centrar el elemento visible, y la información aparece en el **Bottom Sheet** (parcialmente visible), permitiendo seguir viendo el contexto geográfico.
*   **Colores Semánticos:** Los mapas de calor (Choropleth) usarán interpolación de colores fluida (característica nativa de MapLibre) basada en escalas de la identidad (Guinda->Dorado->Verde).

## 4. Flujo de Autenticación y Roles
*   **Acceso Público:** Vista de solo lectura del dashboard (Transparencia).
*   **Login Institucional:** Diseño limpio con logos oficiales.
    *   Soporte para Email/Password y Social Auth (Google/Microsoft).
*   **Moderación de Usuarios:**
    *   Nuevos registros entran en estado `PENDING`.
    *   **Admin Panel:** Interfaz para aprobar/rechazar usuarios y asignar roles (`ADMIN`, `ANALYST`, `VIEWER_VIP`).

## 5. Reportes y Exportación
*   **PDF Generator:** Motor de renderizado que inyecta las fuentes de Cloudflare.
*   **Branding:** Encabezado con logos SENER/Gobierno y pie de página oficial.
*   **Seguridad:** Marca de agua diagonal con "CONFIDENCIAL" o nombre del usuario si el reporte contiene datos sensibles.
