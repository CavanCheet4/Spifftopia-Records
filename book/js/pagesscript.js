document.addEventListener('DOMContentLoaded', () => {
    const mainElement = document.querySelector('main');
    const flipBook = document.getElementById('flip_book');
    const backCover = document.querySelector('.back_cover');

    async function fetchHtml(path) {
        if (!path) return '';
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for path: ${path}`);
            }
            return await response.text();
        } catch (error) {
            console.error("Error fetching content from:", path, error);
            return `<p style="color: red; padding: 10px;">Error loading content.</p>`;
        }
    }

    async function buildBook() {
        try {
            const response = await fetch('./js/pages.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const pages = await response.json();
            const totalPages = pages.length;
            const dynamicStyles = document.createElement('style');
            document.head.appendChild(dynamicStyles);

            for (const [index, page] of pages.entries()) {
                const pageNum = index + 1;
                const checkboxId = `page${pageNum}_checkbox`;
                const pageId = `page${pageNum}`;

                // --- 1. Fetch HTML content (if path is provided) ---
                const frontHtmlContent = await fetchHtml(page.frontHtmlPath);
                const backHtmlContent = await fetchHtml(page.backHtmlPath);
                
                // Determine if we have content to inject
                const isFrontHtml = !!page.frontHtmlPath;
                const isBackHtml = !!page.backHtmlPath;
                
                // --- 2. Create elements and structure ---
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = checkboxId;
                mainElement.insertBefore(checkbox, flipBook);

                const pageElement = document.createElement('div');
                pageElement.id = pageId;
                pageElement.classList.add('page');

                // Generate inner HTML structure
                pageElement.innerHTML = `
                    <div class="front_page">
                        <label for="${checkboxId}"></label>
                        <img class="content_bg front_image" src="${page.frontImage}" alt="Front background">
                        ${isFrontHtml 
                            ? `<div class="page_text front_html_overlay">${frontHtmlContent}</div>`
                            : ''
                        }
                    </div>
                    <div class="back_page">
                        <label for="${checkboxId}"></label>
                        <img class="content_bg back_image" src="${page.backImage}" alt="Back background">
                        ${isBackHtml 
                            ? `<div class="page_text back_html_overlay">${backHtmlContent}</div>`
                            : ''
                        }
                    </div>
                `;
                flipBook.insertBefore(pageElement, backCover);

                // --- 3. Apply dynamic CSS rules for flipping ---
                const initialZIndex = totalPages - index;
                const flippedZIndex = totalPages + index + 1;

                const initialRule = `#${pageId} { z-index: ${initialZIndex}; }`;
                const flippedRule = `#${checkboxId}:checked ~ #flip_book #${pageId} { transform: rotateY(-180deg); z-index: ${flippedZIndex}; }`;

                dynamicStyles.sheet.insertRule(initialRule, dynamicStyles.sheet.cssRules.length);
                dynamicStyles.sheet.insertRule(flippedRule, dynamicStyles.sheet.cssRules.length);
                
                // --- 4. Add event listeners for transition control ---
                checkbox.addEventListener('change', () => {
                    pageElement.classList.add('is-flipping');
                    flipBook.classList.add('pointer-events-none');
                });
                pageElement.addEventListener('transitionend', () => {
                    pageElement.classList.remove('is-flipping');
                    flipBook.classList.remove('pointer-events-none');
                });
            }

        } catch (error) {
            console.error("Could not build the book:", error);
            flipBook.innerHTML = `<p style="color: red; text-align: center;">Error loading book pages.</p>`;
        }
    }

    buildBook();
});