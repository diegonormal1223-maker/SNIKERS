// ===== UTILIDADES =====
const formatPrice = (n) =>
  Number(n).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

// ===== VARIABLES GLOBALES =====
let categoriaActual = "todas";
let productIdActualAjuste = null;
let stockActualAjuste = 0;

// ===== FUNCION PARA COLAPSAR/EXPANDIR SIDEBAR =====
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar?.classList.toggle("collapsed");
}

// ===== FUNCION PARA BUSCAR PRODUCTOS =====
function buscarProductos() {
  const input = document.getElementById("searchInput");
  const filtro = (input?.value ?? "").toUpperCase();
  const productos = document.querySelectorAll(".product-card");
  let contadorVisible = 0;

  productos.forEach((producto) => {
    const nombre = (producto.querySelector(".product-name")?.textContent || "").toUpperCase();
    const sku = (producto.querySelector(".product-sku")?.textContent || "").toUpperCase();
    if (nombre.indexOf(filtro) > -1 || sku.indexOf(filtro) > -1) {
      producto.style.display = "";
      contadorVisible++;
    } else {
      producto.style.display = "none";
    }
  });

  actualizarEstadisticas();
}

// ===== FUNCION PARA FILTRAR POR CATEGORIA =====
function filtrarPorCategoria(categoria) {
  categoriaActual = categoria;

  document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"));
  (window.event?.target)?.classList.add("active");

  const productos = document.querySelectorAll(".product-card");
  let contadorVisible = 0;

  productos.forEach((producto) => {
    const catProducto = producto.getAttribute("data-category");
    if (categoria === "todas" || catProducto === categoria) {
      producto.style.display = "";
      contadorVisible++;
    } else {
      producto.style.display = "none";
    }
  });

  actualizarEstadisticas();
}

// ===== FUNCION PARA FILTRAR POR STOCK =====
function filtrarPorStock() {
  const filtro = document.getElementById("stockFilter")?.value || "todos";
  const productos = document.querySelectorAll(".product-card");
  let contadorVisible = 0;

  productos.forEach((producto) => {
    const stock = parseInt(producto.getAttribute("data-stock") || "0", 10);
    let mostrar = false;

    switch (filtro) {
      case "todos":
        mostrar = true;
        break;
      case "alto":
        mostrar = stock >= 30;
        break;
      case "medio":
        mostrar = stock >= 11 && stock <= 29;
        break;
      case "bajo":
        mostrar = stock <= 10 && stock > 0;
        break;
      case "agotado":
        mostrar = stock === 0;
        break;
    }

    producto.style.display = mostrar ? "" : "none";
    if (mostrar) contadorVisible++;
  });

  actualizarEstadisticas();
}

// ===== FUNCION PARA ORDENAR PRODUCTOS =====
function ordenarProductos() {
  const orden = document.getElementById("sortFilter")?.value || "nombre";
  const grid = document.getElementById("productsGrid");
  const productos = Array.from(document.querySelectorAll(".product-card"));

  productos.sort((a, b) => {
    switch (orden) {
      case "nombre":
        return a.querySelector(".product-name").textContent.localeCompare(
          b.querySelector(".product-name").textContent
        );
      case "precio-asc":
        return parseFloat(a.getAttribute("data-price")) - parseFloat(b.getAttribute("data-price"));
      case "precio-desc":
        return parseFloat(b.getAttribute("data-price")) - parseFloat(a.getAttribute("data-price"));
      case "stock-asc":
        return parseInt(a.getAttribute("data-stock")) - parseInt(b.getAttribute("data-stock"));
      case "stock-desc":
        return parseInt(b.getAttribute("data-stock")) - parseInt(a.getAttribute("data-stock"));
    }
  });

  productos.forEach((p) => grid.appendChild(p));
}

// ===== FUNCION PARA CERRAR MODAL =====
function cerrarModal(modalId) {
  const modal = document.getElementById(modalId);
  modal?.classList.remove("active");
}

// ===== FUNCION PARA VER DETALLES DE PRODUCTO =====
async function verDetallesProducto(productId) {
  try {
    const response = await fetch(`/api/products/${productId}`);
    if (!response.ok) throw new Error("Error al cargar detalles");

    const product = await response.json();
    const content = document.getElementById("detallesContent");

    content.innerHTML = `
      <div style="line-height: 2;">
        <h4 style="color: var(--neon-green); margin-bottom: 15px; font-size: 20px;">${product.name}</h4>
        <p><strong>SKU:</strong> ${product.sku}</p>
        <p><strong>Categoría:</strong> ${product.category ? product.category.name : "N/A"}</p>
        <p><strong>Marca:</strong> ${product.brand || "N/A"}</p>
        <p><strong>Precio:</strong> <span style="color: var(--success-green); font-weight: 700; font-size: 18px;">${formatPrice(product.price)}</span></p>
        <p><strong>Stock:</strong> <span style="color: var(--neon-green); font-weight: 700; font-size: 18px;">${product.stock} unidades</span></p>
        <p><strong>Colores:</strong> ${product.colors || "N/A"}</p>
        <p><strong>Tallas:</strong> ${product.sizes || "N/A"}</p>
        ${product.description ? `<p><strong>Descripción:</strong> ${product.description}</p>` : ""}
        ${product.imageUrl ? `<p><strong>Imagen:</strong><br><img src="${product.imageUrl}" style="max-width: 200px; margin-top: 10px; border-radius: 8px;" alt="${product.name}"></p>` : ""}
        <hr style="border-color: rgba(57, 255, 20, 0.2); margin: 20px 0;">
        <p><strong>Valor en Inventario:</strong> ${formatPrice(product.price * product.stock)}</p>
        <p><strong>Estado:</strong> ${product.status}</p>
      </div>
    `;

    document.getElementById("modalDetalles").classList.add("active");
  } catch (error) {
    console.error("Error:", error);
    alert("❌ Error al cargar los detalles del producto");
  }
}

// ===== FUNCION PARA INACTIVAR PRODUCTO =====
async function eliminarProducto(productId, productName) {
  const confirmar = confirm(
    `⚠️ ¿Seguro que deseas INACTIVAR este producto?\n\n${productName}\n\nEl producto se marcará como INACTIVO y no aparecerá en el inventario activo.`
  );

  if (!confirmar) return;

  try {
    // Obtener token JWT del localStorage
    const token = localStorage.getItem("token");
    const headers = {};

    // Agregar Authorization header si hay token
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
      headers: headers
    });

    if (!response.ok) {
      if (response.status === 403 || response.status === 401) {
        throw new Error("No tienes permisos para inactivar productos. Por favor, inicia sesión.");
      }
      throw new Error("Error al inactivar");
    }

    alert(`✅ Producto "${productName}" inactivado correctamente`);
    fetchProducts();
  } catch (error) {
    console.error("Error:", error);
    alert(`❌ ${error.message || "Error al inactivar el producto"}`);
  }
}

// ===== FUNCION PARA AJUSTAR STOCK DE UN PRODUCTO =====
function ajustarStock(productId, productName, currentStock) {
  productIdActualAjuste = productId;
  stockActualAjuste = currentStock;

  document.getElementById("ajusteSKU").value = productName;
  document.getElementById("ajusteStockActual").value = currentStock;
  document.getElementById("ajusteCantidad").value = currentStock;
  document.getElementById("vistaPrevia").textContent = currentStock;

  document.getElementById("modalAjusteStock").classList.add("active");
}

// ===== FUNCION PARA ACTUALIZAR VISTA PREVIA DE STOCK =====
function actualizarVistaPreviaStock() {
  const cantidad = parseInt(document.getElementById("ajusteCantidad").value || "0", 10);
  document.getElementById("vistaPrevia").textContent = cantidad;
}

// ===== FUNCION PARA GUARDAR AJUSTE DE STOCK =====
async function guardarAjusteStock() {
  const cantidad = parseInt(document.getElementById("ajusteCantidad").value || "0", 10);

  if (cantidad < 0) {
    alert("⚠️ El stock no puede ser negativo");
    return;
  }

  if (cantidad > 99) {
    alert("⚠️ El stock máximo permitido es 99 unidades");
    return;
  }

  if (!productIdActualAjuste) {
    alert("❌ No se pudo obtener el ID del producto");
    return;
  }

  try {
    // Obtener token JWT del localStorage
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json"
    };

    // Agregar Authorization header si hay token
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/products/${productIdActualAjuste}/stock`, {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify({ quantity: cantidad })
    });

    if (!response.ok) {
      if (response.status === 403 || response.status === 401) {
        throw new Error("No tienes permisos para actualizar el stock. Por favor, inicia sesión.");
      }
      throw new Error("Error al actualizar stock");
    }

    alert(`✅ Stock actualizado correctamente a ${cantidad} unidades`);
    cerrarModal("modalAjusteStock");
    fetchProducts();
  } catch (error) {
    console.error("Error:", error);
    alert(`❌ ${error.message || "Error al actualizar el stock"}`);
  }
}

// ===== FUNCION PARA ACTUALIZAR ESTADISTICAS =====
function actualizarEstadisticas() {
  const productos = document.querySelectorAll(".product-card:not([style*='display: none'])");
  const totalProductos = productos.length;
  let valorTotal = 0;
  let stockBajo = 0;
  let unidadesTotales = 0;

  productos.forEach((producto) => {
    const precio = parseFloat(producto.getAttribute("data-price") || "0");
    const stock = parseInt(producto.getAttribute("data-stock") || "0", 10);

    valorTotal += precio * stock;
    unidadesTotales += stock;

    if (stock <= 10) stockBajo++;
  });

  document.getElementById("totalProductos").textContent = totalProductos;
  document.getElementById("valorInventario").textContent = formatPrice(valorTotal);
  document.getElementById("stockBajo").textContent = stockBajo;
  document.getElementById("unidadesTotales").textContent = unidadesTotales;
}

// ===== FUNCION PARA MOSTRAR ALERTAS =====
function mostrarAlertas() {
  const productos = document.querySelectorAll(".product-card");
  const alertas = [];

  productos.forEach((producto) => {
    const stock = parseInt(producto.getAttribute("data-stock") || "0", 10);
    const nombre = producto.querySelector(".product-name")?.textContent || "";
    const sku = (producto.querySelector(".product-sku")?.textContent || "").replace("SKU: ", "");

    if (stock === 0) {
      alertas.push(`🔴 ${nombre} (${sku}) - AGOTADO`);
    } else if (stock <= 10) {
      alertas.push(`⚠️ ${nombre} (${sku}) - Stock bajo: ${stock} unidades`);
    }
  });

  if (alertas.length === 0) {
    alert("✅ No hay alertas de stock\n\nTodos los productos tienen stock adecuado.");
  } else {
    alert(`⚠️ ALERTAS DE STOCK\n\n${alertas.join("\n")}\n\n💡 Considera reabastecer estos productos pronto.`);
  }
}

// ===== FUNCION PARA GENERAR REPORTE PDF =====
async function generarReporteInventario() {
  try {
    const response = await fetch("/api/products/report/pdf", {
      method: "GET"
    });

    if (!response.ok) throw new Error("Error al generar reporte");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventario_${new Date().toISOString().split("T")[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    console.log("Reporte PDF descargado exitosamente");
  } catch (error) {
    console.error("Error:", error);
    alert("❌ Error al generar el reporte PDF");
  }
}

// ===== FUNCION PARA TOGGLE PERFIL =====
function togglePerfilMenu() {
  alert("👤 MENU DE PERFIL\n\n• Mi Cuenta\n• Configuracion\n• Ayuda\n• Cerrar Sesion");
}

// ===== CERRAR MODAL AL HACER CLIC FUERA =====
window.onclick = function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.classList.remove("active");
  }
};

// ===== CERRAR MODAL CON TECLA ESC =====
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    document.querySelectorAll(".modal").forEach(function (modal) {
      if (modal.classList.contains("active")) {
        modal.classList.remove("active");
      }
    });
  }
});

// ===== INICIALIZACION =====
document.addEventListener("DOMContentLoaded", function () {
  console.log("%c🚀 SNIKER - Gestion de Inventario", "color: #39ff14; font-size: 20px; font-weight: bold;");
  console.log("%c✨ Sistema de inventario inicializado", "color: #b026ff; font-size: 14px;");

  fetchProducts();

  const cantidadInput = document.getElementById("ajusteCantidad");
  cantidadInput?.addEventListener("input", actualizarVistaPreviaStock);

  console.log("📦 Inventario cargado correctamente");
});

// ===== FETCH PRODUCTS (filtrar solo ACTIVE) =====
async function fetchProducts() {
  try {
    const response = await fetch("/api/products");
    if (!response.ok) throw new Error("Error fetching products");

    const products = await response.json();

    const activeProducts = products.content
      ? products.content.filter((p) => p.status === "ACTIVE")
      : products.filter((p) => p.status === "ACTIVE");

    renderProducts(activeProducts);
    actualizarEstadisticas();
  } catch (error) {
    console.error("Error:", error);
    const grid = document.getElementById("productsGrid");
    grid.innerHTML =
      '<p style="color: var(--text-gray); text-align: center; padding: 40px;">Error al cargar productos. Por favor, recarga la página.</p>';
  }
}

// ===== RENDER PRODUCTS =====
function renderProducts(products) {
  const grid = document.getElementById("productsGrid");
  grid.innerHTML = "";

  if (!products || products.length === 0) {
    grid.innerHTML =
      '<p style="color: var(--text-gray); text-align: center; padding: 40px;">No hay productos activos en el inventario.</p>';
    return;
  }

  products.forEach((product) => {
    const stockNum = product.stock;
    let stockBadge = "high";
    let stockText = "Stock Alto";

    if (stockNum === 0) {
      stockBadge = "low";
      stockText = "Agotado";
    } else if (stockNum <= 10) {
      stockBadge = "low";
      stockText = "Stock Bajo";
    } else if (stockNum >= 11 && stockNum <= 29) {
      stockBadge = "medium";
      stockText = "Stock Medio";
    } else if (stockNum >= 30) {
      stockBadge = "high";
      stockText = "Stock Alto";
    }

    const nuevaCard = document.createElement("div");
    nuevaCard.className = "product-card";
    nuevaCard.setAttribute("data-id", product.id);
    nuevaCard.setAttribute("data-category", product.category ? product.category.name : "general");
    nuevaCard.setAttribute("data-stock", String(stockNum));
    nuevaCard.setAttribute("data-price", String(product.price));

    const iconos = {
      Casual: "👟",
      Urbanas: "👟",
      Retro: "👟",
      Deportivo: "👟"
    };
    const categoria = product.category ? product.category.name : "general";
    const icono = iconos[categoria] || "👟";

    // CAMBIO: Pasar IDs directamente en onclick, NO SKUs
    nuevaCard.innerHTML = `
            <div class="product-image">
              <span class="stock-badge ${stockBadge}">${stockText}</span>
              ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` : icono}
            </div>
            <div class="product-content">
              <div class="product-category">${product.category ? product.category.name : "General"}</div>
              <div class="product-name">${product.name}</div>
              <div class="product-sku">SKU: ${product.sku}</div>
              <div class="product-stock">
                <span class="stock-label">Stock Disponible:</span>
                <span class="stock-value">${stockNum}</span>
              </div>
              <div class="product-price">${formatPrice(product.price)}</div>
              <div class="product-actions">
                <button class="product-action-btn" onclick="verDetallesProducto(${product.id})" title="Ver detalles">👁️</button>
                <button class="product-action-btn" onclick="ajustarStock(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${stockNum})" title="Ajustar stock">📦</button>
                <button class="product-action-btn delete" onclick="eliminarProducto(${product.id}, '${product.name.replace(/'/g, "\\'")}')\" title="Inactivar">🗑️</button>
              </div>
            </div>
          `;
    grid.appendChild(nuevaCard);
  });
}
