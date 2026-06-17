let currentPage = 0;
let currentFilters = {
    search: '',
    category: '',
    brand: '',
    status: '',
    color: '',
    productSize: '',
    price: '',
    stock: ''
};

// Colors definition for dynamic generation
const AVAILABLE_COLORS = [
    { name: 'Negro', hex: '#000000' },
    { name: 'Blanco', hex: '#FFFFFF' },
    { name: 'Rojo', hex: '#FF0000' },
    { name: 'Azul', hex: '#0000FF' },
    { name: 'Verde', hex: '#00FF00' },
    { name: 'Amarillo', hex: '#FFFF00' },
    { name: 'Naranja', hex: '#FFA500' },
    { name: 'Morado', hex: '#800080' }
];

document.addEventListener('DOMContentLoaded', () => {
    cargarEstadisticas();
    cargarProductos();
    generarTallas();
    generarColores();
    // cargarCategorias(); // Disabled to use hardcoded HTML options and manual mapping

    // Event listeners for real-time validation
    setupValidation();

    // Image preview listener
    const imgInput = document.getElementById('inputImagenes');
    if (imgInput) imgInput.addEventListener('change', handleImagePreview);
});

function setupValidation() {
    const inputs = document.querySelectorAll('#formularioProducto input, #formularioProducto select, #formularioProducto textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => validateField(input));
        input.addEventListener('blur', () => validateField(input));
    });
}

function handleImagePreview(event) {
    const file = event.target.files[0];
    const uploadDiv = document.querySelector('.upload-imagen');
    const existingPreview = uploadDiv.querySelector('.preview-image');
    if (existingPreview) existingPreview.remove();

    if (file) {
        if (!file.type.startsWith('image/')) {
            showFieldError(document.getElementById('inputImagenes'), 'El archivo debe ser una imagen');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-image';
            img.style.maxWidth = '100%';
            img.style.maxHeight = '150px';
            img.style.marginTop = '10px';
            img.style.borderRadius = '8px';

            // Hide default text
            uploadDiv.querySelectorAll('div').forEach(div => div.style.display = 'none');
            uploadDiv.appendChild(img);
        }
        reader.readAsDataURL(file);
        clearFieldError(document.getElementById('inputImagenes'));
    }
}

function validateField(input) {
    let isValid = true;
    let errorMessage = '';

    if (input.id === 'nombreProducto') {
        if (input.value.length > 40) {
            input.value = input.value.substring(0, 40);
        }
        if (input.value.trim().length < 3) {
            isValid = false;
            errorMessage = 'El nombre debe tener al menos 3 caracteres';
        }
    } else if (input.id === 'precio') {
        if (!input.value || parseFloat(input.value) <= 0) {
            isValid = false;
            errorMessage = 'El precio debe ser mayor a 0';
        }
        if (parseFloat(input.value) > 9999) {
            input.value = 9999;
        }
    } else if (input.id === 'stock') {
        if (!input.value || parseInt(input.value) < 0) {
            isValid = false;
            errorMessage = 'El stock no puede ser negativo';
        }
        if (parseInt(input.value) > 99) {
            input.value = 99;
        }
    } else if (input.id === 'descripcion') {
        // Sanitize symbols
        const validText = input.value.replace(/[^a-zA-Z0-9\s.,áéíóúÁÉÍÓÚñÑ]/g, '');
        if (input.value !== validText) {
            input.value = validText;
        }

        const singleSpaced = input.value.replace(/\s\s+/g, ' ');
        if (input.value !== singleSpaced) {
            input.value = singleSpaced;
        }

        if (input.value.trim().length > 0) {
            const wordCount = input.value.trim().split(/\s+/).filter(w => w.length > 0).length;
            if (wordCount < 20) {
                isValid = false;
                errorMessage = `Mínimo 20 palabras (Actual: ${wordCount})`;
            }
        }
    }

    if (input.required && !input.value) {
        isValid = false;
        errorMessage = 'Este campo es obligatorio';
    }

    if (!isValid) {
        showFieldError(input, errorMessage);
    } else {
        clearFieldError(input);
    }

    checkFormValidity();
    return isValid;
}

function showFieldError(input, message) {
    input.classList.add('error');
    input.classList.remove('success');

    let errorSmall = input.nextElementSibling;
    if (!errorSmall || !errorSmall.classList.contains('error-message')) {
        errorSmall = document.createElement('small');
        errorSmall.className = 'error-message';
        errorSmall.style.color = 'var(--rojo-error)';
        errorSmall.style.fontSize = '12px';
        errorSmall.style.marginTop = '5px';
        input.parentNode.appendChild(errorSmall);
    }
    errorSmall.textContent = message;
    errorSmall.style.display = 'block';
}

function clearFieldError(input) {
    input.classList.remove('error');
    input.classList.add('success');

    const errorSmall = input.parentNode.querySelector('.error-message');
    if (errorSmall) {
        errorSmall.style.display = 'none';
    }
}

function checkFormValidity() {
    const inputs = document.querySelectorAll('#formularioProducto input[required], #formularioProducto select[required], #formularioProducto textarea[required]');
    const isValid = Array.from(inputs).every(input => input.value && !input.classList.contains('error'));
    const btnGuardar = document.querySelector('.boton-guardar');

    if (btnGuardar) {
        btnGuardar.disabled = !isValid;
        if (!isValid) {
            btnGuardar.style.opacity = '0.5';
            btnGuardar.style.cursor = 'not-allowed';
        } else {
            btnGuardar.style.opacity = '1';
            btnGuardar.style.cursor = 'pointer';
        }
    }
    return isValid;
}

function toggleFiltros() {
    const container = document.getElementById('panelFiltros');
    if (container.style.display === 'none' || container.style.display === '') {
        container.style.display = 'flex';
    } else {
        container.style.display = 'none';
    }
}

function aplicarFiltros() {
    currentFilters.category = document.getElementById('filtroCategoria').value;
    currentFilters.brand = document.getElementById('filtroMarca').value;
    currentFilters.status = document.getElementById('filtroEstado').value;
    currentFilters.color = document.getElementById('filtroColor').value;
    currentFilters.productSize = document.getElementById('filtroTalla').value;
    currentFilters.price = document.getElementById('filtroPrecio').value;
    currentFilters.stock = document.getElementById('filtroStock').value;
    cargarProductos(0);
}

function buscarProductos() {
    currentFilters.search = document.getElementById('buscarProducto').value;
    cargarProductos(0);
}

async function cargarProductos(page = 0) {
    currentPage = page;
    const token = localStorage.getItem('token');
    try {
        let url = `/api/admin/products?page=${page}&size=10`;
        if (currentFilters.search) url += `&search=${encodeURIComponent(currentFilters.search)}`;
        if (currentFilters.category) url += `&category=${encodeURIComponent(currentFilters.category)}`;
        if (currentFilters.brand) url += `&brand=${encodeURIComponent(currentFilters.brand)}`;
        if (currentFilters.status) url += `&status=${encodeURIComponent(currentFilters.status)}`;
        if (currentFilters.color) url += `&color=${encodeURIComponent(currentFilters.color)}`;
        if (currentFilters.productSize) url += `&productSize=${encodeURIComponent(currentFilters.productSize)}`;
        if (currentFilters.price) url += `&price=${encodeURIComponent(currentFilters.price)}`;
        if (currentFilters.stock) url += `&stock=${encodeURIComponent(currentFilters.stock)}`;

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error al cargar productos');

        const data = await response.json();
        renderizarTabla(data.content);
        renderizarPaginacion(data);

    } catch (error) {
        console.error(error);
        mostrarNotificacion('Error al cargar productos', 'error');
    }
}

function renderizarTabla(productos) {
    const tbody = document.getElementById('tablaProductosBody');
    tbody.innerHTML = '';

    if (!productos || productos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 20px;">No se encontraron productos</td></tr>';
        return;
    }

    productos.forEach(producto => {
        const tr = document.createElement('tr');
        if (producto.status === 'INACTIVE') {
            tr.style.opacity = '0.6';
            tr.style.background = 'rgba(255, 255, 255, 0.02)';
        }

        let stockBgColor = '#10b981';
        if (producto.stock === 0) stockBgColor = '#ef4444';
        else if (producto.stock <= 10) stockBgColor = '#ef4444';
        else if (producto.stock <= 30) stockBgColor = '#f59e0b';

        const imageUrl = producto.imageUrl ? producto.imageUrl : 'https://via.placeholder.com/60?text=No+Img';

        // Renderizar Colores como círculos
        let colorsHtml = '-';
        if (producto.colors) {
            const colorsArray = producto.colors.split(',').slice(0, 3);
            const colorMap = {
                'Negro': '#000000', 'Blanco': '#FFFFFF', 'Rojo': '#FF0000',
                'Azul': '#0000FF', 'Verde': '#00FF00', 'Amarillo': '#FFFF00',
                'Naranja': '#FFA500', 'Morado': '#800080', 'Gris': '#808080'
            };
            colorsHtml = colorsArray.map(c => {
                const hex = colorMap[c.trim()] || '#777';
                return `<span style="display:inline-block;width:15px;height:15px;border-radius:50%;background:${hex};margin-right:2px;border:1px solid #444;" title="${c}"></span>`;
            }).join('');
        }

        const statusClass = producto.status === 'ACTIVE' ? 'status-active' : 'status-inactive';
        const statusLabel = producto.status === 'ACTIVE' ? 'ACTIVO' : 'INACTIVO';
        const statusColor = producto.status === 'ACTIVE' ? 'var(--verde-exito)' : 'var(--texto-gris)';

        tr.innerHTML = `
            <td>
                <div class="info-producto-tabla">
                    <div class="imagen-producto-mini">
                        <img src="${imageUrl}" alt="${producto.name}" onerror="this.src='https://via.placeholder.com/60'">
                    </div>
                    <div class="detalles-producto">
                        <div class="nombre-producto">${producto.name}</div>
                        <div class="categoria-producto">${producto.category ? producto.category.name : '-'}</div>
                    </div>
                </div>
            </td>
            <td><span style="font-family: monospace; color: var(--neon-verde);">#${producto.id}</span></td>
            <td>${producto.category ? producto.category.name : '-'}</td>
            <td>${producto.brand || '-'}</td>
            <td style="font-weight: 700;">$${producto.price.toFixed(2)}</td>
            <td>
                <span style="background-color: ${stockBgColor}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px;">${producto.stock}</span>
            </td>
            <td>${colorsHtml}</td>
            <td>${producto.sizes || '-'}</td>
            <td>
                <span style="border: 1px solid ${statusColor}; color: ${statusColor}; padding: 4px 10px; border-radius: 12px; font-size: 10px;">${statusLabel}</span>
            </td>
            <td>
                <div class="botones-accion">
                    <button class="boton-icono" title="Editar" onclick="editarProducto(${producto.id})">✏️</button>
                    ${producto.status === 'ACTIVE' ?
                `<button class="boton-icono eliminar" title="Eliminar" onclick="eliminarProducto(${producto.id})">🗑️</button>` :
                `<button class="boton-icono" title="Restaurar" style="opacity:0.3;cursor:default;">♻️</button>`
            }
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderizarPaginacion(data) {
    const paginacion = document.getElementById('paginacion');
    paginacion.innerHTML = '';
    if (data.totalPages <= 1) return;

    const createBtn = (text, page, active = false, disabled = false) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.className = active ? 'boton-pagina activo' : 'boton-pagina';
        btn.disabled = disabled;
        if (!disabled) btn.onclick = () => cargarProductos(page);
        return btn;
    };

    paginacion.appendChild(createBtn('←', currentPage - 1, false, data.first));

    let start = Math.max(0, currentPage - 2);
    let end = Math.min(data.totalPages, start + 5);
    if (end - start < 5) start = Math.max(0, end - 5);

    for (let i = start; i < end; i++) {
        paginacion.appendChild(createBtn(i + 1, i, i === currentPage));
    }

    paginacion.appendChild(createBtn('→', currentPage + 1, false, data.last));
}

// --- MODAL & FORM FUNCTIONS ---

function abrirModalNuevoProducto() {
    document.getElementById('formularioProducto').reset();
    document.getElementById('productoId').value = '';

    // Limpiar SKU anterior para evitar conflictos en creación
    if (document.getElementById('formularioProducto').dataset.currentSku) {
        delete document.getElementById('formularioProducto').dataset.currentSku;
    }

    document.getElementById('productoIdVisible').value = 'Autogenerado';
    document.getElementById('tituloModal').textContent = 'Nuevo Producto';
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

    // Clear validations
    document.querySelectorAll('.error, .success').forEach(el => {
        el.classList.remove('error', 'success');
    });
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

    // Reset file preview
    const uploadDiv = document.querySelector('.upload-imagen');
    const existingPreview = uploadDiv.querySelector('.preview-image');
    if (existingPreview) existingPreview.remove();
    uploadDiv.querySelectorAll('div').forEach(div => div.style.display = 'block');

    document.getElementById('modalProducto').classList.add('mostrar');
    checkFormValidity();
}

function cerrarModal() {
    document.getElementById('modalProducto').classList.remove('mostrar');
}

async function editarProducto(id) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/admin/products/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Producto no encontrado');
        const product = await response.json();

        abrirModalNuevoProducto();
        document.getElementById('tituloModal').textContent = 'Editar Producto';

        document.getElementById('productoId').value = product.id;
        document.getElementById('productoIdVisible').value = product.id;
        document.getElementById('nombreProducto').value = product.name;

        // SKU handling for edit
        document.getElementById('formularioProducto').dataset.currentSku = product.sku;

        document.getElementById('categoria').value = product.category ? product.category.name : '';
        document.getElementById('precio').value = product.price;
        document.getElementById('stock').value = product.stock;
        document.getElementById('marca').value = product.brand;
        document.getElementById('estado').value = product.status;
        document.getElementById('descripcion').value = product.description;

        // Colors - Checkboxes
        if (product.colors) {
            const prodColors = product.colors.split(',').map(c => c.trim());
            prodColors.forEach(colorName => {
                const cb = document.querySelector(`#contenedorColores input[value="${colorName}"]`);
                if (cb) cb.checked = true;
            });
        }

        // Sizes - Checkboxes
        if (product.sizes) {
            const sizes = product.sizes.split(',');
            sizes.forEach(s => {
                const cb = document.querySelector(`#contenedorTallas input[value="${s.trim()}"]`);
                if (cb) cb.checked = true;
            });
        }

        // Existing image
        if (product.imageUrl) {
            const uploadDiv = document.querySelector('.upload-imagen');
            uploadDiv.querySelectorAll('div').forEach(div => div.style.display = 'none');

            const img = document.createElement('img');
            img.src = product.imageUrl;
            img.className = 'preview-image';
            img.style.maxWidth = '100%';
            img.style.maxHeight = '150px';
            img.style.marginTop = '10px';
            img.style.borderRadius = '8px';

            const oldParams = uploadDiv.querySelector('.preview-image');
            if (oldParams) oldParams.remove();

            uploadDiv.appendChild(img);
        }

        // Validate populated fields
        document.querySelectorAll('#formularioProducto input, #formularioProducto select, #formularioProducto textarea').forEach(input => {
            if (input.value) validateField(input);
        });
        checkFormValidity();

    } catch (error) {
        console.error(error);
        mostrarNotificacion('Error al cargar producto', 'error');
    }
}

document.getElementById('formularioProducto').addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!checkFormValidity()) return;

    const token = localStorage.getItem('token');
    const id = document.getElementById('productoId').value;
    const formData = new FormData();

    // -- FLAT PARAMETERS CONSTRUCTION --
    formData.append('name', document.getElementById('nombreProducto').value);
    formData.append('price', document.getElementById('precio').value);
    formData.append('stock', document.getElementById('stock').value);
    formData.append('description', document.getElementById('descripcion').value);
    formData.append('brand', document.getElementById('marca').value);

    // HARDCODED MAP: NAME -> ID
    const categoryName = document.getElementById('categoria').value;
    const categoryMap = {
        'Casual': 1,
        'Urbanas': 2,
        'Retro': 3,
        'Deportivo': 4
    };
    const categoryId = categoryMap[categoryName] || 1; // Default to 1
    formData.append('categoryId', categoryId);

    formData.append('status', document.getElementById('estado').value);

    // SKU Auto-generation or existing
    let skuToSend = document.getElementById('formularioProducto').dataset.currentSku;
    if (!skuToSend || !id) {
        const namePart = document.getElementById('nombreProducto').value.substring(0, 3).toUpperCase();
        const randomPart = Math.floor(1000 + Math.random() * 9000);
        skuToSend = `SNKR-${namePart}-${randomPart}`;
    }
    formData.append('sku', skuToSend);

    // Colors Array -> Comma String
    const selectedColors = Array.from(document.querySelectorAll('#contenedorColores input:checked'))
        .map(cb => cb.value)
        .join(',');
    formData.append('colors', selectedColors);

    // Sizes Array -> Comma String
    const selectedSizes = Array.from(document.querySelectorAll('#contenedorTallas input:checked'))
        .map(cb => cb.value)
        .join(',');
    formData.append('sizes', selectedSizes);

    // Image File
    const imageFile = document.getElementById('inputImagenes').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const url = id ? `/api/admin/products/${id}` : '/api/admin/products';
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        if (!response.ok) {
            // Manejo de errores seguro para evitar HTML en la alerta
            const errText = await response.text();

            if (errText.trim().startsWith('<')) {
                // Es una página HTML (ej: 500 o 401), no mostrar el contenido
                console.error("Error del servidor (HTML):", errText);
                throw new Error('Error interno del servidor. Verifique los datos o la consola.');
            }

            // Intentar parsear como JSON si es un error estructurado
            try {
                const errJson = JSON.parse(errText);
                throw new Error(errJson.error || errJson.message || 'Error al guardar');
            } catch (e) {
                // Si es texto plano, mostrarlo
                throw new Error('Error al guardar: ' + errText);
            }
        }

        cerrarModal();
        cargarProductos(currentPage);
        cargarEstadisticas();
        mostrarNotificacion('Producto guardado correctamente', 'exito');

    } catch (error) {
        console.error(error);
        mostrarNotificacion(error.message, 'error');
    }
});

async function eliminarProducto(id) {
    if (!confirm('¿Estás seguro de eliminar este producto? La acción lo marcará como INACTIVO.')) return;

    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/admin/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Error al eliminar');

        cargarProductos(currentPage);
        cargarEstadisticas();
        mostrarNotificacion('Producto inactivado correctamente', 'exito');
    } catch (error) {
        console.error(error);
        mostrarNotificacion('Error al eliminar producto', 'error');
    }
}

function generarColores() {
    const container = document.getElementById('contenedorColores');
    if (!container) return;
    container.innerHTML = '';

    AVAILABLE_COLORS.forEach(color => {
        const label = document.createElement('label');
        label.className = 'checkbox-talla'; // Reusamos la clase de estilo de tallas
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.gap = '8px';
        label.style.marginRight = '10px';

        const circle = `<span class="color-circle" style="background-color: ${color.hex}; border: 1px solid #ffffff33; width: 14px; height: 14px; border-radius: 50%; display: inline-block;"></span>`;

        label.innerHTML = `<input type="checkbox" value="${color.name}"> ${circle} ${color.name}`;
        container.appendChild(label);
    });
}

function generarTallas() {
    const container = document.getElementById('contenedorTallas');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 33; i <= 44; i++) {
        const label = document.createElement('label');
        label.className = 'checkbox-talla';
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.gap = '5px';
        label.style.marginRight = '10px';
        label.innerHTML = `<input type="checkbox" value="${i}"> ${i}`;
        container.appendChild(label);
    }
}

async function cargarCategorias() {
    // Mantener comentado si usas opciones fijas en HTML, o descomentar si habilitas el endpoint
    /*
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('/api/categories', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const categories = await response.json();
            const selectCategoria = document.getElementById('categoria');
            selectCategoria.innerHTML = '<option value="">Seleccionar...</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                selectCategoria.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
    */
}

async function cargarEstadisticas() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('/api/admin/products?size=1000', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            const products = data.content || [];

            let totalProducts = products.length;
            let stockAlto = 0;
            let stockMedio = 0;
            let stockBajo = 0;

            products.forEach(product => {
                if (product.status === 'INACTIVE') return;

                if (product.stock >= 31) stockAlto++;
                else if (product.stock >= 11) stockMedio++;
                else if (product.stock > 0) stockBajo++;
            });

            if (document.getElementById('totalProductos')) document.getElementById('totalProductos').textContent = totalProducts;
            if (document.getElementById('stockAlto')) document.getElementById('stockAlto').textContent = stockAlto;
            if (document.getElementById('stockMedio')) document.getElementById('stockMedio').textContent = stockMedio;
            if (document.getElementById('stockBajo')) document.getElementById('stockBajo').textContent = stockBajo;
        }
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}

function mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.getElementById('notificacion');
    notificacion.textContent = mensaje;
    notificacion.className = 'notificacion mostrar';
    if (tipo === 'error') {
        notificacion.style.background = 'var(--rojo-error)';
        notificacion.style.color = 'white';
    } else {
        notificacion.style.background = 'var(--verde-exito)';
        notificacion.style.color = 'black';
        notificacion.style.fontWeight = '700';
    }

    setTimeout(() => {
        notificacion.classList.remove('mostrar');
    }, 3000);
}