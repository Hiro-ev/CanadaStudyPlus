document.addEventListener('DOMContentLoaded', function() {
    // Check if mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                     (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
    
    if (!isMobile) return;
    
    // Find all sections with backgrounds
    const sections = document.querySelectorAll('section.info, section.intro');
    
    sections.forEach(section => {
        // Get the computed background image
        const computedStyle = window.getComputedStyle(section);
        const bgImage = computedStyle.backgroundImage;
        
        if (bgImage && bgImage !== 'none') {
            // Extract all URLs from background-image
            const urlMatches = bgImage.match(/url\(['"]?([^'"]+?)['"]?\)/g);
            
            if (urlMatches && urlMatches.length > 0) {
                // Get the last URL (the actual image, not overlay)
                const lastUrl = urlMatches[urlMatches.length - 1];
                const imageUrl = lastUrl.match(/url\(['"]?([^'"]+?)['"]?\)/)[1];
                
                // Store original background for restoration if needed
                section.dataset.originalBg = bgImage;
                
                // iOS Safari fix: use transform instead of background-attachment
                section.style.position = 'relative';
                // Don't use overflow hidden to prevent menu cutoff
                section.style.backgroundImage = 'none';
                
                // Create a pseudo-fixed background
                const bgDiv = document.createElement('div');
                bgDiv.className = 'mobile-bg-fix';
                bgDiv.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: url('${imageUrl}');
                    background-size: cover;
                    background-position: center center;
                    background-repeat: no-repeat;
                    will-change: transform;
                    z-index: -1;
                `;
                
                // Insert the background div
                section.insertBefore(bgDiv, section.firstChild);
                
                // Store reference for parallax
                section.dataset.hasParallaxBg = 'true';
            }
        }
    });
    
    // Simple parallax effect on scroll
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        document.querySelectorAll('[data-has-parallax-bg="true"]').forEach(section => {
            const bgDiv = section.querySelector('.mobile-bg-fix');
            if (!bgDiv) return;
            
            const rect = section.getBoundingClientRect();
            const speed = 0.5; // Parallax speed
            
            // Only apply parallax when section is in view
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                const yPos = -(rect.top * speed);
                bgDiv.style.transform = `translateY(${yPos}px)`;
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
    
    // Add scroll listener
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Initial call
    updateParallax();
});