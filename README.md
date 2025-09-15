# � Capacitación Servicio al Cliente - Coltefinanciera 2025-2

## 📚 Descripción

Capacitación interactiva en formato SCORM para el fortalecimiento del servicio al cliente en Coltefinanciera, segundo semestre 2025.

## 🌐 Despliegue en Vercel

### Configuración Automática

El proyecto está configurado para desplegarse automáticamente en Vercel con la siguiente estructura:

- **Punto de entrada**: `scorm-package/index.html`
- **Archivos estáticos**: Todos los recursos en `scorm-package/`
- **Configuración SCORM**: Compatible con estándares SCORM 1.2

### Pasos de Despliegue

1. **Instalar Vercel CLI** (si no está instalado):

   ```bash
   npm install -g vercel
   ```

2. **Configurar autenticación** con tu token:

   ```bash
   vercel login
   ```

3. **Desplegar el proyecto**:
   ```bash
   vercel --prod
   ```

### URL de Acceso

Una vez desplegado, la capacitación estará disponible en:
`https://[proyecto-name].vercel.app`

## 📋 Características del Curso

### Módulos Incluidos

1. **Introducción**: Transformando Vidas a Través del Servicio
2. **Módulo 1**: Conceptos Básicos del Servicio al Cliente
3. **Módulo 2**: Comunicación Efectiva
4. **Módulo 3**: Manejo de Objeciones
5. **Módulo 4**: Resolución de Conflictos
6. **Módulo 5**: Cierre Efectivo
7. **Módulo 6**: Seguimiento Post-Venta
8. **Módulo 7**: Defensoría del Consumidor Financiero
9. **Módulo 8**: Casos Prácticos
10. **Módulo 9**: Evaluación Final
11. **Conclusión**: Certificación y Próximos Pasos

### Tecnologías

- **HTML5** con semántica moderna
- **CSS3** con variables CSS y diseño responsivo
- **JavaScript ES6+** para interactividad
- **SCORM 1.2** para compatibilidad LMS
- **Progressive Web App** features

### Funcionalidades

- ✅ **Diseño responsivo** (mobile-first)
- ✅ **Modo claro/oscuro**
- ✅ **Navegación intuitiva**
- ✅ **Seguimiento de progreso**
- ✅ **Evaluaciones interactivas**
- ✅ **Compatibilidad SCORM**
- ✅ **Optimización SEO**

---

## 🐳 Entorno de Desarrollo Docker (Alternativo)

### Descripción

Entorno de desarrollo con Docker para desarrollo local de la capacitación sobre Servicio al Cliente.

## Estructura del Proyecto

```
/proyecto-capacitacion
│── /web (archivos estáticos: HTML, CSS, JS)
│── /generated-images (imágenes generadas por IA)
│── Dockerfile
│── docker-compose.yml
└── README.md
```

## Servicios Incluidos

### 1. Servicio Web

- **Tecnología**: Nginx Alpine
- **Puerto**: 8080
- **Descripción**: Servidor web para los archivos estáticos de la capacitación

### 2. Generador de Imágenes IA

- **Tecnología**: Stable Diffusion WebUI
- **Puerto**: 5000
- **Descripción**: Servicio para generar imágenes con inteligencia artificial

## Comandos de Uso

### Comandos Básicos

```bash
# Iniciar entorno completo
docker compose up --build -d

# Detener todos los servicios
docker compose down

# Reiniciar servicios
docker compose restart

# Ver logs de los servicios
docker compose logs

# Ver logs de un servicio específico
docker compose logs web
docker compose logs image-generator
```

### Comandos de Desarrollo

```bash
# Reconstruir solo el servicio web
docker compose up --build web

# Ejecutar en modo interactivo
docker compose up

# Parar un servicio específico
docker compose stop web
docker compose stop image-generator
```

## Accesos

- **Página web principal**: http://localhost:8080
- **Servicio de generación de imágenes**: http://localhost:5000

## Características

### Desarrollo en Tiempo Real

- Los cambios en los archivos del directorio `/web` se reflejan automáticamente en el navegador
- No es necesario reiniciar el contenedor para ver cambios en HTML, CSS o JS

### Persistencia de Datos

- Las imágenes generadas se guardan en el directorio `/generated-images`
- Los archivos persisten aunque se reinicien los contenedores

### Configuración de Reinicio

- Ambos servicios están configurados con `restart: unless-stopped`
- Los contenedores se reinician automáticamente si fallan

## Requisitos del Sistema

- Docker Engine 20.10+
- Docker Compose 2.0+
- Puertos 8080 y 5000 disponibles

## Solución de Problemas

### Puerto en Uso

```bash
# Verificar qué proceso usa el puerto
netstat -ano | findstr :8080
netstat -ano | findstr :5000
```

### Limpiar Contenedores

```bash
# Eliminar contenedores, redes y volúmenes
docker compose down -v

# Limpiar imágenes no utilizadas
docker system prune
```

### Reconstruir desde Cero

```bash
# Eliminar todo y reconstruir
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

## Notas Importantes

- El servicio de generación de imágenes puede tardar varios minutos en iniciarse la primera vez
- Asegúrate de tener suficiente espacio en disco para las imágenes de Docker
- El directorio `generated-images` se crea automáticamente al iniciar los servicios

## Soporte

Para problemas técnicos o consultas sobre el entorno de desarrollo, consulta la documentación de Docker o contacta al equ
