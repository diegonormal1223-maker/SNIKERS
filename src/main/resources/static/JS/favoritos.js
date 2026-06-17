
// FAVORITOS.JS - Logic for Wishlist

let productosSeleccionados = [];
let carritoContador = 0; // This will be updated by cart-badge.js but we keep it for local logic if needed
let vistaActual = 'grid';

document.addEventListener('DOMContentLoaded', () => {
    loadFavorites();

    // Initialize event listeners for modal
    document.getElementById('modalCompartir').addEventListener('click', function (e) {
        if (e.target === this) {
            cerrarModal();
        }
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            e.preventDefault();
            agregarTodosAlCarrito();
        }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            agregarSeleccionados();
        }
        if (e.key === 'Delete' && productosSeleccionados.length > 0) {
            productosSeleccionados.forEach(id => removerProducto(id));
        }
        if (e.key === 'Escape') {
            cerrarModal();
        }
    });
});

async function loadFavorites() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'loginyregistro.html';
        return;
    }

    const grid = document.getElementById('gridFavoritos');
    const emptyState = document.getElementById('estadoVacio');

    grid.innerHTML = '<p style="color:white; text-align:center; grid-column: 1/-1;">Cargando favoritos...</p>';

    try {
        const response = await fetch('/api/favorites', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Error fetching favorites');

        const favorites = await response.json();

        if (favorites.length === 0) {
            grid.innerHTML = '';
            emptyState.classList.add('mostrar');
            grid.style.display = 'none';
            actualizarContadores();
        } else {
            emptyState.classList.remove('mostrar');
            grid.style.display = 'grid';
            renderFavorites(favorites);
            actualizarContadores();
        }

    } catch (error) {
        console.error('Error:', error);
        grid.innerHTML = '<p style="color:red; text-align:center; grid-column: 1/-1;">Error al cargar favoritos</p>';
    }
}

function renderFavorites(favorites) {
    const grid = document.getElementById('gridFavoritos');
    grid.innerHTML = '';

    favorites.forEach(fav => {
        const product = fav.product;
        const card = document.createElement('div');
        card.className = `tarjeta-producto ${vistaActual === 'lista' ? 'vista-lista' : ''}`;
        card.dataset.id = product.id;
        card.dataset.precio = product.price;
        card.dataset.nombre = product.name;
        card.dataset.fecha = new Date().toISOString(); // Mock date for sorting if not available

        // Determine badge and availability
        let badgeHtml = '<span class="insignia-producto">En Stock</span>';
        let availabilityHtml = '<div class="disponibilidad en-stock">✓ En stock</div>';

        if (product.stock < 5) {
            badgeHtml = '<span class="insignia-producto oferta">Pocas Unidades</span>';
            availabilityHtml = `<div class="disponibilidad bajo-stock">⚠️ Solo quedan ${product.stock} unidades</div>`;
        }

        card.innerHTML = `
            <input type="checkbox" class="checkbox-seleccion" onchange="actualizarSeleccion()">
            ${badgeHtml}
            <div class="imagen-producto">
                <img src="${product.imageUrl || 'https://placehold.co/400x400'}" alt="${product.name}">
                <button class="boton-remover" onclick="removerProducto(${product.id})">×</button>
            </div>
            <div class="info-producto">
                <div class="categoria-producto">${product.category ? product.category.name : 'General'}</div>
                <h3 class="nombre-producto">${product.name}</h3>
                <div class="colores-producto">
                    <div class="punto-color" style="background: #000;"></div>
                    <div class="punto-color" style="background: #fff; border: 2px solid #333;"></div>
                </div>
                <div class="precio-producto">$${parseFloat(product.price).toFixed(2)}</div>
                ${availabilityHtml}
                <div class="fecha-agregado">Agregado recientemente</div>
                <div class="acciones-producto">
                    <button class="boton-agregar-carrito" onclick="agregarAlCarrito(${product.id})">Agregar al Carrito</button>
                    <button class="boton-ver" onclick="verProducto(${product.id})">👁</button>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

// MOSTRAR NOTIFICACIÓN
function mostrarNotificacion(mensaje, tipo = 'exito') {
    const notificacion = document.getElementById('notificacion');
    notificacion.textContent = mensaje;

    if (tipo === 'error') {
        notificacion.classList.add('error');
    } else {
        notificacion.classList.remove('error');
    }

    notificacion.classList.add('mostrar');

    setTimeout(() => {
        notificacion.classList.remove('mostrar');
    }, 3000);
}

// ACTUALIZAR SELECCIÓN
function actualizarSeleccion() {
    const checkboxes = document.querySelectorAll('.checkbox-seleccion:checked');
    productosSeleccionados = Array.from(checkboxes).map(cb =>
        parseInt(cb.closest('.tarjeta-producto').dataset.id)
    );

    document.getElementById('contadorSeleccionados').textContent = productosSeleccionados.length;

    // Actualizar borde de tarjetas seleccionadas
    document.querySelectorAll('.tarjeta-producto').forEach(tarjeta => {
        const checkbox = tarjeta.querySelector('.checkbox-seleccion');
        if (checkbox.checked) {
            tarjeta.classList.add('seleccionado');
        } else {
            tarjeta.classList.remove('seleccionado');
        }
    });
}

// REMOVER PRODUCTO
async function removerProducto(id) {
    if (!confirm('¿Remover este producto de tu lista de deseos?')) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`/api/favorites/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const tarjeta = document.querySelector(`[data-id="${id}"]`);
            if (tarjeta) {
                tarjeta.style.animation = 'desaparecer 0.3s';
                setTimeout(() => {
                    tarjeta.remove();
                    actualizarContadores();
                    mostrarNotificacion('💔 Producto removido de favoritos');
                    verificarListaVacia();
                }, 300);
            } else {
                // Fallback if element not found (e.g. bulk delete)
                loadFavorites();
            }
        } else {
            mostrarNotificacion('Error al eliminar', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error de conexión', 'error');
    }
}

// AGREGAR AL CARRITO
async function agregarAlCarrito(id) {
    const token = localStorage.getItem('token');
    if (!token) return;

    const tarjeta = document.querySelector(`[data-id="${id}"]`);
    const nombre = tarjeta ? tarjeta.dataset.nombre : 'Producto';
    const boton = tarjeta ? tarjeta.querySelector('.boton-agregar-carrito') : null;

    if (boton) {
        boton.textContent = 'Agregando...';
        boton.disabled = true;
    }

    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                productId: id,
                quantity: 1
            })
        });

        if (response.ok) {
            mostrarNotificacion(`🛒 ${nombre} agregado al carrito`);
            window.dispatchEvent(new Event('cartUpdated'));
        } else {
            mostrarNotificacion('Error al agregar al carrito', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error de conexión', 'error');
    } finally {
        if (boton) {
            boton.textContent = 'Agregar al Carrito';
            boton.disabled = false;
        }
    }
}

// AGREGAR TODOS AL CARRITO
async function agregarTodosAlCarrito() {
    const productos = document.querySelectorAll('.tarjeta-producto');
    if (productos.length === 0) {
        mostrarNotificacion('⚠️ No hay productos disponibles para agregar', 'error');
        return;
    }

    let successCount = 0;

    // Process sequentially to avoid overwhelming server or race conditions
    for (const tarjeta of productos) {
        const id = tarjeta.dataset.id;
        await agregarAlCarrito(id); // Re-use existing function (will trigger multiple notifications, maybe optimize later)
        successCount++;
    }

    // Note: The individual notifications might be too much, but for now it's safe.
    // Ideally we'd have a bulk API endpoint.
}

// AGREGAR SELECCIONADOS
async function agregarSeleccionados() {
    if (productosSeleccionados.length === 0) {
        mostrarNotificacion('⚠️ Selecciona al menos un producto', 'error');
        return;
    }

    for (const id of productosSeleccionados) {
        await agregarAlCarrito(id);
    }

    // Desmarcar todos
    document.querySelectorAll('.checkbox-seleccion:checked').forEach(cb => cb.checked = false);
    actualizarSeleccion();
}

// VER PRODUCTO
function verProducto(id) {
    mostrarNotificacion(`👁️ Abriendo detalles del producto...`);
    // Placeholder for product detail navigation
    // window.location.href = `product-detail.html?id=${id}`;
}

// LIMPIAR LISTA
async function limpiarLista() {
    const productos = document.querySelectorAll('.tarjeta-producto');

    if (productos.length === 0) {
        mostrarNotificacion('⚠️ Tu lista ya está vacía', 'error');
        return;
    }

    if (!confirm(`¿Estás seguro de eliminar todos los productos (${productos.length}) de tu lista?`)) {
        return;
    }

    // We need to delete all. Since we don't have a bulk delete API, we loop.
    // This is not efficient but works for small lists.
    const token = localStorage.getItem('token');
    if (!token) return;

    for (const tarjeta of productos) {
        const id = tarjeta.dataset.id;
        try {
            await fetch(`/api/favorites/${id}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (e) {
            console.error(e);
        }
    }

    loadFavorites();
    mostrarNotificacion('🗑️ Lista limpiada completamente');
}

// ORDENAR PRODUCTOS
function ordenarProductos() {
    const selector = document.getElementById('selectorOrdenar');
    const criterio = selector.value;
    const contenedor = document.getElementById('gridFavoritos');
    const productos = Array.from(contenedor.children);

    productos.sort((a, b) => {
        switch (criterio) {
            case 'reciente':
                // We don't have real dates, so we assume order is preserved or random for now
                return 0;
            case 'antiguo':
                return 0;
            case 'precio-bajo':
                return parseFloat(a.dataset.precio) - parseFloat(b.dataset.precio);
            case 'precio-alto':
                return parseFloat(b.dataset.precio) - parseFloat(a.dataset.precio);
            case 'nombre':
                return a.dataset.nombre.localeCompare(b.dataset.nombre);
            default:
                return 0;
        }
    });

    productos.forEach(producto => contenedor.appendChild(producto));
    mostrarNotificacion('✓ Lista ordenada');
}

// CAMBIAR VISTA
function cambiarVista(vista) {
    vistaActual = vista;
    const grid = document.getElementById('gridFavoritos');
    const botones = document.querySelectorAll('.boton-vista');

    botones.forEach(btn => btn.classList.remove('activo'));
    event.currentTarget.classList.add('activo');

    if (vista === 'lista') {
        grid.classList.add('vista-lista');
        grid.querySelectorAll('.tarjeta-producto').forEach(tarjeta => {
            tarjeta.classList.add('vista-lista');
        });
    } else {
        grid.classList.remove('vista-lista');
        grid.querySelectorAll('.tarjeta-producto').forEach(tarjeta => {
            tarjeta.classList.remove('vista-lista');
        });
    }
}

// ABRIR MODAL COMPARTIR
function abrirModalCompartir() {
    document.getElementById('modalCompartir').classList.add('mostrar');
}

// CERRAR MODAL
function cerrarModal() {
    document.getElementById('modalCompartir').classList.remove('mostrar');
}

// COMPARTIR
function compartir(plataforma) {
    event.preventDefault();
    const enlace = document.getElementById('enlaceCompartir').value;

    switch (plataforma) {
        case 'whatsapp':
            mostrarNotificacion('📱 Compartiendo en WhatsApp...');
            break;
        case 'facebook':
            mostrarNotificacion('📘 Compartiendo en Facebook...');
            break;
        case 'twitter':
            mostrarNotificacion('🐦 Compartiendo en Twitter...');
            break;
        case 'email':
            mostrarNotificacion('📧 Abriendo cliente de email...');
            break;
    }

    console.log(`Compartir en ${plataforma}: ${enlace}`);
    setTimeout(cerrarModal, 1500);
}

// COPIAR ENLACE
function copiarEnlace() {
    const input = document.getElementById('enlaceCompartir');
    input.select();
    document.execCommand('copy');

    mostrarNotificacion('✓ Enlace copiado al portapapeles');
}

// ACTUALIZAR CONTADORES
function actualizarContadores() {
    const productos = document.querySelectorAll('.tarjeta-producto');
    const total = productos.length;

    let valorTotal = 0;
    productos.forEach(tarjeta => {
        valorTotal += parseFloat(tarjeta.dataset.precio);
    });

    document.getElementById('contadorTotal').textContent = total;
    document.getElementById('valorTotal').textContent = '$' + valorTotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// VERIFICAR LISTA VACÍA
function verificarListaVacia() {
    const productos = document.querySelectorAll('.tarjeta-producto');
    const estadoVacio = document.getElementById('estadoVacio');
    const grid = document.getElementById('gridFavoritos');

    if (productos.length === 0) {
        estadoVacio.classList.add('mostrar');
        grid.style.display = 'none';
    } else {
        estadoVacio.classList.remove('mostrar');
        grid.style.display = 'grid';
    }
}

// AÑADIR ANIMACIÓN DE DESAPARECER
const estilo = document.createElement('style');
estilo.textContent = `
    @keyframes desaparecer {
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
`;
document.head.appendChild(estilo);
