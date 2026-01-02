# Track Spec: Gestión de Usuarios e Indicadores (Admin)

## 1. Objetivo
Dotar a la plataforma de herramientas administrativas para gestionar el acceso de usuarios (RBAC) y mantener actualizado el catálogo de indicadores de eficiencia energética sin intervención de desarrolladores.

## 2. Alcance (Funcionalidades)
- **Roles y Permisos:** Implementar protección de rutas (`RequireAuth`, `RequireRole`) para asegurar áreas sensibles.
- **Panel de Usuarios:** Vista tabular para listar usuarios registrados.
    - Filtros por estatus (`PENDING`, `APPROVED`).
    - Acciones: Aprobar (asignar rol), Rechazar, Eliminar.
- **Modelo de Datos (Supabase):**
    - Tabla `indicators`: Catálogo maestro (Nombre, Peso, Escala, Unidad).
    - Tabla `measurements`: Valores por municipio/año.
- **Gestor de Indicadores:**
    - Vista maestra de indicadores.
    - Formulario para editar pesos y metadatos.
    - Funcionalidad para crear nuevos indicadores.

## 3. Consideraciones Técnicas
- **UI:** Usar componentes de tabla (`Table` de Shadcn/ui) y formularios (`Form` + `Zod`).
- **Seguridad:** Las políticas RLS (Row Level Security) en Supabase deben ser estrictas: solo ADMIN puede editar.
- **Estado:** Usar `TanStack Query` (React Query) para manejar el caché de datos administrativos de forma eficiente.

## 4. Criterios de Aceptación
- Un usuario `ADMIN` puede ver la lista de pendientes y aprobar un nuevo usuario.
- Un usuario `ANALYST` puede editar el peso de un indicador pero no borrar usuarios.
- El cambio de un peso en el admin se refleja (tras recargar) en los cálculos del frontend o base de datos.
- Las rutas `/admin` están bloqueadas para usuarios públicos o no logueados.
