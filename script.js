async function loadMenu() {
    const sections = [
        { file: 'morning-brews.json', titleId: 'morning-title', containerId: 'morning-items-container' },
        { file: 'cafe-eats.json', titleId: 'eats-title', containerId: 'eats-items-container' }
    ];

    for (const section of sections) {
        try {
            const response = await fetch(`/content/menu/${section.file}`);
            if (!response.ok) continue; // Skip if file doesn't exist yet
            
            const data = await response.json();
            
            // Update the Section Header (e.g., "Morning Brews")
            const titleElement = document.getElementById(section.titleId);
            if (titleElement) titleElement.innerText = data.title;
            
            const container = document.getElementById(section.containerId);
            
            // Clear and rebuild the list from Stephanie's data
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
        } catch (e) { 
            console.error("Error loading " + section.file, e); 
        }
    }
}

async function fetchSpecial() {
    try {
        const response = await fetch('/content/specials/index.json');
        if (response.ok) {
            const data = await response.json();
            document.getElementById('special-title').innerText = data.title;
            document.getElementById('special-body').innerText = data.body;
            document.getElementById('special-price').innerText = data.price;
            document.getElementById('daily-special-container').style.display = 'block';
        }
    } catch (e) { 
        console.log("No daily special found."); 
    }
}

// Initialize the site
loadMenu();
fetchSpecial();