async function loadMenu() {
    const sections = [
        { file: 'morning-brews.json', containerId: 'morning-items-container' },
        { file: 'cafe-eats.json', containerId: 'eats-items-container' }
    ];

    for (const section of sections) {
        try {
            const response = await fetch(`/content/menu/${section.file}`);
            const data = await response.json();
            const container = document.getElementById(section.containerId);
            
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
        } catch (e) { console.error("Error loading " + section.file, e); }
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
    } catch (e) { console.log("No daily special found."); }
}

loadMenu();
fetchSpecial();
