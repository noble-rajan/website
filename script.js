/* ==========================================================================
   North Star Bakery - Touchstone 4 Interactivity & Form Validation
   ========================================================================== */

// --- DATA STRUCTURE: Array of Objects for Interactive Products Feature ---
const featuredItems = [
    { id: 'sourdough', name: 'Signature Country Sourdough', category: 'bread', price: '$8.50', desc: 'Slow-fermented for 24 hours with a crisp crust and chewy crumb.' },
    { id: 'croissant', name: 'Butter Croissant', category: 'pastry', price: '$4.25', desc: 'Flaky, golden layers baked fresh every morning at 6:30 AM.' },
    { id: 'cinnamon-roll', name: 'Morning Cinnamon Roll', category: 'pastry', price: '$5.00', desc: 'Soft dough rolled with Ceylon cinnamon and light vanilla glaze.' },
    { id: 'rye', name: 'Dark Artisan Rye', category: 'bread', price: '$9.00', desc: 'Hearty whole-grain rye baked with caraway seeds.' }
];

document.addEventListener('DOMContentLoaded', () => {
    initFavoritesFeature();
    initFormValidation();
});

/* ==========================================================================
   FEATURE 1 & BROWSER STORAGE: Product Favorites / Wishlist Tracker
   ========================================================================== */
function initFavoritesFeature() {
    const favoritesContainer = document.getElementById('favorites-list');
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (!favoritesContainer) return; // Safely exits on index, about, and contact pages

    // Load stored favorites from localStorage on page load
    let savedFavorites = getStoredFavorites();
    renderFavorites(savedFavorites);

    // Event Delegation / Handling for Favorite Buttons
    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('fav-toggle-btn')) {
            const itemId = e.target.getAttribute('data-id');
            toggleFavorite(itemId);
        }
    });

    // Filtering logic for categories
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            filterProductsByCategory(category);
        });
    });
}

// Get favorites from localStorage
function getStoredFavorites() {
    const data = localStorage.getItem('northstar_favorites');
    return data ? JSON.parse(data) : [];
}

// Save favorites array to localStorage
function saveFavorites(favoritesArray) {
    localStorage.setItem('northstar_favorites', JSON.stringify(favoritesArray));
}

// Toggle item in favorites list
function toggleFavorite(itemId) {
    let favorites = getStoredFavorites();
    if (favorites.includes(itemId)) {
        favorites = favorites.filter(id => id !== itemId);
    } else {
        favorites.push(itemId);
    }
    saveFavorites(favorites);
    renderFavorites(favorites);
    updateButtonStates(favorites);
}

// Render saved items in DOM
function renderFavorites(favoritesArray) {
    const container = document.getElementById('favorites-list');
    if (!container) return;

    if (favoritesArray.length === 0) {
        container.innerHTML = '<p class="empty-msg">No items saved to your morning pickup list yet.</p>';
        return;
    }

    const savedObjects = featuredItems.filter(item => favoritesArray.includes(item.id));
    container.innerHTML = savedObjects.map(item => `
        <div class="fav-item-card">
            <h4>${item.name} <span>(${item.price})</span></h4>
            <p>${item.desc}</p>
            <button class="fav-toggle-btn remove-btn" data-id="${item.id}">Remove</button>
        </div>
    `).join('');
}

// Update button labels dynamically
function updateButtonStates(favoritesArray) {
    const buttons = document.querySelectorAll('.fav-toggle-btn:not(.remove-btn)');
    buttons.forEach(btn => {
        const id = btn.getAttribute('data-id');
        if (favoritesArray.includes(id)) {
            btn.textContent = ' Saved to List';
            btn.classList.add('is-active');
        } else {
            btn.textContent = '+ Add to Pickup List';
            btn.classList.remove('is-active');
        }
    });
}

// Category filter logic
function filterProductsByCategory(category) {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}


/* ==========================================================================
   FEATURE 2: Custom JavaScript Form Validation & Inline Error Feedback
   ========================================================================== */
function initFormValidation() {
    const orderForm = document.getElementById('bakery-order-form');
    if (!orderForm) return; // Safely exits on pages without the order form

    // Load remembered customer name from localStorage if available
    const savedName = localStorage.getItem('northstar_customer_name');
    const nameInput = document.getElementById('full-name');
    if (savedName && nameInput) {
        nameInput.value = savedName;
    }

    orderForm.addEventListener('submit', (e) => {
        let isValid = true;

        // Clear existing error messages
        clearInlineErrors();

        // 1. Required Field & Min Length Validation (Name)
        if (nameInput) {
            if (nameInput.value.trim().length < 2) {
                showInlineError(nameInput, 'Please enter your full name (at least 2 characters).');
                isValid = false;
            } else {
                // Save customer name for future visits
                localStorage.setItem('northstar_customer_name', nameInput.value.trim());
            }
        }

        // 2. Email Format Validation
        const emailInput = document.getElementById('email-address');
        if (emailInput) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                showInlineError(emailInput, 'Please enter a valid email address (e.g., name@example.com).');
                isValid = false;
            }
        }

        // 3. Pickup Date Validation (Must be selected and in future)
        const dateInput = document.getElementById('pickup-date');
        if (dateInput) {
            if (!dateInput.value) {
                showInlineError(dateInput, 'Please select a pickup date.');
                isValid = false;
            }
        }

        // Prevent submission if invalid
        if (!isValid) {
            e.preventDefault();
        } else {
            alert('Thank you! Your pre-order has been received. We will send a confirmation to your email.');
        }
    });
}

function showInlineError(inputElement, message) {
    inputElement.classList.add('input-error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'inline-error-msg';
    errorDiv.style.color = '#b30000';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
}

function clearInlineErrors() {
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.inline-error-msg').forEach(el => el.remove());
}