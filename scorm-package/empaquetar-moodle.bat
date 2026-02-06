@echo off
echo =====================================
echo  EMPAQUETADO SCORM PARA MOODLE
echo  Coltefinanciera - Capacitacion 2025
echo =====================================
echo.

REM Verificar que estamos en el directorio correcto
if not exist "index.html" (
    echo ERROR: No se encuentra index.html
    echo Asegurate de ejecutar este script desde el directorio scorm-package
    pause
    exit /b 1
)

REM Crear directorio temporal si no existe
if not exist "temp" mkdir temp

REM Limpiar directorio temporal
del /q temp\* 2>nul

echo Copiando archivos necesarios...

REM Copiar archivos principales
copy index.html temp\
copy style.css temp\
copy app.js temp\
copy scorm-api.js temp\
copy imsmanifest.xml temp\
copy moodle-config.json temp\

REM Copiar directorio de imagenes
if exist "imagenes" (
    if not exist "temp\imagenes" mkdir temp\imagenes
    copy imagenes\* temp\imagenes\
    echo Imagenes copiadas
) else (
    echo ADVERTENCIA: No se encontro el directorio imagenes
)

echo.
echo Validando estructura SCORM...

REM Verificar archivos obligatorios
if not exist "temp\imsmanifest.xml" (
    echo ERROR: imsmanifest.xml no encontrado
    pause
    exit /b 1
)

if not exist "temp\index.html" (
    echo ERROR: index.html no encontrado  
    pause
    exit /b 1
)

echo Estructura SCORM validada correctamente

echo.
echo Creando archivo ZIP para Moodle...

REM Crear ZIP usando PowerShell (disponible en Windows 10+)
powershell -Command "Compress-Archive -Path 'temp\*' -DestinationPath 'Coltefinanciera-SAC-2025-2-Moodle.zip' -Force"

if exist "Coltefinanciera-SAC-2025-2-Moodle.zip" (
    echo.
    echo =====================================
    echo  EMPAQUETADO COMPLETADO EXITOSAMENTE
    echo =====================================
    echo.
    echo Archivo creado: Coltefinanciera-SAC-2025-2-Moodle.zip
    echo.
    echo INSTRUCCIONES PARA MOODLE:
    echo 1. Ir a su curso en Moodle
    echo 2. Activar edicion
    echo 3. Anadir actividad ^> Paquete SCORM
    echo 4. Subir: Coltefinanciera-SAC-2025-2-Moodle.zip
    echo 5. Configurar segun README-MOODLE.md
    echo.
    echo Tamano del archivo:
    dir "Coltefinanciera-SAC-2025-2-Moodle.zip" | find "Coltefinanciera-SAC-2025-2-Moodle.zip"
    echo.
) else (
    echo ERROR: No se pudo crear el archivo ZIP
    echo Verifique que PowerShell este disponible
    pause
    exit /b 1
)

REM Limpiar archivos temporales
echo Limpiando archivos temporales...
rmdir /s /q temp

echo.
echo PROCESO COMPLETADO
echo El paquete SCORM esta listo para subir a Moodle
echo.
pause