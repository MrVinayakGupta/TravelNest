document.addEventListener("DOMContentLoaded", () => {
    
    /* ─── SCROLL REVEAL ─── */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.property-card').forEach(card => revealObserver.observe(card));

    /* ─── SEARCH FUNCTIONALITY ─── */
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.getElementById('search-where');

    const handleSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `/search?q=${encodeURIComponent(query)}`;
        }
    };

    if (searchBtn) searchBtn.addEventListener('click', handleSearch);
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }

    /* ─── TAX TOGGLE ─── */
    const taxSwitch = document.getElementById('switchCheckDefault');
    if (taxSwitch) {
        taxSwitch.addEventListener('change', function() {
            document.querySelectorAll('.tax-info').forEach(el => {
                el.style.display = this.checked ? 'inline' : 'none';
            });
        });
    }
});

/* ─── WISHLIST TOGGLE (Global) ─── */
async function toggleSave(event, btn, listingId) {
    event.preventDefault();
    event.stopPropagation();
    
    const icon = btn.querySelector('i');
    const isSaved = btn.classList.toggle('saved');
    
    // UI Feedback
    icon.className = isSaved ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
    btn.style.transform = 'scale(1.3)';
    setTimeout(() => btn.style.transform = '', 200);

    // Backend Sync (Optional: Requires the Wishlist route we discussed)
    /*
    try {
        await fetch(`/wishlist/${listingId}/toggle`, { method: 'POST' });
    } catch (err) { console.error("Wishlist sync failed"); }
    */
}