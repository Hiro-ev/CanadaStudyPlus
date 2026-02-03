document.addEventListener('DOMContentLoaded', function() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                     (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
    
    if (!isMobile) return;
    
    // Find all sections with class "info" (city sections)
    const citySections = document.querySelectorAll('section.info');
    
    citySections.forEach(section => {
        const computedStyle = window.getComputedStyle(section);
        const bgImage = computedStyle.backgroundImage;
        
        // Extract the actual image URL from backgroundImage
        if (bgImage && bgImage !== 'none') {
            // Match the last URL in the background-image (actual image, not overlay)
            const urlMatches = bgImage.match(/url\(['"]?([^'"]+?)['"]?\)/g);
            if (urlMatches && urlMatches.length > 0) {
                // Get the last URL (actual background, not overlay)
                const lastUrl = urlMatches[urlMatches.length - 1];
                const imageUrl = lastUrl.match(/url\(['"]?([^'"]+?)['"]?\)/)[1];
                
                // Apply fixed background effect
                section.style.position = 'relative';
                section.style.backgroundImage = 'none';
                
                const parallaxBg = document.createElement('div');
                parallaxBg.className = 'parallax-bg';
                parallaxBg.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    background-image: url('${imageUrl}');
                    background-size: cover;
                    background-position: center center;
                    background-repeat: no-repeat;
                    will-change: transform;
                    z-index: -1;
                `;
                
                // Create a container for the parallax background
                const bgContainer = document.createElement('div');
                bgContainer.className = 'parallax-container';
                bgContainer.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    z-index: -1;
                `;
                bgContainer.appendChild(parallaxBg);
                
                section.insertBefore(bgContainer, section.firstChild);
                section.dataset.hasParallax = 'true';
            }
        }
    });
    
    let ticking = false;
    let currentVisibleBg = null;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const viewportHeight = window.innerHeight;
        
        document.querySelectorAll('[data-has-parallax]').forEach(section => {
            const bgContainer = section.querySelector('.parallax-container');
            const parallaxBg = section.querySelector('.parallax-bg');
            if (!parallaxBg || !bgContainer) return;
            
            const rect = section.getBoundingClientRect();
            
            // Check if section is in viewport
            const isInView = rect.top < viewportHeight && rect.bottom > 0;
            
            if (isInView) {
                // Show this background and hide others
                if (currentVisibleBg && currentVisibleBg !== parallaxBg) {
                    currentVisibleBg.style.display = 'none';
                }
                parallaxBg.style.display = 'block';
                currentVisibleBg = parallaxBg;
                
                // Optional: Add slight parallax movement
                const scrollPercent = -rect.top / viewportHeight;
                const parallaxSpeed = 0.3;
                const yPos = scrollPercent * 100 * parallaxSpeed;
                parallaxBg.style.transform = `translate3d(0, ${yPos}px, 0)`;
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