document.addEventListener('DOMContentLoaded', function() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                     (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
    
    if (!isMobile) return;
    
    const cityConfigs = {
        'toronto': {
            selector: '#toronto',
            imageUrl: '/user/themes/big-picture/assets/images/toronto-bg.jpg',
            speed: 0.5
        },
        'calgary': {
            selector: '#calgary',
            imageUrl: '/user/themes/big-picture/assets/images/calgary-bg.jpg',
            speed: 0.5
        },
        'vancouver': {
            selector: '#vancouver',
            imageUrl: '/user/themes/big-picture/assets/images/vancouver-bg.jpg',
            speed: 0.5
        },
        'montreal': {
            selector: '#montreal',
            imageUrl: '/user/themes/big-picture/assets/images/montreal-bg.jpg',
            speed: 0.5
        }
    };
    
    Object.entries(cityConfigs).forEach(([city, config]) => {
        const section = document.querySelector(config.selector);
        if (!section) return;
        
        const computedStyle = window.getComputedStyle(section);
        const bgImage = computedStyle.backgroundImage;
        
        if (bgImage && bgImage !== 'none') {
            const urlMatch = bgImage.match(/url\(['"]?(.+?)['"]?\)/);
            if (urlMatch) {
                config.imageUrl = urlMatch[1];
            }
        }
        
        section.style.position = 'relative';
        section.style.overflow = 'hidden';
        section.style.backgroundImage = 'none';
        
        const parallaxBg = document.createElement('div');
        parallaxBg.className = 'parallax-bg';
        parallaxBg.style.cssText = `
            position: absolute;
            top: -20%;
            left: 0;
            width: 100%;
            height: 120%;
            background-image: url('${config.imageUrl}');
            background-size: cover;
            background-position: center center;
            background-repeat: no-repeat;
            will-change: transform;
            z-index: -1;
        `;
        
        section.insertBefore(parallaxBg, section.firstChild);
        
        section.dataset.parallaxCity = city;
        section.dataset.parallaxSpeed = config.speed;
    });
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const viewportHeight = window.innerHeight;
        
        document.querySelectorAll('[data-parallax-city]').forEach(section => {
            const parallaxBg = section.querySelector('.parallax-bg');
            if (!parallaxBg) return;
            
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + scrolled;
            const sectionHeight = rect.height;
            const speed = parseFloat(section.dataset.parallaxSpeed) || 0.5;
            
            const isInView = (scrolled + viewportHeight > sectionTop) && 
                           (scrolled < sectionTop + sectionHeight);
            
            if (isInView) {
                const sectionScrolled = scrolled - sectionTop + viewportHeight;
                const percentage = sectionScrolled / (viewportHeight + sectionHeight);
                const parallaxOffset = -(percentage * 100 * speed);
                
                parallaxBg.style.transform = `translate3d(0, ${parallaxOffset}px, 0)`;
            }
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick, { passive: true });
    
    updateParallax();
});