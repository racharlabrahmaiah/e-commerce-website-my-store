/* ==========================================================================
   1. GLOBAL PRODUCT DATASET (DATA BANK)
   ========================================================================== */
const productsData = [
    { id: 1, title: 'Laptop', price: 50000, category: 'laptops', tier: 'above20', popularity: 5, rating: 4.5, img: 'https://images.pexels.com/photos/18105/pexels-photo.jpg', desc: 'High-performance processing power laptop with crystal clear display.' },
    { id: 2, title: 'Mobile', price: 20000, category: 'mobiles', tier: '5to20', popularity: 4, rating: 4.0, img: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg', desc: 'Premium multi-camera setup mobile device with high refresh-rate display screen.' },
    { id: 3, title: 'Headphone', price: 3000, category: 'audio', tier: 'below5', popularity: 6, rating: 5.0, img: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg', desc: 'Studio quality wireless headphones with premium noise cancellation audio.' },
    { id: 4, title: 'Smart Watch', price: 8500, category: 'accessories', tier: '5to20', popularity: 3, rating: 4.5, img: 'https://images.pexels.com/photos/4370376/pexels-photo-4370376.jpeg?auto=compress&cs=tinysrgb&w=300', desc: 'Modern fitness tracking wearable smart watch with clear AMOLED display.' },
    { id: 5, title: 'Gaming Mouse', price: 2500, category: 'accessories', tier: 'below5', popularity: 2, rating: 4.0, img: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=300', desc: 'Tactile high-precision optical gaming mouse with custom RGB profiles.' },
    { id: 6, title: 'Tablet', price: 28000, category: 'mobiles', tier: 'above20', popularity: 1, rating: 5.0, img: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=300', desc: 'Versatile smart tablet designed for digital illustration artwork and streaming.' }
];

let currentActiveProduct = null;

// Currency Formatter Helper (Example: 50000 -> ₹50,000)
function formatPrice(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

// Global LocalStorage Managers
function getCartItems() { return JSON.parse(localStorage.getItem('ecommerce_cart')) || []; }
function saveCartItems(cartArray) { localStorage.setItem('ecommerce_cart', JSON.stringify(cartArray)); }


/* ==========================================================================
   2. DOM INITIALIZATION EVENT ROUTER
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function() {
    
    // ---- [A] CATALOG PRODUCTS PAGE RUNNER ----
    if (document.getElementById('product-grid')) {
        applyFiltersAndSort(); // First initial load rendering

        // Bind Sidebar Filter Controls listeners
        document.querySelectorAll('.category-filter, .price-filter').forEach(cb => {
            cb.addEventListener('change', applyFiltersAndSort);
        });
        document.getElementById('sort-selector').addEventListener('change', applyFiltersAndSort);
    }

    // ---- [B] SHOPPING CART PAGE RUNNER ----
    if (document.getElementById('cart-table-body')) {
        renderCart();
    }

    // ---- [C] LOGIN SYSTEM HANDLER ----
    if (document.getElementById('login-form')) {
        document.getElementById('login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Login Successful! Redirecting to Home Page...');
            window.location.href = 'index.html'; // Redirect to main
        });
    }

    // ---- [D] REGISTRATION SYSTEM HANDLER ----
    if (document.getElementById('register-form')) {
        document.getElementById('register-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const pass = document.getElementById('user-password').value;
            const confirmPass = document.getElementById('confirm-password').value;
            const errorBox = document.getElementById('error-box');

            if (pass !== confirmPass) {
                errorBox.style.display = "block";
                return;
            }
            errorBox.style.display = "none";
            alert('Registration Successful! Redirecting to Login Page...');
            window.location.href = 'login.html'; // Redirect to login login
        });
    }

    // Global setup to close modal pop-ups when clicking outside the box area overlay
    const modal = document.getElementById('productModal');
    if (modal) {
        window.onclick = function(e) { if (e.target == modal) closeModal(); }
    }
});


/* ==========================================================================
   3. CATALOG & FILTERS PAGE CORE FUNCTIONS
   ========================================================================== */
function applyFiltersAndSort() {
    const productGrid = document.getElementById('product-grid');
    const resultsCount = document.getElementById('results-count');
    const sortSelector = document.getElementById('sort-selector');

    const checkedCategories = Array.from(document.querySelectorAll('.category-filter:checked')).map(cb => cb.value);
    const checkedPrices = Array.from(document.querySelectorAll('.price-filter:checked')).map(cb => cb.value);

    // Filter array
    let filtered = productsData.filter(p => checkedCategories.includes(p.category) && checkedPrices.includes(p.tier));

    // Sort switch block
    if (sortSelector.value === 'low-high') filtered.sort((a, b) => a.price - b.price);
    else if (sortSelector.value === 'high-low') filtered.sort((a, b) => b.price - a.price);
    else if (sortSelector.value === 'popularity') filtered.sort((a, b) => b.popularity - a.popularity);
    else if (sortSelector.value === 'default') filtered.sort((a, b) => a.id - b.id);

    productGrid.innerHTML = '';
    if (filtered.length === 0) {
        productGrid.innerHTML = '<p style="grid-column:1/-1; color:#64748b; font-size:16px; padding:20px 0; text-align:center;">No items match selected filters.</p>';
        resultsCount.innerText = 'Showing 0 of 0 catalog results';
        return;
    }

    filtered.forEach(product => {
        // Generate Star icons template loops
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(product.rating)) starsHTML += '<i class="fa-solid fa-star"></i>';
            else if (i - 0.5 === product.rating) starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
            else starsHTML += '<i class="fa-regular fa-star"></i>';
        }

        productGrid.innerHTML += `
            <div class="product-card">
                <div class="image-viewport"><img src="${product.img}" alt="${product.title}"></div>
                <h3>${product.title}</h3>
                <div class="rating-stars">${starsHTML}</div>
                <div class="item-price">${formatPrice(product.price)}</div>
                <button class="details-action-btn" onclick="openProductModal(${product.id})">View Details</button>
            </div>`;
    });
    resultsCount.innerText = `Showing 1–${filtered.length} of ${filtered.length} catalog results`;
}


/* ==========================================================================
   4. MODAL DETAILED POP-UP MODULE LOGIC
   ========================================================================== */
function openProductModal(id) {
    const modal = document.getElementById('productModal');
    // If on homepage where dynamic script arrays don't match, map via dataset mapping arrays directly
    let product = productsData.find(p => p.id === id);
    
    if(!product) return;
    currentActiveProduct = product;

    document.getElementById('modal-title').innerText = product.title;
    document.getElementById('modal-price').innerText = formatPrice(product.price);
    document.getElementById('modal-desc').innerText = product.desc;
    document.getElementById('modal-img-container').innerHTML = `<img src="${product.img}" alt="${product.title}">`;
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('productModal').classList.remove('active');
}

function addToCartFromModal() {
    if (!currentActiveProduct) return;
    let cart = getCartItems();
    let existingItem = cart.find(item => item.title === currentActiveProduct.title);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: currentActiveProduct.id, title: currentActiveProduct.title, price: currentActiveProduct.price, img: currentActiveProduct.img, quantity: 1 });
    }
    
    saveCartItems(cart);
    alert(`${currentActiveProduct.title} added to cart successfully!`);
    closeModal();
}


/* ==========================================================================
   5. SHOPPING CART ENGINE PAGE LOGICS
   ========================================================================== */
function renderCart() {
    const tableBody = document.getElementById('cart-table-body');
    const cartMainContainer = document.getElementById('cart-main-container');
    let cartItems = getCartItems();
    
    tableBody.innerHTML = '';
    if (cartItems.length === 0) {
        cartMainContainer.innerHTML = `
            <div style="text-align:center; width:100%; padding: 60px 0;">
                <i class="fa-solid fa-cart-shopping" style="font-size: 64px; color: #cbd5e1; margin-bottom: 20px;"></i>
                <h2 style="font-size: 24px; margin-bottom: 10px;">Your Cart is Empty!</h2>
                <p style="color: #64748b; margin-bottom: 25px;">Go back to the products page to add some items.</p>
                <a href="products.html" style="background-color: #ff6600; color: white; text-decoration: none; padding: 12px 30px; font-weight: bold; border-radius: 6px; display: inline-block;">Shop Products</a>
            </div>`;
        return;
    }

    let finalGrandTotal = 0;
    cartItems.forEach(item => {
        let itemSubtotal = item.price * item.quantity;
        finalGrandTotal += itemSubtotal;

        tableBody.innerHTML += `
            <tr>
                <td>
                    <div class="cart-item-info">
                        <img src="${item.img}" alt="${item.title}">
                        <h3>${item.title}</h3>
                    </div>
                </td>
                <td>${formatPrice(item.price)}</td>
                <td>
                    <div class="quantity-control">
                        <button onclick="changeQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    </div>
                </td>
                <td style="font-weight: 600; color: #0b1421;">${formatPrice(itemSubtotal)}</td>
                <td>
                    <button class="remove-btn" onclick="deleteItem(${item.id})"><i class="fa-regular fa-trash-can"></i></button>
                </td>
            </tr>`;
    });

    document.getElementById('summary-subtotal').innerText = formatPrice(finalGrandTotal);
    document.getElementById('summary-total').innerText = formatPrice(finalGrandTotal);
}

function changeQuantity(id, step) {
    let cartItems = getCartItems();
    let item = cartItems.find(p => p.id === id);
    if (item) {
        item.quantity += step;
        if (item.quantity < 1) item.quantity = 1;
        saveCartItems(cartItems);
        renderCart();
    }
}

function deleteItem(id) {
    let cartItems = getCartItems();
    cartItems = cartItems.filter(p => p.id !== id);
    saveCartItems(cartItems);
    if(cartItems.length === 0) { location.reload(); } else { renderCart(); }
}


/* ==========================================================================
   6. SECURITY ACCESS FIELD VISIBILITY TOGGLES
   ========================================================================== */
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('user-password');
    const eyeIcon = document.getElementById('eye-icon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.className = 'fa-regular fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        eyeIcon.className = 'fa-regular fa-eye';
    }
}

function togglePassword(inputId, eyeId) {
    const passwordInput = document.getElementById(inputId);
    const eyeIcon = document.getElementById(eyeId);

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.className = 'fa-regular fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        eyeIcon.className = 'fa-regular fa-eye';
    }
}