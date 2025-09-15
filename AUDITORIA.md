# Auditoría técnica del proyecto: Capacitación Servicio al Cliente 2025-2

Fecha: 2025-09-14
Responsable: Auditoría técnica (web, accesibilidad, SCORM, devops)

## 1) Visión general y lógica de funcionamiento

Este repositorio contiene:

- Un paquete SCORM 1.2 funcional en `scorm-package/` (HTML, CSS y JS) para desplegarse en Moodle u otros LMS compatibles.
- Archivos de apoyo (Markdown, PDF) con contenidos y guiones de la capacitación.
- Un entorno Docker/Nginx para servir el paquete de forma local.

Flujo principal del curso (SCORM):

- `index.html` renderiza una presentación con 9 módulos (slides) y un carrusel de imágenes (fraudes).
- `style.css` define un sistema de diseño (tokens, temas claro/oscuro, componentes, responsivo).
- `app.js` controla navegación, animaciones, modal de imágenes y marca progreso de módulos.
- `scorm-api.js` implementa un wrapper SCORM 1.2: inicializa la sesión, registra progreso/estado y termina sesión al cerrar.
- `imsmanifest.xml` (dentro de `scorm-package/`) define el SCO principal, metadatos y recursos.

Docker/Nginx:

- `Dockerfile` y `docker-compose.yml` sirven el contenido estático desde Nginx exponiendo el puerto `8080` para pruebas locales.

## 2) Estructura y clasificación por módulos

- Módulo SCORM (`scorm-package/`)

  - `index.html`: página principal (estructura, navegación, roles ARIA, imágenes)
  - `style.css`: tokens de diseño, temas (light/dark), layout y componentes, responsive y accesibilidad
  - `app.js`: lógica de presentación (slides 1..9), progreso, carrusel, modal de imágenes, teclado
  - `scorm-api.js`: integración SCORM 1.2 (initialize/commit/terminate, setStatus, setScore, session_time)
  - `imsmanifest.xml`: manifiesto SCORM 1.2 del SCO
  - `imagenes/`: activos de imagen usados por el curso

- Despliegue local

  - `Dockerfile`: imagen Nginx minimal, copia del paquete SCORM a `/usr/share/nginx/html`
  - `docker-compose.yml`: orquesta Nginx en `8080:80` y mapea `./scorm-package` como volumen para hot-reload

- Documentación y contenidos

  - Archivos `.md` con contenidos, guiones y propuesta para Moodle
  - `Capacitación ce 019 2024 SFC - Fraudes.pdf`: material de referencia
  - `Coltefinanciera-SAC-2025-2.zip`: paquete comprimido (debe contener `scorm-package`) para subir a Moodle

- Manifiesto duplicado (raíz)
  - `imsmanifest.xml` (en la raíz del repo): versión alternativa de metadatos; no es utilizado por el ZIP principal (que se genera desde `scorm-package/`).

## 3) Hallazgos y problemas detectados

- Despliegue Docker

  - `docker-compose.yml` y `Dockerfile` apuntaban a una carpeta `web/` inexistente. Impacto: build fallido o sitio vacío. (Corregido)

- Cumplimiento SCORM 1.2

  - `scorm-api.js` enviaba `cmi.progress_measure` (propiedad de 2004/1.3, no 1.2). Impacto: potenciales errores en LMS SCORM 1.2. (Corregido)
  - `session_time` usaba formato ISO8601 (`PT...`) en vez de `HH:MM:SS` requerido por 1.2. (Corregido)
  - Inconsistencia de `adlcp:masteryscore` entre manifiestos (100 en `scorm-package/imsmanifest.xml` y 80 en el manifiesto raíz). El curso actual no tiene evaluación; el estado de finalización lo determina la visita a todos los módulos. Recomendación: mantener un único valor o eliminarlo del manifiesto raíz. (Documentado)

- Accesibilidad y UX

  - Falta de landmarks/roles ARIA en `index.html` (banner, nav, main, application). (Mejorado)
  - Imágenes sin `loading="lazy"` y `decoding="async"`. (Mejorado)
  - Sin `noscript` de fallback. (Mejorado)
  - Contraste de texto de párrafos forzado a blanco en algunas secciones que en tema claro reducía legibilidad. (Ajustado vía override no disruptivo)
  - Preferencia de movimiento reducido no respetada. (Añadido @media reduce motion)

- CSS

  - Uso de variable inexistente `--border-radius-md` en un bloque puntual (se sustituyó por `--radius-md` sin alterar UI).
  - Efectos que dependían de `--color-primary-rgb` sin definición explícita en todos los temas (se añadió definición segura por tema).
  - Fuente remota `@font-face` externa; aceptable en LMS con internet, pero no funciona offline. (Documentado)

- Código JS

  - Llamadas SCORM robustecidas para 1.2; la lógica de UI se mantiene.
  - Elementos opcionales con null-check (p.ej., `restartBtn`). Ya estaba contemplado.

- Redundancias/archivos
  - Manifiesto SCORM duplicado: raíz y `scorm-package/`. El zip recomendado usa el de `scorm-package/`.
  - Servicio de generación de imágenes en `docker-compose.yml` comentado (no se usa). Se conserva comentado.

## 4) Cambios aplicados (sin modificar el contenido visible)

- `docker-compose.yml`

  - Volumen: `./scorm-package:/usr/share/nginx/html` (antes `./web`).

- `Dockerfile`

  - `COPY ./scorm-package /usr/share/nginx/html` (antes `./web`).

- `scorm-package/index.html`

  - Metadatos: `X-UA-Compatible`, `description`, `link rel="preload"` de CSS, `favicon`.
  - Accesibilidad: `role="application"`, `role="banner"`, `role="navigation"` con `aria-label`, `role="main"`.
  - Performance/UX: `loading="lazy"` y `decoding="async"` en imágenes; scripts con `defer`; `noscript`.

- `scorm-package/style.css`

  - Overrides no disruptivos: color de párrafos según token de texto, definición de `--color-primary-rgb` por tema, corrección `--radius-md` en bloque dependiente, soporte `prefers-reduced-motion`.

- `scorm-package/scorm-api.js`

  - Eliminación de `cmi.progress_measure` (no 1.2) y registro de progreso en `cmi.core.lesson_location` (porcentaje redondeado).
  - `session_time` al formato `HH:MM:SS` para SCORM 1.2.

- `scorm-package/app.js`
  - Ajuste menor para alinear el envío de progreso con el wrapper SCORM actualizado.

Nota: No se alteró texto, imágenes ni estructura de contenido mostrada al usuario final.

## 5) Limpieza y elementos obsoletos

- No se eliminaron archivos para evitar impacto en empaquetado o referencias externas.
- Elementos señalados para futura limpieza (con validación previa):
  - `imsmanifest.xml` en la raíz: redundante frente al de `scorm-package/` que es el que debe incluirse en el ZIP.
  - Fuente remota en `style.css`: opcionalizar o empaquetar una fuente local, si la licencia lo permite.

## 6) Recomendaciones de mejores prácticas (aplicadas y futuras)

Aplicadas:

- Accesibilidad: landmarks ARIA, atributos `alt`, `lazy/async`, `noscript`, `reduced-motion`.
- Performance: `preload` de CSS, `defer` en JS, lazy images.
- SCORM 1.2: `session_time` y eliminación de propiedades no soportadas.
- DevOps: apuntar Docker a la carpeta real del paquete.

Futuras (sin alterar contenido):

- Unificar manifiesto: mantener solo `scorm-package/imsmanifest.xml` para empaquetado; alinear `adlcp:masteryscore` (si no hay evaluación, puede omitirse o ponerse 0; si habrá quiz, defínase acorde).
- Accesibilidad WCAG AA:
  - Revisar contrastes en todos los estados (hover/focus),
  - Añadir `skip link` al contenido principal,
  - Asegurar foco visible en todos los controles personalizados.
- Observabilidad: registrar errores SCORM/JS en un panel de diagnóstico oculto (solo técnicos) o en consola con prefijo.
- CSS: considerar dividir `style.css` por componentes/módulos; añadir `content-visibility` para secciones no visibles.
- Rendimiento: uso de `prefers-color-scheme` sin fuentes remotas bloqueantes.
- Seguridad/Privacidad: evitar fuentes/recursos de terceros si el LMS opera en intranet.
- QA: validar SCORM con herramientas como SCORM Cloud y probar en Moodle 4.x.

## 7) Cómo ejecutar y probar

Opción A: Docker local (Windows PowerShell)

```powershell
# En la raíz del repositorio
docker compose up --build -d

# Abrir en navegador
Start-Process http://localhost:8080
```

Opción B: Prueba directa del paquete

- Abrir `scorm-package/index.html` en un navegador para validar UI (la integración SCORM requiere un LMS para persistir datos).

Opción C: Subida a Moodle

- Comprimir el contenido de `scorm-package/` en `Coltefinanciera-SAC-2025-2.zip` asegurando que `imsmanifest.xml` quede en la raíz del ZIP.
- Crear actividad SCORM en Moodle y cargar el ZIP.

## 8) Trazabilidad a requisitos

- Documentar estructura y lógica: Completado (secciones 1 y 2).
- Clasificación por módulos: Completado (sección 2).
- Identificar y corregir errores: Completado (sección 3 y 4; cambios aplicados sin alterar contenido visible).
- Limpieza y redundancias: Documentado y parcialmente abordado sin borrado (sección 5).
- Mejores prácticas HTML/CSS/JS/SCORM: Completado (sección 6 – aplicadas + futuras).
- Mantener contenido intacto: Cumplido (no se agregaron/alteraron textos ni imágenes visibles).
- Documentación final: Completado (este documento).

## 9) Estado de calidad (quick gates)

- Build Docker: OK (config actualizado a `scorm-package`).
- Lint/Typecheck: N/A (proyecto estático, sin toolchain JS configurada).
- Unit Tests: N/A.
- Smoke test: HTML carga, scripts con `defer`, imágenes lazy; no se validó en LMS real en este paso.

---

Para dudas o profundización (p.ej., validación en SCORM Cloud/Moodle, métricas de accesibilidad con Lighthouse/axe), puedo preparar un plan de verificación formal y ejecutar pruebas adicionales.
