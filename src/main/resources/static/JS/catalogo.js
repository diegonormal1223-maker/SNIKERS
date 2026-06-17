
// STATE
let selectedSizes = [];
let selectedColors = [];
let maxPrice = 1000000; // Default high value
let currentView = 'grid';
let allProducts = [];
let currentFilteredProducts = [];
let currentPage = 1;
const itemsPerPage = 9;
let favoritosIds = []; // IDs de productos favoritos del usuario

// FETCH PRODUCTS
async function fetchProducts() {
    const loading = document.getElementById('loading');
    if (loading) loading.classList.add('show');

    try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Error fetching products');
        allProducts = await response.json();
        currentFilteredProducts = [...allProducts];

        // Initialize filters based on data
        generateFilters(allProducts);

        // Initial Render
        updateCatalogDisplay();

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('productsGrid').innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Error cargando productos. Intenta recargar la página.</p>';
    } finally {
        if (loading) loading.classList.remove('show');
    }
}

// GENERATE DYNAMIC FILTERS
function generateFilters(products) {
    const categories = new Set();
    const brands = new Set();
    const sizes = new Set();
    const colors = new Set();
    let maxProductPrice = 0;

    products.forEach(p => {
        if (p.category) categories.add(p.category.name);
        if (p.brand) brands.add(p.brand);
        if (p.sizes) p.sizes.split(',').forEach(s => sizes.add(s.trim()));
        if (p.colors) p.colors.split(',').forEach(c => colors.add(c.trim()));
        if (p.price > maxProductPrice) maxProductPrice = p.price;
    });

    // Render Categories
    const catContainer = document.querySelector('#filter-categories .filter-options');
    if (catContainer) {
        catContainer.innerHTML = Array.from(categories).map(c => `
            <div class="filter-option">
                <input type="checkbox" id="cat-${c}" value="${c}" onchange="applyFilters()">
                <label for="cat-${c}">${c}</label>
                <span class="filter-count">(${products.filter(p => p.category && p.category.name === c).length})</span>
            </div>
        `).join('');
    }

    // Render Brands
    const brandContainer = document.querySelector('#filter-brands .filter-options');
    if (brandContainer) {
        brandContainer.innerHTML = Array.from(brands).map(b => `
            <div class="filter-option">
                <input type="checkbox" id="brand-${b}" value="${b}" onchange="applyFilters()">
                <label for="brand-${b}">${b}</label>
                <span class="filter-count">(${products.filter(p => p.brand === b).length})</span>
            </div>
        `).join('');
    }

    // Render Sizes
    const sizeContainer = document.querySelector('#filter-sizes .size-grid');
    if (sizeContainer) {
        // Sort sizes numerically if possible
        const sortedSizes = Array.from(sizes).sort((a, b) => parseFloat(a) - parseFloat(b));
        sizeContainer.innerHTML = sortedSizes.map(s => `
            <div class="size-option" onclick="toggleSize(this, '${s}')">${s}</div>
        `).join('');
    }

    // Render Colors
    const colorContainer = document.querySelector('#filter-colors .color-grid');
    if (colorContainer) {
        colorContainer.innerHTML = Array.from(colors).map(c => `
            <div class="color-option" style="background: ${getColorCode(c)};" onclick="toggleColor(this, '${c}')" title="${c}"></div>
        `).join('');
    }

    // Update Price Range
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.max = maxProductPrice;
        priceRange.value = maxProductPrice;
        maxPrice = maxProductPrice;
        document.getElementById('maxPrice').textContent = `$${maxProductPrice.toLocaleString()}`;
    }
}

// HELPER: Get Color Code
function getColorCode(colorName) {
    const map = {
        'negro': '#000000', 'blanco': '#ffffff', 'rojo': '#ff0000', 'azul': '#0000ff',
        'verde': '#00ff00', 'amarillo': '#ffff00', 'naranja': '#ff6600', 'gris': '#808080',
        'morado': '#800080', 'rosa': '#ffc0cb', 'cafe': '#8b4513', 'beige': '#f5f5dc'
    };
    return map[colorName.toLowerCase()] || colorName;
}

// UPDATE CATALOG DISPLAY (Pagination + Render)
function updateCatalogDisplay() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToShow = currentFilteredProducts.slice(startIndex, endIndex);

    renderProducts(productsToShow);
    renderPagination();

    // Update count
    const productCount = document.getElementById('productCount');
    if (productCount) productCount.textContent = currentFilteredProducts.length;
}

// RENDER PRODUCTS
function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    const emptyState = document.getElementById('emptyState');

    grid.innerHTML = '';

    if (products.length === 0) {
        if (emptyState) emptyState.classList.add('show');
        return;
    }

    if (emptyState) emptyState.classList.remove('show');

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = `product-card ${currentView === 'list' ? 'list-view' : ''}`;

        // CORRECCIÓN: Usar estrictamente product.imageUrl
        const imgSrc = product.imageUrl || 'img/placeholder.png';

        // Determine badge
        let badgeHtml = '';
        if (product.stock < 5) {
            badgeHtml = '<span class="product-badge limited">POCAS UNIDADES</span>';
        } else if (product.comparePrice && product.price < product.comparePrice) {
            badgeHtml = '<span class="product-badge sale">OFERTA</span>';
        }

        // Colors Logic
        const productColors = product.colors ? product.colors.split(',').map(c => c.trim()) : [];
        const colorsHtml = productColors.map(c =>
            `<div class="color-dot" style="background: ${getColorCode(c)};" title="${c}"></div>`
        ).join('');

        // Sizes Logic (Range)
        const productSizes = product.sizes ? product.sizes.split(',').map(s => parseFloat(s.trim())).sort((a, b) => a - b) : [];
        let sizesHtml = '';
        if (productSizes.length > 0) {
            const minSize = productSizes[0];
            const maxSize = productSizes[productSizes.length - 1];
            sizesHtml = `<div class="product-sizes" style="font-size: 12px; color: var(--text-gray); margin-bottom: 5px;">Tallas: ${minSize} - ${maxSize}</div>`;
        }

        card.innerHTML = `
            ${badgeHtml}
            <button class="favorite-btn ${favoritosIds.includes(product.id) ? 'active' : ''}" onclick="toggleFavorite(this, ${product.id})">${favoritosIds.includes(product.id) ? '♥' : '♡'}</button>
            <div class="product-image">
                <img src="${imgSrc}" alt="${product.name}" onerror="this.src='img/placeholder.png'">
            </div>
            <div class="product-info">
                <div class="product-category">${product.category ? product.category.name : 'General'}</div>
                <h3 class="product-name">${product.name}</h3>
                
                <div class="product-colors" style="display: flex; gap: 5px; margin-bottom: 10px;">
                    ${colorsHtml}
                </div>
                
                ${sizesHtml}

                <div class="product-price">
                    $${parseFloat(product.price).toLocaleString()}
                </div>
                
                <div class="product-actions">
                    <button class="add-cart-btn" onclick="window.location.href='detalleproducto.html?id=${product.id}'">Ver Opciones</button>
                    <button class="quick-view-btn" onclick="window.location.href='detalleproducto.html?id=${product.id}'">👁</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// RENDER PAGINATION
function renderPagination() {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(currentFilteredProducts.length / itemsPerPage);
    paginationContainer.innerHTML = '';

    if (totalPages <= 1) return;

    // Prev Button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.textContent = '←';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            updateCatalogDisplay();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    paginationContainer.appendChild(prevBtn);

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => {
            currentPage = i;
            updateCatalogDisplay();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        paginationContainer.appendChild(pageBtn);
    }

    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.textContent = '→';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            updateCatalogDisplay();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    paginationContainer.appendChild(nextBtn);
}

// APPLY FILTERS
function applyFilters() {
    // Get selected categories
    const selectedCategories = Array.from(document.querySelectorAll('#filter-categories input:checked'))
        .map(cb => cb.value);

    // Get selected brands
    const selectedBrands = Array.from(document.querySelectorAll('#filter-brands input:checked'))
        .map(cb => cb.value);

    // Filter products
    currentFilteredProducts = allProducts.filter(product => {
        const categoryMatch = selectedCategories.length === 0 || (product.category && selectedCategories.includes(product.category.name));
        const brandMatch = selectedBrands.length === 0 || (product.brand && selectedBrands.includes(product.brand));
        const priceMatch = product.price <= maxPrice;

        // Size Match
        const productSizes = product.sizes ? product.sizes.split(',').map(s => s.trim()) : [];
        const sizeMatch = selectedSizes.length === 0 || selectedSizes.some(s => productSizes.includes(s));

        // Color Match
        const productColors = product.colors ? product.colors.split(',').map(c => c.trim()) : [];
        const colorMatch = selectedColors.length === 0 || selectedColors.some(c => productColors.includes(c));

        return categoryMatch && brandMatch && priceMatch && sizeMatch && colorMatch;
    });

    currentPage = 1; // Reset to first page
    updateCatalogDisplay();
    updateActiveFilters(selectedCategories, selectedBrands);
}

// UPDATE PRICE
function updatePrice(value) {
    maxPrice = value;
    document.getElementById('maxPrice').textContent = `$${parseInt(value).toLocaleString()}`;
    applyFilters();
}

// TOGGLE SIZE
function toggleSize(element, size) {
    element.classList.toggle('active');
    const index = selectedSizes.indexOf(size);
    if (index > -1) {
        selectedSizes.splice(index, 1);
    } else {
        selectedSizes.push(size);
    }
    applyFilters();
}

// TOGGLE COLOR
function toggleColor(element, color) {
    element.classList.toggle('active');
    const index = selectedColors.indexOf(color);
    if (index > -1) {
        selectedColors.splice(index, 1);
    } else {
        selectedColors.push(color);
    }
    applyFilters();
}

// UPDATE ACTIVE FILTERS CHIPS
function updateActiveFilters(cats, brands) {
    const container = document.getElementById('activeFilters');
    if (!container) return;

    container.innerHTML = '';

    // Categories
    cats.forEach(c => addFilterChip(c, () => {
        document.getElementById(`cat-${c}`).checked = false;
        applyFilters();
    }));

    // Brands
    brands.forEach(b => addFilterChip(b, () => {
        document.getElementById(`brand-${b}`).checked = false;
        applyFilters();
    }));

    // Sizes
    selectedSizes.forEach(s => addFilterChip(`Talla ${s}`, () => {
        const el = Array.from(document.querySelectorAll('.size-option')).find(e => e.textContent === s);
        if (el) toggleSize(el, s);
    }));

    // Colors
    selectedColors.forEach(c => addFilterChip(c, () => {
        // Reset color selection logic is tricky without direct ref, so we just rebuild
        selectedColors = selectedColors.filter(color => color !== c);
        // Update UI
        document.querySelectorAll('.color-option').forEach(el => {
            if (el.getAttribute('onclick').includes(`'${c}'`)) el.classList.remove('active');
        });
        applyFilters();
    }));
}

function addFilterChip(text, removeCallback) {
    const container = document.getElementById('activeFilters');
    const chip = document.createElement('div');
    chip.className = 'filter-chip';
    chip.innerHTML = `${text} <button>×</button>`;
    chip.querySelector('button').onclick = removeCallback;
    container.appendChild(chip);
}

// CLEAR FILTERS
function clearAllFilters() {
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.value = priceRange.max;
        updatePrice(priceRange.max);
    }

    selectedSizes = [];
    document.querySelectorAll('.size-option').forEach(el => el.classList.remove('active'));

    selectedColors = [];
    document.querySelectorAll('.color-option').forEach(el => el.classList.remove('active'));

    applyFilters();
}

// SORT PRODUCTS
function sortProducts(sortBy) {
    currentFilteredProducts.sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        // Add other sort options if needed (e.g., newest, relevance)
        return 0;
    });

    updateCatalogDisplay();
}

// SET VIEW
function setView(view) {
    currentView = view;
    const grid = document.getElementById('productsGrid');
    const viewBtns = document.querySelectorAll('.view-btn');

    viewBtns.forEach(btn => btn.classList.remove('active'));
    if (view === 'grid') viewBtns[0].classList.add('active');
    else viewBtns[1].classList.add('active');

    if (view === 'list') {
        grid.classList.add('list-view');
        document.querySelectorAll('.product-card').forEach(card => card.classList.add('list-view'));
    } else {
        grid.classList.remove('list-view');
        document.querySelectorAll('.product-card').forEach(card => card.classList.remove('list-view'));
    }
}

// ADD TO CART
async function addToCart(button, productId) {
    const token = localStorage.getItem('token');
    if (!token) {
        mostrarNotificacion('Debes iniciar sesión', 'error');
        setTimeout(() => window.location.href = 'loginyregistro.html', 1500);
        return;
    }

    const originalText = button.textContent;
    button.textContent = '...';
    button.disabled = true;

    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                productId: productId,
                quantity: 1
            })
        });

        if (response.ok) {
            button.textContent = '✓';
            button.style.background = 'var(--neon-green)';
            button.style.color = 'var(--dark-bg)';
            mostrarNotificacion('🛒 Producto agregado al carrito');
            window.dispatchEvent(new Event('cartUpdated'));
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
                button.style.color = '';
                button.disabled = false;
            }, 2000);
        } else {
            mostrarNotificacion('Error al agregar', 'error');
            button.textContent = originalText;
            button.disabled = false;
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error de conexión', 'error');
        button.textContent = originalText;
        button.disabled = false;
    }
}

// TOGGLE FAVORITE
async function toggleFavorite(button, productId) {
    const token = localStorage.getItem('token');
    if (!token) {
        mostrarNotificacion('Inicia sesión para favoritos', 'error');
        return;
    }
    try {
        const response = await fetch(`/api/favorites/${productId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            button.classList.toggle('active');
            button.textContent = button.classList.contains('active') ? '♥' : '♡';
            mostrarNotificacion(button.classList.contains('active') ? '❤️ Agregado a favoritos' : '💔 Eliminado de favoritos');
            window.dispatchEvent(new Event('favoritesUpdated'));
        }
    } catch (error) {
        console.error(error);
    }
}

// MOSTRAR NOTIFICACIÓN
function mostrarNotificacion(mensaje, tipo = 'exito') {
    const notificacion = document.getElementById('notificacion');
    if (!notificacion) return;
    notificacion.textContent = mensaje;
    if (tipo === 'error') notificacion.classList.add('error');
    else notificacion.classList.remove('error');
    notificacion.classList.add('mostrar');
    setTimeout(() => notificacion.classList.remove('mostrar'), 3000);
}

// TOGGLE MOBILE FILTERS
function toggleMobileFilters() {
    const overlay = document.getElementById('filtersOverlay');
    if (overlay) overlay.classList.toggle('show');
}

// CARGAR FAVORITOS DEL USUARIO
async function cargarFavoritosUsuario() {
    const token = localStorage.getItem('token');
    if (!token) return; // Si no hay sesión, no hay favoritos

    try {
        const response = await fetch('/api/favorites', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const favoritos = await response.json();
            // Extraer solo los IDs de productos
            favoritosIds = favoritos.map(f => f.product.id);
            console.log('✅ Favoritos cargados:', favoritosIds.length);
        }
    } catch (error) {
        console.error('Error cargando favoritos:', error);
    }
}

// INITIAL LOAD
document.addEventListener('DOMContentLoaded', async () => {
    // PRIMERO cargar favoritos antes de renderizar productos
    await cargarFavoritosUsuario();

    // LUEGO cargar productos
    fetchProducts();

    // Global search
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            currentFilteredProducts = allProducts.filter(p =>
                p.name.toLowerCase().includes(term) ||
                (p.category && p.category.name.toLowerCase().includes(term))
            );
            currentPage = 1;
            updateCatalogDisplay();
        });
    }
});
