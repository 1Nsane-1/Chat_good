// Круглые аналоговые часы в шапке
(function () {
  function set(id, deg) {
    const el = document.getElementById(id);
    if (el) el.setAttribute('transform', 'rotate(' + deg + ' 32 32)');
  }
  function tick() {
    const d = new Date();
    const s = d.getSeconds(), m = d.getMinutes() + s / 60, h = (d.getHours() % 12) + m / 60;
    set('hh', h * 30); set('mh', m * 6); set('sh', s * 6);
  }
  tick();
  setInterval(tick, 1000);
})();
