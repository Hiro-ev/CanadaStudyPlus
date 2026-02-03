document.addEventListener('DOMContentLoaded', function() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                     (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
    
    if (!isMobile) return;
    
    // Map section IDs to their background images
    const sectionBackgrounds = {
        'why': 'one.jpg',
        'toronto': 'two.jpg',
        'calgary': 'three.jpg',
        'vancouver': 'four.jpg',
        'montreal': 'five.jpg',
        'aboutus': 'intro.jpg'
    };
    
    // Process each section
    Object.entries(sectionBackgrounds).forEach(([sectionId, imageName]) => {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        // Extract the base URL from existing background if possible
        const computedStyle = window.getComputedStyle(section);
        const bgImage = computedStyle.backgroundImage;
        let baseUrl = '/user/pages/01.home/';
        
        // Try to extract the actual path from current background
        if (bgImage && bgImage !== 'none') {
            const urlMatches = bgImage.match(/url\(['"]?([^'"]+?)['"]?\)/g);
            if (urlMatches && urlMatches.length > 0) {
                const lastUrl = urlMatches[urlMatches.length - 1];
                const currentUrl = lastUrl.match(/url\(['"]?([^'"]+?)['"]?\)/)[1];
                // Extract base path
                const pathMatch = currentUrl.match(/(.+\/)([^/]+\.jpg)/);
                if (pathMatch) {
                    baseUrl = pathMatch[1];
                }
            }
        }
        
        // Construct the image URL
        const imageUrl = baseUrl + imageName;
        
        // Apply fixed background effect
        section.style.position = 'relative';
        section.style.overflow = 'hidden';
        
        // Hide original background
        section.style.backgroundImage = 'none';
        
        // Create fixed background element
        const fixedBg = document.createElement('div');
        fixedBg.className = 'mobile-fixed-bg';
        fixedBg.dataset.section = sectionId;
        fixedBg.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background-image: url('${imageUrl}');
            background-size: cover;
            background-position: center center;
            background-repeat: no-repeat;
            z-index: -2;
            display: none;
        `;
        
        // Add to body for proper fixed positioning
        document.body.appendChild(fixedBg);
        
        // Mark section as processed
        section.dataset.mobileParallax = 'true';
    });
    
    // Update visibility based on scroll
    let ticking = false;
    let activeBg = null;
    
    function updateBackgrounds() {
        const viewportHeight = window.innerHeight;
        const scrolled = window.pageYOffset;
        
        // Find which section is most visible
        let mostVisibleSection = null;
        let maxVisibility = 0;
        
        document.querySelectorAll('[data-mobile-parallax="true"]').forEach(section => {
            const rect = section.getBoundingClientRect();
            
            // Calculate how much of the section is visible
            if (rect.top < viewportHeight && rect.bottom > 0) {
                const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
                const visibility = visibleHeight / viewportHeight;
                
                if (visibility > maxVisibility) {
                    maxVisibility = visibility;
                    mostVisibleSection = section;
                }
            }
        });
        
        // Update background visibility
        document.querySelectorAll('.mobile-fixed-bg').forEach(bg => {
            if (mostVisibleSection && bg.dataset.section === mostVisibleSection.id) {
                bg.style.display = 'block';
                
                // Add slight parallax effect
                const rect = mostVisibleSection.getBoundingClientRect();
                const scrollPercent = -rect.top / viewportHeight;
                const parallaxSpeed = 0.2;
                const yPos = scrollPercent * 50 * parallaxSpeed;
                bg.style.transform = `translate3d(0, ${yPos}px, 0) scale(1.1)`;
            } else {
                bg.style.display = 'none';
            }
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateBackgrounds);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick, { passive: true });
    
    // Initial update
    updateBackgrounds();
});