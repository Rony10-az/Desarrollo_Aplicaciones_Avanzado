// Solo accesible para el rol admin
if (Auth.guard(['admin'])) {

    // ---------- Paleta de gráficos (validada para daltonismo) ----------
    const SERIES = ['#0a84b0', '#c8763f', '#6a5ac0'];
    const INK = { primary: '#263238', secondary: '#5f6b70', muted: '#8d989c', grid: '#ebe6df' };

    const nf = new Intl.NumberFormat('es-PE');
    const dayFmt = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short' });
    const monthFmt = new Intl.DateTimeFormat('es-PE', { month: 'short', year: '2-digit' });

    const tableHtml = (headers, rows) => `
        <table class="striped data-table">
            <thead><tr>${headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>
            <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>`;

    // =====================================================================
    // 1. Datos simulados (semilla por día: estables durante la jornada)
    // =====================================================================
    function mulberry32(seed) {
        return () => {
            seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
            let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const rand = mulberry32(Number(today.toISOString().slice(0, 10).replace(/-/g, '')));

    const days = Array.from({ length: 14 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - (13 - i));
        return d;
    });
    const views = days.map((d, i) => {
        const weekend = d.getDay() === 0 || d.getDay() === 6 ? 0.68 : 1;
        return Math.round((1150 + i * 22) * weekend * (0.88 + rand() * 0.24));
    });
    const uniques = views.map(v => Math.round(v * (0.56 + rand() * 0.1)));

    const pages = [
        ['/', 0.31], ['/signIn', 0.24], ['/dashboard', 0.18],
        ['/profile', 0.12], ['/signUp', 0.09], ['/admin/dashboard', 0.06]
    ];
    const totalViews = views.reduce((a, b) => a + b, 0);
    const pageViews = pages.map(([path, share]) => [path, Math.round(totalViews * share * (0.9 + rand() * 0.2))]);

    const devices = [['Escritorio', 58 + Math.round(rand() * 6)], ['Móvil', 30 + Math.round(rand() * 6)]];
    devices.push(['Tablet', 100 - devices[0][1] - devices[1][1]]);

    const sessionSecs = 170 + Math.round(rand() * 90);

    // =====================================================================
    // 2. Configuración común de Chart.js
    // =====================================================================
    Chart.defaults.font.family = "'Poppins', 'Roboto', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = INK.secondary;
    Chart.defaults.plugins.tooltip.backgroundColor = '#1f2a2d';
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.boxPadding = 4;
    Chart.defaults.plugins.tooltip.usePointStyle = true;

    const axis = {
        grid: { color: INK.grid, drawTicks: false },
        border: { display: false },
        ticks: { padding: 8 }
    };

    // Etiqueta directa al final de cada línea (identidad sin depender solo del color)
    const endLabels = {
        id: 'endLabels',
        afterDatasetsDraw(chart) {
            const { ctx } = chart;
            if (chart.width < 560) return; // en móvil basta la leyenda
            chart.data.datasets.forEach((ds, i) => {
                const meta = chart.getDatasetMeta(i);
                if (meta.hidden) return;
                const pt = meta.data[meta.data.length - 1];
                ctx.save();
                ctx.font = `500 12px ${Chart.defaults.font.family}`;
                ctx.fillStyle = INK.primary;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(`${ds.label}: ${nf.format(ds.data[ds.data.length - 1])}`, pt.x + 10, pt.y);
                ctx.restore();
            });
        }
    };

    // Se dibujan al terminar la bienvenida, con la fuente ya cargada (medidas correctas)
    const drawSimCharts = () => {

    // Tráfico: dos series de la misma unidad (vistas) → un solo eje
    new Chart(document.getElementById('chart-traffic'), {
        type: 'line',
        data: {
            labels: days.map(d => dayFmt.format(d)),
            datasets: [
                {
                    label: 'Páginas vistas', data: views, borderColor: SERIES[0], borderWidth: 2,
                    backgroundColor: 'rgba(10, 132, 176, 0.10)', fill: true, tension: 0.35,
                    pointRadius: 0, pointHoverRadius: 5, pointBackgroundColor: SERIES[0],
                    pointHoverBorderColor: '#fff', pointHoverBorderWidth: 2
                },
                {
                    label: 'Visitantes únicos', data: uniques, borderColor: SERIES[1], borderWidth: 2,
                    fill: false, tension: 0.35,
                    pointRadius: 0, pointHoverRadius: 5, pointBackgroundColor: SERIES[1],
                    pointHoverBorderColor: '#fff', pointHoverBorderWidth: 2
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            layout: { padding: ctx => ({ top: 8, right: ctx.chart.width < 560 ? 4 : 170 }) },
            plugins: {
                legend: { position: 'top', align: 'end', labels: { usePointStyle: true, pointStyle: 'line', boxWidth: 18 } },
                tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ${nf.format(c.parsed.y)}` } }
            },
            scales: {
                x: { ...axis, grid: { display: false } },
                y: { ...axis, beginAtZero: true, ticks: { ...axis.ticks, callback: v => nf.format(v) } }
            }
        },
        plugins: [endLabels]
    });
    document.getElementById('table-traffic').innerHTML = tableHtml(
        ['Día', 'Páginas vistas', 'Visitantes únicos'],
        days.map((d, i) => [dayFmt.format(d), nf.format(views[i]), nf.format(uniques[i])])
    );

    // Vistas por página: magnitud por categoría → barras horizontales, una serie
    new Chart(document.getElementById('chart-pages'), {
        type: 'bar',
        data: {
            labels: pageViews.map(p => p[0]),
            datasets: [{
                label: 'Vistas', data: pageViews.map(p => p[1]), backgroundColor: SERIES[0],
                borderRadius: 4, borderSkipped: 'start', barThickness: 16
            }]
        },
        options: {
            indexAxis: 'y',
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: c => ` ${nf.format(c.parsed.x)} vistas` } }
            },
            scales: {
                x: { ...axis, beginAtZero: true, ticks: { ...axis.ticks, callback: v => nf.format(v) } },
                y: { ...axis, grid: { display: false }, ticks: { ...axis.ticks, color: INK.primary } }
            }
        }
    });
    document.getElementById('table-pages').innerHTML = tableHtml(
        ['Página', 'Vistas'], pageViews.map(([p, v]) => [p, nf.format(v)])
    );
    };

    // Dispositivos: parte de un todo con 3 categorías → barra apilada al 100%
    document.getElementById('devices').innerHTML = `
        <div class="meter-bar" role="img"
             aria-label="${devices.map(([n, v]) => `${n} ${v}%`).join(', ')}">
            ${devices.map(([n, v], i) => `
                <span class="meter-seg" style="flex:${v};background:${SERIES[i]}" title="${n}: ${v}%"></span>`).join('')}
        </div>
        <ul class="meter-legend">
            ${devices.map(([n, v], i) => `
                <li><span class="swatch" style="background:${SERIES[i]}"></span>${n}<b>${v}%</b></li>`).join('')}
        </ul>`;

    // =====================================================================
    // 3. Indicadores (mezcla de datos reales y simulados)
    // =====================================================================
    const kpi = ({ icon, label, value, note, sim }, i) => `
        <div class="kpi accent-${i + 1}" style="animation-delay:${i * 90}ms">
            <div class="kpi-top">
                <span class="kpi-icon"><i class="material-icons">${icon}</i></span>
                <span class="${sim ? 'sim-chip' : 'real-chip'}">${sim ? 'Simulado' : 'Real'}</span>
            </div>
            <div class="kpi-value">${value}</div>
            <div class="kpi-label">${label}</div>
            <div class="kpi-note">${note}</div>
        </div>`;

    function renderKpis(users) {
        const admins = users.filter(u => u.roles.includes('admin')).length;
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const newThisMonth = users.filter(u => new Date(u.createdAt) >= monthStart).length;
        const viewsToday = views[views.length - 1];
        const diff = (viewsToday - views[views.length - 2]) / views[views.length - 2] * 100;
        const trend = `<i class="material-icons tiny">${diff >= 0 ? 'trending_up' : 'trending_down'}</i>
                       ${diff >= 0 ? '+' : ''}${diff.toFixed(1)}% vs. ayer`;

        document.getElementById('kpis').innerHTML = [
            { icon: 'visibility', label: 'Páginas vistas hoy', value: nf.format(viewsToday), note: trend, sim: true },
            { icon: 'timer', label: 'Duración media de sesión', value: `${Math.floor(sessionSecs / 60)}m ${sessionSecs % 60}s`, note: 'Promedio de 14 días', sim: true },
            { icon: 'group', label: 'Usuarios registrados', value: nf.format(users.length), note: `${newThisMonth} nuevo(s) este mes`, sim: false },
            { icon: 'verified_user', label: 'Administradores', value: nf.format(admins), note: `${users.length - admins} con rol user`, sim: false }
        ].map(kpi).join('');
    }

    // Registros por mes (datos reales a partir de createdAt)
    function renderSignups(users) {
        const months = Array.from({ length: 6 }, (_, i) => new Date(today.getFullYear(), today.getMonth() - (5 - i), 1));
        const counts = months.map(m => users.filter(u => {
            const c = new Date(u.createdAt);
            return c.getFullYear() === m.getFullYear() && c.getMonth() === m.getMonth();
        }).length);

        new Chart(document.getElementById('chart-signups'), {
            type: 'bar',
            data: {
                labels: months.map(m => monthFmt.format(m)),
                datasets: [{
                    label: 'Registros', data: counts, backgroundColor: SERIES[0],
                    borderRadius: 4, borderSkipped: 'start', maxBarThickness: 36
                }]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: c => ` ${c.parsed.y} registro(s)` } }
                },
                scales: {
                    x: { ...axis, grid: { display: false } },
                    y: { ...axis, beginAtZero: true, ticks: { ...axis.ticks, precision: 0 } }
                }
            }
        });
        document.getElementById('table-signups').innerHTML = tableHtml(
            ['Mes', 'Registros'], months.map((m, i) => [monthFmt.format(m), String(counts[i])])
        );
    }

    // =====================================================================
    // 4. Tabla de usuarios + modal de detalle
    // =====================================================================
    const tbody = document.getElementById('users-body');
    const modalBody = document.getElementById('modal-body');
    const modal = M.Modal.init(document.getElementById('user-modal'));
    let users = [];

    const renderTable = list => {
        if (!list.length) {
            tbody.innerHTML = '<tr><td colspan="7" class="center-align grey-text">No se encontraron usuarios</td></tr>';
            return;
        }
        tbody.innerHTML = list.map(u => `
            <tr>
                <td>${avatarHtml(u, 'small')}</td>
                <td>${escapeHtml([u.name, u.lastName].filter(Boolean).join(' '))}</td>
                <td>${escapeHtml(u.email)}</td>
                <td>${escapeHtml(u.phoneNumer) || '—'}</td>
                <td>${u.roles.map(roleChip).join('')}</td>
                <td>${formatDateTime(u.createdAt)}</td>
                <td>
                    <button class="btn-small brand waves-effect btn-view" data-id="${escapeHtml(u.id)}">
                        <i class="material-icons left">visibility</i>Ver
                    </button>
                </td>
            </tr>`).join('');
    };

    // Ver información de un usuario: GET /api/users/:id
    tbody.addEventListener('click', async e => {
        const btn = e.target.closest('.btn-view');
        if (!btn) return;
        modalBody.innerHTML = '<div class="progress"><div class="indeterminate"></div></div>';
        modal.open();
        try {
            const user = await api(`/users/${btn.dataset.id}`);
            modalBody.innerHTML = `
                <div class="modal-header">
                    ${avatarHtml(user, 'large')}
                    <div>
                        <h5>${escapeHtml(fullName(user))}</h5>
                        ${user.roles.map(roleChip).join('')}
                    </div>
                </div>
                <ul class="collection">
                    ${userDetails(user)}
                    ${detailItem('fingerprint', 'ID', user.id)}
                    ${detailItem('update', 'Última actualización', formatDateTime(user.updatedAt))}
                </ul>`;
        } catch (err) {
            modalBody.innerHTML = `<p class="red-text">${escapeHtml(err.message)}</p>`;
        }
    });

    document.getElementById('search').addEventListener('input', e => {
        const q = e.target.value.trim().toLowerCase();
        renderTable(users.filter(u =>
            [u.name, u.lastName, u.email, ...u.roles].some(v => (v || '').toLowerCase().includes(q))
        ));
    });

    // =====================================================================
    // 5. Carga: bienvenida → banner 3D → indicadores y gráficos
    // =====================================================================
    (async () => {
        const introDone = Welcome.intro();
        try {
            const [me, list] = await Promise.all([api('/users/me'), api('/users')]);
            users = list;
            const firstName = (me.name || me.email).split(' ')[0];

            Welcome.setIntroName(firstName);
            Welcome.hero(me, {
                title: `Bienvenido, ${fullName(me)}`,
                messages: [
                    'Sesión autenticada mediante JSON Web Token con privilegios de administrador.',
                    `Hay ${users.length} cuenta(s) registradas en el sistema.`,
                    'Supervise la actividad del sitio y gestione las cuentas desde este panel.',
                    'Gire la tarjeta para consultar los datos técnicos de la sesión.'
                ]
            });
            renderTable(users);

            await introDone;
            renderKpis(users);
            await document.fonts.ready;
            drawSimCharts();
            renderSignups(users);
        } catch (err) {
            await introDone;
            tbody.innerHTML = `<tr><td colspan="7" class="center-align red-text">${escapeHtml(err.message)}</td></tr>`;
        }
    })();
}
