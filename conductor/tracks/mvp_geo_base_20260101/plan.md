# Track Plan: MVP - Infraestructura Geoespacial y Visualización Base

## Fase 1: Inicialización y Estilos (Andamiaje)
- [x] **Task: Setup - Inicializar Proyecto Vite + React + TS**
- [x] **Task: Setup - Configurar Tailwind CSS y Shadcn/ui con Identidad Institucional**
    - Configurar colores `gobmx-guinda`, `gobmx-verde`, etc.
    - Cargar tipografías `Patria` y `Noto Sans` desde CDN.
- [x] **Task: Setup - Configurar Cliente de Supabase**
- [x] **Task: Conductor - User Manual Verification 'Fase 1: Inicialización y Estilos' (Protocol in workflow.md)**

## Fase 2: Autenticación y Navegación
- [x] **Task: UI - Implementar Landing Page con selección de acceso (Público/Privado)**
- [x] **Task: Auth - Implementar Login con Supabase (Email/Password)**
- [x] **Task: UI - Implementar Menú Lateral (Hamburguesa) y Navegación Base**
- [x] **Task: Conductor - User Manual Verification 'Fase 2: Autenticación y Navegación' (Protocol in workflow.md)**

## Fase 3: Visualización Geoespacial Core
- [x] **Task: Map - Configurar MapLibre GL JS y cargar Mapa Base Personalizado**
- [x] **Task: Map - Implementar carga y renderizado de capas GeoJSON (Estados y Municipios)**
- [x] **Task: Map - Desarrollar lógica de coloreado Choropleth basada en claves CVEGEO**
- [x] **Task: UI - Desarrollar componente Bottom Sheet para Detalles Municipales**
- [x] **Task: Conductor - User Manual Verification 'Fase 3: Visualización Geoespacial Core' (Protocol in workflow.md)**

## Fase 4: Integración y Despliegue Inicial
- [x] **Task: Data - Carga inicial de datos de indicadores (Mock o carga parcial de Excel)**
- [x] **Task: Deploy - Configuración y despliegue en Cloudflare Pages**
- [x] **Task: Conductor - User Manual Verification 'Fase 4: Integración y Despliegue Inicial' (Protocol in workflow.md)**