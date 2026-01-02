# Initial Concept

El usuario desea construir un dashboard geoespacial online para visualizar y gestionar indicadores de eficiencia energética a nivel estatal y municipal en México.

**Objetivos Principales:**
- Evaluar indicadores tomados del INEGI con pesos asignados.
- Visualización de resultados a nivel municipal seleccionando el municipio.
- Diseño "Mobile First".
- Mantenibilidad y capacidad de realizar nuevas "corridas" de datos.

**Tecnología Propuesta:**
- **Frontend:** React + Vite (PWA/Mobile First).
- **Mapas:** Leaflet.
- **Backend/Base de Datos:** Supabase (Auth, DB, Realtime).
- **Almacenamiento de GeoJSON:** Cloudflare (para los shapes visuales).

**Funcionalidades Clave:**
- Mapa en pantalla completa (estilo Google Maps) con capas GeoJSON.
- Interfaz para ver detalles de indicadores y resultados generales por municipio.
- Gestión de usuarios.
- ABM (Alta, Baja, Modificación) de indicadores y pesos.
- Tablas de datos y vistas de dashboard complementarias al mapa.
- Integración de datos de Supabase con la visualización de formas de Cloudflare.
