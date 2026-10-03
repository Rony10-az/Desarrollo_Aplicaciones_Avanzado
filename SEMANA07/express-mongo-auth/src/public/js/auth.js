Auth.redirectIfLogged();

const shell = document.querySelector('.auth-shell');
const role = shell.dataset.role;
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const passwordRule = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$%&*@])[A-Za-z\d#$%&*@]{8,}$/;

// ---------- Cambio dinámico entre SignIn y SignUp (sin recargar) ----------
function setMode(mode, { push = true } = {}) {
    if (mode === 'signup' && !signupForm) mode = 'signin';
    const previous = shell.dataset.mode;
    shell.dataset.mode = mode;

    // Dirección de la animación: signup entra por la derecha, signin por la izquierda
    document.querySelectorAll('.auth-form').forEach(form => {
        const active = form.dataset.mode === mode;
        form.classList.toggle('active', active);
        form.classList.remove('from-left', 'from-right');
        if (active && previous !== mode) form.classList.add(mode === 'signup' ? 'from-right' : 'from-left');
    });
    document.querySelectorAll('.auth-switch button').forEach(b =>
        b.setAttribute('aria-selected', b.dataset.mode === mode));

    // Textos del panel visual
    document.querySelectorAll('[data-signin]').forEach(el => (el.textContent = el.dataset[mode]));
    document.title = `${mode === 'signup' ? 'Registro' : 'Iniciar sesión'} | Express Mongo Auth`;

    if (push) {
        const url = `/${mode === 'signup' ? 'signUp' : 'signIn'}${role ? `?role=${role}` : ''}`;
        history.pushState({ mode }, '', url);
    }
    M.updateTextFields();
}

document.querySelectorAll('.auth-switch button, [data-switch]').forEach(el =>
    el.addEventListener('click', e => {
        e.preventDefault();
        setMode(el.dataset.mode || el.dataset.switch);
    }));

window.addEventListener('popstate', () =>
    setMode(location.pathname.toLowerCase() === '/signup' ? 'signup' : 'signin', { push: false }));

setMode(shell.dataset.mode, { push: false });

// ---------- Mostrar / ocultar contraseña ----------
document.querySelectorAll('.toggle-pass').forEach(icon => icon.addEventListener('click', () => {
    const input = icon.parentElement.querySelector('input');
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    icon.textContent = show ? 'visibility_off' : 'visibility';
}));

// ---------- SignIn ----------
signinForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = signinForm.email.value.trim();
    const password = signinForm.password.value;

    if (!email || !password) {
        return M.toast({ html: 'El email y password son requeridos', classes: 'orange darken-2' });
    }

    setLoading(signinForm, true);
    try {
        const { token } = await api('/auth/signIn', { method: 'POST', body: { email, password } });
        Auth.setToken(token);
        // Eligió "administrador" en el inicio pero su cuenta no tiene ese rol
        if (role === 'admin' && !Auth.isAdmin()) {
            sessionStorage.setItem('flash', 'Tu cuenta no tiene rol de administrador. Ingresaste como usuario.');
        } else {
            M.toast({ html: '¡Bienvenido!', classes: 'green' });
        }
        // Redirigir al dashboard correspondiente a su rol
        setTimeout(() => (window.location.href = Auth.homePath()), 600);
    } catch (err) {
        M.toast({ html: escapeHtml(err.message), classes: 'red' });
        setLoading(signinForm, false);
    }
});

// ---------- SignUp ----------
if (signupForm) {
    const rules = {
        length: v => v.length >= 8,
        upper: v => /[A-Z]/.test(v),
        digit: v => /\d/.test(v),
        special: v => /[#$%&*@]/.test(v)
    };

    // Checklist en vivo de los requisitos de la contraseña
    signupForm.password.addEventListener('input', () => {
        const value = signupForm.password.value;
        Object.entries(rules).forEach(([name, test]) => {
            const li = signupForm.querySelector(`[data-rule="${name}"]`);
            const ok = test(value);
            li.classList.toggle('ok', ok);
            li.querySelector('i').textContent = ok ? 'check_circle' : 'radio_button_unchecked';
        });
        const valid = passwordRule.test(value);
        signupForm.password.classList.toggle('valid', valid);
        signupForm.password.classList.toggle('invalid', !valid && value.length > 0);
    });

    signupForm.addEventListener('submit', async e => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(signupForm).entries());
        Object.keys(data).forEach(k => (data[k] = data[k].trim()));
        data.password = signupForm.password.value;

        const missing = ['name', 'lastName', 'phoneNumer', 'birthdate', 'email', 'password'].filter(k => !data[k]);
        if (missing.length) {
            return M.toast({ html: 'Completa todos los campos obligatorios (*)', classes: 'orange darken-2' });
        }
        if (!passwordRule.test(data.password)) {
            return M.toast({ html: 'La contraseña no cumple los requisitos', classes: 'orange darken-2' });
        }
        if (new Date(data.birthdate) > new Date()) {
            return M.toast({ html: 'La fecha de nacimiento no puede ser futura', classes: 'orange darken-2' });
        }

        setLoading(signupForm, true);
        try {
            await api('/auth/signUp', { method: 'POST', body: data });
            M.toast({ html: 'Cuenta creada. Ahora inicia sesión.', classes: 'green' });
            // Redirigir a SignIn con el correo ya escrito
            signupForm.reset();
            signupForm.password.dispatchEvent(new Event('input'));
            signinForm.email.value = data.email;
            setMode('signin');
            signinForm.password.focus();
        } catch (err) {
            M.toast({ html: escapeHtml(err.message), classes: 'red' });
        } finally {
            setLoading(signupForm, false);
        }
    });
}
