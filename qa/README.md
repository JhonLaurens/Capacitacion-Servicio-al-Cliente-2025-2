# 🔬 QA Automation Suite - Capacitación Servicio al Cliente

Suite automatizada de pruebas de calidad para el proyecto de capacitación virtual de Coltefinanciera, que incluye validación técnica con **Lighthouse** y cumplimiento de estándares **SCORM 1.2**.

## 🛠️ Características

- ✅ **Lighthouse 12.8.2**: Análisis de rendimiento, accesibilidad, mejores prácticas y SEO
- ✅ **SCORM Cloud**: Validación de compatibilidad con estándares SCORM 1.2
- ✅ **Docker Integration**: Orquestación automática del entorno de pruebas
- ✅ **Reportes Consolidados**: HTML, JSON y Markdown con métricas detalladas
- ✅ **CI/CD Ready**: Integración con GitHub Actions y pipelines

## 📋 Requisitos

- **Node.js** 18+
- **Docker Desktop** ejecutándose
- **npm** (incluido con Node.js)

## 🚀 Instalación

Desde la raíz del repositorio:

```bash
cd qa
npm install
```

## ⚙️ Configuración

1. **Copiar archivo de configuración:**

```bash
copy .env.example .env
```

2. **Variables principales:**

### Lighthouse

- `LH_URL`: URL a auditar (default: `http://localhost:8080/index.html`)
- `LH_MIN_PERF`: Umbral mínimo de rendimiento (default: 80)
- `LH_MIN_A11Y`: Umbral mínimo de accesibilidad (default: 90)
- `LH_MIN_BP`: Umbral mínimo de mejores prácticas (default: 90)
- `LH_MIN_SEO`: Umbral mínimo de SEO (default: 80)

### SCORM Cloud (Opcional)

- `SCORMCLOUD_APP_ID`: ID de aplicación de SCORM Cloud
- `SCORMCLOUD_SECRET`: Clave secreta de SCORM Cloud
- `REQUIRE_SCORM`: Si es `true`, falla si las credenciales faltan (default: false)
- `SCORMCLOUD_ORG`: Organización en SCORM Cloud (default: default)

### Reportes

- `QA_REPORT_DIR`: Carpeta de salida para reportes (default: `qa/reports`)

## 🎯 Ejecución Local

### Orquestación Completa

```bash
# Desde la raíz del proyecto
npm --prefix qa run orchestrate
```

### Modo CI (Auto limpieza)

```bash
npm --prefix qa run ci
```

### Pruebas Individuales

```bash
# Solo Lighthouse
npm --prefix qa run lighthouse

# Solo SCORM Cloud (requiere credenciales)
npm --prefix qa run scormcloud

# Iniciar/Detener Docker
npm --prefix qa run start:docker
npm --prefix qa run stop:docker
```

## 📊 Resultados y Reportes

Los artefactos se guardan en `qa/reports/`:

### Lighthouse

- `lighthouse-*.html`: Reporte visual completo
- `lighthouse-*.json`: Datos detallados en JSON
- `lighthouse-summary-*.json`: Resumen con scores y estado

### SCORM Cloud

- `scormcloud-*.json`: Resultados de validación SCORM

### Consolidados

- `consolidated-report.json`: Reporte unificado en JSON
- `consolidated-report.md`: Resumen ejecutivo en Markdown

## 🔧 Integración CI/CD

### GitHub Actions

El workflow está configurado en `.github/workflows/qa.yml`:

1. Configura Node.js 18
2. Instala dependencias en `qa/`
3. Ejecuta `npm --prefix qa run ci`
4. Sube reportes como artefactos

### Variables de Entorno CI

```yaml
env:
  SCORMCLOUD_APP_ID: ${{ secrets.SCORMCLOUD_APP_ID }}
  SCORMCLOUD_SECRET: ${{ secrets.SCORMCLOUD_SECRET }}
  REQUIRE_SCORM: false # Cambiar a true si se requiere SCORM
```

## 🎯 Umbrales de Calidad

### Scores Actuales (✅ Aprobados)

- **Performance**: 88/100 (Umbral: 80)
- **Accessibility**: 95/100 (Umbral: 90)
- **Best Practices**: 100/100 (Umbral: 90)
- **SEO**: 100/100 (Umbral: 80)

### Estado SCORM

- **Validación**: ✅ Paquete compatible con SCORM 1.2
- **Metadatos**: ✅ Estructura IMS manifest válida
- **Interoperabilidad**: ⚠️ Requiere credenciales para pruebas completas

## 🐛 Solución de Problemas

### Error: PROTOCOL_TIMEOUT

**Solucionado** ✅ - Actualizado a Lighthouse 12.8.2

### Error: Estructura de reportes duplicada

**Solucionado** ✅ - Rutas corregidas en scripts

### Error: Credenciales SCORM

```bash
# Configurar en .env
SCORMCLOUD_APP_ID=tu-app-id
SCORMCLOUD_SECRET=tu-secret
```

### Error: Puerto en uso

```bash
# Verificar procesos
netstat -ano | findstr :8080
# Detener Docker
npm run stop:docker
```

## 📈 Métricas de Calidad

| Categoría      | Score Actual | Umbral | Estado       |
| -------------- | ------------ | ------ | ------------ |
| Performance    | 88           | 80     | ✅ PASS      |
| Accessibility  | 95           | 90     | ✅ PASS      |
| Best Practices | 100          | 90     | ✅ PASS      |
| SEO            | 100          | 80     | ✅ PASS      |
| **GENERAL**    | **✅**       | **✅** | **APROBADO** |
