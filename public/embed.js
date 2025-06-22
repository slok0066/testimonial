(function() {
    const scriptTag = document.querySelector('script[data-slug]');
    if (!scriptTag) return console.error('Testimania: Script tag with data-slug not found.');

    // --- Config ---
    const config = {
        slug: scriptTag.getAttribute('data-slug'),
        layout: scriptTag.getAttribute('data-layout') || 'list',
        theme: scriptTag.getAttribute('data-theme') || 'light',
        primaryColor: scriptTag.getAttribute('data-primary-color') || '#f59e0b',
        maxWidth: scriptTag.getAttribute('data-max-width') || '800px',
        maxItems: parseInt(scriptTag.getAttribute('data-max-items'), 10) || 10,
        showStars: scriptTag.getAttribute('data-show-stars') !== 'false',
        widgetTitle: scriptTag.getAttribute('data-widget-title') || '',
        gridColumns: parseInt(scriptTag.getAttribute('data-grid-columns'), 10) || 3,
        borderRadius: scriptTag.getAttribute('data-border-radius') || '8px',
        shadow: scriptTag.getAttribute('data-shadow') || 'md',
        font: scriptTag.getAttribute('data-font') || 'sans',
        gap: scriptTag.getAttribute('data-gap') || '16px'
    };
    if (!config.slug) return console.error('Testimania: data-slug is missing.');
    
    // Base URL for API requests - points to the same origin as the script
    const apiBaseUrl = window.location.origin;

    const widgetContainer = document.getElementById('testimania-widget');
    if (!widgetContainer) return console.error('Testimania: Widget container div not found.');

    // --- Styles ---
    const style = document.createElement('style');
    const shadowVariants = { none: 'none', sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)', md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' };
    const fontVariants = { sans: 'ui-sans-serif, system-ui, sans-serif', serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif', mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' };

    style.textContent = `
        :root { 
            --tm-primary-color: ${config.primaryColor};
            --tm-font-family: ${fontVariants[config.font] || fontVariants.sans};
            --tm-card-border-radius: ${config.borderRadius};
            --tm-card-shadow: ${shadowVariants[config.shadow] || shadowVariants.md};
            --tm-gap: ${config.gap};
        }
        #testimania-widget { font-family: var(--tm-font-family); }
        .tm-widget-container { max-width: ${config.maxWidth}; margin: 20px auto; }
        .tm-widget-header { font-size: 1.5em; font-weight: bold; margin-bottom: 16px; text-align: center; }
        .tm-card { 
            border: 1px solid #e2e8f0; 
            border-left: 5px solid var(--tm-primary-color); 
            padding: 20px; 
            margin-bottom: 16px; 
            border-radius: var(--tm-card-border-radius); 
            box-shadow: var(--tm-card-shadow); 
        }
        .tm-stars { display: flex; color: var(--tm-primary-color); margin-bottom: 8px; }
        .tm-title { font-weight: bold; font-size: 1.1em; margin-bottom: 4px; }
        .tm-content { line-height: 1.6; margin-bottom: 12px; }
        .tm-author { font-style: italic; font-size: 0.9em; }
        /* Theme */
        .tm-theme-light { color-scheme: light; }
        .tm-theme-light .tm-widget-header { color: #1a202c; }
        .tm-theme-light .tm-card { background: #fff; color: #333; }
        .tm-theme-dark { color-scheme: dark; }
        .tm-theme-dark .tm-widget-header { color: #f7fafc; }
        .tm-theme-dark .tm-card { background: #2d3748; color: #f7fafc; border-color: #4a5568; }
        /* Layouts */
        .tm-layout-list .testimonials-wrapper { display: flex; flex-direction: column; }
        .tm-layout-grid .testimonials-wrapper { display: grid; grid-template-columns: repeat(${config.gridColumns}, 1fr); }
        .tm-layout-carousel { position: relative; overflow: hidden; }
        .tm-carousel-inner { display: flex; transition: transform 0.5s ease; }
        .tm-carousel-item { min-width: 100%; box-sizing: border-box; padding: 0 40px; }
        .tm-carousel-btn { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.2); color: white; border: none; border-radius: 50%; cursor: pointer; width: 32px; height: 32px; z-index: 1; }
        .tm-carousel-btn.prev { left: 5px; }
        .tm-carousel-btn.next { right: 5px; }
    `;
    document.head.appendChild(style);
    widgetContainer.className = `tm-widget-container tm-theme-${config.theme} tm-layout-${config.layout}`;

    // --- Logic ---
    async function loadTestimonials() {
        try {
            const res = await fetch(`${apiBaseUrl}/api/testimonials?slug=${encodeURIComponent(config.slug)}`);
            if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
            let testimonials = await res.json();
            if (config.layout === 'single') testimonials = testimonials.slice(0, 1);
            else testimonials = testimonials.slice(0, config.maxItems);

            if (!testimonials.length) { widgetContainer.innerHTML = '<p>No testimonials yet.</p>'; return; }

            const renderStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);
            const testimonialHTML = testimonials.map(t => `
                <div class="${config.layout === 'carousel' ? 'tm-carousel-item' : ''}">
                    <div class="tm-card">
                        ${config.showStars && t.rating ? `<div class="tm-stars">${renderStars(t.rating)}</div>` : ''}
                        <div class="tm-title">${t.title || ''}</div>
                        <p class="tm-content">"${t.content}"</p>
                        <p class="tm-author">- ${t.client_name}</p>
                    </div>
                </div>
            `).join('');

            let finalHTML = '';
            if (config.widgetTitle) {
                finalHTML += `<h2 class="tm-widget-header">${config.widgetTitle}</h2>`;
            }

            if (config.layout === 'carousel') {
                finalHTML += `
                    <div class="tm-layout-carousel">
                        <div class="tm-carousel-inner">${testimonialHTML}</div>
                        <button class="tm-carousel-btn prev">&#10094;</button>
                        <button class="tm-carousel-btn next">&#10095;</button>
                    </div>
                `;
                widgetContainer.innerHTML = finalHTML;
                // Carousel Logic
                let currentIndex = 0;
                const items = widgetContainer.querySelectorAll('.tm-carousel-item');
                const totalItems = items.length;
                if(totalItems > 0) {
                    const inner = widgetContainer.querySelector('.tm-carousel-inner');
                    const updateCarousel = () => { inner.style.transform = `translateX(-${currentIndex * 100}%)`; };
                    widgetContainer.querySelector('.next').addEventListener('click', () => { currentIndex = (currentIndex + 1) % totalItems; updateCarousel(); });
                    widgetContainer.querySelector('.prev').addEventListener('click', () => { currentIndex = (currentIndex - 1 + totalItems) % totalItems; updateCarousel(); });
                }
            } else {
                finalHTML += `<div class="testimonials-wrapper">${testimonialHTML}</div>`;
                widgetContainer.innerHTML = finalHTML;
            }
        } catch (error) {
            console.error('Testimania Error:', error);
            widgetContainer.innerHTML = '<p>Could not load testimonials.</p>';
        }
    }

    loadTestimonials();
})();
