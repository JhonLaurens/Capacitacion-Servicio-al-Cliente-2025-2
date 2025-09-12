# 🐳 Entorno de Desarrollo Docker - Capacitación Servicio al Cliente

## Descripción
Entorno de desarrollo con Docker para la página web de capacitación sobre Servicio al Cliente – Segundo Semestre 2025.

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