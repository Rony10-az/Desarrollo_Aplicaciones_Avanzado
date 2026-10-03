// En pantallas táctiles (sin hover): el primer toque desliza la imagen y muestra
// el texto; el segundo toque lleva al login. Con mouse, el hover desliza y el click navega.
const cards = document.querySelectorAll('.role-card');
const isTouch = window.matchMedia('(hover: none)').matches;

cards.forEach(card => card.addEventListener('click', e => {
    if (!isTouch || card.classList.contains('revealed')) return;
    e.preventDefault();
    cards.forEach(c => c.classList.remove('revealed'));
    card.classList.add('revealed');
}));
