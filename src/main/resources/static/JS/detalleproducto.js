// ===== VARIABLES GLOBALES =====
let currentProduct = null;
let selectedSize = null;
let selectedColor = null;
let quantity = 1;

// ===== UTILIDADES =====
const formatPrice = (n, currency = 'USD') => {
    const locales = {
        USD: 'en-US',
        COP: 'es-CO',
        EUR: 'de-DE',
        GBP: 'en-GB'
    };
    const locale = locales[currency] || 'en-US';
    const digits = currency === 'COP' ? 0 : 2;
    return Number(n).toLocaleString(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    });
};

// ===== MAPEO DE COLORES A HEX =====
const colorMap = {
    'negro': '#000000',
    'blanco': '#ffffff',
    'rojo': '#ff0000',
    'azul': '#0000ff',
    'verde': '#00ff00',
    'amarillo': '#ffff00',
    'gris': '#808080',
    'rosa': '#ff69b4',
    'naranja': '#ffa500',
    'morado': '#800080'
};

function getColorHex(colorName) {
    const name = colorName.toLowerCase().trim();
    return colorMap[name] || 'var(--neon-green)';
}

// ===== OBTENER ID DEL PRODUCTO DE LA URL =====
function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}

// ===== CARGAR PRODUCTO =====
async function loadProduct() {
    const productId = getProductIdFromURL();

    if (!productId) {
        showNotification("❌ No se especificó un producto", "warning");
        setTimeout(() => window.location.href = "index.html", 2000);
        return;
    }

    try {
        const response = await fetch(`/api/products/${productId}`);

        if (!response.ok) {
            throw new Error("Producto no encontrado");
        }

        currentProduct = await response.json();
        renderProduct(currentProduct);
    } catch (error) {
        console.error("Error al cargar producto:", error);
        showNotification("❌ Error al cargar el producto", "warning");
        setTimeout(() => window.location.href = "index.html", 2000);
    }
}

// ===== RENDERIZAR PRODUCTO =====
function renderProduct(product) {
    // Título de la página
    document.getElementById("pageTitle").textContent = `${product.name} - SNIKER`;

    // Breadcrumb
    document.getElementById("breadcrumbProduct").textContent = product.name;

    // Imagen
    const productImage = document.getElementById("mainImg");
    if (product.imageUrl) {
        productImage.src = product.imageUrl;
        productImage.alt = product.name;
    } else {
        productImage.src = "https://via.placeholder.com/500x500?text=Sin+Imagen";
    }

    // Categoría (mapear ID a nombre)
    const categoryNames = {
        1: "Casual",
        2: "Urbanas",
        3: "Retro",
        4: "Deportivo"
    };
    document.getElementById("productCategory").textContent = categoryNames[product.categoryId] || "Sneakers";

    // Información básica
    document.getElementById("productName").textContent = product.name;
    document.getElementById("productSubtitle").textContent = product.description || "Diseño exclusivo con estilo único.";
    document.getElementById("productSKU").textContent = product.sku;
    document.getElementById("productPrice").textContent = formatPrice(product.price, 'USD');
    document.getElementById("productBrand").textContent = product.brand || "No especificada";
    document.getElementById("productDescription").textContent = product.description || "Sin descripción disponible.";
    document.dispatchEvent(new CustomEvent('snkrProductLoaded', { detail: { priceUSD: product.price } }));

    // Stock
    const stockElement = document.getElementById("productStock");
    const stockInfo = document.getElementById("stockInfo");
    const outOfStockMessage = document.getElementById("outOfStockMessage");
    const addToCartBtn = document.getElementById("addToCartBtn");

    if (product.stock === 0) {
        stockElement.textContent = "Stock: Agotado";
        stockElement.style.color = "#ff3939";
        stockInfo.textContent = "";
        outOfStockMessage.style.display = "block";
        addToCartBtn.disabled = true;
    } else {
        stockElement.textContent = `Stock: ${product.stock} unidades`;
        stockElement.style.color = product.stock <= 10 ? "#ff3939" : "var(--success-green)";
        stockInfo.textContent = `✓ En stock (${product.stock} unidades)`;
    }

    // Parsear y renderizar colores
    renderColors(product.colors);

    // Parsear y renderizar tallas
    renderSizes(product.sizes);
}

// ===== RENDERIZAR COLORES =====
function renderColors(colorsString) {
    const colorsContainer = document.getElementById("colors-container");
    colorsContainer.innerHTML = "";

    if (!colorsString || colorsString.trim() === "") {
        colorsContainer.innerHTML = '<p style="color: var(--text-gray); font-size: 14px;">No hay colores disponibles</p>';
        return;
    }

    // Split por coma y crear botones con clase .color-option
    const colors = colorsString.split(",").map(c => c.trim()).filter(c => c !== "");
    const colorLabel = document.getElementById("colorLabel");

    colors.forEach((color, index) => {
        const div = document.createElement("div");
        div.className = "color-option";

        // Intentar mapear a color hex, sino usar gradiente
        const colorHex = getColorHex(color);
        div.style.background = colorHex;

        // Si el color es claro, usar texto oscuro
        if (['blanco', 'amarillo'].includes(color.toLowerCase())) {
            div.style.border = '2px solid #333';
        }

        div.title = color;
        div.onclick = () => selectColor(color, div, colorLabel);

        // Seleccionar el primer color por defecto
        if (index === 0) {
            div.classList.add('active');
            selectedColor = color;
            colorLabel.textContent = `Color: ${color}`;
        }

        colorsContainer.appendChild(div);
    });
}

// ===== RENDERIZAR TALLAS =====
function renderSizes(sizesString) {
    const sizesContainer = document.getElementById("sizes-container");
    sizesContainer.innerHTML = "";

    if (!sizesString || sizesString.trim() === "") {
        sizesContainer.innerHTML = '<p style="color: var(--text-gray); font-size: 14px;">No hay tallas disponibles</p>';
        return;
    }

    // Split por coma y crear divs con clase .size-option
    const sizes = sizesString.split(",").map(s => s.trim()).filter(s => s !== "");

    sizes.forEach(size => {
        const div = document.createElement("div");
        div.className = "size-option";
        div.textContent = size;
        div.onclick = () => selectSize(size, div);
        sizesContainer.appendChild(div);
    });
}

// ===== SELECCIONAR COLOR =====
function selectColor(color, element, labelElement) {
    // Remover selección anterior
    document.querySelectorAll("#colors-container .color-option").forEach(opt => {
        opt.classList.remove("active");
    });

    // Marcar nueva selección
    element.classList.add("active");
    selectedColor = color;

    // Actualizar label
    labelElement.textContent = `Color: ${color}`;

    // Ocultar error
    document.getElementById("colorError").style.display = "none";
}

// ===== SELECCIONAR TALLA =====
function selectSize(size, element) {
    if (element.classList.contains('unavailable')) {
        showNotification('⚠️ Esta talla no está disponible', 'warning');
        return;
    }

    // Remover selección anterior
    document.querySelectorAll("#sizes-container .size-option").forEach(opt => {
        opt.classList.remove("active");
    });

    // Marcar nueva selección
    element.classList.add("active");
    selectedSize = size;

    // Ocultar error
    document.getElementById("sizeError").style.display = "none";
}

// ===== ACTUALIZAR CANTIDAD =====
function updateQuantity(change) {
    const newQty = quantity + change;
    const maxStock = currentProduct ? Math.min(currentProduct.stock, 10) : 10;

    if (newQty < 1) return;

    if (newQty > maxStock) {
        showNotification('⚠️ Máximo 10 unidades por compra', 'warning');
        return;
    }

    quantity = newQty;
    document.getElementById("quantity").textContent = quantity;
}

// ===== NOTIFICACION =====
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;

    if (type === 'warning') {
        notification.style.background = 'linear-gradient(135deg, #ffaa00, #ff8800)';
    } else {
        notification.style.background = 'linear-gradient(135deg, var(--neon-green), #2ecc40)';
    }

    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ===== AGREGAR AL CARRITO =====
async function addToCart() {
    // Validar talla
    if (!selectedSize) {
        document.getElementById("sizeError").style.display = "block";
        showNotification('⚠️ Por favor selecciona una talla', 'warning');
        return;
    }

    // Validar color
    if (!selectedColor) {
        document.getElementById("colorError").style.display = "block";
        showNotification('⚠️ Por favor selecciona un color', 'warning');
        return;
    }

    // Validar cantidad máxima
    if (quantity > 10) {
        showNotification('⚠️ No puedes agregar más de 10 unidades al carrito', 'warning');
        return;
    }

    // Verificar token
    const token = localStorage.getItem("token");
    if (!token) {
        showNotification("⚠️ Debes iniciar sesión para agregar productos al carrito", "warning");
        setTimeout(() => window.location.href = "loginyregistro.html", 1500);
        return;
    }

    // Preparar datos
    const cartData = {
        productId: currentProduct.id,
        quantity: quantity,
        size: selectedSize,
        color: selectedColor
    };

    try {
        const response = await fetch("/api/cart/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(cartData)
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
            }
            throw new Error("Error al agregar al carrito");
        }

        showNotification(`✓ Agregado al carrito: ${quantity}x ${currentProduct.name} (Talla ${selectedSize}, Color ${selectedColor})`);
    } catch (error) {
        console.error("Error:", error);
        if (error.message.includes("Sesión expirada")) {
            showNotification("❌ " + error.message, "warning");
            localStorage.removeItem("token");
            setTimeout(() => window.location.href = "loginyregistro.html", 2000);
        } else {
            showNotification("❌ " + error.message, "warning");
        }
    }
}

// ===== CAMBIAR TAB =====
function switchTab(tabName) {
    // Remover active de todos
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Agregar active al seleccionado
    event.target.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// ===== IMAGE ZOOM =====
document.addEventListener('DOMContentLoaded', () => {
    const mainImageContainer = document.getElementById('mainImageContainer');
    const mainImg = document.getElementById('mainImg');

    if (mainImageContainer && mainImg) {
        mainImageContainer.addEventListener('click', function () {
            if (mainImg.style.transform === 'scale(2)') {
                mainImg.style.transform = 'scale(1)';
                mainImg.style.cursor = 'zoom-in';
            } else {
                mainImg.style.transform = 'scale(2)';
                mainImg.style.cursor = 'zoom-out';
            }
        });
    }
});

// ===== EVENT LISTENERS =====
document.addEventListener("DOMContentLoaded", () => {
    console.log("%c🛍️ SNIKER - Detalle de Producto (Advanced Design)", "color: #39ff14; font-size: 20px; font-weight: bold;");

    // Cargar producto
    loadProduct();

    // Botón agregar al carrito
    const addToCartBtn = document.getElementById("addToCartBtn");
    addToCartBtn.addEventListener("click", addToCart);

    // Botones de cantidad
    document.getElementById("decreaseBtn").addEventListener("click", () => updateQuantity(-1));
    document.getElementById("increaseBtn").addEventListener("click", () => updateQuantity(1));
});
