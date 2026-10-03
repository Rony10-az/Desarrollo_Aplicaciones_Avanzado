// Experiencia de ingreso compartida por ambos dashboards (admin y user):
//  1. Bienvenida a pantalla completa que se desplaza a los 3 segundos.
//  2. Banner 3D con datos de la sesión que se gira arrastrando.
const Welcome = {

    INTRO_MS: 3000,

    // ---------- 1. Bienvenida a pantalla completa ----------
    intro() {
        const overlay = document.getElementById('welcome-intro');
        const root = document.documentElement;
        const key = `intro:${Auth.payload()?.iat}`;

        // Entrada escalonada de las secciones del panel
        const ready = () => {
            document.querySelectorAll('.reveal').forEach((el, i) => (el.style.animationDelay = `${i * 90}ms`));
            root.classList.add('dash-ready');
        };

        const finish = () => {
            root.classList.remove('intro-pending');
            ready();
            overlay?.remove();
        };

        if (!overlay || !root.classList.contains('intro-pending')) {
            finish();
            return Promise.resolve();
        }

        sessionStorage.setItem(key, '1');
        overlay.classList.add('running');

        return new Promise(resolve => {
            let done = false;
            const leave = () => {
                if (done) return;
                done = true;
                overlay.classList.add('leaving');           // se desplaza hacia arriba
                ready();                                    // el panel entra por detrás
                setTimeout(() => { finish(); resolve(); }, prefersReducedMotion() ? 0 : 850);
            };
            setTimeout(leave, prefersReducedMotion() ? 600 : this.INTRO_MS);
            document.getElementById('intro-skip').addEventListener('click', leave);
            document.addEventListener('keydown', e => e.key === 'Escape' && leave(), { once: true });
        });
    },

    setIntroName(name) {
        const el = document.getElementById('intro-name');
        if (el && name) el.textContent = `, ${name}`;
    },

    // ---------- 2. Banner 3D ----------
    hero(user, { title, messages = [], icon } = {}) {
        const $ = id => document.getElementById(id);
        const payload = Auth.payload();

        $('hero-avatar').innerHTML = avatarHtml(user, 'large');
        $('hero-title').textContent = title;
        if (icon) $('hero-icon').textContent = icon;
        $('hero-roles').innerHTML = user.roles.map(roleChip).join('');
        $('hero-email').textContent = user.email;
        $('hero-role-list').textContent = user.roles.join(', ');
        $('hero-since').textContent = formatDate(user.createdAt);
        $('hero-iat').textContent = payload.iat
            ? new Date(payload.iat * 1000).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
            : '—';

        // Reloj, fecha y expiración del token
        const tick = () => {
            const now = new Date();
            $('hero-clock').textContent = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            $('hero-date').textContent = now.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });
            const secs = Math.max(0, Math.floor(payload.exp - now.getTime() / 1000));
            const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
            $('hero-expires').textContent = `${h ? `${h} h ` : ''}${String(m).padStart(2, '0')} min ${String(s).padStart(2, '0')} s`;
        };
        tick();
        setInterval(tick, 1000);

        // Estado de la API (latencia de /health)
        (async () => {
            const t0 = performance.now();
            try {
                const res = await fetch('/health');
                if (!res.ok) throw new Error();
                $('hero-api').textContent = `API operativa · ${Math.round(performance.now() - t0)} ms`;
            } catch {
                $('hero-api').textContent = 'API sin respuesta';
                $('hero3d').classList.add('api-down');
            }
        })();

        // Mensajes rotativos
        const msg = $('hero-msg');
        let i = 0;
        msg.textContent = messages[0] || '';
        if (messages.length > 1 && !prefersReducedMotion()) {
            setInterval(() => {
                msg.classList.add('out');
                setTimeout(() => {
                    i = (i + 1) % messages.length;
                    msg.textContent = messages[i];
                    msg.classList.remove('out');
                }, 400);
            }, 5000);
        }

        this.interact3d($('hero3d-card'), $('hero3d-flip'));
    },

    // Interacción 3D: inclinación con el puntero, arrastre para girar y botón/teclado para voltear
    interact3d(card, flipBtn) {
        let base = 0;                 // 0 = frente, 180 = reverso
        let rx = 0, ry = 0;
        let drag = null;

        const apply = (x, y, smooth) => {
            rx = x; ry = y;
            card.style.transition = smooth ? '' : 'none';
            card.style.setProperty('--rx', `${rx}deg`);
            card.style.setProperty('--ry', `${ry}deg`);
            card.classList.toggle('flipped', Math.abs(((ry % 360) + 360) % 360 - 180) < 90);
        };
        const flip = () => { base += 180; apply(0, base, true); };

        flipBtn.addEventListener('click', flip);
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
        });

        if (prefersReducedMotion()) return;

        card.addEventListener('pointerdown', e => {
            drag = { x: e.clientX, y: e.clientY, ry, moved: false };
            card.setPointerCapture(e.pointerId);
            card.classList.add('dragging');
        });
        card.addEventListener('pointermove', e => {
            const r = card.getBoundingClientRect();
            if (drag) {
                const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
                if (Math.abs(dx) > 3) drag.moved = true;
                apply(Math.max(-20, Math.min(20, -dy * 0.15)), drag.ry + dx * 0.6, false);
            } else {
                // Inclinación suave siguiendo al puntero
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                apply(-y * 10, base + x * 14, true);
                card.style.setProperty('--gx', `${(x + 0.5) * 100}%`);
                card.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
            }
        });
        const release = () => {
            if (!drag) return;
            card.classList.remove('dragging');
            // Encaja en la cara más cercana (frente o reverso)
            base = Math.round(ry / 180) * 180;
            drag = null;
            apply(0, base, true);
        };
        card.addEventListener('pointerup', release);
        card.addEventListener('pointercancel', release);
        card.addEventListener('pointerleave', () => { if (!drag) apply(0, base, true); });
    }
};

// Saludo según la hora del día
function greeting(date = new Date()) {
    const h = date.getHours();
    if (h < 12) return { text: 'Buenos días', icon: 'wb_sunny' };
    if (h < 19) return { text: 'Buenas tardes', icon: 'wb_twilight' };
    return { text: 'Buenas noches', icon: 'dark_mode' };
}
