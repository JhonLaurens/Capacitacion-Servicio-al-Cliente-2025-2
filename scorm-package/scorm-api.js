/**
 * SCORM API Wrapper for Moodle Integration
 * Coltefinanciera - Capacitación Servicio al Cliente 2025
 * Compatible with SCORM 1.2
 */

class ScormAPI {
    constructor() {
        this.apiHandle = null;
        this.isInitialized = false;
        this.isTerminated = false;
        this.lessonStatus = 'not attempted';
        this.score = 0;
        this.maxScore = 100;
        this.minScore = 0;
        this.completionThreshold = 80;
        this.sessionTime = new Date();
        this.totalTime = 'PT0H0M0S';
        
        // Buscar la API del LMS
        this.findAPI();
    }

    /**
     * Busca la API SCORM en la ventana padre
     */
    findAPI() {
        let api = null;
        let findAPITries = 0;
        const maxTries = 500;
        
        while ((api === null) && (findAPITries < maxTries)) {
            findAPITries++;
            
            // Buscar en la ventana actual
            if (window.API) {
                api = window.API;
                break;
            }
            
            // Buscar en ventana padre
            if (window.parent && window.parent.API) {
                api = window.parent.API;
                break;
            }
            
            // Buscar en ventana superior
            if (window.top && window.top.API) {
                api = window.top.API;
                break;
            }
            
            // Buscar en opener
            if (window.opener && window.opener.API) {
                api = window.opener.API;
                break;
            }
            
            // Buscar recursivamente en ventanas padre
            if (window.parent && window.parent !== window) {
                api = this.findAPIInParent(window.parent, findAPITries);
            }
        }
        
        this.apiHandle = api;
        
        if (api === null) {
            console.warn('SCORM API no encontrada. Funcionando en modo standalone.');
        } else {
            console.log('SCORM API encontrada exitosamente.');
        }
        
        return api;
    }

    /**
     * Busca la API en ventanas padre recursivamente
     */
    findAPIInParent(win, tries) {
        if (tries > 10) return null;
        
        if (win.API) {
            return win.API;
        }
        
        if (win.parent && win.parent !== win) {
            return this.findAPIInParent(win.parent, tries + 1);
        }
        
        return null;
    }

    /**
     * Inicializa la sesión SCORM
     */
    initialize() {
        if (this.isInitialized) {
            console.warn('SCORM ya está inicializado.');
            return true;
        }
        
        if (!this.apiHandle) {
            console.warn('API SCORM no disponible. Continuando en modo standalone.');
            this.isInitialized = true;
            return true;
        }
        
        try {
            const result = this.apiHandle.LMSInitialize('');
            
            if (result === 'true') {
                this.isInitialized = true;
                
                // Obtener datos existentes
                this.lessonStatus = this.getValue('cmi.core.lesson_status') || 'not attempted';
                this.totalTime = this.getValue('cmi.core.total_time') || 'PT0H0M0S';
                
                // Establecer estado inicial si es necesario
                if (this.lessonStatus === 'not attempted') {
                    this.setValue('cmi.core.lesson_status', 'incomplete');
                    this.lessonStatus = 'incomplete';
                }
                
                console.log('SCORM inicializado exitosamente.');
                console.log('Estado de la lección:', this.lessonStatus);
                
                return true;
            } else {
                console.error('Error al inicializar SCORM:', this.getLastError());
                return false;
            }
        } catch (error) {
            console.error('Excepción al inicializar SCORM:', error);
            return false;
        }
    }

    /**
     * Finaliza la sesión SCORM
     */
    terminate() {
        if (this.isTerminated) {
            console.warn('SCORM ya está terminado.');
            return true;
        }
        
        if (!this.apiHandle || !this.isInitialized) {
            console.warn('SCORM no está inicializado.');
            this.isTerminated = true;
            return true;
        }
        
        try {
            // Calcular tiempo de sesión
            this.calculateSessionTime();
            
            // Confirmar datos antes de terminar
            this.commit();
            
            const result = this.apiHandle.LMSFinish('');
            
            if (result === 'true') {
                this.isTerminated = true;
                console.log('SCORM terminado exitosamente.');
                return true;
            } else {
                console.error('Error al terminar SCORM:', this.getLastError());
                return false;
            }
        } catch (error) {
            console.error('Excepción al terminar SCORM:', error);
            return false;
        }
    }

    /**
     * Obtiene un valor del LMS
     */
    getValue(parameter) {
        if (!this.apiHandle || !this.isInitialized) {
            return '';
        }
        
        try {
            const value = this.apiHandle.LMSGetValue(parameter);
            const error = this.apiHandle.LMSGetLastError();
            
            if (error !== '0') {
                console.warn(`Error al obtener ${parameter}:`, this.getErrorString(error));
                return '';
            }
            
            return value;
        } catch (error) {
            console.error(`Excepción al obtener ${parameter}:`, error);
            return '';
        }
    }

    /**
     * Establece un valor en el LMS
     */
    setValue(parameter, value) {
        if (!this.apiHandle || !this.isInitialized) {
            console.log(`Modo standalone - ${parameter}: ${value}`);
            return true;
        }
        
        try {
            const result = this.apiHandle.LMSSetValue(parameter, value.toString());
            const error = this.apiHandle.LMSGetLastError();
            
            if (error !== '0') {
                console.error(`Error al establecer ${parameter}:`, this.getErrorString(error));
                return false;
            }
            
            console.log(`SCORM - ${parameter}: ${value}`);
            return result === 'true';
        } catch (error) {
            console.error(`Excepción al establecer ${parameter}:`, error);
            return false;
        }
    }

    /**
     * Confirma los datos en el LMS
     */
    commit() {
        if (!this.apiHandle || !this.isInitialized) {
            return true;
        }
        
        try {
            const result = this.apiHandle.LMSCommit('');
            
            if (result === 'true') {
                console.log('Datos confirmados en el LMS.');
                return true;
            } else {
                console.error('Error al confirmar datos:', this.getLastError());
                return false;
            }
        } catch (error) {
            console.error('Excepción al confirmar datos:', error);
            return false;
        }
    }

    /**
     * Establece el progreso del estudiante
     */
    setProgress(progressPercent) {
        if (progressPercent < 0 || progressPercent > 100) {
            console.warn('El progreso debe estar entre 0 y 100.');
            return false;
        }
        
        // Actualizar progreso
        this.setValue('cmi.core.lesson_location', progressPercent.toString());
        this.setValue('cmi.progress_measure', (progressPercent / 100).toString());
        
        // Si el progreso es 100%, marcar como completado
        if (progressPercent >= 100) {
            this.setStatus('completed');
        } else if (progressPercent > 0) {
            this.setStatus('incomplete');
        }
        
        this.commit();
        return true;
    }

    /**
     * Establece la puntuación del estudiante
     */
    setScore(score, maxScore = 100, minScore = 0) {
        this.score = Math.max(minScore, Math.min(maxScore, score));
        this.maxScore = maxScore;
        this.minScore = minScore;
        
        this.setValue('cmi.core.score.raw', this.score);
        this.setValue('cmi.core.score.max', this.maxScore);
        this.setValue('cmi.core.score.min', this.minScore);
        
        // Determinar si pasó o falló
        const passed = this.score >= this.completionThreshold;
        this.setValue('cmi.core.lesson_status', passed ? 'passed' : 'failed');
        this.lessonStatus = passed ? 'passed' : 'failed';
        
        console.log(`Puntuación establecida: ${this.score}/${this.maxScore} - ${passed ? 'APROBADO' : 'REPROBADO'}`);
        
        this.commit();
        return true;
    }

    /**
     * Establece el estado de la lección
     */
    setStatus(status) {
        const validStatuses = ['passed', 'completed', 'failed', 'incomplete', 'browsed', 'not attempted'];
        
        if (!validStatuses.includes(status)) {
            console.warn('Estado inválido:', status);
            return false;
        }
        
        this.lessonStatus = status;
        this.setValue('cmi.core.lesson_status', status);
        
        console.log('Estado de lección actualizado:', status);
        return true;
    }

    /**
     * Calcula el tiempo de sesión
     */
    calculateSessionTime() {
        const now = new Date();
        const sessionDuration = now - this.sessionTime;
        
        const hours = Math.floor(sessionDuration / (1000 * 60 * 60));
        const minutes = Math.floor((sessionDuration % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((sessionDuration % (1000 * 60)) / 1000);
        
        const sessionTimeString = `PT${hours}H${minutes}M${seconds}S`;
        
        this.setValue('cmi.core.session_time', sessionTimeString);
        
        console.log('Tiempo de sesión:', sessionTimeString);
    }

    /**
     * Obtiene el último error
     */
    getLastError() {
        if (!this.apiHandle) {
            return '0';
        }
        
        try {
            return this.apiHandle.LMSGetLastError();
        } catch (error) {
            console.error('Error al obtener último error:', error);
            return '101';
        }
    }

    /**
     * Obtiene la descripción del error
     */
    getErrorString(errorCode) {
        if (!this.apiHandle) {
            return 'API no disponible';
        }
        
        try {
            return this.apiHandle.LMSGetErrorString(errorCode);
        } catch (error) {
            console.error('Error al obtener descripción del error:', error);
            return 'Error desconocido';
        }
    }

    /**
     * Obtiene información diagnóstica del error
     */
    getDiagnostic(errorCode) {
        if (!this.apiHandle) {
            return 'API no disponible';
        }
        
        try {
            return this.apiHandle.LMSGetDiagnostic(errorCode);
        } catch (error) {
            console.error('Error al obtener diagnóstico:', error);
            return 'Diagnóstico no disponible';
        }
    }

    /**
     * Verifica si SCORM está disponible
     */
    isAvailable() {
        return this.apiHandle !== null;
    }

    /**
     * Obtiene el estado actual
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            isTerminated: this.isTerminated,
            lessonStatus: this.lessonStatus,
            score: this.score,
            maxScore: this.maxScore,
            isAvailable: this.isAvailable()
        };
    }
}

// Crear instancia global
window.scormAPI = new ScormAPI();

// Inicializar automáticamente cuando se carga la página
window.addEventListener('load', () => {
    window.scormAPI.initialize();
});

// Terminar automáticamente cuando se cierra la página
window.addEventListener('beforeunload', () => {
    window.scormAPI.terminate();
});

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScormAPI;
}