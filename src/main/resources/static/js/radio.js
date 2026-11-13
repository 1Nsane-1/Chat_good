// Ретро-радио: 4 базовые живые станции + купленные в Магазине
(() => {
  const root = document.getElementById('radio');
  if (!root) return;

  const BASE_STATIONS = [
    { id: 'base_rock', name: 'Record Rock', genre: 'ROCK & METAL', url: 'https://radiorecord.hostingradio.ru/rock96.aacp' },
    { id: 'base_nashe', name: 'Наше радио', genre: 'RUSSIAN ROCK', url: 'https://nashe1.hostingradio.ru/nashe-128.mp3' },
    { id: 'base_record', name: 'Радио Рекорд', genre: 'DANCE / ELECTRONIC', url: 'https://radiorecord.hostingradio.ru/rr_main96.aacp' },
    { id: 'base_europa', name: 'Европа Плюс', genre: 'TOP HITS', url: 'https://ep128.hostingradio.ru:8030/ep128' }
  ];

  const SHOP_STATIONS = [
    { id: 'radio_phonk', name: 'Record Phonk', genre: 'PHONK & DRIFT', url: 'https://radiorecord.hostingradio.ru/phonk96.aacp' },
    { id: 'radio_lofi', name: 'Record Lo-Fi', genre: 'LO-FI BEATS', url: 'https://radiorecord.hostingradio.ru/lofi96.aacp' },
    { id: 'radio_chill', name: 'Record Chill-Out', genre: 'CHILLOUT & LOUNGE', url: 'https://radiorecord.hostingradio.ru/chil96.aacp' },
    { id: 'radio_synthwave', name: 'Record Synthwave', genre: 'SYNTHWAVE / 80S', url: 'https://radiorecord.hostingradio.ru/synth96.aacp' },
    { id: 'radio_maximum', name: 'Радио Maximum', genre: 'ROCK & ALTERNATIVE', url: 'https://maximum.hostingradio.ru/maximum96.aacp' },
    { id: 'radio_ultra', name: 'Radio ULTRA', genre: 'ALT & METAL', url: 'https://nashe1.hostingradio.ru/ultra-128.mp3' },
    { id: 'radio_dfm', name: 'DFM Dance', genre: 'DANCE & CLUB', url: 'https://dfm.hostingradio.ru/dfm96.aacp' }
  ];

  const nameEl = document.getElementById('rname');
  const genreEl = document.getElementById('rgenre');
  const badgeEl = document.getElementById('rstate');
  const statusEl = document.getElementById('rstatus');
  const volEl = document.getElementById('rvol');
  const volPctEl = document.getElementById('rvolpct');
  const muteBtn = document.getElementById('rmute');

  const audio = new Audio();
  audio.preload = 'none';
  const savedVol = parseFloat(localStorage.getItem('goodmood_radio_vol') || '0.7');
  audio.volume = isFinite(savedVol) ? savedVol : 0.7;
  if (volEl) volEl.value = String(audio.volume);
  if (volPctEl) volPctEl.textContent = Math.round(audio.volume * 100) + '%';

  let stations = [...BASE_STATIONS];
  let idx = 0;

  function buildStations(ownedIds) {
    const set = new Set(ownedIds || []);
    stations = [...BASE_STATIONS, ...SHOP_STATIONS.filter(s => set.has(s.id))];
  }

  const initialOwned = (root.dataset.ownedRadios || '').split(',').map(s => s.trim()).filter(Boolean);
  buildStations(initialOwned);

  const savedUrl = localStorage.getItem('goodmood_radio_url');
  const fav = (root.dataset.fav || '').trim().toLowerCase();
  if (savedUrl) {
    const foundSaved = stations.findIndex(s => s.url === savedUrl);
    if (foundSaved >= 0) idx = foundSaved;
  } else if (fav) {
    const foundFav = stations.findIndex(s => s.name.toLowerCase().includes(fav) || fav.includes(s.name.toLowerCase()));
    if (foundFav >= 0) idx = foundFav;
  }

  function renderStation(msg) {
    const st = stations[idx] || stations[0];
    if (nameEl) nameEl.textContent = st.name;
    if (genreEl) genreEl.textContent = st.genre;
    if (statusEl) statusEl.textContent = msg || 'Готово';
  }

  function loadCurrent() {
    const st = stations[idx] || stations[0];
    audio.src = st.url;
    localStorage.setItem('goodmood_radio_url', st.url);
    renderStation('Готово');
  }

  function playCurrent() {
    const st = stations[idx] || stations[0];
    if (!audio.src || audio.src !== st.url) loadCurrent();
    if (statusEl) statusEl.textContent = 'Подключение...';
    audio.play()
      .then(() => {
        if (statusEl) statusEl.textContent = 'В эфире 🎵';
        if (badgeEl) badgeEl.textContent = 'ON';
      })
      .catch(() => {
        if (statusEl) statusEl.textContent = 'Нажмите ▶ ещё раз';
        if (badgeEl) badgeEl.textContent = 'OFF';
      });
  }

  audio.addEventListener('playing', () => {
    root.classList.add('playing');
    if (badgeEl) badgeEl.textContent = 'ON';
    if (statusEl) statusEl.textContent = 'В эфире 🎵';
  });
  audio.addEventListener('pause', () => {
    root.classList.remove('playing');
    if (badgeEl) badgeEl.textContent = 'OFF';
    if (statusEl) statusEl.textContent = 'Пауза';
  });
  audio.addEventListener('error', () => {
    root.classList.remove('playing');
    if (badgeEl) badgeEl.textContent = 'OFF';
    if (statusEl) statusEl.textContent = 'Станция недоступна';
  });

  document.getElementById('rplay')?.addEventListener('click', () => audio.paused ? playCurrent() : audio.pause());
  document.getElementById('rnext')?.addEventListener('click', () => { idx = (idx + 1) % stations.length; loadCurrent(); if (!audio.paused) playCurrent(); });
  document.getElementById('rprev')?.addEventListener('click', () => { idx = (idx - 1 + stations.length) % stations.length; loadCurrent(); if (!audio.paused) playCurrent(); });
  volEl?.addEventListener('input', e => {
    const v = parseFloat(e.target.value);
    audio.volume = v;
    audio.muted = v === 0;
    localStorage.setItem('goodmood_radio_vol', String(v));
    if (volPctEl) volPctEl.textContent = Math.round(v * 100) + '%';
    if (muteBtn) muteBtn.classList.toggle('text-red-400', audio.muted);
  });
  muteBtn?.addEventListener('click', () => {
    audio.muted = !audio.muted;
    muteBtn.classList.toggle('text-red-400', audio.muted);
  });

  window.reloadShopRadios = (ownedIds, playUrl) => {
    const currentUrl = stations[idx]?.url;
    buildStations(ownedIds);
    const targetUrl = playUrl || currentUrl;
    const found = stations.findIndex(s => s.url === targetUrl);
    idx = found >= 0 ? found : 0;
    loadCurrent();
    if (playUrl) playCurrent();
  };

  renderStation('Готово');

  if (root.dataset.auth === 'true') {
    fetch('/api/shop/state')
      .then(r => r.ok ? r.json() : null)
      .then(st => {
        if (!st) return;
        const cur = stations[idx]?.url;
        buildStations(st.ownedRadios || []);
        const found = stations.findIndex(s => s.url === cur);
        if (found >= 0) idx = found;
        renderStation('Готово');
      })
      .catch(() => {});
  }
})();
