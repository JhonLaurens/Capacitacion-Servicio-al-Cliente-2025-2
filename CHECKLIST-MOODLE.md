# Lista de Verificación - Implementación SCORM en Moodle

## Coltefinanciera - Capacitación Servicio al Cliente 2025-2

### ✅ Pre-implementación

#### Verificación del Paquete SCORM

- [ ] Archivo `imsmanifest.xml` presente y válido
- [ ] Archivo `index.html` como punto de entrada
- [ ] Archivos `style.css`, `app.js`, `scorm-api.js` incluidos
- [ ] Carpeta `imagenes` con todos los recursos gráficos
- [ ] Archivo ZIP menor a 50MB (recomendado para Moodle)
- [ ] Estructura de archivos sin caracteres especiales
- [ ] Codificación UTF-8 en todos los archivos de texto

#### Verificación de Moodle

- [ ] Moodle versión 4.0 o superior
- [ ] Módulo SCORM habilitado
- [ ] Permisos de administrador/profesor para subir actividades
- [ ] Espacio suficiente en servidor para el paquete
- [ ] Backup del curso realizado (recomendado)

### ✅ Configuración en Moodle

#### Subida del Paquete

- [ ] Ir al curso donde se implementará la capacitación
- [ ] Activar modo de edición
- [ ] Agregar actividad → Paquete SCORM
- [ ] Subir archivo `Coltefinanciera-SAC-2025-2-Moodle.zip`
- [ ] Verificar que la subida se complete sin errores

#### Configuración General

- [ ] **Nombre**: "Capacitación Servicio al Cliente - Segundo Semestre 2025"
- [ ] **Descripción**: Incluir objetivos y duración estimada (45 min)
- [ ] **Mostrar descripción**: Habilitado
- [ ] **Disponibilidad**: Configurar fechas según cronograma
- [ ] **ID number**: Asignar identificador único (opcional)

#### Configuración del Paquete SCORM

- [ ] **Método de calificación**: "Intento con puntuación más alta"
- [ ] **Número máximo de intentos**: 3
- [ ] **Puntuación de dominio**: 80%
- [ ] **Auto-continuar**: Sí
- [ ] **Auto-confirmar**: Sí
- [ ] **Permitir saltar estructura de contenido**: No
- [ ] **Ocultar navegación**: No
- [ ] **Mostrar botón de navegación**: Sí

#### Configuración de Apariencia

- [ ] **Mostrar en ventana emergente**: No (recomendado)
- [ ] **Ancho**: 100%
- [ ] **Alto**: 600px
- [ ] **Permitir redimensionar**: Sí (si se usa popup)
- [ ] **Mostrar barras de desplazamiento**: Sí (si se usa popup)
- [ ] **Ocultar navegación**: No
- [ ] **Mostrar tabla de contenidos**: Sí

#### Configuración de Finalización

- [ ] **Rastreo de finalización**: Automático
- [ ] **Requerir vista**: Sí
- [ ] **Requerir calificación**: No (opcional)
- [ ] **Fecha esperada de finalización**: Configurar según cronograma

#### Configuración de Calificaciones

- [ ] **Categoría de calificación**: Asignar categoría apropiada
- [ ] **Pasar calificación**: 80 (o según política de la empresa)
- [ ] **Escala**: Numérica 0-100

### ✅ Pruebas y Validación

#### Pruebas Funcionales

- [ ] La actividad se carga correctamente
- [ ] Navegación entre módulos funciona
- [ ] Carrusel de fraudes funciona con flechas visibles
- [ ] Tema claro/oscuro cambia correctamente
- [ ] Todas las imágenes se cargan
- [ ] Progreso se registra en Moodle
- [ ] Completación se marca automáticamente

#### Pruebas de Compatibilidad

- [ ] Funciona en Chrome (versión 90+)
- [ ] Funciona en Firefox (versión 88+)
- [ ] Funciona en Safari (versión 14+)
- [ ] Funciona en dispositivos móviles
- [ ] Funciona en tablets
- [ ] Compatible con lectores de pantalla (básico)

#### Pruebas de SCORM

- [ ] Progreso se guarda correctamente
- [ ] Estado de finalización se actualiza
- [ ] Tiempo invertido se registra
- [ ] Datos persisten entre sesiones
- [ ] Múltiples intentos funcionan correctamente

### ✅ Post-implementación

#### Configuración de Acceso

- [ ] Grupos configurados (si aplica)
- [ ] Restricciones de acceso establecidas
- [ ] Fechas de disponibilidad configuradas
- [ ] Notificaciones automáticas configuradas

#### Comunicación a Usuarios

- [ ] Anuncio en el curso publicado
- [ ] Instructivo de acceso enviado
- [ ] Soporte técnico identificado
- [ ] FAQ preparado para consultas comunes

#### Monitoreo Inicial

- [ ] Verificar primeros accesos de usuarios
- [ ] Revisar reportes de progreso
- [ ] Monitorear errores en logs de Moodle
- [ ] Recopilar feedback inicial de usuarios

### ✅ Mantenimiento y Soporte

#### Reportes y Seguimiento

- [ ] Reporte de participación semanal
- [ ] Reporte de finalización mensual
- [ ] Análisis de tiempo promedio de finalización
- [ ] Identificación de usuarios con dificultades

#### Resolución de Problemas

- [ ] Procedimiento para reiniciar intentos
- [ ] Guía para problemas técnicos comunes
- [ ] Contacto de soporte técnico documentado
- [ ] Escalación a administrador de Moodle

### 📞 Contactos de Soporte

#### Administrador de Moodle

- **Plataforma**: https://aprende.coltefinanciera.com.co/
- **Usuario administrativo**: JHONJARA
- **Contraseña**: Agosto2025/\*-+

#### Contacto Técnico

- **Departamento**: Capacitación Coltefinanciera
- **Email**: [correo de soporte]
- **Teléfono**: [número de soporte]

### 📊 Métricas de Éxito

#### Indicadores Objetivo

- [ ] **Tasa de finalización**: ≥ 85%
- [ ] **Tiempo promedio**: 45 ± 15 minutos
- [ ] **Puntuación promedio**: ≥ 80%
- [ ] **Tasa de error técnico**: < 5%
- [ ] **Satisfacción del usuario**: ≥ 4.0/5.0

#### Métricas a Monitorear

- [ ] Número total de accesos
- [ ] Progreso por módulo
- [ ] Abandono por módulo
- [ ] Dispositivos más utilizados
- [ ] Horarios pico de acceso

---

**Fecha de verificación**: ****\_\_\_****  
**Verificado por**: ****\_\_\_****  
**Notas adicionales**:

---

---

---

---

**© 2025 Coltefinanciera. Documento de uso interno.**
