
// carousel
document.querySelectorAll('.carousel').forEach(c => {
  const slides = [...c.querySelectorAll('.car-slide')];
  const dots = [...c.querySelectorAll('.dots span')];
  let i = slides.findIndex(s => s.classList.contains('on')); if (i < 0) i = 0;
  const show = n => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s,k) => s.classList.toggle('on', k===i));
    dots.forEach((d,k) => d.classList.toggle('on', k===i));
  };
  c.querySelector('.prev')?.addEventListener('click', () => show(i-1));
  c.querySelector('.next')?.addEventListener('click', () => show(i+1));
  dots.forEach((d,k) => d.addEventListener('click', () => show(k)));
});

// templates library keyword filter
const filterBox = document.querySelector('.filters');
if (filterBox && document.querySelector('.tcards')) {
  const cards = [...document.querySelectorAll('.tcard')];
  const chip = document.querySelector('.kchips .chip');
  const empty = document.querySelector('.empty-note');
  const crumb = document.querySelector('.crumb b');
  filterBox.querySelectorAll('label').forEach(l => {
    const input = l.querySelector('input');
    input.addEventListener('change', () => {
      const kw = [...l.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
      const isDVM = kw.startsWith('Daily');
      cards.forEach(c => c.style.display = isDVM ? '' : 'none');
      if (empty) empty.style.display = isDVM ? 'none' : '';
      if (chip) chip.textContent = kw.length > 20 ? kw.slice(0,18)+'... \u00d7' : kw+' \u00d7';
      if (crumb) crumb.textContent = kw;
    });
  });
  const clear = document.querySelector('.kchips .clear');
  clear?.addEventListener('click', e => {
    e.preventDefault();
    cards.forEach(c => c.style.display = '');
    if (empty) empty.style.display = 'none';
    filterBox.querySelectorAll('input').forEach(x => x.checked = false);
  });
  if (empty) empty.style.display = 'none';
}

// prompt library live search
const psearch = document.querySelector('input[type=search]');
if (psearch && document.querySelector('.pcard')) {
  psearch.addEventListener('input', () => {
    const q = psearch.value.toLowerCase();
    document.querySelectorAll('.pcard').forEach(c => {
      c.style.display = c.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}
