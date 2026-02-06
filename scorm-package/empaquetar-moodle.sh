#!/bin/bash

echo "====================================="
echo " EMPAQUETADO SCORM PARA MOODLE"
echo " Coltefinanciera - Capacitación 2025"
echo "====================================="
echo

# Verificar que estamos en el directorio correcto
if [ ! -f "index.html" ]; then
    echo "ERROR: No se encuentra index.html"
    echo "Asegúrate de ejecutar este script desde el directorio scorm-package"
    exit 1
fi

# Crear directorio temporal
mkdir -p temp

# Limpiar directorio temporal
rm -rf temp/*

echo "Copiando archivos necesarios..."

# Copiar archivos principales
cp index.html temp/
cp style.css temp/
cp app.js temp/
cp scorm-api.js temp/
cp imsmanifest.xml temp/
cp moodle-config.json temp/

# Copiar directorio de imágenes
if [ -d "imagenes" ]; then
    cp -r imagenes temp/
    echo "Imágenes copiadas"
else
    echo "ADVERTENCIA: No se encontró el directorio imagenes"
fi

echo
echo "Validando estructura SCORM..."

# Verificar archivos obligatorios
if [ ! -f "temp/imsmanifest.xml" ]; then
    echo "ERROR: imsmanifest.xml no encontrado"
    exit 1
fi

if [ ! -f "temp/index.html" ]; then
    echo "ERROR: index.html no encontrado"
    exit 1
fi

echo "Estructura SCORM validada correctamente"

echo
echo "Creando archivo ZIP para Moodle..."

# Crear ZIP
cd temp
zip -r ../Coltefinanciera-SAC-2025-2-Moodle.zip . -x "*.DS_Store" "*.git*" "*Thumbs.db*"
cd ..

if [ -f "Coltefinanciera-SAC-2025-2-Moodle.zip" ]; then
    echo
    echo "====================================="
    echo " EMPAQUETADO COMPLETADO EXITOSAMENTE"
    echo "====================================="
    echo
    echo "Archivo creado: Coltefinanciera-SAC-2025-2-Moodle.zip"
    echo
    echo "INSTRUCCIONES PARA MOODLE:"
    echo "1. Ir a su curso en Moodle"
    echo "2. Activar edición"
    echo "3. Añadir actividad > Paquete SCORM"
    echo "4. Subir: Coltefinanciera-SAC-2025-2-Moodle.zip"
    echo "5. Configurar según README-MOODLE.md"
    echo
    echo "Tamaño del archivo:"
    ls -lh Coltefinanciera-SAC-2025-2-Moodle.zip
    echo
else
    echo "ERROR: No se pudo crear el archivo ZIP"
    exit 1
fi

# Limpiar archivos temporales
echo "Limpiando archivos temporales..."
rm -rf temp

echo
echo "PROCESO COMPLETADO"
echo "El paquete SCORM está listo para subir a Moodle"
echo