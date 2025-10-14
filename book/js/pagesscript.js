document.addEventListener('DOMContentLoaded', () => {
    const mainElement = document.querySelector('main');
    const flipBook = document.getElementById('flip_book');
    const backCover = document.querySelector('.back_cover');

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

            pages.forEach((page, index) => {
                const pageNum = index + 1;
                const checkboxId = `page${pageNum}_checkbox`;
                const pageId = `page${pageNum}`;

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = checkboxId;
                mainElement.insertBefore(checkbox, flipBook);

                const pageElement = document.createElement('div');
                pageElement.id = pageId;
                pageElement.classList.add('page');
                pageElement.innerHTML = `
                    <div class="front_page">
                        <label for="${checkboxId}"></label>
                        <img class="front_content" src="${page.frontImage}" alt="Front content">
                    </div>
                    <div class="back_page">
                        <label for="${checkboxId}"></label>
                        <img class="back_content" src="${page.backImage}" alt="Back content">
                    </div>
                `;
                flipBook.insertBefore(pageElement, backCover);

                const initialZIndex = totalPages - index;
                const flippedZIndex = totalPages + index + 1;

                const initialRule = `#${pageId} { z-index: ${initialZIndex}; }`;
                const flippedRule = `#${checkboxId}:checked ~ #flip_book #${pageId} { transform: rotateY(-180deg); z-index: ${flippedZIndex}; }`;

                dynamicStyles.sheet.insertRule(initialRule, dynamicStyles.sheet.cssRules.length);
                dynamicStyles.sheet.insertRule(flippedRule, dynamicStyles.sheet.cssRules.length);
                
                checkbox.addEventListener('change', () => {
                    pageElement.classList.add('is-flipping');
                    flipBook.classList.add('pointer-events-none');
                });
                pageElement.addEventListener('transitionend', () => {
                    pageElement.classList.remove('is-flipping');
                    flipBook.classList.remove('pointer-events-none');
                });
            });

        } catch (error) {
            console.error("Could not build the book:", error);
            flipBook.innerHTML = `<p style="color: red; text-align: center;">Error loading book pages.</p>`;
        }
    }

    buildBook();
});