/**
 * Documentation Interactive Features
 * Handles navigation, code copying, and interactive elements
 */

// Navigation state
let currentSection = 'installation';

/**
 * Show a specific section and update navigation
 * @param {string} sectionId - The section to show
 */
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
    }

    // Update navigation active state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });

    // Find and activate the corresponding nav item
    const activeNavItem = Array.from(navItems).find(item => 
        item.textContent.toLowerCase().replace(/\s+/g, '-') === sectionId ||
        item.onclick?.toString().includes(sectionId)
    );
    
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update URL hash without page reload
    history.pushState(null, null, `#${sectionId}`);
}

/**
 * Copy code from a code block to clipboard
 * @param {HTMLElement} button - The copy button element
 */
async function copyCode(button) {
    try {
        // Find the code content
        const codeBlock = button.closest('.code-block');
        const preElement = codeBlock.querySelector('pre');
        
        if (!preElement) {
            throw new Error('Code block not found');
        }

        // Get the text content
        const codeText = preElement.textContent || preElement.innerText;

        // Copy to clipboard
        await navigator.clipboard.writeText(codeText);

        // Visual feedback
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = 'rgba(34, 197, 94, 0.3)';
        button.style.color = '#22c55e';

        // Reset after 2 seconds
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = 'rgba(139, 92, 246, 0.3)';
            button.style.color = '#c084fc';
        }, 2000);

    } catch (error) {
        console.error('Failed to copy code:', error);
        
        // Fallback for older browsers
        const codeBlock = button.closest('.code-block');
        const preElement = codeBlock.querySelector('pre');
        
        if (preElement) {
            // Select the text
            const range = document.createRange();
            range.selectNode(preElement);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            
            try {
                document.execCommand('copy');
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            } catch (fallbackError) {
                console.error('Fallback copy failed:', fallbackError);
                button.textContent = 'Copy failed';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            }
            
            window.getSelection().removeAllRanges();
        }
    }
}

/**
 * Initialize the documentation page
 */
function initializeDocs() {
    // Check URL hash and show corresponding section
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
        showSection(hash);
    }

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.replace('#', '');
        if (hash && document.getElementById(hash)) {
            showSection(hash);
        } else {
            showSection('installation');
        }
    });

    // Add keyboard navigation
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case '1':
                    event.preventDefault();
                    showSection('installation');
                    break;
                case '2':
                    event.preventDefault();
                    showSection('quick-start');
                    break;
                case '3':
                    event.preventDefault();
                    showSection('components');
                    break;
                case '4':
                    event.preventDefault();
                    showSection('hooks');
                    break;
                case '5':
                    event.preventDefault();
                    showSection('advanced');
                    break;
                case '6':
                    event.preventDefault();
                    showSection('examples');
                    break;
            }
        }
    });

    // Add scroll spy for navigation
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNavOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    console.log('📚 Documentation initialized successfully');
}

/**
 * Update active navigation based on scroll position
 */
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('.section');
    const scrollPosition = window.scrollY + 100; // Offset for better UX

    sections.forEach(section => {
        if (section.classList.contains('active')) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Check if we're in this section
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Update URL without triggering navigation
                const sectionId = section.id;
                if (sectionId && window.location.hash !== `#${sectionId}`) {
                    history.replaceState(null, null, `#${sectionId}`);
                }
            }
        }
    });
}

/**
 * Add syntax highlighting to code blocks
 */
function highlightCode() {
    const codeBlocks = document.querySelectorAll('.code-block pre');
    
    codeBlocks.forEach(block => {
        const code = block.textContent || block.innerText;
        
        // Simple syntax highlighting for common patterns
        let highlightedCode = code
            // Highlight React imports
            .replace(/(import\s+.*?from\s+['"`].*?['"`];?)/g, '<span style="color: #8b5cf6;">$1</span>')
            // Highlight function names
            .replace(/(function\s+\w+)/g, '<span style="color: #a855f7;">$1</span>')
            // Highlight JSX tags
            .replace(/(&lt;\/?\w+[^&]*?&gt;)/g, '<span style="color: #c084fc;">$1</span>')
            // Highlight comments
            .replace(/(\/\/.*$)/gm, '<span style="color: #64748b; font-style: italic;">$1</span>')
            // Highlight strings
            .replace(/(['"`].*?['"`])/g, '<span style="color: #22c55e;">$1</span>');
        
        // Only apply if we made changes
        if (highlightedCode !== code) {
            block.innerHTML = highlightedCode;
        }
    });
}

/**
 * Add smooth animations to elements
 */
function addAnimations() {
    // Animate feature cards on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInUp 0.6s ease-out forwards';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        observer.observe(card);
    });

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .feature-card {
            opacity: 0;
        }
        
        .copy-btn:active {
            transform: scale(0.95);
        }
        
        .nav-item {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .section {
            transition: opacity 0.3s ease-in-out;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Add keyboard shortcuts help
 */
function addKeyboardShortcuts() {
    // Show shortcuts on ? key
    document.addEventListener('keydown', (event) => {
        if (event.key === '?' && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            showKeyboardShortcuts();
        }
        
        // Hide shortcuts on Escape
        if (event.key === 'Escape') {
            hideKeyboardShortcuts();
        }
    });
}

/**
 * Show keyboard shortcuts modal
 */
function showKeyboardShortcuts() {
    const existingModal = document.getElementById('shortcuts-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'shortcuts-modal';
    modal.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        ">
            <div style="
                background: #1e1b3b;
                border-radius: 16px;
                padding: 2rem;
                border: 1px solid rgba(139, 92, 246, 0.3);
                max-width: 400px;
                width: 90%;
            ">
                <h3 style="color: #c084fc; margin-bottom: 1rem;">Keyboard Shortcuts</h3>
                <div style="color: #e2e8f0; line-height: 1.6;">
                    <p><kbd>Ctrl+1</kbd> - Installation</p>
                    <p><kbd>Ctrl+2</kbd> - Quick Start</p>
                    <p><kbd>Ctrl+3</kbd> - Components</p>
                    <p><kbd>Ctrl+4</kbd> - Hooks</p>
                    <p><kbd>Ctrl+5</kbd> - Advanced</p>
                    <p><kbd>Ctrl+6</kbd> - Examples</p>
                    <p><kbd>?</kbd> - Show this help</p>
                    <p><kbd>Esc</kbd> - Close this help</p>
                </div>
                <button onclick="hideKeyboardShortcuts()" style="
                    margin-top: 1rem;
                    padding: 0.5rem 1rem;
                    background: rgba(139, 92, 246, 0.3);
                    border: 1px solid rgba(139, 92, 246, 0.5);
                    color: #c084fc;
                    border-radius: 8px;
                    cursor: pointer;
                ">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

/**
 * Hide keyboard shortcuts modal
 */
function hideKeyboardShortcuts() {
    const modal = document.getElementById('shortcuts-modal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Initialize everything when the page loads
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeDocs();
    addAnimations();
    addKeyboardShortcuts();
    
    // Small delay to ensure content is ready
    setTimeout(() => {
        highlightCode();
    }, 100);
});

// Make functions available globally
window.showSection = showSection;
window.copyCode = copyCode;
window.hideKeyboardShortcuts = hideKeyboardShortcuts;
