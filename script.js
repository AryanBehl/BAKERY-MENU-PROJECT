// Bakery Menu Data
const menuItems = [
    { id: 1, name: "Honey Lavender Cake", desc: "Light & floral with wildflower honey", price: 6.50, category: "cakes", emoji: "🍯🌸" },
    { id: 2, name: "Classic Croissant", desc: "Buttery, flaky layers", price: 3.75, category: "pastries", emoji: "🥐✨" },
    { id: 3, name: "Sourdough Boule", desc: "Crusty artisan loaf", price: 5.50, category: "breads", emoji: "🍞🔥" },
    { id: 4, name: "Rose Latte", desc: "Velvety rose-infused milk coffee", price: 4.80, category: "drinks", emoji: "☕🌹" },
    { id: 5, name: "Strawberry Matcha Cake", desc: "Matcha sponge + strawberry cream", price: 7.25, category: "cakes", emoji: "🍓🍵" },
    { id: 6, name: "Almond Pain au Chocolat", desc: "Dark chocolate & almond crunch", price: 4.50, category: "pastries", emoji: "🍫🌰" },
    { id: 7, name: "Brioche Buns", desc: "Soft, eggy & slightly sweet", price: 3.25, category: "breads", emoji: "🥐🍞" },
    { id: 8, name: "Chai Spiced Cookie", desc: "Warm cardamom & cinnamon", price: 2.80, category: "pastries", emoji: "🍪☕" },
    { id: 9, name: "Carrot Walnut Cake", desc: "Cream cheese frosting", price: 6.25, category: "cakes", emoji: "🥕🌰" },
    { id: 10, name: "Iced Matcha Latte", desc: "Smooth & earthy", price: 5.20, category: "drinks", emoji: "🍵❄️" },
    { id: 11, name: "Focaccia Rosemary", desc: "Garlic & sea salt", price: 4.90, category: "breads", emoji: "🌿🧄" },
    { id: 12, name: "Mango Passion Tart", desc: "Tropical fruit curd", price: 5.95, category: "pastries", emoji: "🥭✨" }
];

let cart = [];

// DOM Elements
const menuGrid = document.getElementById('menuGrid');
const cartItemsDiv = document.getElementById('cartItems');
const cartTotalSpan = document.getElementById('cartTotal');
const cartCountSpan = document.getElementById('cartCount');
const cartToggle = document.getElementById('cartToggle');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const toast = document.getElementById('toast');
const checkoutBtn = document.getElementById('checkoutBtn');

// Render Menu Items
function renderMenu(category = 'all') {
    const filtered = category === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === category);
    
    menuGrid.innerHTML = filtered.map(item => `
        <div class="menu-card" data-id="${item.id}">
            <div class="card-img">
                ${item.emoji}
            </div>
            <div class="card-content">
                <div class="item-name">${item.name}</div>
                <div class="item-desc">${item.desc}</div>
                <div class="item-footer">
                    <span class="price">$${item.price.toFixed(2)}</span>
                    <button class="add-btn" data-id="${item.id}">+ Add to cart</button>
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners to "Add to cart" buttons
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            addToCart(id);
        });
    });
}

// Add to Cart
function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;

    const existing = cart.find(i => i.id === itemId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCartUI();
    showToast(`✨ ${item.name} added!`);
}

// Update Cart Display
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = `<p class="empty-cart-msg">Your cart is empty ✨<br>Add some sweetness!</p>`;
        cartTotalSpan.textContent = `$0.00`;
        return;
    }
    
    cartItemsDiv.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-actions">
                <button class="qty-btn" data-id="${item.id}" data-change="-1">-</button>
                <span class="cart-item-qty">${item.quantity}</span>
                <button class="qty-btn" data-id="${item.id}" data-change="1">+</button>
                <button class="remove-item" data-id="${item.id}">🗑️</button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalSpan.textContent = `$${total.toFixed(2)}`;
    
    // Attach cart item events
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            const change = parseInt(btn.dataset.change);
            updateQuantity(id, change);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            removeItem(id);
        });
    });
}

// Update Quantity
function updateQuantity(itemId, delta) {
    const itemIndex = cart.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;
    
    const newQuantity = cart[itemIndex].quantity + delta;
    if (newQuantity <= 0) {
        cart.splice(itemIndex, 1);
    } else {
        cart[itemIndex].quantity = newQuantity;
    }
    updateCartUI();
}

// Remove Item
function removeItem(itemId) {
    cart = cart.filter(i => i.id !== itemId);
    updateCartUI();
}

// Show Toast Notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 1800);
}

// Toggle Cart Sidebar
function openCart() {
    cartSidebar.classList.add('open');
    overlay.classList.add('active');
}

function closeCartSidebar() {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
}

// Checkout
function handleCheckout() {
    if (cart.length === 0) {
        showToast("🛒 Your cart is empty! Add some treats~");
        return;
    }
    const total = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    showToast(`🎀 Order placed! Total: $${total.toFixed(2)}. Thank you! 💕`);
    cart = [];
    updateCartUI();
    closeCartSidebar();
}

// Category Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.dataset.category;
        renderMenu(category);
    });
});

// Event Listeners
cartToggle.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartSidebar);
overlay.addEventListener('click', closeCartSidebar);
checkoutBtn.addEventListener('click', handleCheckout);

// Initialize
renderMenu('all');
updateCartUI();