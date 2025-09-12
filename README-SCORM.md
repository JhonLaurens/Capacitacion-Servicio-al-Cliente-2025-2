# 📚 Paquete SCORM - Capacitación Servicio al Cliente Coltefinanciera

## 🎯 Descripción

Este es un paquete SCORM 1.2 completo para la capacitación "Transformando Vidas a Través del Servicio - Segundo Semestre 2025" de Coltefinanciera. El paquete incluye integración completa con LMS Moodle para seguimiento de progreso y puntuaciones.

## 📦 Contenido del Paquete

### Archivos Principales
- `imsmanifest.xml` - Manifiesto SCORM 1.2 con metadatos del curso
- `index.html` - Página principal de la capacitación
- `style.css` - Estilos CSS corporativos de Coltefinanciera
- `app.js` - Lógica de la aplicación con integración SCORM
- `scorm-api.js` - API wrapper para comunicación con LMS

### Características del Curso
- **18 slides interactivos** con contenido completo
- **Quiz de evaluación** con 10 preguntas
- **Certificado digital** descargable
- **Seguimiento de progreso** en tiempo real
- **Puntuación automática** enviada al LMS
- **Compatibilidad SCORM 1.2** certificada

## 🚀 Instalación en Moodle

### Paso 1: Crear el Paquete ZIP

1. Comprimir toda la carpeta `scorm-package` en un archivo ZIP
2. Asegurarse de que `imsmanifest.xml` esté en la raíz del ZIP
3. Nombrar el archivo: `Coltefinanciera-SAC-2025-2.zip`

```bash
# Desde la carpeta del proyecto
cd scorm-package
# Crear ZIP con todos los archivos
Compress-Archive -Path * -DestinationPath ../Coltefinanciera-SAC-2025-2.zip
```

### Paso 2: Subir a Moodle

1. **Acceder al curso en Moodle**
   - Ir al curso donde se instalará la capacitación
   - Activar el modo de edición

2. **Agregar actividad SCORM**
   - Hacer clic en "Agregar una actividad o recurso"
   - Seleccionar "Paquete SCORM"
   - Hacer clic en "Agregar"

3. **Configurar la actividad**
   - **Nombre**: "Capacitación Servicio al Cliente - Segundo Semestre 2025"
   - **Descripción**: "Capacitación interactiva sobre servicio al cliente con las actualizaciones de Auditoría Interna"
   - **Archivo del paquete**: Subir `Coltefinanciera-SAC-2025-2.zip`

4. **Configuraciones recomendadas**
   - **Calificación máxima**: 100
   - **Método de calificación**: Puntuación más alta
   - **Intentos permitidos**: 2
   - **Forzar nuevo intento**: No
   - **Bloquear después del intento final**: Sí

### Paso 3: Configurar Finalización de Actividad

1. **Habilitar seguimiento de finalización**
   - Marcar "Habilitar seguimiento de finalización"
   - Seleccionar "Mostrar controles de finalización de actividad a los estudiantes"

2. **Condiciones de finalización**
   - ✅ "Requerir calificación"
   - ✅ "Requerir calificación de aprobación" (80%)
   - ✅ "El estudiante debe ver esta actividad para completarla"

## 📊 Seguimiento y Reportes

### Datos que se Envían al LMS

1. **Progreso del estudiante**
   - Porcentaje de slides visitados
   - Tiempo total en la actividad
   - Estado de finalización

2. **Puntuación del quiz**
   - Puntuación raw (0-100)
   - Estado de aprobación (≥80%)
   - Número de intentos

3. **Estados SCORM**
   - `not attempted` - No iniciado
   - `incomplete` - En progreso
   - `completed` - Completado sin evaluación
   - `passed` - Aprobado (≥80%)
   - `failed` - Reprobado (<80%)

### Acceder a Reportes

1. **Reporte de actividad**
   - Ir a la actividad SCORM
   - Hacer clic en "Reportes"
   - Ver progreso individual y grupal

2. **Calificaciones**
   - Ir a "Calificaciones" en el curso
   - Ver puntuaciones automáticas del SCORM

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. "El paquete no se puede abrir"
**Solución:**
- Verificar que `imsmanifest.xml` esté en la raíz del ZIP
- Comprobar que el XML sea válido
- Asegurarse de que todos los archivos referenciados existan

#### 2. "No se registra el progreso"
**Solución:**
- Verificar que JavaScript esté habilitado
- Comprobar la consola del navegador para errores
- Asegurarse de que la API SCORM esté disponible

#### 3. "La puntuación no se envía"
**Solución:**
- Completar todo el quiz hasta el final
- Verificar que la puntuación sea ≥80% para aprobar
- Comprobar configuración de calificaciones en Moodle

#### 4. "Pantalla en blanco"
**Solución:**
- Verificar permisos de archivos
- Comprobar que todos los recursos CSS/JS se carguen
- Revisar configuración de seguridad del navegador

### Logs de Depuración

Para activar logs detallados:
1. Abrir consola del navegador (F12)
2. Buscar mensajes que inicien con "SCORM"
3. Verificar errores en rojo

## 📋 Requisitos Técnicos

### Moodle
- **Versión mínima**: Moodle 3.9+
- **SCORM**: Soporte para SCORM 1.2
- **JavaScript**: Habilitado
- **Cookies**: Habilitadas

### Navegadores Compatibles
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivos
- **Desktop**: Resolución mínima 1024x768
- **Tablet**: Compatible con tablets 10"+
- **Móvil**: Responsive design incluido

## 🔄 Actualizaciones

### Para Actualizar el Contenido

1. **Modificar archivos fuente**
   - Editar archivos en la carpeta `web/`
   - Actualizar contenido según necesidades

2. **Regenerar paquete SCORM**
   - Copiar archivos actualizados a `scorm-package/`
   - Crear nuevo ZIP
   - Subir nueva versión a Moodle

3. **Consideraciones importantes**
   - Los estudiantes en progreso pueden perder su avance
   - Notificar a estudiantes antes de actualizar
   - Hacer backup de calificaciones existentes

## 📞 Soporte

### Contacto Técnico
- **Departamento**: Sistemas - Coltefinanciera
- **Email**: sistemas@coltefinanciera.com
- **Teléfono**: +57 (1) 234-5678

### Documentación Adicional
- [Documentación SCORM](https://scorm.com/scorm-explained/)
- [Moodle SCORM Settings](https://docs.moodle.org/en/SCORM_settings)
- [Guía de Troubleshooting Moodle](https://docs.moodle.org/en/SCORM_troubleshooting)

## 📄 Licencia

© 2025 Coltefinanciera. Todos los derechos reservados.
Material de uso interno exclusivo.

---

**Versión**: 2.0  
**Fecha**: Enero 2025  
**Autor**: Departamento de Capacitación - Coltefinanciera  
**SCORM**: Compatible con SCORM 1.2  
**Moodle**: Probado en Moodle 4.0+