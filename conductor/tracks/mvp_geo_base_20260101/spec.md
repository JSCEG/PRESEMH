# Track Spec: MVP - Infraestructura Geoespacial y Visualización Base

## 1. Objetivo
Establecer la base técnica y visual del proyecto, permitiendo la visualización de un mapa de calor (Choropleth) de eficiencia energética a nivel municipal con una interfaz optimizada para dispositivos móviles.

## 2. Alcance (Funcionalidades)
- **Scaffolding:** Proyecto React + TS + Vite + Tailwind + Shadcn/ui.
- **Autenticación Base:** Pantalla de Landing con bifurcación (Login/Público) usando Supabase Auth.
- **Mapa Interactivo:** Motor MapLibre GL JS cargando capas GeoJSON de estados y municipios.
- **Visualización Choropleth:** Lógica de coloreado de polígonos basada en un indicador de prueba cruzado por `CVEGEO`.
- **UX Móvil:** Panel inferior desglosable (Bottom Sheet) para mostrar detalles del elemento seleccionado en el mapa.
- **Identidad:** Implementación de fuentes `Patria` y `Noto Sans` y colores institucionales.

## 3. Consideraciones Técnicas
- Las fuentes se consumen desde `cdn.sassoapps.com`.
- Los GeoJSON se consumen desde `cdn.sassoapps.com`.
- Se requiere configuración de Supabase (URL y Anon Key).
- El diseño debe ser estrictamente Mobile-First.

## 4. Criterios de Aceptación
- El mapa carga y muestra los polígonos de municipios correctamente.
- Al tocar un municipio, se despliega el Bottom Sheet con información dinámica.
- La aplicación es accesible sin login (modo público) y permite loguearse desde el menú.
- Se respetan los colores y tipografías de la guía de estilos SENER 2025.
