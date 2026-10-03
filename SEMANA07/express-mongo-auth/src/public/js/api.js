// Cliente de la API: maneja el token JWT (sessionStorage), la protección de rutas y las peticiones.
const Auth = {
    getToken: () => sessionStorage.getItem('token'),
    setToken: token => sessionStorage.setItem('token', token),

    logout(message) {
        sessionStorage.removeItem('token');
        if (message) sessionStorage.setItem('flash', message);
        window.location.href = '/signIn';
    },

    // Decodifica el payload del JWT (sub, roles, exp) sin verificar la firma.
    payload() {
        const token = this.getToken();
        if (!token) return null;
        try {
            const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(atob(base64));
        } catch {
            return null;
        }
    },

    isExpired() {
        const data = this.payload();
        return !data || (data.exp && data.exp * 1000 <= Date.now());
    },

    isLogged() { return this.getToken() !== null && !this.isExpired(); },
    roles() { return this.isLogged() ? this.payload().roles || [] : []; },
    isAdmin() { return this.roles().includes('admin'); },
    homePath() { return this.isAdmin() ? '/admin/dashboard' : '/dashboard'; },

    // Protección de rutas:
    //  - sin token => /signIn
    //  - token expirado => cerrar sesión y /signIn
    //  - sin el rol requerido => /403
    guard(requiredRoles = []) {
        if (!this.getToken()) {
            window.location.replace('/signIn');
            return false;
        }
        if (this.isExpired()) {
            this.logout('Tu sesión expiró. Inicia sesión nuevamente.');
            return false;
        }
        if (requiredRoles.length && !this.roles().some(r => requiredRoles.includes(r))) {
            window.location.replace('/403');
            return false;
        }
        return true;
    },

    redirectIfLogged() {
        if (this.isLogged()) window.location.replace(this.homePath());
    },

    // Cierra la sesión automáticamente en el momento en que expira el token.
    scheduleAutoLogout() {
        const data = this.payload();
        if (!data?.exp) return;
        const ms = data.exp * 1000 - Date.now();
        if (ms > 0 && ms < 2 ** 31) {
            setTimeout(() => this.logout('Tu sesión expiró. Inicia sesión nuevamente.'), ms);
        }
    }
};

async function api(path, { method = 'GET', body } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    const token = Auth.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`/api${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => ({}));

    // Token inválido/caducado según el servidor
    if (res.status === 401 && token) Auth.logout('Tu sesión expiró. Inicia sesión nuevamente.');
    // Sin permisos suficientes
    if (res.status === 403) window.location.href = '/403';

    if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
    return data;
}

// Utilidades de presentación
const escapeHtml = value => String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const formatDate = value => value
    ? new Date(value).toLocaleDateString('es-PE', { timeZone: 'UTC', day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

const formatDateTime = value => value
    ? new Date(value).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' })
    : '—';

const fullName = user => [user.name, user.lastName].filter(Boolean).join(' ') || user.email;

const roleChip = role => `<div class="chip ${role === 'admin' ? 'chip-admin' : 'chip-user'}">${escapeHtml(role)}</div>`;

function avatarHtml(user, size = 'large') {
    const initials = ((user.name || user.email || '?').charAt(0) + (user.lastName || '').charAt(0)).toUpperCase();
    if (user.url_profile && /^https?:\/\//i.test(user.url_profile)) {
        // Si la imagen no carga, se reemplaza por las iniciales
        return `<img class="circle avatar-${size}" src="${escapeHtml(user.url_profile)}" alt="avatar"
                    data-initials="${escapeHtml(initials)}"
                    onerror="this.replaceWith(Object.assign(document.createElement('span'), { className: 'circle avatar-${size} avatar-initials', textContent: this.dataset.initials }))">`;
    }
    return `<span class="circle avatar-${size} avatar-initials">${escapeHtml(initials)}</span>`;
}

// Lista de datos del usuario (usada en dashboard, perfil y detalle de admin)
const detailItem = (icon, label, value) => `
    <li class="collection-item avatar">
        <i class="material-icons circle brand">${icon}</i>
        <span class="title grey-text">${label}</span>
        <p>${escapeHtml(value) || '—'}</p>
    </li>`;

const userDetails = user => [
    detailItem('person', 'Nombre completo', [user.name, user.lastName].filter(Boolean).join(' ')),
    detailItem('email', 'Correo', user.email),
    detailItem('phone', 'Teléfono', user.phoneNumer),
    detailItem('cake', 'Fecha de nacimiento', formatDate(user.birthdate)),
    detailItem('timelapse', 'Edad', user.age != null ? `${user.age} años` : ''),
    detailItem('home', 'Dirección', user.adress),
    detailItem('event', 'Fecha de registro', formatDateTime(user.createdAt))
].join('');

function setLoading(form, loading) {
    form.querySelector('button[type=submit]').disabled = loading;
    form.querySelector('.progress')?.classList.toggle('hide', !loading);
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Contador animado de 0 al valor final
function countUp(el, value, { duration = 1200, format = v => v } = {}) {
    if (prefersReducedMotion()) { el.textContent = format(value); return; }
    const start = performance.now();
    let done = false;
    const step = () => {
        if (done) return;
        const t = Math.min(1, Math.max(0, (performance.now() - start) / duration));
        el.textContent = format(Math.round(value * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(step); else done = true;
    };
    requestAnimationFrame(step);
    // Garantiza el valor final aunque el navegador pause rAF (pestaña en segundo plano)
    setTimeout(() => { done = true; el.textContent = format(value); }, duration + 100);
}

// Navbar dinámico según sesión y rol + mensajes flash
document.addEventListener('DOMContentLoaded', () => {
    M.Sidenav.init(document.querySelectorAll('.sidenav'));

    const logged = Auth.isLogged();
    const admin = Auth.isAdmin();
    document.querySelectorAll('.guest-only').forEach(el => el.classList.toggle('hide', logged));
    document.querySelectorAll('.auth-only').forEach(el => el.classList.toggle('hide', !logged));
    document.querySelectorAll('.admin-only').forEach(el => el.classList.toggle('hide', !admin));
    document.querySelectorAll('.btn-logout').forEach(el => el.addEventListener('click', e => {
        e.preventDefault();
        Auth.logout('Sesión cerrada correctamente.');
    }));

    if (logged) Auth.scheduleAutoLogout();

    const flash = sessionStorage.getItem('flash');
    if (flash) {
        sessionStorage.removeItem('flash');
        M.toast({ html: escapeHtml(flash), classes: 'brand' });
    }
});
