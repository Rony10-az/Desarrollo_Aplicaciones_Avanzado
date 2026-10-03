// Solo usuarios logueados con rol user (o superior: admin)
if (Auth.guard(['user', 'admin'])) {

    const SERIES_USER = '#c8763f'; // terracota (validado contra la superficie clara)
    const INK = { primary: '#263238', secondary: '#5f6b70', grid: '#ebe6df' };
    const nf = new Intl.NumberFormat('es-PE');
    const dayFmt = new Intl.DateTimeFormat('es-PE', { weekday: 'short', day: '2-digit' });
    const DAY_MS = 86400000;

    // ---------- Cálculos con los datos reales del usuario ----------
    const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };

    function nextBirthday(birthdate) {
        if (!birthdate) return null;
        const b = new Date(birthdate);
        const today = startOfToday();
        let next = new Date(today.getFullYear(), b.getUTCMonth(), b.getUTCDate());
        if (next < today) next.setFullYear(today.getFullYear() + 1);
        return Math.round((next - today) / DAY_MS);
    }

    const profileFields = [
        ['name', 'Nombres'], ['lastName', 'Apellidos'], ['email', 'Correo electrónico'],
        ['phoneNumer', 'Teléfono'], ['birthdate', 'Fecha de nacimiento'],
        ['adress', 'Dirección'], ['url_profile', 'Foto de perfil']
    ];

    // ---------- Indicadores personales ----------
    function renderKpis(user) {
        const memberDays = Math.max(0, Math.floor((Date.now() - new Date(user.createdAt)) / DAY_MS));
        const bday = nextBirthday(user.birthdate);
        const filled = profileFields.filter(([k]) => user[k]).length;
        const pct = Math.round(filled / profileFields.length * 100);

        const items = [
            { icon: 'cake', label: 'Tu edad', value: user.age ?? 0, suffix: ' años', note: formatDate(user.birthdate) },
            { icon: 'event_available', label: 'Días como miembro', value: memberDays, suffix: '', note: `Desde ${formatDate(user.createdAt)}` },
            {
                icon: 'celebration', label: 'Para tu cumpleaños', value: bday ?? 0, suffix: ' días',
                note: bday === 0 ? '¡Feliz cumpleaños!' : 'Cuenta regresiva'
            },
            { icon: 'task_alt', label: 'Perfil completo', value: pct, suffix: '%', note: `${filled} de ${profileFields.length} datos` }
        ];

        document.getElementById('kpis').innerHTML = items.map((k, i) => `
            <div class="kpi accent-${i + 1}" style="animation-delay:${i * 90}ms">
                <div class="kpi-top">
                    <span class="kpi-icon"><i class="material-icons">${k.icon}</i></span>
                    <span class="real-chip">Real</span>
                </div>
                <div class="kpi-value"><span data-count="${k.value}">0</span>${k.suffix}</div>
                <div class="kpi-label">${k.label}</div>
                <div class="kpi-note">${escapeHtml(k.note)}</div>
            </div>`).join('');

        document.querySelectorAll('[data-count]').forEach(el =>
            countUp(el, Number(el.dataset.count), { format: v => nf.format(v) }));

        return { pct, filled };
    }

    // ---------- Anillo de progreso + primeros pasos ----------
    function renderProfile(user, pct) {
        const ring = document.getElementById('ring-value');
        const circumference = 2 * Math.PI * 52;
        ring.style.strokeDasharray = circumference;
        ring.style.strokeDashoffset = circumference;
        ring.getBoundingClientRect(); // fuerza el estado inicial antes de animar
        ring.style.strokeDashoffset = circumference * (1 - pct / 100);
        countUp(document.getElementById('ring-pct'), pct, { format: v => `${v}%` });

        const steps = [
            { done: true, text: 'Crear tu cuenta' },
            { done: true, text: 'Iniciar sesión con JWT' },
            { done: Boolean(user.phoneNumer), text: 'Registrar tu teléfono' },
            { done: Boolean(user.adress), text: 'Agregar tu dirección' },
            { done: Boolean(user.url_profile), text: 'Subir una foto de perfil (URL)' }
        ];
        document.getElementById('steps').innerHTML = steps.map((s, i) => `
            <li class="${s.done ? 'done' : ''}" style="animation-delay:${200 + i * 80}ms">
                <i class="material-icons">${s.done ? 'check_circle' : 'radio_button_unchecked'}</i>${s.text}
            </li>`).join('');
    }

    // ---------- Actividad (simulada, estable por usuario y por día) ----------
    function renderActivity(user) {
        let seed = [...`${user.id}${startOfToday().toDateString()}`].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7);
        const rand = () => ((seed = (seed * 1103515245 + 12345) | 0) >>> 0) / 4294967296;

        const days = Array.from({ length: 7 }, (_, i) => new Date(startOfToday().getTime() - (6 - i) * DAY_MS));
        const logins = days.map((d, i) => i === 6 ? 1 + Math.floor(rand() * 3) : Math.floor(rand() * 5));

        Chart.defaults.font.family = "'Poppins', 'Roboto', sans-serif";

        new Chart(document.getElementById('chart-activity'), {
            type: 'bar',
            data: {
                labels: days.map(d => dayFmt.format(d)),
                datasets: [{
                    label: 'Inicios de sesión', data: logins, backgroundColor: SERIES_USER,
                    borderRadius: 4, borderSkipped: 'start', maxBarThickness: 34
                }]
            },
            options: {
                maintainAspectRatio: false,
                animation: { duration: prefersReducedMotion() ? 0 : 900, easing: 'easeOutQuart' },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1f2a2d', padding: 10, cornerRadius: 8,
                        callbacks: { label: c => ` ${c.parsed.y} inicio(s) de sesión` }
                    }
                },
                scales: {
                    x: { grid: { display: false }, border: { display: false }, ticks: { color: INK.secondary } },
                    y: {
                        beginAtZero: true, border: { display: false },
                        grid: { color: INK.grid, drawTicks: false },
                        ticks: { precision: 0, padding: 8, color: INK.secondary }
                    }
                }
            }
        });
        document.getElementById('table-activity').innerHTML = `
            <table class="striped data-table">
                <thead><tr><th>Día</th><th>Inicios de sesión</th></tr></thead>
                <tbody>${days.map((d, i) => `<tr><td>${dayFmt.format(d)}</td><td>${logins[i]}</td></tr>`).join('')}</tbody>
            </table>`;
    }

    // ---------- Carga ----------
    (async () => {
        const introDone = Welcome.intro();
        try {
            const user = await api('/users/me');
            const g = greeting();
            const firstName = (user.name || user.email).split(' ')[0];
            const bday = nextBirthday(user.birthdate);

            Welcome.setIntroName(firstName);
            Welcome.hero(user, {
                title: `${g.text}, ${firstName}`,
                icon: g.icon,
                messages: [
                    'Bienvenido a tu espacio personal. Aquí están tus datos.',
                    bday === 0 ? '¡Hoy es tu cumpleaños! Que tengas un gran día.' : `Faltan ${bday} días para tu cumpleaños.`,
                    'Mantén tus datos al día desde «Mi cuenta».',
                    'Gira la tarjeta para ver los datos de tu sesión.'
                ]
            });
            document.getElementById('details').innerHTML = userDetails(user);

            // Las animaciones de los indicadores empiezan cuando termina la bienvenida
            await introDone;
            const { pct } = renderKpis(user);
            renderProfile(user, pct);
            document.fonts.ready.then(() => renderActivity(user));
        } catch (err) {
            await introDone;
            M.toast({ html: escapeHtml(err.message), classes: 'red' });
        }
    })();
}
