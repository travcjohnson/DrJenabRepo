// Performance-optimized Particle System with object pooling
class ParticleSystem {
    constructor() {
        this.container = document.getElementById('particles');
        this.particles = [];
        this.particlePool = [];
        this.isAnimating = true;
        this.lastFrameTime = 0;
        this.frameInterval = 1000 / 60; // 60 FPS target
        this.maxParticles = window.innerWidth < 768 ? 15 : 30; // Reduced particle count
        this.init();
    }

    init() {
        // Pre-create particle pool for better performance
        this.createParticlePool();
        this.createParticles();
        this.animate();
        
        // Pause animations when page is hidden
        document.addEventListener('visibilitychange', () => {
            this.isAnimating = !document.hidden;
        });
        
        // Optimize for mobile
        this.handleResize();
        window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));
    }

    createParticlePool() {
        // Create a pool of reusable particle elements
        for (let i = 0; i < this.maxParticles * 2; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.willChange = 'transform, opacity';
            particle.style.transform = 'translateZ(0)'; // Force hardware acceleration
            this.particlePool.push(particle);
        }
    }

    getParticleFromPool() {
        return this.particlePool.pop() || this.createNewParticle();
    }

    returnParticleToPool(particle) {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
        particle.style.animation = '';
        this.particlePool.push(particle);
    }

    createNewParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.willChange = 'transform, opacity';
        particle.style.transform = 'translateZ(0)';
        return particle;
    }

    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = this.getParticleFromPool();
        
        const size = Math.random() * 4 + 2;
        const animationDuration = Math.random() * 10 + 15;
        const delay = Math.random() * 15;
        const startX = Math.random() * window.innerWidth;
        
        // Use transform instead of changing left/top for better performance
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.transform = `translateX(${startX}px) translateZ(0)`;
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
        
        // Use more efficient cleanup
        const cleanup = () => {
            const index = this.particles.indexOf(particle);
            if (index > -1) {
                this.particles.splice(index, 1);
                this.returnParticleToPool(particle);
                
                // Only create new particle if we're still under the limit
                if (this.particles.length < this.maxParticles && this.isAnimating) {
                    this.createParticle();
                }
            }
        };
        
        setTimeout(cleanup, (animationDuration + delay) * 1000);
    }

    handleResize() {
        const newMaxParticles = window.innerWidth < 768 ? 15 : 30;
        
        if (newMaxParticles < this.maxParticles) {
            // Remove excess particles
            const excess = this.particles.length - newMaxParticles;
            for (let i = 0; i < excess; i++) {
                const particle = this.particles.pop();
                if (particle) {
                    this.returnParticleToPool(particle);
                }
            }
        }
        
        this.maxParticles = newMaxParticles;
    }

    animate(currentTime = 0) {
        if (!this.isAnimating) {
            requestAnimationFrame((time) => this.animate(time));
            return;
        }
        
        // Throttle to 60 FPS
        if (currentTime - this.lastFrameTime >= this.frameInterval) {
            this.lastFrameTime = currentTime;
            // Particle animations are handled by CSS, just maintain the loop
        }
        
        requestAnimationFrame((time) => this.animate(time));
    }
    
    // Utility function for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Cleanup method for memory management
    destroy() {
        this.isAnimating = false;
        this.particles.forEach(particle => this.returnParticleToPool(particle));
        this.particles = [];
    }
}

// Glass Card Interactions with Performance Optimizations
class GlassEffects {
    constructor() {
        this.cards = document.querySelectorAll('.glass-card');
        this.eventListeners = new Map(); // Track event listeners for cleanup
        this.intersectionObserver = null;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.cards.forEach(card => {
            this.addHoverEffects(card);
            this.addMouseMoveEffect(card);
            this.observeCard(card);
        });
    }

    setupIntersectionObserver() {
        // Only animate cards that are visible
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const card = entry.target;
                if (entry.isIntersecting) {
                    card.style.willChange = 'transform';
                    card.classList.add('visible');
                } else {
                    card.style.willChange = 'auto';
                    card.classList.remove('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
    }

    observeCard(card) {
        if (this.intersectionObserver) {
            this.intersectionObserver.observe(card);
        }
    }

    addHoverEffects(card) {
        const mouseEnterHandler = (e) => {
            if (card.classList.contains('visible')) {
                this.addShimmerEffect(e.target);
            }
        };

        const mouseLeaveHandler = (e) => {
            this.removeShimmerEffect(e.target);
        };

        card.addEventListener('mouseenter', mouseEnterHandler);
        card.addEventListener('mouseleave', mouseLeaveHandler);

        // Store handlers for cleanup
        this.eventListeners.set(card, {
            mouseenter: mouseEnterHandler,
            mouseleave: mouseLeaveHandler
        });
    }

    addMouseMoveEffect(card) {
        let isHovering = false;
        
        // Simplified mouse move handler for better performance
        const throttledMouseMove = this.throttle((e) => {
            if (!isHovering || !card.classList.contains('visible')) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Much more subtle rotation for smoother animation
            const rotateX = (y - centerY) / 80; // Reduced from 40 to 80
            const rotateY = (centerX - x) / 80; // Reduced from 40 to 80
            
            // Simplified transform - no perspective for better performance
            card.style.transform = `translate3d(0, -4px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }, 32); // Reduced to ~30fps for smoother performance
        
        const mouseEnterHandler = () => {
            isHovering = true;
            card.style.willChange = 'transform';
        };
        
        const mouseLeaveHandler = () => {
            isHovering = false;
            card.style.willChange = 'auto';
            
            // Smooth transition back to original state
            card.style.transition = 'transform 0.2s ease-out';
            card.style.transform = 'translate3d(0, 0, 0)';
            
            // Remove transition after animation
            setTimeout(() => {
                card.style.transition = '';
            }, 200);
        };
        
        card.addEventListener('mouseenter', mouseEnterHandler);
        card.addEventListener('mousemove', throttledMouseMove);
        card.addEventListener('mouseleave', mouseLeaveHandler);

        // Store additional handlers for cleanup
        const existingHandlers = this.eventListeners.get(card) || {};
        this.eventListeners.set(card, {
            ...existingHandlers,
            mousemove: throttledMouseMove,
            mouseenterMove: mouseEnterHandler,
            mouseleaveMove: mouseLeaveHandler
        });
    }
    
    // Utility function for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Utility function for throttling - better for mouse events
    throttle(func, wait) {
        let lastTime = 0;
        return function executedFunction(...args) {
            const now = Date.now();
            if (now - lastTime >= wait) {
                func(...args);
                lastTime = now;
            }
        };
    }

    addShimmerEffect(element) {
        // Shimmer effect disabled for performance
        // element.classList.add('shimmer');
    }

    removeShimmerEffect(element) {
        // Shimmer effect disabled for performance
        // element.classList.remove('shimmer');
    }

    // Cleanup method for memory management
    destroy() {
        // Clean up intersection observer
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
            this.intersectionObserver = null;
        }

        // Remove all event listeners
        this.eventListeners.forEach((handlers, card) => {
            Object.entries(handlers).forEach(([event, handler]) => {
                if (event === 'mouseenterMove' || event === 'mouseleaveMove') {
                    // These are special handlers for mouse move effects
                    card.removeEventListener(event.replace('Move', ''), handler);
                } else {
                    card.removeEventListener(event, handler);
                }
            });
        });

        this.eventListeners.clear();
    }
}

// Page Transitions
class PageTransitions {
    constructor() {
        this.overlay = this.createOverlay();
        this.currentPage = 'home';
        this.init();
    }

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'page-transition';
        document.body.appendChild(overlay);
        return overlay;
    }

    init() {
        this.bindNavigationEvents();
    }

    bindNavigationEvents() {
        const navCards = document.querySelectorAll('.nav-card');
        navCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const page = e.currentTarget.getAttribute('data-page');
                const color = e.currentTarget.getAttribute('data-color');
                this.transitionToPage(page, color, e.currentTarget);
            });
        });
    }

    async transitionToPage(page, color, clickedCard) {
        // Create particle burst effect
        this.createParticleBurst(clickedCard);
        
        // Activate transition overlay
        this.overlay.style.background = `linear-gradient(135deg, ${color}33, rgba(255, 255, 255, 0.1))`;
        this.overlay.classList.add('active');
        
        // Wait for transition
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Load new page content
        this.loadPageContent(page);
        
        // Deactivate overlay
        setTimeout(() => {
            this.overlay.classList.remove('active');
        }, 300);
    }

    createParticleBurst(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const burst = document.createElement('div');
        burst.className = 'particle-burst';
        burst.style.left = `${centerX}px`;
        burst.style.top = `${centerY}px`;
        document.body.appendChild(burst);
        
        // Create burst particles - reduced count for performance
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'burst-particle';
            
            const angle = (i / 6) * Math.PI * 2;
            const distance = 100 + Math.random() * 50;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;
            
            particle.style.setProperty('--dx', `${dx}px`);
            particle.style.setProperty('--dy', `${dy}px`);
            
            burst.appendChild(particle);
        }
        
        // Remove burst after animation
        setTimeout(() => {
            if (burst.parentNode) {
                burst.parentNode.removeChild(burst);
            }
        }, 800);
    }

    loadPageContent(page) {
        // Store current scroll position
        const scrollPos = window.pageYOffset;
        
        // Load page content based on page parameter
        switch(page) {
            case 'about':
                this.loadAboutPage();
                break;
            case 'services':
                this.loadServicesPage();
                break;
            case 'leadership':
                this.loadLeadershipPage();
                break;
            case 'philosophy':
                this.loadPhilosophyPage();
                break;
            case 'locations':
                this.loadLocationsPage();
                break;
            case 'testimonials':
                this.loadTestimonialsPage();
                break;
            default:
                console.log(`Loading ${page} page...`);
        }
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    loadAboutPage() {
        const container = document.querySelector('.container');
        container.innerHTML = this.getAboutPageContent();
        this.initBackButton();
    }

    loadServicesPage() {
        const container = document.querySelector('.container');
        container.innerHTML = this.getServicesPageContent();
        this.initBackButton();
    }

    loadLeadershipPage() {
        const container = document.querySelector('.container');
        container.innerHTML = this.getLeadershipPageContent();
        this.initBackButton();
    }

    loadPhilosophyPage() {
        const container = document.querySelector('.container');
        container.innerHTML = this.getPhilosophyPageContent();
        this.initBackButton();
    }

    loadLocationsPage() {
        const container = document.querySelector('.container');
        container.innerHTML = this.getLocationsPageContent();
        this.initBackButton();
    }

    loadTestimonialsPage() {
        const container = document.querySelector('.container');
        container.innerHTML = this.getTestimonialsPageContent();
        this.initBackButton();
    }

    initBackButton() {
        const backButton = document.querySelector('.back-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.returnToHome();
            });
        }
        
        // Re-initialize glass effects for new content
        new GlassEffects();
    }

    returnToHome() {
        this.overlay.classList.add('active');
        
        setTimeout(() => {
            location.reload(); // Simple way to return to home page
        }, 300);
    }

    getAboutPageContent() {
        return `
            <div class="particles" id="particles"></div>
            <header class="page-header">
                <div class="glass-card">
                    <button class="back-button glass-button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H6m6-7l-7 7 7 7"/>
                        </svg>
                        Back to Home
                    </button>
                    <h1>About Dr. Arvin Jenab, ND</h1>
                </div>
            </header>
            
            <main class="page-content">
                <div class="glass-card content-card">
                    <div class="profile-section">
                        <h2>Educational Background</h2>
                        <div class="education-grid">
                            <div class="education-item">
                                <h3>Doctor of Naturopathic Medicine</h3>
                                <p>Canadian College of Naturopathic Medicine, Toronto</p>
                            </div>
                            <div class="education-item">
                                <h3>Bachelor of Science</h3>
                                <p>Anatomy and Cell Biology, McGill University, Montreal</p>
                            </div>
                            <div class="education-item">
                                <h3>Integrative Medicine Fellowship</h3>
                                <p>Academy of Integrative Health & Medicine (In Progress)</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="glass-card content-card">
                    <h2>Professional Journey</h2>
                    <p>With over 20 years of experience in naturopathic medicine, Dr. Jenab has emerged as a leading figure in integrative health. His journey began with a strong foundation in anatomy and cell biology from McGill University, followed by comprehensive training in naturopathic medicine.</p>
                    <p>Dr. Jenab's career has been marked by a commitment to advancing integrative medicine through education, clinical practice, and leadership roles. His work spans multiple prestigious institutions including CCNM, Boucher Institute, and Bastyr University.</p>
                </div>
                
                <div class="glass-card content-card">
                    <h2>Current Role at UCI</h2>
                    <p>As Medical Director of Naturopathic Medicine and Director of the ND Residency Program at the Susan Samueli Integrative Health Institute, Dr. Jenab plays a pivotal role in shaping the future of integrative healthcare education and practice.</p>
                </div>
            </main>
        `;
    }

    getServicesPageContent() {
        return `
            <div class="particles" id="particles"></div>
            <header class="page-header">
                <div class="glass-card">
                    <button class="back-button glass-button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H6m6-7l-7 7 7 7"/>
                        </svg>
                        Back to Home
                    </button>
                    <h1>Clinical Specialties & Services</h1>
                </div>
            </header>
            
            <main class="page-content">
                <div class="services-grid">
                    <div class="glass-card service-card">
                        <h3>Chronic Health Conditions</h3>
                        <p>Comprehensive treatment approaches for complex, long-term health challenges using integrative medicine principles.</p>
                    </div>
                    
                    <div class="glass-card service-card">
                        <h3>Digestive Disorders</h3>
                        <p>Specialized care for gastrointestinal health, focusing on root cause identification and holistic treatment.</p>
                    </div>
                    
                    <div class="glass-card service-card">
                        <h3>Mood Disorders</h3>
                        <p>Integrative approach to mental health, combining traditional and naturopathic treatment modalities.</p>
                    </div>
                    
                    <div class="glass-card service-card">
                        <h3>Chronic Fatigue & Fibromyalgia</h3>
                        <p>Specialized treatment protocols for energy disorders and chronic pain management.</p>
                    </div>
                    
                    <div class="glass-card service-card">
                        <h3>Liver & Gallbladder Disorders</h3>
                        <p>Expert care for hepatic health using natural medicine approaches and lifestyle modifications.</p>
                    </div>
                    
                    <div class="glass-card service-card">
                        <h3>Mind-Body Medicine</h3>
                        <p>Exploring the neuro-emotional and psychosocial aspects of health for comprehensive healing.</p>
                    </div>
                </div>
                
                <div class="glass-card content-card">
                    <h2>Treatment Modalities</h2>
                    <div class="modalities-list">
                        <div class="modality">
                            <h4>Diet & Nutrition</h4>
                            <p>Personalized nutritional protocols</p>
                        </div>
                        <div class="modality">
                            <h4>Herbal Medicine</h4>
                            <p>Traditional and evidence-based botanical therapies</p>
                        </div>
                        <div class="modality">
                            <h4>Traditional Chinese Medicine</h4>
                            <p>Acupuncture and TCM principles</p>
                        </div>
                        <div class="modality">
                            <h4>Mind-Body Therapies</h4>
                            <p>Stress reduction and emotional healing techniques</p>
                        </div>
                    </div>
                </div>
            </main>
        `;
    }

    getLeadershipPageContent() {
        return `
            <div class="particles" id="particles"></div>
            <header class="page-header">
                <div class="glass-card">
                    <button class="back-button glass-button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H6m6-7l-7 7 7 7"/>
                        </svg>
                        Back to Home
                    </button>
                    <h1>Leadership & Education</h1>
                </div>
            </header>
            
            <main class="page-content">
                <div class="glass-card content-card">
                    <h2>Current Leadership Roles</h2>
                    <div class="role-item">
                        <h3>Medical Director of Naturopathic Medicine</h3>
                        <p>UCI Susan Samueli Integrative Health Institute</p>
                        <span class="role-description">Leading naturopathic medicine integration within UCI Health's comprehensive healthcare system.</span>
                    </div>
                    
                    <div class="role-item">
                        <h3>Director of ND Residency Program</h3>
                        <p>UCI Susan Samueli Integrative Health Institute</p>
                        <span class="role-description">Developing and overseeing the naturopathic residency program, training the next generation of integrative healthcare providers.</span>
                    </div>
                </div>
                
                <div class="glass-card content-card">
                    <h2>Board Positions & Professional Involvement</h2>
                    <div class="board-positions">
                        <div class="position">
                            <h4>Council for Naturopathic Medical Education</h4>
                            <p>Board of Directors (6 years)</p>
                            <span>Supporting accreditation and advancement efforts in naturopathic medical education.</span>
                        </div>
                    </div>
                    
                    <h3>Professional Associations</h3>
                    <div class="associations">
                        <span class="association-tag">Institute for Natural Medicine (INM)</span>
                        <span class="association-tag">Academy of Integrative Health & Medicine (AIHM)</span>
                        <span class="association-tag">Integrative Medicine for the Underserved (IM4US)</span>
                        <span class="association-tag">UCI Health</span>
                    </div>
                </div>
                
                <div class="glass-card content-card">
                    <h2>Academic Positions</h2>
                    <p>Dr. Jenab has held various academic positions at prestigious institutions:</p>
                    <ul class="institutions-list">
                        <li>Canadian College of Naturopathic Medicine (CCNM)</li>
                        <li>Boucher Institute of Naturopathic Medicine</li>
                        <li>Bastyr University California</li>
                    </ul>
                </div>
            </main>
        `;
    }

    getPhilosophyPageContent() {
        return `
            <div class="particles" id="particles"></div>
            <header class="page-header">
                <div class="glass-card">
                    <button class="back-button glass-button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H6m6-7l-7 7 7 7"/>
                        </svg>
                        Back to Home
                    </button>
                    <h1>Treatment Philosophy</h1>
                </div>
            </header>
            
            <main class="page-content">
                <div class="glass-card content-card">
                    <h2>Integrative Approach to Health</h2>
                    <p class="philosophy-intro">Dr. Jenab believes that an integrative approach to treating chronic illness can significantly enhance patients' care and improve overall health outcomes. His philosophy centers on understanding the body as a complex, interconnected system.</p>
                </div>
                
                <div class="glass-card content-card">
                    <h2>Core Principles</h2>
                    <div class="principles-grid">
                        <div class="principle">
                            <h3>Holistic Systems-Based Approach</h3>
                            <p>Integrating complex systems theory to understand and address disease patterns comprehensively.</p>
                        </div>
                        
                        <div class="principle">
                            <h3>Metabolic Optimization</h3>
                            <p>Finding opportunities to improve health by optimizing how the body works and regulates itself.</p>
                        </div>
                        
                        <div class="principle">
                            <h3>Physiologic Resilience</h3>
                            <p>Facilitating healing through treatments aimed at increasing the body's natural resilience and adaptive capacity.</p>
                        </div>
                        
                        <div class="principle">
                            <h3>Root Cause Focus</h3>
                            <p>Identifying and addressing underlying causes rather than just managing symptoms.</p>
                        </div>
                    </div>
                </div>
                
                <div class="glass-card content-card">
                    <h2>Patient-Centered Care</h2>
                    <p>Dr. Jenab is especially interested in working with patients who are ready to explore the neuro-emotional and psychosocial aspects of their health. This comprehensive approach recognizes that true healing often requires addressing the mental, emotional, and spiritual dimensions of wellness alongside physical symptoms.</p>
                </div>
                
                <div class="glass-card content-card">
                    <h2>Educational Philosophy</h2>
                    <p>With a distinctive perspective on naturopathic education, Dr. Jenab emphasizes the foundational knowledge and skills essential to naturopathic medicine. He advocates for rigorous training that prepares practitioners to think critically and apply naturopathic principles effectively in clinical practice.</p>
                </div>
            </main>
        `;
    }

    getLocationsPageContent() {
        return `
            <div class="particles" id="particles"></div>
            <header class="page-header">
                <div class="glass-card">
                    <button class="back-button glass-button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H6m6-7l-7 7 7 7"/>
                        </svg>
                        Back to Home
                    </button>
                    <h1>Locations & Contact</h1>
                </div>
            </header>
            
            <main class="page-content">
                <div class="locations-grid">
                    <div class="glass-card location-card">
                        <h3>UCI Health - Irvine</h3>
                        <div class="location-details">
                            <p class="address">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                Susan Samueli Integrative Health Institute<br>
                                856 Health Sciences Rd, Suite 2600<br>
                                Irvine, CA 92617
                            </p>
                        </div>
                    </div>
                    
                    <div class="glass-card location-card">
                        <h3>UCI Health - Costa Mesa</h3>
                        <div class="location-details">
                            <p class="address">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                1202 Bristol Street, Floor 2<br>
                                Costa Mesa, CA 92626
                            </p>
                        </div>
                    </div>
                </div>
                
                <div class="glass-card content-card">
                    <h2>Schedule an Appointment</h2>
                    <div class="contact-options">
                        <a href="tel:949-824-7000" class="glass-button large-button">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            Call (949) 824-7000
                        </a>
                        
                        <a href="https://www.ucihealth.org/find-a-doctor/j/arvin-jenab" class="glass-button large-button" target="_blank">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M8 6h13"></path>
                                <path d="M8 12h13"></path>
                                <path d="M8 18h13"></path>
                                <path d="M3 6h.01"></path>
                                <path d="M3 12h.01"></path>
                                <path d="M3 18h.01"></path>
                            </svg>
                            Book Online at UCI Health
                        </a>
                    </div>
                    
                    <div class="services-info">
                        <h3>Available Services</h3>
                        <ul>
                            <li>New patient consultations</li>
                            <li>Follow-up appointments</li>
                            <li>Telehealth consultations</li>
                            <li>Integrative treatment planning</li>
                        </ul>
                        
                        <div class="languages">
                            <h4>Languages Spoken:</h4>
                            <span class="language-tag">English</span>
                            <span class="language-tag">Persian (Farsi)</span>
                        </div>
                    </div>
                </div>
            </main>
        `;
    }

    getTestimonialsPageContent() {
        return `
            <div class="particles" id="particles"></div>
            <header class="page-header">
                <div class="glass-card">
                    <button class="back-button glass-button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H6m6-7l-7 7 7 7"/>
                        </svg>
                        Back to Home
                    </button>
                    <h1>Patient Experience</h1>
                </div>
            </header>
            
            <main class="page-content">
                <div class="glass-card content-card">
                    <div class="rating-overview">
                        <div class="rating-display">
                            <span class="rating-number">4.7</span>
                            <div class="stars">★★★★★</div>
                            <p>Based on 37 patient reviews</p>
                        </div>
                    </div>
                </div>
                
                <div class="glass-card content-card">
                    <h2>What Sets Dr. Jenab Apart</h2>
                    <div class="highlights-grid">
                        <div class="highlight">
                            <h3>Comprehensive Care</h3>
                            <p>Patients appreciate Dr. Jenab's thorough approach to understanding their complete health picture.</p>
                        </div>
                        
                        <div class="highlight">
                            <h3>Collaborative Approach</h3>
                            <p>Works closely with patients to develop personalized treatment plans that fit their lifestyle and goals.</p>
                        </div>
                        
                        <div class="highlight">
                            <h3>Educational Focus</h3>
                            <p>Takes time to educate patients about their conditions and treatment options, empowering informed decisions.</p>
                        </div>
                        
                        <div class="highlight">
                            <h3>Integrative Expertise</h3>
                            <p>Seamlessly blends conventional and naturopathic approaches for optimal patient outcomes.</p>
                        </div>
                    </div>
                </div>
                
                <div class="glass-card content-card">
                    <h2>Patient Care Philosophy</h2>
                    <blockquote class="philosophy-quote">
                        "I believe in treating the whole person, not just the symptoms. Every patient is unique, and their treatment should reflect that individuality. My goal is to empower patients with the knowledge and tools they need to achieve optimal health and wellness."
                    </blockquote>
                    <cite>- Dr. Arvin Jenab, ND</cite>
                </div>
                
                <div class="glass-card content-card">
                    <h2>Ready to Experience Integrative Care?</h2>
                    <p>Dr. Jenab is currently accepting new patients at both UCI Health locations. Telehealth consultations are also available for your convenience.</p>
                    
                    <div class="cta-buttons">
                        <a href="tel:949-824-7000" class="glass-button large-button">
                            Schedule Your Consultation
                        </a>
                    </div>
                </div>
            </main>
        `;
    }
}

// Smooth Scrolling
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Enable smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Responsive Features
class ResponsiveFeatures {
    constructor() {
        this.init();
    }

    init() {
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        // Adjust particle count based on screen size
        const particleContainer = document.getElementById('particles');
        if (particleContainer && window.innerWidth < 768) {
            const particles = particleContainer.querySelectorAll('.particle');
            if (particles.length > 25) {
                for (let i = 25; i < particles.length; i++) {
                    particles[i].remove();
                }
            }
        }
    }
}

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.bindToggleEvent();
    }

    setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    bindToggleEvent() {
        const toggleButton = document.getElementById('themeToggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                this.toggleTheme();
                
                // Add a subtle animation to the button
                toggleButton.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    toggleButton.style.transform = '';
                }, 150);
            });
        }
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;
        this.fpsThreshold = 30; // Below this FPS, reduce effects
        this.init();
    }

    init() {
        this.measureFPS();
        this.setupPerformanceObserver();
    }

    measureFPS() {
        const now = performance.now();
        this.frameCount++;
        
        if (now - this.lastTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
            this.frameCount = 0;
            this.lastTime = now;
            
            // Adjust effects based on performance
            this.adjustPerformance();
        }
        
        requestAnimationFrame(() => this.measureFPS());
    }

    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.entryType === 'measure' && entry.duration > 16) {
                        console.warn(`Slow operation detected: ${entry.name} took ${entry.duration}ms`);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['measure', 'navigation'] });
        }
    }

    adjustPerformance() {
        const body = document.body;
        
        if (this.fps < this.fpsThreshold) {
            body.classList.add('performance-mode');
            // Reduce particle count
            const particles = document.querySelectorAll('.particle');
            particles.forEach((particle, index) => {
                if (index % 2 === 0) {
                    particle.style.display = 'none';
                }
            });
        } else {
            body.classList.remove('performance-mode');
        }
    }
}

// Initialize all systems when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Initialize all components
    const particleSystem = new ParticleSystem();
    const glassEffects = new GlassEffects();
    const pageTransitions = new PageTransitions();
    const smoothScroll = new SmoothScroll();
    const responsiveFeatures = new ResponsiveFeatures();
    const themeManager = new ThemeManager();
    
    // Initialize performance monitor only if not in reduced motion mode
    if (!prefersReducedMotion) {
        new PerformanceMonitor();
    }
    
    // Store instances for cleanup
    window.appInstances = {
        particleSystem,
        glassEffects,
        pageTransitions
    };
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Performance optimizations
window.addEventListener('load', () => {
    // Remove any loading states
    document.body.classList.add('loaded');
});

// Handle page visibility changes for better performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.querySelectorAll('.particle').forEach(particle => {
            particle.style.animationPlayState = 'paused';
        });
        document.body.classList.add('page-hidden');
    } else {
        // Resume animations when page becomes visible
        document.querySelectorAll('.particle').forEach(particle => {
            particle.style.animationPlayState = 'running';
        });
        document.body.classList.remove('page-hidden');
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.appInstances) {
        Object.values(window.appInstances).forEach(instance => {
            if (instance && typeof instance.destroy === 'function') {
                instance.destroy();
            }
        });
    }
});

// Handle browser back/forward
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // Page was restored from cache, reinitialize if needed
        document.body.style.opacity = '1';
    }
});

// Chat functionality
document.addEventListener('DOMContentLoaded', () => {
    const chatCard = document.getElementById('chatCard');
    if (chatCard) {
        chatCard.addEventListener('click', () => {
            alert('Chat feature coming soon! For now, please call (949) 824-7000 or book online for appointments.');
        });
    }
});