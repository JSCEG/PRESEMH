# Technology Stack

## Frontend Core
*   **Framework:** React 18+
*   **Build Tool:** Vite (Ultra-fast build & HMR)
*   **Language:** TypeScript 5+ (Strict typing for robust data handling)
*   **State Management:** React Context API + Hooks.

## UI & Styling
*   **Styling Engine:** Tailwind CSS 3.x
*   **Component Primitives:** Shadcn/ui (Radix UI base).
*   **Icons:** Lucide React.
*   **Typography:** Custom fonts hosted on Cloudflare CDN (`Patria`, `Noto Sans`).
*   **Map Engine:** MapLibre GL JS (via `react-map-gl` o MapTiler SDK) y Turf.js para análisis geoespacial en el cliente. Motor WebGL para alto rendimiento y personalización.

## Backend & Data (BaaS)
*   **Platform:** Supabase.
*   **Database:** PostgreSQL.
*   **Authentication:** Supabase Auth (Email, Social Providers) + Custom Role Based Access Control (RBAC).
*   **Serverless Logic:** Supabase Edge Functions (para cálculos pesados de modelos).

## Infrastructure & DevOps
*   **Hosting/Deployment:** Cloudflare Pages (conectado a GitHub).
*   **Assets/CDN:** Cloudflare (GeoJSONs, Fuentes, Imágenes).
*   **Version Control:** Git.

## Quality Assurance & Developer Experience
*   **Linting:** ESLint (Configuración recomendada para React + TS).
*   **Formatting:** Prettier.
