// Coltefinanciera Training Presentation App with SCORM Integration
class PresentationApp {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 9;
        this.slideTimers = {
            1: "0:10", 2: "0:25", 3: "0:30", 4: "0:25", 5: "0:30",
            6: "0:35", 7: "0:25", 8: "0:25", 9: "0:30"
        };
        
        // DOM elements cache
        this.elements = {};
        this.isInitialized = false;
        
        // SCORM Integration
        this.scormAPI = null;
        this.visitedSlides = new Set();
        this.startTime = null;
        
        this.init();
    }

    init() {
        this.initSCORM();
        this.bindEvents();
        this.updateDisplay();
        this.showSlide(1);
        this.startTime = new Date();
    }

    /**
     * Inicializa la integración SCORM
     */
    initSCORM() {
        // Esperar a que la API SCORM esté disponible
        setTimeout(() => {
            if (window.scormAPI) {
                this.scormAPI = window.scormAPI;
                console.log('SCORM API integrada exitosamente');
                
                // Verificar estado inicial
                const status = this.scormAPI.getStatus();
                console.log('Estado SCORM inicial:', status);
                
                // Si ya está completado, mostrar mensaje
                if (status.lessonStatus === 'passed' || status.lessonStatus === 'completed') {
                    this.showCompletionMessage();
                }
            } else {
                console.log('Funcionando en modo standalone (sin SCORM)');
            }
        }, 1000);
    }

    /**
     * Actualiza el progreso en SCORM
     */
    updateSCORMProgress() {
        if (!this.scormAPI) return;
        
        // Marcar slide como visitado
        this.visitedSlides.add(this.currentSlide);
        
        // Calcular progreso basado en slides visitados
        const progressPercent = (this.visitedSlides.size / this.totalSlides) * 100;
        
        // Enviar progreso al LMS
        this.scormAPI.setProgress(progressPercent);
        
        console.log(`Progreso SCORM: ${progressPercent.toFixed(1)}% (${this.visitedSlides.size}/${this.totalSlides} módulos)`);
        
        // Si visitó todos los slides, marcar como completado
        if (this.visitedSlides.size >= this.totalSlides) {
            this.scormAPI.setStatus('completed');
            this.showCompletionInfo();
        }
    }

    /**
     * Muestra mensaje de finalización
     */
    showCompletionMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-success);
            color: var(--color-white);
            padding: var(--space-16);
            border-radius: var(--radius-base);
            z-index: 9999;
            font-weight: bold;
        `;
        message.textContent = '✅ Capacitación ya completada';
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    /**
     * Muestra información de finalización en el último módulo
     */
    showCompletionInfo() {
        const completionDate = document.getElementById('completionDate');
        const totalTime = document.getElementById('totalTime');
        
        if (completionDate) {
            completionDate.textContent = new Date().toLocaleDateString('es-ES');
        }
        
        if (totalTime && this.startTime) {
            const duration = new Date() - this.startTime;
            const minutes = Math.floor(duration / (1000 * 60));
            const seconds = Math.floor((duration % (1000 * 60)) / 1000);
            totalTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    bindEvents() {
        // Navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const restartBtn = document.getElementById('restartBtn');

        prevBtn.addEventListener('click', () => this.previousSlide());
        nextBtn.addEventListener('click', () => this.nextSlide());
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restartPresentation());
        }

        // Slide navigation buttons
        const slideButtons = document.querySelectorAll('.slide-btn');
        slideButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const slideNum = parseInt(e.target.dataset.slide);
                this.goToSlide(slideNum);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides);
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.restartPresentation();
                    break;
            }
        });

        // Add hover effects to interactive elements
        this.addHoverEffects();
        
        // Initialize smart tooltip positioning
        this.initSmartTooltips();
        
        // Initialize HTML tooltips
        this.initHTMLTooltips();
    }

    addHoverEffects() {
        // Add hover effects to point items
        const pointItems = document.querySelectorAll('.point-item');
        pointItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-4px) scale(1.02)';
                item.style.boxShadow = '0 10px 25px rgba(255, 215, 0, 0.2)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
                item.style.boxShadow = '';
            });
        });

        // Add hover effects to step items
        const stepItems = document.querySelectorAll('.step-item');
        stepItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateX(5px)';
                item.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.15)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateX(0)';
                item.style.boxShadow = '';
            });
        });

        // Add hover effects to checklist items
        const checklistItems = document.querySelectorAll('.checklist-item');
        checklistItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'scale(1.02)';
                item.style.borderColor = 'var(--color-coltefinanciera-gold)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'scale(1)';
                item.style.borderColor = '';
            });
        });

        // Add hover effects to law cards
        const lawCards = document.querySelectorAll('.law-card');
        lawCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-2px)';
                card.style.boxShadow = '0 8px 20px rgba(0, 51, 102, 0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '';
            });
        });

        // Add hover effects to commitment cards
        const commitmentCards = document.querySelectorAll('.commitment-card');
        commitmentCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'scale(1.03)';
                card.style.boxShadow = '0 8px 25px rgba(0, 51, 102, 0.2)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'scale(1)';
                card.style.boxShadow = '';
            });
        });
    }

    initSmartTooltips() {
        const tooltipItems = document.querySelectorAll('.tooltip-item');
        
        tooltipItems.forEach((item, index) => {
            // Create unique tooltip ID for aria-describedby
            const tooltipId = item.getAttribute('aria-describedby') || `tooltip-${index}`;
            item.setAttribute('aria-describedby', tooltipId);
            
            // Mouse events
            item.addEventListener('mouseenter', () => {
                this.positionTooltip(item);
                item.setAttribute('aria-expanded', 'true');
            });
            
            item.addEventListener('mouseleave', () => {
                // Clean up positioning classes when not hovering
                item.classList.remove('tooltip-left', 'tooltip-right');
                item.setAttribute('aria-expanded', 'false');
            });
            
            // Keyboard events for accessibility
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.positionTooltip(item);
                    item.setAttribute('aria-expanded', 'true');
                } else if (e.key === 'Escape') {
                    item.classList.remove('tooltip-left', 'tooltip-right', 'tooltip-top', 'tooltip-bottom');
                    item.setAttribute('aria-expanded', 'false');
                    item.blur();
                }
            });
            
            item.addEventListener('blur', () => {
                // Delay to allow for focus transitions
                setTimeout(() => {
                    if (!item.matches(':focus-within')) {
                        item.classList.remove('tooltip-left', 'tooltip-right', 'tooltip-top', 'tooltip-bottom');
                        item.setAttribute('aria-expanded', 'false');
                    }
                }, 100);
            });
            
            // Initialize aria-expanded
        item.setAttribute('aria-expanded', 'false');
        
        // Mobile touch/click handling for accordion behavior
        item.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                
                // Close other expanded tooltips on mobile
                tooltipItems.forEach(otherItem => {
                    if (otherItem !== this) {
                        otherItem.classList.remove('mobile-expanded');
                        otherItem.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Toggle current tooltip
                const isExpanded = this.classList.contains('mobile-expanded');
                if (isExpanded) {
                    this.classList.remove('mobile-expanded');
                    this.setAttribute('aria-expanded', 'false');
                } else {
                    this.classList.add('mobile-expanded');
                    this.setAttribute('aria-expanded', 'true');
                }
            } else {
                // En desktop, prevenir cualquier comportamiento de click
                // Solo permitir hover para mostrar tooltips
                e.preventDefault();
                e.stopPropagation();
            }
        });
    });
    
    // Handle window resize to clean up mobile states
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            tooltipItems.forEach(item => {
                item.classList.remove('mobile-expanded');
            });
        }
    });
        
        // Reposition tooltips on window resize with debouncing
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Only reposition if window size changed significantly
                tooltipItems.forEach(item => {
                    if (item.matches(':hover')) {
                        // Remove existing classes first to avoid conflicts
                        item.classList.remove('tooltip-left', 'tooltip-right');
                        setTimeout(() => this.positionTooltip(item), 10);
                    }
                });
            }, 150);
        });
        
        // Inicializar tooltips con contenido HTML
        this.initHTMLTooltips();
    }
    
    initHTMLTooltips() {
        const htmlTooltips = document.querySelectorAll('.tooltip-text[data-tooltip-html="true"]');
        
        htmlTooltips.forEach((tooltip, index) => {
            const tooltipContent = tooltip.querySelector('.tooltip-content');
            if (!tooltipContent) return;
            
            // Crear ID único para accesibilidad
            const tooltipId = `html-tooltip-${index}`;
            tooltip.setAttribute('aria-describedby', tooltipId);
            tooltipContent.setAttribute('id', tooltipId);
            tooltipContent.setAttribute('role', 'tooltip');
            
            // Eventos de mouse
            tooltip.addEventListener('mouseenter', () => {
                this.positionHTMLTooltip(tooltip, tooltipContent);
                tooltip.setAttribute('aria-expanded', 'true');
            });
            
            tooltip.addEventListener('mouseleave', () => {
                tooltipContent.classList.remove('tooltip-left', 'tooltip-right', 'tooltip-top', 'tooltip-bottom');
                tooltip.setAttribute('aria-expanded', 'false');
            });
            
            // Eventos de teclado para accesibilidad
            tooltip.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.positionHTMLTooltip(tooltip, tooltipContent);
                    tooltip.setAttribute('aria-expanded', 'true');
                } else if (e.key === 'Escape') {
                    tooltipContent.classList.remove('tooltip-left', 'tooltip-right', 'tooltip-top', 'tooltip-bottom');
                    tooltip.setAttribute('aria-expanded', 'false');
                    tooltip.blur();
                }
            });
            
            // Manejo móvil
            tooltip.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Cerrar otros tooltips HTML expandidos
                    htmlTooltips.forEach(otherTooltip => {
                        if (otherTooltip !== this) {
                            const otherContent = otherTooltip.querySelector('.tooltip-content');
                            if (otherContent) {
                                otherContent.classList.remove('mobile-expanded');
                                otherTooltip.setAttribute('aria-expanded', 'false');
                            }
                        }
                    });
                    
                    // Toggle tooltip actual
                    const isExpanded = tooltipContent.classList.contains('mobile-expanded');
                    if (isExpanded) {
                        tooltipContent.classList.remove('mobile-expanded');
                        this.setAttribute('aria-expanded', 'false');
                    } else {
                        tooltipContent.classList.add('mobile-expanded');
                        this.setAttribute('aria-expanded', 'true');
                    }
                } else {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
            
            // Inicializar estado
            tooltip.setAttribute('aria-expanded', 'false');
        });
        
        // Limpiar estados móviles en redimensionamiento
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                htmlTooltips.forEach(tooltip => {
                    const content = tooltip.querySelector('.tooltip-content');
                    if (content) {
                        content.classList.remove('mobile-expanded');
                    }
                });
            }
        });
    }
    
    positionHTMLTooltip(tooltip, tooltipContent) {
        const rect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Remover clases de posicionamiento previas
        tooltipContent.classList.remove('tooltip-left', 'tooltip-right', 'tooltip-top', 'tooltip-bottom');
        
        // Determinar posición horizontal
        const tooltipWidth = 320; // Ancho máximo estimado
        const spaceLeft = rect.left;
        const spaceRight = viewportWidth - rect.right;
        
        if (spaceLeft < tooltipWidth / 2 && spaceRight > tooltipWidth) {
            tooltipContent.classList.add('tooltip-right');
        } else if (spaceRight < tooltipWidth / 2 && spaceLeft > tooltipWidth) {
            tooltipContent.classList.add('tooltip-left');
        }
        
        // Determinar posición vertical
        const spaceAbove = rect.top;
        const spaceBelow = viewportHeight - rect.bottom;
        
        if (spaceAbove < 150 && spaceBelow > 150) {
            tooltipContent.classList.add('tooltip-bottom');
        } else if (spaceBelow < 150 && spaceAbove > 150) {
            tooltipContent.classList.add('tooltip-top');
        }
    }

    positionTooltip(tooltipItem) {
        // Prevent multiple rapid calls
        if (tooltipItem.dataset.positioning) return;
        tooltipItem.dataset.positioning = 'true';
        
        // Get element and viewport dimensions
        const rect = tooltipItem.getBoundingClientRect();
        const tooltipWidth = 280;
        const tooltipHeight = 120; // Estimated tooltip height
        const offset = 12;
        const margin = 20;
        
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        // Calculate available space in each direction
        const space = {
            right: viewport.width - rect.right - margin,
            left: rect.left - margin,
            top: rect.top - margin,
            bottom: viewport.height - rect.bottom - margin
        };
        
        // Remove all positioning classes
        tooltipItem.classList.remove('tooltip-left', 'tooltip-right', 'tooltip-top', 'tooltip-bottom');
        
        // Determine best position based on available space
        if (space.right >= tooltipWidth) {
            tooltipItem.classList.add('tooltip-right');
        } else if (space.left >= tooltipWidth) {
            tooltipItem.classList.add('tooltip-left');
        } else if (space.bottom >= tooltipHeight) {
            tooltipItem.classList.add('tooltip-bottom');
        } else if (space.top >= tooltipHeight) {
            tooltipItem.classList.add('tooltip-top');
        } else {
            // Fallback to right if no space is adequate
            tooltipItem.classList.add('tooltip-right');
        }
        
        // Clean up positioning flag
        setTimeout(() => {
            delete tooltipItem.dataset.positioning;
        }, 50);
    }

    showSlide(slideNum) {
        // Hide all slides
        const slides = document.querySelectorAll('.slide');
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Show target slide
        const targetSlide = document.getElementById(`slide-${slideNum}`);
        if (targetSlide) {
            // Add a small delay for smooth transition
            setTimeout(() => {
                targetSlide.classList.add('active');
                this.animateSlideContent(slideNum);
            }, 100);
        }

        this.currentSlide = slideNum;
        this.updateDisplay();
        
        // Actualizar progreso SCORM
        this.updateSCORMProgress();
    }

    animateSlideContent(slideNum) {
        const slide = document.getElementById(`slide-${slideNum}`);
        if (!slide) return;

        // Add different animations based on slide type
        switch(slideNum) {
            case 1:
                this.animateTitleSlide(slide);
                break;
            case 2:
                this.animateComparisonSlide(slide);
                break;
            case 3:
            case 4:
                this.animateProcedureSlide(slide);
                break;
            case 5:
                this.animateRootCauseSlide(slide);
                break;
            case 6:
                this.animateLegalSlide(slide);
                break;
            case 7:
                this.animateCommitmentSlide(slide);
                break;
            case 8:
            case 9:
                this.animateToolsSlide(slide);
                break;
            case 10:
                this.animateFinalSlide(slide);
                break;
            default:
                this.animateDefaultSlide(slide);
        }
    }

    animateTitleSlide(slide) {
        const logo = slide.querySelector('.company-logo h1');
        const accent = slide.querySelector('.logo-accent');
        const title = slide.querySelector('.title-content h2');
        const subtitle = slide.querySelector('.title-content h3');
        const tagline = slide.querySelector('.tagline');
        const intro = slide.querySelector('.intro-message');

        if (logo) {
            logo.style.opacity = '0';
            logo.style.transform = 'scale(0.8)';
            setTimeout(() => {
                logo.style.transition = 'all 0.6s ease-out';
                logo.style.opacity = '1';
                logo.style.transform = 'scale(1)';
            }, 200);
        }

        if (accent) {
            accent.style.width = '0';
            setTimeout(() => {
                accent.style.transition = 'width 0.8s ease-out';
                accent.style.width = '200px';
            }, 600);
        }

        [title, subtitle, tagline, intro].forEach((element, index) => {
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    element.style.transition = 'all 0.5s ease-out';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 800 + (index * 200));
            }
        });
    }

    animateComparisonSlide(slide) {
        const beforeSide = slide.querySelector('.before');
        const afterSide = slide.querySelector('.after');
        const arrow = slide.querySelector('.comparison-arrow');
        const implementationNote = slide.querySelector('.implementation-note');

        // Alert box animation removed - element no longer exists

        if (beforeSide) {
            beforeSide.style.opacity = '0';
            beforeSide.style.transform = 'translateX(-30px)';
            setTimeout(() => {
                beforeSide.style.transition = 'all 0.5s ease-out';
                beforeSide.style.opacity = '1';
                beforeSide.style.transform = 'translateX(0)';
            }, 400);
        }

        if (arrow) {
            arrow.style.opacity = '0';
            arrow.style.transform = 'scale(0.5)';
            setTimeout(() => {
                arrow.style.transition = 'all 0.4s ease-out';
                arrow.style.opacity = '1';
                arrow.style.transform = 'scale(1)';
            }, 700);
        }

        if (afterSide) {
            afterSide.style.opacity = '0';
            afterSide.style.transform = 'translateX(30px)';
            setTimeout(() => {
                afterSide.style.transition = 'all 0.5s ease-out';
                afterSide.style.opacity = '1';
                afterSide.style.transform = 'translateX(0)';
            }, 900);
        }

        if (implementationNote) {
            implementationNote.style.opacity = '0';
            implementationNote.style.transform = 'translateY(20px)';
            setTimeout(() => {
                implementationNote.style.transition = 'all 0.5s ease-out';
                implementationNote.style.opacity = '1';
                implementationNote.style.transform = 'translateY(0)';
            }, 1200);
        }
    }

    animateProcedureSlide(slide) {
        const steps = slide.querySelectorAll('.step-item');
        const consequencesSection = slide.querySelector('.consequences-section');
        const standards = slide.querySelectorAll('.standard-item');

        steps.forEach((step, index) => {
            step.style.opacity = '0';
            step.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                step.style.transition = 'all 0.3s ease-out';
                step.style.opacity = '1';
                step.style.transform = 'translateX(0)';
            }, index * 150);
        });

        if (consequencesSection) {
            consequencesSection.style.opacity = '0';
            consequencesSection.style.transform = 'translateY(20px)';
            setTimeout(() => {
                consequencesSection.style.transition = 'all 0.5s ease-out';
                consequencesSection.style.opacity = '1';
                consequencesSection.style.transform = 'translateY(0)';
            }, steps.length * 150 + 300);
        }

        standards.forEach((standard, index) => {
            standard.style.opacity = '0';
            standard.style.transform = 'translateY(20px)';
            setTimeout(() => {
                standard.style.transition = 'all 0.4s ease-out';
                standard.style.opacity = '1';
                standard.style.transform = 'translateY(0)';
            }, index * 200 + 300);
        });
    }

    animateRootCauseSlide(slide) {
        const questions = slide.querySelectorAll('.question-item');
        const exampleCase = slide.querySelector('.example-case');
        const analysisSteps = slide.querySelectorAll('.analysis-step');

        questions.forEach((question, index) => {
            question.style.opacity = '0';
            question.style.transform = 'scale(0.9)';
            setTimeout(() => {
                question.style.transition = 'all 0.4s ease-out';
                question.style.opacity = '1';
                question.style.transform = 'scale(1)';
            }, index * 200);
        });

        if (exampleCase) {
            exampleCase.style.opacity = '0';
            exampleCase.style.transform = 'translateY(30px)';
            setTimeout(() => {
                exampleCase.style.transition = 'all 0.5s ease-out';
                exampleCase.style.opacity = '1';
                exampleCase.style.transform = 'translateY(0)';
            }, questions.length * 200 + 300);
        }

        analysisSteps.forEach((step, index) => {
            step.style.opacity = '0';
            step.style.transform = 'translateX(-15px)';
            setTimeout(() => {
                step.style.transition = 'all 0.3s ease-out';
                step.style.opacity = '1';
                step.style.transform = 'translateX(0)';
            }, questions.length * 200 + 500 + (index * 150));
        });
    }

    animateLegalSlide(slide) {
        const lawCards = slide.querySelectorAll('.law-card');
        
        lawCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.transition = 'all 0.4s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }

    animateCommitmentSlide(slide) {
        const commitmentCards = slide.querySelectorAll('.commitment-card');
        
        commitmentCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            setTimeout(() => {
                card.style.transition = 'all 0.4s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, index * 200);
        });
    }

    animateToolsSlide(slide) {
        const toolSections = slide.querySelectorAll('.tool-section, .attention-item');
        
        toolSections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                section.style.transition = 'all 0.4s ease-out';
                section.style.opacity = '1';
                section.style.transform = 'translateX(0)';
            }, index * 250);
        });
    }

    animateFinalSlide(slide) {
        const checklistItems = slide.querySelectorAll('.checklist-item');
        const messageBox = slide.querySelector('.message-box');
        const completionInfo = slide.querySelector('.completion-info');
        const restartSection = slide.querySelector('.restart-section');

        checklistItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease-out';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
                
                // Add a small bounce effect to the checkmark
                const checkmark = item.querySelector('.check');
                if (checkmark) {
                    setTimeout(() => {
                        checkmark.style.transform = 'scale(1.3)';
                        setTimeout(() => {
                            checkmark.style.transition = 'transform 0.2s ease-out';
                            checkmark.style.transform = 'scale(1)';
                        }, 100);
                    }, 200);
                }
            }, index * 120);
        });

        [messageBox, completionInfo, restartSection].forEach((element, index) => {
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    element.style.transition = 'all 0.5s ease-out';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, checklistItems.length * 120 + 300 + (index * 200));
            }
        });

        // Mostrar información de finalización
        setTimeout(() => {
            this.showCompletionInfo();
        }, checklistItems.length * 120 + 800);
    }

    animateDefaultSlide(slide) {
        const animatableElements = slide.querySelectorAll('h2, h3, .commitment-item, .norm-item, .question-item, .analysis-item');
        animatableElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            setTimeout(() => {
                element.style.transition = 'all 0.4s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.showSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 1) {
            this.showSlide(this.currentSlide - 1);
        }
    }

    goToSlide(slideNum) {
        if (slideNum >= 1 && slideNum <= this.totalSlides) {
            this.showSlide(slideNum);
        }
    }

    updateDisplay() {
        // Update current slide indicator
        const currentSlideElement = document.getElementById('currentSlide');
        if (currentSlideElement) {
            currentSlideElement.textContent = `Módulo ${this.currentSlide} de ${this.totalSlides}`;
        }

        // Update timer
        const timerElement = document.getElementById('timer');
        if (timerElement && this.slideTimers[this.currentSlide]) {
            timerElement.textContent = `Timer: ${this.slideTimers[this.currentSlide]}`;
        }

        // Update progress bar
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            const progress = (this.currentSlide / this.totalSlides) * 100;
            progressFill.style.width = `${progress}%`;
        }

        // Update navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentSlide === 1;
            prevBtn.style.opacity = this.currentSlide === 1 ? '0.5' : '1';
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentSlide === this.totalSlides;
            nextBtn.style.opacity = this.currentSlide === this.totalSlides ? '0.5' : '1';
        }

        // Update slide navigation buttons
        const slideButtons = document.querySelectorAll('.slide-btn');
        slideButtons.forEach((btn, index) => {
            btn.classList.toggle('active', index + 1 === this.currentSlide);
        });
    }

    restartPresentation() {
        this.currentSlide = 1;
        this.visitedSlides.clear();
        this.startTime = new Date();
        this.showSlide(1);
        
        // Reset SCORM if available
        if (this.scormAPI) {
            this.scormAPI.setProgress(0);
            this.scormAPI.setStatus('incomplete');
        }
        
        console.log('Presentación reiniciada');
    }
}

// Clase para manejar el carrusel
class Carousel {
    constructor(container) {
        this.container = container;
        this.slides = container.querySelector('.carousel-slides');
        this.slideElements = container.querySelectorAll('.carousel-slide');
        this.prevBtn = container.querySelector('.carousel-btn-prev');
        this.nextBtn = container.querySelector('.carousel-btn-next');
        this.indicators = container.querySelectorAll('.indicator');
        this.currentSlide = 0;
        this.totalSlides = this.slideElements.length;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateCarousel();
    }
    
    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
    }
    
    prevSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.updateCarousel();
    }
    
    nextSlide() {
        this.currentSlide = this.currentSlide === this.totalSlides - 1 ? 0 : this.currentSlide + 1;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }
    
    updateCarousel() {
        const translateX = -this.currentSlide * 100;
        this.slides.style.transform = `translateX(${translateX}%)`;
        
        // Actualizar indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.presentationApp = new PresentationApp();
    
    // Inicializar carrusel
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        new Carousel(carouselContainer);
    }
    
    // Initialize image modal
    const imageModal = new ImageModal();
});

// Image Modal Class
class ImageModal {
    constructor() {
        this.modal = document.getElementById('imageModal');
        this.modalImage = document.getElementById('modalImage');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalText = document.getElementById('modalText');
        this.modalClose = document.getElementById('modalClose');
        this.modalOverlay = this.modal.querySelector('.modal-overlay');
        
        this.bindEvents();
    }
    
    bindEvents() {
        // Add click event to all fraud images
        const fraudImages = document.querySelectorAll('.fraud-image img');
        fraudImages.forEach(img => {
            img.addEventListener('click', (e) => {
                this.openModal(e.target);
            });
        });
        
        // Close modal events
        this.modalClose.addEventListener('click', () => {
            this.closeModal();
        });
        
        this.modalOverlay.addEventListener('click', () => {
            this.closeModal();
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.closeModal();
            }
        });
    }
    
    openModal(imgElement) {
        // Get image source and alt text
        const imgSrc = imgElement.src;
        const imgAlt = imgElement.alt;
        
        // Get the fraud card content
        const fraudCard = imgElement.closest('.fraud-card');
        const title = fraudCard.querySelector('h5').textContent;
        const description = fraudCard.querySelector('p').textContent;
        
        // Set modal content
        this.modalImage.src = imgSrc;
        this.modalImage.alt = imgAlt;
        this.modalTitle.textContent = title;
        this.modalText.textContent = description;
        
        // Show modal with animation
        this.modal.style.display = 'flex';
        setTimeout(() => {
            this.modal.classList.add('show');
        }, 10);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.remove('show');
        
        setTimeout(() => {
            this.modal.style.display = 'none';
            // Restore body scroll
            document.body.style.overflow = '';
        }, 300);
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PresentationApp;
}