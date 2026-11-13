(() => {
  const $ = id => document.getElementById(id);
  let heading = 0;
  let nearest = null;
  let rate = 0.3, geigerOn = false, total = 0, audio = null;
  let simulatedDist = 120;

  function formatDist(d) {
    return d < 1000 ? Math.round(d) + ' м' : (d / 1000).toFixed(2) + ' км';
  }

  function draw() {
    const h = heading || 0;
    const bearing = nearest ? nearest.bearing : 45;
    if ($('rose')) $('rose').style.transform = 'rotate(' + (-h) + 'deg)';
    if ($('arrow')) $('arrow').style.transform = 'rotate(' + (bearing - h) + 'deg)';
    if ($('headingVal')) $('headingVal').textContent = Math.round(h) + '°';
    if ($('bearingVal')) $('bearingVal').textContent = Math.round(bearing) + '°';
    if ($('sliderHeading')) $('sliderHeading').value = String(Math.round(h));
  }

  function onOrientation(e) {
    let h = null;
    if (e.webkitCompassHeading != null) h = e.webkitCompassHeading;
    else if (e.alpha != null && (e.absolute || e.type === 'deviceorientationabsolute')) h = (360 - e.alpha) % 360;
    if (h == null) return;
    heading = h;
    draw();
  }

  async function startSensors() {
    try {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        const r = await DeviceOrientationEvent.requestPermission();
        if (r !== 'granted' && $('warn')) $('warn').textContent = 'Доступ к датчикам отклонён';
      }
      window.addEventListener('deviceorientationabsolute', onOrientation, true);
      window.addEventListener('deviceorientation', onOrientation, true);
      if ($('start')) {
        $('start').textContent = 'Датчик активен';
        $('start').className = 'px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer bg-green-100 text-green-800 border-green-300';
      }
    } catch (e) {
      if ($('warn')) $('warn').textContent = 'Датчик ориентации недоступен: ' + e.message;
    }
    if (window.Geo) Geo.start(msg => { if ($('warn')) $('warn').textContent = msg; });
    poll();
    setInterval(poll, 5000);
  }

  async function poll() {
    try {
      const r = await fetch('/api/nearest');
      if (r.status === 204) {
        nearest = null;
        if ($('who')) $('who').textContent = 'Режим симуляции (нет GPS других)';
        setRate(simulatedDist);
        draw();
        return;
      }
      nearest = await r.json();
      if ($('who')) $('who').textContent = nearest.name;
      setRate(nearest.distance);
      draw();
    } catch (e) {}
  }

  function setRate(d) {
    const eff = d == null ? simulatedDist : d;
    rate = 0.3 + 60 * Math.exp(-eff / 40);
    if ($('dist')) $('dist').textContent = formatDist(eff);
    if ($('geigerDist')) $('geigerDist').textContent = formatDist(eff);
    if ($('cps')) $('cps').textContent = rate.toFixed(1);
    if ($('cpsBanner')) $('cpsBanner').textContent = rate.toFixed(1) + ' щелчков/сек';
    if ($('simDistLabel')) $('simDistLabel').textContent = Math.round(eff) + ' метров';
    if ($('meter')) $('meter').style.width = Math.min(100, Math.max(4, (rate / 60) * 100)) + '%';
  }

  function geigerClick() {
    total++;
    if ($('total')) $('total').textContent = String(total);
    if (!audio) return;
    const len = Math.floor(audio.sampleRate * 0.02);
    const buf = audio.createBuffer(1, len, audio.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len / 6));
    const src = audio.createBufferSource();
    src.buffer = buf;
    src.connect(audio.destination);
    src.start();
  }

  function loop() {
    if (!geigerOn) return;
    geigerClick();
    const wait = Math.max(15, -Math.log(1 - Math.random()) / rate * 1000);
    setTimeout(loop, wait);
  }

  $('start')?.addEventListener('click', startSensors);
  $('sliderHeading')?.addEventListener('input', e => {
    heading = parseInt(e.target.value, 10) || 0;
    draw();
  });
  $('simDistRange')?.addEventListener('input', e => {
    simulatedDist = parseFloat(e.target.value) || 0;
    nearest = null;
    setRate(simulatedDist);
  });

  $('geiger')?.addEventListener('click', () => {
    geigerOn = !geigerOn;
    const btn = $('geiger');
    const lbl = $('geigerBtnLabel');
    const st = $('speakerState');
    if (lbl) lbl.textContent = geigerOn ? 'Выключить звук' : 'Включить звук щелчков';
    if (btn) btn.className = 'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ' + (geigerOn ? 'bg-red-500 hover:bg-red-600 text-white shadow-md animate-pulse' : 'bg-[#ffd84d] hover:bg-[#ffc107] text-black font-bold');
    if (st) {
      st.textContent = geigerOn ? 'АКТИВЕН' : 'БЕЗ ЗВУКА';
      st.className = 'text-2xl font-mono font-bold mt-0.5 ' + (geigerOn ? 'text-green-400' : 'text-gray-500');
    }
    if (geigerOn) {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      audio.resume();
      loop();
    }
  });

  draw();
  setRate(simulatedDist);
})();
