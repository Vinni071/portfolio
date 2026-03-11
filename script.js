document.addEventListener('DOMContentLoaded', () => {
    
    /* === Custom Cursor Logic === */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice && cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Immediate position for dot
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Slightly delayed animation for outline
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Add hover effect to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .skill-card, .project-card');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering');
            });
        });
    } else {
        // Hide custom cursor on mobile/touch devices
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorOutline) cursorOutline.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

    /* === Header Scroll Effect === */
    const header = document.querySelector('.header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on load

    /* === Mobile Menu Logic === */
    const hamburger = document.querySelector('.hamburger');
    const navWrapper = document.querySelector('.nav-wrapper');
    const navLinksList = document.querySelectorAll('.nav-item');

    if (hamburger && navWrapper) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navWrapper.classList.toggle('active');
            document.body.style.overflow = navWrapper.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navLinksList.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navWrapper.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    /* === Active Link Highlighting using IntersectionObserver === */
    const sections = document.querySelectorAll('section, main');
    const navItems = document.querySelectorAll('.nav-item');

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -70% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));

    /* === Scroll Reveal Logic (Advanced) === */
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -15% 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    /* === Animated Statistics Counter === */
    const statNumbers = document.querySelectorAll('.stat-item .number');
    let hasAnimated = false; // Prevent re-animating

    const animateCounters = () => {
        statNumbers.forEach(counter => {
            const triggerEl = counter.closest('.stat-item');
            if(triggerEl && triggerEl.classList.contains('active')) {
                 const target = +counter.getAttribute('data-target');
                 const duration = 2000; // ms
                 const increment = target / (duration / 16); // 60fps
                 
                 let current = 0;
                 const updateCounter = () => {
                     current += increment;
                     if (current < target) {
                         counter.innerText = Math.ceil(current) + (target === 4 || target === 15 ? '+' : '');
                         requestAnimationFrame(updateCounter);
                     } else {
                         counter.innerText = target + (target === 4 || target === 15 ? '+' : '');
                     }
                 };
                 updateCounter();
                 counter.removeAttribute('data-target'); // Prevent re-triggering this specific stat
            }
        });
    };

    // Observe stats section for counter animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
             if(entry.isIntersecting && !hasAnimated) {
                 // Slight delay to allow fade-in
                 setTimeout(animateCounters, 300); 
                 hasAnimated = true;
             }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.about__stats');
    if(statsSection) {
        statsObserver.observe(statsSection);
    }
});