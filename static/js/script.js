
const products = [
    { id: 1, name: "Pastel Crochet Bouquet", price: 899, art: "💐", tag: "BESTSELLER", desc: "A beautiful handmade bouquet for special moments." },
    { id: 2, name: "Jellyfish Keychain", price: 250, art: "🪼", tag: "POPULAR", desc: "A cute little crochet companion for your everyday." },
    { id: 3, name: "Blush Pink Scrunchie", price: 200, art: "🎀", tag: "NEW", desc: "A soft handmade accessory for your collection." },
    { id: 4, name: "Mini Tulip Bouquet", price: 599, art: "🌷", tag: "HANDMADE", desc: "A charming little bouquet made with care." },
    { id: 5, name: "Crochet Teddy Bear", price: 749, art: "🧸", tag: "FAVOURITE", desc: "A lovely handmade gift for someone special." },
    { id: 6, name: "Daisy Flower Keychain", price: 199, art: "🌼", tag: "NEW", desc: "A tiny flower to brighten up your day." },
    { id: 7, name: "Sunflower Bouquet", price: 999, art: "🌻", tag: "SPECIAL", desc: "A cheerful handmade sunflower arrangement." },
    { id: 8, name: "Crochet Mini Bag", price: 799, art: "👜", tag: "TRENDING", desc: "A cute handmade bag for everyday styling." },
    { id: 9, name: "Rose Crochet Flower", price: 299, art: "🌹", tag: "GIFT PICK", desc: "A handmade rose that lasts beyond the moment." },
    { id: 10, name: "Cute Crochet Bunny", price: 649, art: "🐰", tag: "POPULAR", desc: "A soft and adorable crochet creation." },
    { id: 11, name: "Pastel Flower Clip", price: 149, art: "🌸", tag: "UNDER ₹200", desc: "A little handmade detail for your hair." },
    { id: 12, name: "Mixed Flower Bouquet", price: 1199, art: "💝", tag: "GIFT SPECIAL", desc: "A colourful bouquet for thoughtful gifting." }
];

let currentPage = 1;
const perPage = 8;
let cart = [];
let wishlist = [];
let activeProduct = null;
let galleryIndex = 0;

function renderProducts() {
    const grid = document.getElementById("product-grid");
    const sort = document.getElementById("sort")?.value || "default";
    let list = [...products];

    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);

    const start = (currentPage - 1) * perPage;
    const visible = list.slice(start, start + perPage);

    grid.innerHTML = visible.map(p => `
        <article class="product-card">
            <div class="product-image" onclick="openProduct(${p.id})">
                <span class="product-tag">${p.tag}</span>
                <span class="product-art">${p.art}</span>
                <button class="wish-btn ${wishlist.includes(p.id) ? "active" : ""}"
                    onclick="event.stopPropagation(); toggleWish(${p.id})">
                    ${wishlist.includes(p.id) ? "♥" : "♡"}
                </button>
                <button class="quick-add" onclick="event.stopPropagation(); addToCart(${p.id})">
                    ADD TO BAG
                </button>
            </div>
            <div class="product-info" onclick="openProduct(${p.id})">
                <h3>${p.name}</h3>
                <p>Handmade with love</p>
                <div class="product-price">₹${p.price.toLocaleString("en-IN")}</div>
            </div>
        </article>
    `).join("");

    renderPagination(list.length);
}

function renderPagination(total) {
    const pages = Math.ceil(total / perPage);
    const container = document.getElementById("pagination");

    container.innerHTML = Array.from({ length: pages }, (_, i) => `
        <button class="${currentPage === i + 1 ? "active" : ""}"
            onclick="goToPage(${i + 1})">${i + 1}</button>
    `).join("");
}

function goToPage(page) {
    currentPage = page;
    renderProducts();
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
}

function sortProducts() {
    currentPage = 1;
    renderProducts();
}

function updateCounts() {
    document.getElementById("cart-count").textContent =
        cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById("wish-count").textContent = wishlist.length;
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) existing.qty++;
    else cart.push({ ...product, qty: 1 });

    updateCounts();
    alert(product.name + " added to your bag!");
}

function toggleWish(id) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(item => item !== id);
    } else {
        wishlist.push(id);
    }
    updateCounts();
    renderProducts();
}

function showModal(content) {
    closeModal();

    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.id = "active-modal";

    backdrop.innerHTML = `
        <div class="modal">
            <button class="modal-close" onclick="closeModal()">×</button>
            ${content}
        </div>
    `;

    backdrop.addEventListener("click", e => {
        if (e.target === backdrop) closeModal();
    });

    document.body.appendChild(backdrop);
}

function closeModal() {
    document.getElementById("active-modal")?.remove();
}

function openProduct(id) {
    activeProduct = products.find(p => p.id === id);
    galleryIndex = 0;
    renderProductDetail();
}

function renderProductDetail() {
    if (!activeProduct) return;

    const photos = [
        activeProduct.art, "🌷", "🌸", "🧶", "💐", "🎀", "💝"
    ];

    showModal(`
        <div class="detail-layout">
            <div>
                <div class="gallery-main" id="gallery-main">${photos[galleryIndex]}</div>
                <div class="gallery-controls">
                    <button onclick="changePhoto(-1)">←</button>
                    <span>${galleryIndex + 1} / 7</span>
                    <button onclick="changePhoto(1)">→</button>
                </div>
                <div class="gallery-thumbs">
                    ${photos.map((photo, i) => `
                        <button class="${galleryIndex === i ? "active" : ""}"
                            onclick="selectPhoto(${i})">${photo}</button>
                    `).join("")}
                </div>
            </div>
            <div class="detail-info">
                <p class="eyebrow">HANDMADE COLLECTION</p>
                <h2>${activeProduct.name}</h2>
                <div class="detail-price">₹${activeProduct.price.toLocaleString("en-IN")}</div>
                <p>${activeProduct.desc}</p>
                <label for="product-qty">Quantity</label>
                <input id="product-qty" type="number" min="1" max="10" value="1">
                <label for="product-note">Customisation request (optional)</label>
                <input id="product-note" type="text" placeholder="Colour or other preference">
                <button class="modal-action" onclick="addDetailToCart()">ADD TO BAG</button>
            </div>
        </div>
    `);
}

function changePhoto(direction) {
    galleryIndex = (galleryIndex + direction + 7) % 7;
    renderProductDetail();
}

function selectPhoto(index) {
    galleryIndex = index;
    renderProductDetail();
}

function addDetailToCart() {
    const qty = Math.max(1, Math.min(10,
        parseInt(document.getElementById("product-qty").value, 10) || 1
    ));
    const note = document.getElementById("product-note").value.trim();
    const existing = cart.find(item => item.id === activeProduct.id);

    if (existing) existing.qty += qty;
    else cart.push({ ...activeProduct, qty, note });

    updateCounts();
    closeModal();
    alert("Added to bag successfully!");
}

function showCart() {
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    showModal(`
        <h2>Your Shopping Bag</h2>
        <div class="panel-list">
            ${cart.length ? cart.map(item => `
                <div class="panel-row">
                    <span>${item.art} ${item.name} × ${item.qty}</span>
                    <strong>₹${(item.price * item.qty).toLocaleString("en-IN")}</strong>
                    <button onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            `).join("") : `<p class="empty-message">Your bag is waiting for something lovely.</p>`}
        </div>
        <h3 style="margin-top:20px">Total: ₹${total.toLocaleString("en-IN")}</h3>
        <p style="margin-top:10px;color:#8b7b73;font-size:12px">
            Demo cart only. Checkout and payment will be connected after setup.
        </p>
    `);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCounts();
    showCart();
}

function showWishlist() {
    const saved = products.filter(p => wishlist.includes(p.id));

    showModal(`
        <h2>Your Wishlist ♡</h2>
        <div class="panel-list">
            ${saved.length ? saved.map(p => `
                <div class="panel-row">
                    <span>${p.art} ${p.name}</span>
                    <strong>₹${p.price}</strong>
                    <button onclick="toggleWish(${p.id}); showWishlist()">Remove</button>
                </div>
            `).join("") : `<p class="empty-message">Your wishlist is empty for now.</p>`}
        </div>
    `);
}

function searchProducts() {
    const query = prompt("Search for a handmade favourite:");
    if (!query) return;

    const results = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    const grid = document.getElementById("product-grid");
    grid.innerHTML = results.length ? results.map(p => `
        <article class="product-card">
            <div class="product-image" onclick="openProduct(${p.id})">
                <span class="product-art">${p.art}</span>
            </div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <div class="product-price">₹${p.price}</div>
            </div>
        </article>
    `).join("") : `<p>No matching products found.</p>`;

    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
}

function subscribe(event) {
    event.preventDefault();
    alert("Thank you for subscribing!");
    event.target.reset();
}

renderProducts();
updateCounts();
