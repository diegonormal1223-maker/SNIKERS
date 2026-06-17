document.addEventListener('DOMContentLoaded', function() {
    const previewButton = document.getElementById('previewButton');
    const confirmButton = document.getElementById('confirmButton');
    const fileInput = document.getElementById('importFile');
    const modeSelect = document.getElementById('importMode');
    const previewContainer = document.getElementById('importPreview');
    const errorContainer = document.getElementById('importErrors');
    const messageContainer = document.getElementById('importMessage');
    const resultContainer = document.getElementById('confirmResult');

    if (!previewButton || !confirmButton || !fileInput) return;

    previewButton.addEventListener('click', async function() {
        clearFeedback();
        const file = fileInput.files[0];
        if (!file) {
            showMessage('Selecciona un archivo para previsualizar.', 'error');
            return;
        }
        await sendPreviewRequest(file);
    });

    confirmButton.addEventListener('click', async function() {
        clearFeedback();
        const file = fileInput.files[0];
        if (!file) {
            showMessage('Selecciona un archivo para importar.', 'error');
            return;
        }
        await sendConfirmRequest(file, modeSelect.value);
    });

    function getAuthHeaders() {
        const token = localStorage.getItem('token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    async function sendPreviewRequest(file) {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('/admin/import/preview', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: formData
            });
            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Error al previsualizar el archivo.');
            }
            const json = await response.json();
            renderPreview(json.previewRows || []);
            renderErrors(json.errors || []);
            showMessage(`Previsualización completa: ${json.totalRows} filas detectadas.`, 'success');
        } catch (error) {
            showMessage(error.message || 'Error de previsualización.', 'error');
        }
    }

    async function sendConfirmRequest(file, mode) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('mode', mode || 'skip');
        try {
            const response = await fetch('/admin/import/confirm', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: formData
            });
            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Error al importar el archivo.');
            }
            const result = await response.json();
            renderResult(result);
            if (result.errors && result.errors.length) {
                renderErrors(result.errors);
            }
            showMessage(`Importación finalizada. Guardados: ${result.savedCount}, Actualizados: ${result.updatedCount}, Omitidos: ${result.skippedCount}.`, 'success');
        } catch (error) {
            showMessage(error.message || 'Error de importación.', 'error');
        }
    }

    function renderPreview(rows) {
        previewContainer.innerHTML = '';
        if (!rows.length) {
            previewContainer.textContent = 'No se detectaron filas válidas en la previsualización.';
            return;
        }
        const table = document.createElement('table');
        table.classList.add('tabla-productos');
        const headerRow = document.createElement('tr');
        ['Fila', 'SKU', 'Nombre', 'Precio', 'Stock', 'Estado'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
        rows.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.rowNumber || ''}</td>
                <td>${row.sku || ''}</td>
                <td>${row.name || ''}</td>
                <td>${row.price || ''}</td>
                <td>${row.stock || ''}</td>
                <td>${row.status || ''}</td>
            `;
            table.appendChild(tr);
        });
        previewContainer.appendChild(table);
    }

    function renderErrors(errors) {
        if (!errors.length) {
            errorContainer.style.display = 'none';
            errorContainer.innerHTML = '';
            return;
        }
        errorContainer.style.display = 'block';
        errorContainer.innerHTML = `<strong>Errores detectados:</strong><ul>${errors.map(err => `<li>Fila ${err.rowNumber}: ${err.message}</li>`).join('')}</ul>`;
    }

    function renderResult(result) {
        resultContainer.innerHTML = `
            <div style="background: rgba(0, 128, 0, 0.08); border: 1px solid rgba(0, 128, 0, 0.16); padding: 16px;">
                <strong>Resultado de importación</strong>
                <p>Total filas: ${result.totalRows}</p>
                <p>Guardados: ${result.savedCount}</p>
                <p>Actualizados: ${result.updatedCount}</p>
                <p>Omitidos: ${result.skippedCount}</p>
            </div>
        `;
    }

    function showMessage(message, type) {
        messageContainer.innerHTML = `<div style="padding: 12px; border-radius: 8px; margin-bottom: 12px; color: ${type === 'error' ? '#7b1e1e' : '#1f4336'}; background: ${type === 'error' ? 'rgba(127, 29, 29, 0.08)' : 'rgba(22, 163, 74, 0.08)'}; border: 1px solid ${type === 'error' ? 'rgba(127, 29, 29, 0.16)' : 'rgba(22, 163, 74, 0.16)'};">${message}</div>`;
    }

    function clearFeedback() {
        errorContainer.innerHTML = '';
        errorContainer.style.display = 'none';
        resultContainer.innerHTML = '';
        messageContainer.innerHTML = '';
    }
});
