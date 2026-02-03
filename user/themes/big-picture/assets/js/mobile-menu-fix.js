document.addEventListener('DOMContentLoaded', function() {
    // Check if mobile
    const isMobile = window.matchMedia && window.matchMedia('(max-width: 980px)').matches;
    
    if (!isMobile) return;
    
    // Check if menu toggle button exists
    let menuToggle = document.querySelector('.navPanelToggle');
    
    if (!menuToggle) {
        // Create menu toggle button if it doesn't exist
        menuToggle = document.createElement('a');
        menuToggle.className = 'navPanelToggle';
        menuToggle.href = '#navPanel';
        menuToggle.innerHTML = '<span class="fa fa-bars"></span>';
        menuToggle.style.cssText = `
            position: fixed;
            top: 1em;
            right: 1em;
            width: 4em;
            height: 4em;
            display: block;
            z-index: 10003;
            background: rgba(255, 255, 255, 0.95);
            border: 2px solid #2c5aa0;
            border-radius: 5px;
            text-align: center;
            line-height: 4em;
            font-size: 1em;
            color: #2c5aa0;
            text-decoration: none;
            cursor: pointer;
        `;
        document.body.appendChild(menuToggle);
    }
    
    // Create nav panel if it doesn't exist
    let navPanel = document.querySelector('#navPanel');
    
    if (!navPanel) {
        navPanel = document.createElement('div');
        navPanel.id = 'navPanel';
        navPanel.style.cssText = `
            position: fixed;
            top: 0;
            right: -250px;
            width: 250px;
            height: 100%;
            background: rgba(255, 255, 255, 0.98);
            box-shadow: -2px 0 10px rgba(0,0,0,0.1);
            transition: right 0.3s ease;
            z-index: 10002;
            overflow-y: auto;
            padding: 2em 1.5em;
        `;
        
        // Copy navigation items
        const nav = document.querySelector('#nav');
        if (nav) {
            const navClone = nav.cloneNode(true);
            navClone.id = 'navPanel-nav';
            navPanel.appendChild(navClone);
            
            // Style the navigation in panel
            const navPanelNav = navPanel.querySelector('ul');
            if (navPanelNav) {
                navPanelNav.style.cssText = `
                    list-style: none;
                    padding: 0;
                    margin: 0;
                `;
                
                navPanelNav.querySelectorAll('li').forEach(li => {
                    li.style.cssText = `
                        margin: 0 0 1em 0;
                        padding: 0;
                    `;
                });
                
                navPanelNav.querySelectorAll('a').forEach(a => {
                    a.style.cssText = `
                        display: block;
                        padding: 0.5em;
                        color: #2c5aa0;
                        text-decoration: none;
                        font-size: 1.1em;
                        border-bottom: 1px solid rgba(44, 90, 160, 0.1);
                    `;
                });
            }
        }
        
        document.body.appendChild(navPanel);
    }
    
    // Toggle functionality
    let isPanelOpen = false;
    
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        isPanelOpen = !isPanelOpen;
        
        if (isPanelOpen) {
            navPanel.style.right = '0';
            menuToggle.innerHTML = '<span class="fa fa-times"></span>';
        } else {
            navPanel.style.right = '-250px';
            menuToggle.innerHTML = '<span class="fa fa-bars"></span>';
        }
    });
    
    // Close panel when clicking on a link
    navPanel.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            isPanelOpen = false;
            navPanel.style.right = '-250px';
            menuToggle.innerHTML = '<span class="fa fa-bars"></span>';
        });
    });
    
    // Close panel when clicking outside
    document.addEventListener('click', function(e) {
        if (isPanelOpen && !navPanel.contains(e.target) && !menuToggle.contains(e.target)) {
            isPanelOpen = false;
            navPanel.style.right = '-250px';
            menuToggle.innerHTML = '<span class="fa fa-bars"></span>';
        }
    });
});