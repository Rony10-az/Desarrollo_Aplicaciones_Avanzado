const passwordRule = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$%&*@])[A-Za-z\d#$%&*@]{8,}$/;
const form = document.getElementById('profile-form');
const fields = ['name', 'lastName', 'phoneNumer', 'birthdate', 'email', 'adress', 'url_profile'];
let current = null;

function renderCard(user) {
    document.getElementById('avatar').innerHTML = avatarHtml(user, 'large');
    document.getElementById('fullName').textContent = fullName(user);
    document.getElementById('emailText').textContent = user.email;
    document.getElementById('roles').innerHTML = user.roles.map(roleChip).join('');
    document.getElementById('memberSince').textContent = `Miembro desde ${formatDate(user.createdAt)}`;
}

function fillForm(user) {
    fields.forEach(f => {
        form[f].value = f === 'birthdate' && user.birthdate ? user.birthdate.slice(0, 10) : (user[f] ?? '');
    });
    form.password.value = '';
    M.updateTextFields();
}

if (Auth.guard()) {
    (async () => {
        try {
            current = await api('/users/me');
            renderCard(current);
            fillForm(current);
            document.getElementById('loader').classList.add('hide');
            document.getElementById('content').classList.remove('hide');
        } catch (err) {
            M.toast({ html: escapeHtml(err.message), classes: 'red' });
        }
    })();

    document.getElementById('btn-reset').addEventListener('click', e => {
        e.preventDefault();
        fillForm(current);
    });

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const data = {};
        fields.forEach(f => (data[f] = form[f].value.trim()));

        if (['name', 'lastName', 'phoneNumer', 'birthdate', 'email'].some(f => !data[f])) {
            return M.toast({ html: 'Completa todos los campos obligatorios (*)', classes: 'orange darken-2' });
        }
        if (new Date(data.birthdate) > new Date()) {
            return M.toast({ html: 'La fecha de nacimiento no puede ser futura', classes: 'orange darken-2' });
        }
        if (form.password.value) {
            if (!passwordRule.test(form.password.value)) {
                return M.toast({ html: 'La nueva contraseña no cumple los requisitos', classes: 'orange darken-2' });
            }
            data.password = form.password.value;
        }

        setLoading(form, true);
        try {
            current = await api('/users/me', { method: 'PUT', body: data });
            renderCard(current);
            fillForm(current);
            M.toast({ html: 'Datos actualizados correctamente', classes: 'green' });
        } catch (err) {
            M.toast({ html: escapeHtml(err.message), classes: 'red' });
        } finally {
            setLoading(form, false);
        }
    });
}
