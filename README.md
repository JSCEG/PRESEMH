# Dashboard de Indicadores de Eficiencia Energética (PRESEMH) - SENER 2026

Este proyecto es un visualizador geoespacial moderno desarrollado para la Secretaría de Energía (SENER).

## Tecnologías
- **Frontend:** React + Vite + TypeScript.
- **Mapa:** MapLibre GL JS + MapTiler SDK.
- **Estilos:** Tailwind CSS + Shadcn/ui.
- **Backend:** Supabase (Auth & Database).
- **Despliegue:** Cloudflare Pages.

## Configuración de Despliegue (Cloudflare Pages)

### Opción 1: Conexión con GitHub (Recomendado)
1. Sube este repositorio a GitHub.
2. En el panel de Cloudflare, crea un nuevo proyecto de "Pages" conectado a tu repo.
3. Configuración de Build:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Variables de entorno:
   - Agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en la configuración del proyecto en Cloudflare.

### Opción 2: Wrangler CLI
1. Instala Wrangler: `npm install -g wrangler`
2. Construye el proyecto: `npm run build`
3. Despliega: `wrangler pages deploy dist`

## Estructura de Datos
Los indicadores se procesan desde el archivo Excel original. Para el MVP, se ha generado una muestra en `src/data/mockIndicators.json` que alimenta el mapa de calor (Choropleth).
