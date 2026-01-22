async function loadMenu() {
    const sections = [
        { file: 'morning-brews.json', titleId: 'morning-title', containerId: 'morning-items-container' },
        { file: 'cafe-eats.json', titleId: 'eats-title', containerId: 'eats-items-container' }
    ];

    for (const section of sections) {
        const container = document.getElementById(section.containerId);
        const titleElement = document.getElementById(section.titleId);

        try {
            const response = await fetch(`/content/menu/${section.file}`);
            if (!response.ok) {
                // If the file is missing, we clear the loading text so it doesn't stay forever
                if (container) container.innerHTML = ''; 
                continue;
            }
            
            const data = await response.json();
            
            // 1. REPLACE THE TITLE
            // This swaps "Morning Brews" for whatever Stephanie typed in the Section Title field
            if (titleElement && data.title) {
                titleElement.innerText = data.title;
            }
            
            // 2. REPLACE THE ITEMS
            // We ensure items exist, then map them. If no items exist, it clears the container.
            if (container) {
                if (data.items && data.items.length > 0) {
                    container.innerHTML = data.items.map(item => {
                        const soldOutClass = item.is_sold_out ? 'sold-out' : '';
                        const soldOutLabel = item.is_sold_out ? '<span class="sold-out-badge">Sold Out</span>' : '';

                        return `
                        <div class="menu-item ${soldOutClass}" style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <strong>${item.item_name}</strong>
                                ${soldOutLabel}
                            </div>
                            <span>${item.item_price}</span>
                            <p style="font-size: 0.9rem; color: #666;">${item.item_desc}</p>
                        </div>`;
                    }).join('');
                } else {
                    // This clears the "Loading..." text if Stephanie published a section with 0 items
                    container.innerHTML = '<p class="loading-text">Coming soon!</p>';
                }
            }
        } catch (e) { 
            console.error("Error loading " + section.file, e);
            if (container) container.innerHTML = '<p class="loading-text">Check back soon for updates!</p>';
        }
    }
}

async function fetchSpecial() {
    const specialContainer = document.getElementById('daily-special-container');
    try {
        const response = await fetch('/content/specials/index.json');
        if (response.ok) {
            const data = await response.json();
            document.getElementById('special-title').innerText = data.title;
            document.getElementById('special-body').innerText = data.body;
            document.getElementById('special-price').innerText = data.price;
            if (specialContainer) specialContainer.style.display = 'block';
        }
    } catch (e) { 
        console.log("No daily special found.");
        if (specialContainer) specialContainer.style.display = 'none';
    }
}

// Initialize the site
loadMenu();
fetchSpecial();