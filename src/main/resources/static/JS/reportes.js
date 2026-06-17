// --- VARIABLES GLOBALES ---
let chartVentasInstance = null;
let chartCategoriasInstance = null;
let currentPeriod = {
  startDate: null,
  endDate: null
};

// --- UTILIDADES ---
const formatCurrency = (n, currency = "COP", locale = "es-CO") =>
  Number(n).toLocaleString(locale, { style: "currency", currency });

function mostrarNotificacion(mensaje) {
  const notificacion = document.getElementById("notificacion");
  if (!notificacion) return;
  notificacion.textContent = mensaje;
  notificacion.classList.add("mostrar");

  setTimeout(() => {
    notificacion.classList.remove("mostrar");
  }, 3000);
}

// --- CAMBIAR PERÍODO ---
function cambiarPeriodo() {
  const selector = document.getElementById("selectorPeriodo");
  const periodo = selector ? selector.value : "";

  const hoy = new Date();
  let inicio = new Date();
  let fin = new Date();

  switch (periodo) {
    case 'hoy':
      inicio = fin = hoy;
      break;
    case 'semana':
      inicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 7);
      break;
    case 'mes':
      inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      break;
    case 'trimestre':
      const currentQuarter = Math.floor(hoy.getMonth() / 3);
      inicio = new Date(hoy.getFullYear(), currentQuarter * 3, 1);
      break;
    case 'ano':
      inicio = new Date(hoy.getFullYear(), 0, 1);
      break;
    case 'personalizado':
      // TODO: Mostrar modal para seleccionar fechas personalizadas
      return;
  }

  currentPeriod.startDate = inicio.toISOString().split('T')[0];
  currentPeriod.endDate = fin.toISOString().split('T')[0];

  mostrarNotificacion(`📅 Actualizando datos para: ${periodo}`);
  cargarDashboard();
}

// --- CARGAR DASHBOARD ---
async function cargarDashboard() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const params = new URLSearchParams({
      startDate: currentPeriod.startDate,
      endDate: currentPeriod.endDate
    });

    const response = await fetch(`/api/admin/reports/dashboard?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Error al cargar datos');
    }

    const data = await response.json();
    renderKPIs(data);
    renderCharts(data);
    renderProductos(data);
    renderTransacciones(data);

    animarKPIs();
  } catch (error) {
    console.error('Error:', error);
    mostrarNotificacion('❌ Error al cargar dashboard');
  }
}

// --- RENDER KPIs ---
function renderKPIs(data) {
  // KPI Ingresos
  const kpiIncome = data.kpiIncome || {};
  document.getElementById('kpiIncomeValue').textContent = formatCurrency(kpiIncome.value || 0);
  updateGrowthIndicator('kpiIncomeGrowth', kpiIncome.growth || 0);

  // KPI Pedidos
  const kpiOrders = data.kpiOrders || {};
  document.getElementById('kpiOrdersValue').textContent = Math.floor(kpiOrders.value || 0);
  document.getElementById('kpiOrdersDetail').textContent =
    `Promedio: ${formatCurrency(kpiOrders.avgTicket || 0)} por pedido`;
  updateGrowthIndicator('kpiOrdersGrowth', kpiOrders.growth || 0);

  // KPI Usuarios
  const kpiUsers = data.kpiUsers || {};
  document.getElementById('kpiUsersValue').textContent = Math.floor(kpiUsers.value || 0);
  updateGrowthIndicator('kpiUsersGrowth', kpiUsers.growth || 0);

  // KPI Conversión
  const kpiConversion = data.kpiConversion || {};
  document.getElementById('kpiConversionValue').textContent = `${kpiConversion.value?.toFixed(1) || 0}%`;
  document.getElementById('kpiConversionDetail').textContent =
    `${kpiConversion.totalVisitors || 0} visitantes → ${kpiConversion.newCustomers || 0} ventas`;
  updateGrowthIndicator('kpiConversionGrowth', kpiConversion.growth || 0);
}

function updateGrowthIndicator(elementId, growth) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const isPositive = growth >= 0;
  const arrow = isPositive ? '↑' : '↓';
  const className = isPositive ? 'positivo' : 'negativo';

  element.textContent = `${arrow} ${Math.abs(growth).toFixed(1)}%`;
  element.className = `cambio-kpi ${className}`;
}

// --- RENDER CHARTS ---
function renderCharts(data) {
  renderChartVentas(data.salesChart || {});
  renderChartCategorias(data.salesByCategory || {});
}

function renderChartVentas(salesData) {
  const canvas = document.getElementById('chartVentas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (chartVentasInstance) {
    chartVentasInstance.destroy();
  }

  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(57, 255, 20, 0.7)');
  gradient.addColorStop(1, 'rgba(57, 255, 20, 0.1)');

  const labels = Object.keys(salesData);
  const values = Object.values(salesData);

  chartVentasInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Ventas',
        data: values,
        backgroundColor: gradient,
        borderColor: '#39ff14',
        borderWidth: 0,
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.6,
        categoryPercentage: 0.8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(22, 22, 31, 0.9)',
          titleColor: '#39ff14',
          bodyColor: '#fff',
          titleFont: {
            size: 13,
            weight: 'bold'
          },
          padding: 12,
          cornerRadius: 10,
          borderColor: 'rgba(57, 255, 20, 0.2)',
          borderWidth: 1,
          displayColors: false,
          callbacks: {
            label: (context) => formatCurrency(context.parsed.y)
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(57, 255, 20, 0.05)',
            borderDash: [5, 5]
          },
          border: {
            display: false
          },
          ticks: {
            color: '#a0a0a0',
            font: {
              size: 11
            },
            padding: 10,
            callback: (value) => formatCurrency(value)
          }
        },
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          border: {
            display: false
          },
          ticks: {
            color: '#a0a0a0',
            font: {
              size: 11
            }
          }
        }
      }
    }
  });
}

function renderChartCategorias(salesByCategory) {
  const ctx = document.getElementById('chartCategorias');
  if (!ctx) return;

  if (chartCategoriasInstance) {
    chartCategoriasInstance.destroy();
  }

  const percentages = salesByCategory.percentages || {};
  const labels = Object.keys(percentages);
  const values = Object.values(percentages);

  const colors = ['#39ff14', '#b026ff', '#ffaa00', '#00d4ff', '#ff3860'];

  chartCategoriasInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: 'rgba(22, 22, 31, 0.8)',
        borderWidth: 4,
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(22, 22, 31, 0.9)',
          titleColor: '#39ff14',
          bodyColor: '#fff',
          titleFont: {
            size: 13,
            weight: 'bold'
          },
          padding: 12,
          cornerRadius: 10,
          borderColor: 'rgba(57, 255, 20, 0.2)',
          borderWidth: 1,
          displayColors: true,
          boxPadding: 4,
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = context.parsed || 0;
              return `${label}: ${value.toFixed(1)}%`;
            }
          }
        }
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  });

  // Renderizar leyenda personalizada
  renderLeyendaCategorias(labels, values, colors);
}

function renderLeyendaCategorias(labels, values, colors) {
  const container = document.getElementById('leyendaCategorias');
  if (!container) return;

  container.innerHTML = '';
  labels.forEach((label, index) => {
    const itemHTML = `
            <div class="item-leyenda">
                <div class="indicador-color" style="background: ${colors[index]};"></div>
                <div class="info-leyenda">
                    <div class="nombre-leyenda">${label}</div>
                    <div class="valor-leyenda">${values[index]?.toFixed(1)}%</div>
                </div>
            </div>
        `;
    container.innerHTML += itemHTML;
  });
}

// --- RENDER PRODUCTOS ---
function renderProductos(data) {
  renderListaProductos('listaTopProductos', data.topProducts || [], false);
  renderListaProductos('listaBajoRendimiento', data.lowPerformingProducts || [], true);
}

function renderListaProductos(containerId, productos, isLowPerformance) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  productos.forEach((producto, index) => {
    const positionStyle = isLowPerformance ? 'background: rgba(255, 56, 96, 0.3);' : '';
    const montoColor = isLowPerformance ? 'color: var(--rojo-error);' : '';

    const itemHTML = `
            <div class="item-producto">
                <div class="posicion-producto" style="${positionStyle}">${index + 1}</div>
                <div class="imagen-producto-mini">
                    ${producto.imageUrl ?
        `<img src="${producto.imageUrl}" alt="${producto.name}" style="width:100%; height:100%; object-fit:cover; border-radius:10px;">` :
        `<svg width="44" height="44" viewBox="0 0 44 44">
                            <path d="M8 32 L12 20 L32 18 L36 30 Z" fill="#333"/>
                            <ellipse cx="14" cy="34" rx="2" ry="1.5" fill="#666"/>
                            <ellipse cx="30" cy="34" rx="2" ry="1.5" fill="#666"/>
                        </svg>`
      }
                </div>
                <div class="info-producto">
                    <div class="nombre-producto">${producto.name}</div>
                    <div class="ventas-producto">${producto.unitsSold} unidades vendidas</div>
                </div>
                <div class="monto-producto" style="${montoColor}">${formatCurrency(producto.revenue)}</div>
            </div>
        `;
    container.innerHTML += itemHTML;
  });
}

// --- RENDER TRANSACCIONES ---
function renderTransacciones(data) {
  const tbody = document.getElementById('tablaTransacciones');
  if (!tbody) return;

  tbody.innerHTML = '';
  const transacciones = data.recentTransactions || [];

  transacciones.forEach(t => {
    const estadoClass = t.status?.toLowerCase() === 'delivered' ? 'completado' : 'pendiente';
    const rowHTML = `
            <tr>
                <td style="font-weight: 700; color: var(--neon-verde);">${t.id}</td>
                <td>${t.customer}</td>
                <td>${t.product}</td>
                <td>${t.date}</td>
                <td style="font-weight: 700; color: var(--neon-verde);">${formatCurrency(t.amount)}</td>
                <td><span class="estado-pedido ${estadoClass}">${t.status}</span></td>
            </tr>
        `;
    tbody.innerHTML += rowHTML;
  });
}

// --- ANIMAR KPIs ---
function animarKPIs() {
  const valores = document.querySelectorAll(".valor-kpi");

  valores.forEach((valor) => {
    const texto = valor.textContent.trim();
    let numero;
    let sufijo = "";

    if (texto.includes("$")) {
      numero = parseFloat(texto.replace(/[$,.]/g, "").replace(/\s/g, ""));
      sufijo = "$";
    } else if (texto.includes("%")) {
      numero = parseFloat(texto.replace("%", ""));
      sufijo = "%";
    } else {
      numero = parseFloat(texto.replace(/,/g, ""));
    }

    if (isNaN(numero)) numero = 0;

    let contador = 0;
    const pasos = 50;
    const incremento = numero / pasos;

    const intervalo = setInterval(() => {
      contador += incremento;
      if (contador >= numero) {
        contador = numero;
        clearInterval(intervalo);
      }

      if (sufijo === "$") {
        valor.textContent = formatCurrency(Math.floor(contador));
      } else if (sufijo === "%") {
        valor.textContent = `${contador.toFixed(1)}%`;
      } else {
        valor.textContent = Math.floor(contador).toLocaleString("es-CO");
      }
    }, 30);
  });
}

// --- CAMBIAR MÉTRICA ---
function cambiarMetrica(boton, metrica) {
  document.querySelectorAll(".boton-filtro").forEach((btn) => {
    btn.classList.remove("activo");
  });
  if (boton) boton.classList.add("activo");

  mostrarNotificacion(`📈 Mostrando datos de: ${metrica}`);
  // TODO: Implementar cambio de métrica en gráfico
}

// --- EXPORTAR REPORTE ---
async function exportarReporte() {
  const token = localStorage.getItem('token');
  mostrarNotificacion("📊 Generando reporte en PDF...");

  try {
    const payload = {
      module: "SALES",
      startDate: currentPeriod.startDate,
      endDate: currentPeriod.endDate,
      statusFilter: "ALL"
    };

    const response = await fetch('/api/admin/reports/export/pdf', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Error al generar PDF');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte_${currentPeriod.startDate}_${currentPeriod.endDate}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    mostrarNotificacion("✓ Reporte exportado exitosamente");
  } catch (error) {
    console.error('Error:', error);
    mostrarNotificacion("❌ Error al exportar reporte");
  }
}

// --- INICIALIZACIÓN ---
window.addEventListener("load", () => {
  // Establecer período inicial (mes actual)
  const hoy = new Date();
  currentPeriod.startDate = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split('T')[0];
  currentPeriod.endDate = hoy.toISOString().split('T')[0];

  // Cargar dashboard
  cargarDashboard();
});

// --- ATAJOS DE TECLADO ---
document.addEventListener("keydown", function (e) {
  // Ctrl/Cmd + E para exportar
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "e") {
    e.preventDefault();
    exportarReporte();
  }

  // Ctrl/Cmd + R para refrescar datos
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r") {
    e.preventDefault();
    mostrarNotificacion("🔄 Actualizando datos...");
    cargarDashboard();
  }
});

console.log(`
⌨️ ATAJOS DE TECLADO:
- Ctrl/Cmd + E: Exportar reporte
- Ctrl/Cmd + R: Refrescar datos

📊 Sistema de Reportes SNIKER v2.0
- Conectado con backend Spring Boot
- Visualización con Chart.js
- Exportación PDF integrada
`);
