(() => {
  const sparksEl = document.getElementById('shopSparks');
  const boostBtn = document.getElementById('boostBtn');
  const noticeEl = document.getElementById('shopNotice');
  const skinsGrid = document.getElementById('skinsGrid');
  const radiosGrid = document.getElementById('radiosGrid');
  const tabSkinsBtn = document.getElementById('tabSkinsBtn');
  const tabRadiosBtn = document.getElementById('tabRadiosBtn');
  const tabSkinsLabel = document.getElementById('tabSkinsLabel');
  const tabRadiosLabel = document.getElementById('tabRadiosLabel');
  const radioHint = document.getElementById('radioHint');

  const SKINS = [
    {
      id: 'classic', name: 'Солнечная классика', price: 0, isDark: false,
      desc: 'Тёплое янтарное оформление чата по умолчанию.',
      previewGradient: 'from-[#ffe0b2] via-[#fff8ea] to-[#e0f7fa]',
      scrollArea: 'bg-[#fffbf2]',
      botBubble: 'bg-[#e0f7fa] text-[#004d40] border border-[#b2ebf2]',
      mineBubble: 'bg-gradient-to-r from-[#ffe0b2] to-[#ffd180] text-[#3e2723]'
    },
    {
      id: 'cyber_teal', name: 'Кибер-Неон', price: 350, isDark: true,
      desc: 'Тёмная неоновая тема с бирюзовым и индиго свечением.',
      previewGradient: 'from-[#0b132b] via-[#1c2541] to-[#06b6d4]',
      scrollArea: 'bg-[#080f24]',
      botBubble: 'bg-[#0f293a] text-[#a5f3fc] border border-[#22d3ee]/40',
      mineBubble: 'bg-gradient-to-r from-[#312e81] to-[#1e40af] text-[#e0f2fe] border border-[#38bdf8]/40'
    },
    {
      id: 'sakura_bloom', name: 'Сакура и рассвет', price: 450, isDark: false,
      desc: 'Нежные лепестки сакуры и мягкие розово-персиковые облачка.',
      previewGradient: 'from-[#fce7f3] via-[#fbcfe8] to-[#f43f5e]',
      scrollArea: 'bg-[#fff0f6]',
      botBubble: 'bg-[#f3e8ff] text-[#581c87] border border-[#d8b4fe]',
      mineBubble: 'bg-gradient-to-r from-[#fda4af] to-[#f472b6] text-[#4c0519] border border-[#fb7185]/40'
    },
    {
      id: 'forest_zen', name: 'Изумрудный лес', price: 600, isDark: false,
      desc: 'Свежая лесная палитра с мягким изумрудным настроением.',
      previewGradient: 'from-[#dcfce7] via-[#86efac] to-[#059669]',
      scrollArea: 'bg-[#f4fbf6]',
      botBubble: 'bg-[#ecfeff] text-[#155e75] border border-[#a5f3fc]',
      mineBubble: 'bg-gradient-to-r from-[#bbf7d0] to-[#6ee7b7] text-[#064e3b] border border-[#34d399]/50'
    },
    {
      id: 'royal_gold', name: 'Императорское золото', price: 900, isDark: true,
      desc: 'Роскошный графитово-чёрный чат с золотыми акцентами.',
      previewGradient: 'from-[#1c1917] via-[#44403c] to-[#f59e0b]',
      scrollArea: 'bg-[#141210]',
      botBubble: 'bg-[#292524] text-[#fde68a] border border-[#f59e0b]/40',
      mineBubble: 'bg-gradient-to-r from-[#78350f] to-[#92400e] text-[#fef3c7] border border-[#fbbf24]/50'
    },
    {
      id: 'retro_vapor', name: 'Ретровейв 80-х', price: 1200, isDark: true,
      desc: 'Атмосферный синтвейв-градиент в стиле неона 80-х годов.',
      previewGradient: 'from-[#1e1b4b] via-[#581c87] to-[#ec4899]',
      scrollArea: 'bg-gradient-to-b from-[#17153b] to-[#2b1055]',
      botBubble: 'bg-[#31105f] text-[#e9d5ff] border border-[#c084fc]/50',
      mineBubble: 'bg-gradient-to-r from-[#be185d] to-[#9d174d] text-[#fdf2f8] border border-[#f472b6]/50'
    }
  ];

  const RADIOS = [
    { id: 'radio_phonk', name: 'Record Phonk', genre: 'Phonk & Drift', url: 'https://radiorecord.hostingradio.ru/phonk96.aacp', price: 200, desc: 'Плотный фонк и драйвовые басы 24/7 от Радио Рекорд.' },
    { id: 'radio_lofi', name: 'Record Lo-Fi', genre: 'Lo-Fi Beats', url: 'https://radiorecord.hostingradio.ru/lofi96.aacp', price: 250, desc: 'Спокойный лоу-фай бит для учёбы, кодинга и уютного чата.' },
    { id: 'radio_chill', name: 'Record Chill-Out', genre: 'Chillout & Lounge', url: 'https://radiorecord.hostingradio.ru/chil96.aacp', price: 300, desc: 'Расслабляющая электроника и атмосферный лаунж без суеты.' },
    { id: 'radio_synthwave', name: 'Record Synthwave', genre: 'Synthwave / 80s', url: 'https://radiorecord.hostingradio.ru/synth96.aacp', price: 350, desc: 'Космический ретровейв и неон 80-х в прямом эфире.' },
    { id: 'radio_maximum', name: 'Радио Maximum', genre: 'Rock & Alternative', url: 'https://maximum.hostingradio.ru/maximum96.aacp', price: 400, desc: 'Культовые рок-хиты, альтернатива и мировой мейнстрим.' },
    { id: 'radio_ultra', name: 'Radio ULTRA', genre: 'Alt & Metal', url: 'https://nashe1.hostingradio.ru/ultra-128.mp3', price: 450, desc: 'Тяжёлый альтернативный рок и метал в отличном качестве 128 kbps.' },
    { id: 'radio_dfm', name: 'DFM Dance', genre: 'Dance & Club', url: 'https://dfm.hostingradio.ru/dfm96.aacp', price: 500, desc: 'Энергичные танцевальные хиты и клубные ремиксы.' }
  ];

  const RADIO_ICON = '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/></svg>';
  const CHECK_ICON = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  const LOCK_ICON = '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';

  let state = { sparks: 1000, activeSkin: 'classic', ownedSkins: ['classic'], ownedRadios: [] };
  let tab = 'skins';

  function toast(msg) {
    if (!noticeEl) return;
    noticeEl.textContent = msg;
    noticeEl.hidden = false;
    setTimeout(() => { noticeEl.hidden = true; }, 3500);
  }

  async function postJson(url, body) {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    });
    if (!r.ok) {
      toast('Недостаточно Искр (✨) для покупки.');
      return null;
    }
    state = await r.json();
    render();
    return state;
  }

  function render() {
    if (sparksEl) sparksEl.textContent = state.sparks + ' ✨';
    if (boostBtn) boostBtn.hidden = state.sparks >= 200;
    if (tabSkinsLabel) tabSkinsLabel.textContent = 'Скины для чата (' + state.ownedSkins.length + '/' + SKINS.length + ')';
    if (tabRadiosLabel) tabRadiosLabel.textContent = 'Радиостанции (' + state.ownedRadios.length + '/' + RADIOS.length + ')';

    if (tabSkinsBtn) tabSkinsBtn.className = 'px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ' + (tab === 'skins' ? 'bg-[#0e4b5a] text-[#ffd84d] shadow-xs' : 'text-[#6d4c41] hover:bg-[#fff8ec]');
    if (tabRadiosBtn) tabRadiosBtn.className = 'px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ' + (tab === 'radio' ? 'bg-[#e65100] text-white shadow-xs' : 'text-[#6d4c41] hover:bg-[#fff8ec]');

    if (skinsGrid) skinsGrid.hidden = tab !== 'skins';
    if (radiosGrid) radiosGrid.hidden = tab !== 'radio';
    if (radioHint) radioHint.hidden = tab !== 'radio';

    if (skinsGrid) {
      skinsGrid.innerHTML = '';
      SKINS.forEach(s => {
        const owned = state.ownedSkins.includes(s.id);
        const active = state.activeSkin === s.id;
        const canBuy = !owned && state.sparks >= s.price;

        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl border-2 overflow-hidden shadow-xs flex flex-col justify-between transition-all ' + (active ? 'border-[#0e4b5a] ring-2 ring-[#0e4b5a]/20' : 'border-[#ffe0b2]');

        const top = document.createElement('div');
        const prev = document.createElement('div');
        prev.className = 'p-4 bg-gradient-to-br ' + s.previewGradient + ' border-b border-black/10 space-y-2';
        prev.innerHTML =
          '<div class="flex items-center justify-between">' +
          '<span class="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ' + (s.isDark ? 'bg-black/50 text-white' : 'bg-white/80 text-[#3e2723]') + '">' + (s.isDark ? '🌙 Тёмный скин' : '☀️ Светлый скин') + '</span>' +
          '<span class="text-xs font-black px-2.5 py-0.5 rounded-full ' + (s.price === 0 ? 'bg-emerald-600 text-white' : 'bg-[#0e4b5a] text-[#ffd84d]') + '">' + (s.price === 0 ? 'Бесплатно' : s.price + ' ✨') + '</span>' +
          '</div>' +
          '<div class="rounded-xl p-2.5 space-y-1.5 border ' + s.scrollArea + ' ' + (s.isDark ? 'border-white/10' : 'border-black/10') + '">' +
          '<div class="text-[10px] px-2.5 py-1 rounded-lg max-w-[82%] ' + s.botBubble + '"><strong>Аня (бот):</strong> Отличный скин! ✨</div>' +
          '<div class="text-[10px] px-2.5 py-1 rounded-lg max-w-[78%] ml-auto ' + s.mineBubble + '"><strong>Вы:</strong> Красота!</div>' +
          '</div>';

        const meta = document.createElement('div');
        meta.className = 'p-4 space-y-1';
        meta.innerHTML = '<h3 class="font-bold text-sm text-[#3e2723]">' + s.name + '</h3><p class="text-xs text-[#6d4c41] leading-relaxed">' + s.desc + '</p>';
        top.append(prev, meta);

        const act = document.createElement('div');
        act.className = 'px-4 pb-4';
        const btn = document.createElement('button');
        btn.type = 'button';
        if (active) {
          btn.disabled = true;
          btn.className = 'w-full py-2.5 px-4 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5';
          btn.innerHTML = CHECK_ICON + '<span>Применён в чате ✓</span>';
        } else if (owned) {
          btn.className = 'w-full py-2.5 px-4 bg-[#0e4b5a] hover:bg-[#093540] text-[#ffd84d] font-bold text-xs rounded-xl transition-colors cursor-pointer';
          btn.textContent = 'Применить скин';
          btn.addEventListener('click', async () => {
            const res = await postJson('/api/shop/apply-skin', { id: s.id, price: 0 });
            if (res) toast('🎨 Скин «' + s.name + '» применён!');
          });
        } else {
          btn.disabled = !canBuy;
          btn.className = 'w-full py-2.5 px-4 bg-gradient-to-r from-[#ff9800] to-[#f57c00] hover:brightness-105 disabled:opacity-45 disabled:cursor-not-allowed text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer';
          btn.innerHTML = (canBuy ? '' : LOCK_ICON) + '<span>' + (canBuy ? ('Купить за ' + s.price + ' ✨') : ('Недостаточно (' + s.price + ' ✨)')) + '</span>';
          btn.addEventListener('click', async () => {
            const res = await postJson('/api/shop/buy-skin', { id: s.id, price: s.price });
            if (res) toast('🎨 Скин «' + s.name + '» куплен и сразу применён к чату!');
          });
        }
        act.appendChild(btn);
        card.append(top, act);
        skinsGrid.appendChild(card);
      });
    }

    if (radiosGrid) {
      radiosGrid.innerHTML = '';
      RADIOS.forEach(st => {
        const owned = state.ownedRadios.includes(st.id);
        const canBuy = !owned && state.sparks >= st.price;

        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl border-2 p-4 shadow-xs flex flex-col justify-between gap-4 ' + (owned ? 'border-emerald-400 bg-emerald-50/20' : 'border-[#ffe0b2]');

        const top = document.createElement('div');
        top.className = 'space-y-2';
        top.innerHTML =
          '<div class="flex items-start justify-between gap-2">' +
          '<div class="flex items-center gap-2.5">' +
          '<div class="w-10 h-10 rounded-xl bg-[#0e4b5a] text-[#ffd84d] flex items-center justify-center shrink-0">' + RADIO_ICON + '</div>' +
          '<div><h3 class="font-bold text-sm text-[#3e2723]">' + st.name + '</h3><div class="text-[11px] font-semibold text-[#00897b]">' + st.genre + ' · Live Stream</div></div>' +
          '</div>' +
          '<span class="text-xs font-black px-2.5 py-0.5 rounded-full shrink-0 ' + (owned ? 'bg-emerald-600 text-white' : 'bg-[#fff3e0] text-[#e65100] border border-[#ffcc80]') + '">' + (owned ? 'Куплено ✓' : (st.price + ' ✨')) + '</span>' +
          '</div>' +
          '<p class="text-xs text-[#6d4c41] leading-relaxed">' + st.desc + '</p>';

        const btn = document.createElement('button');
        btn.type = 'button';
        if (owned) {
          btn.className = 'w-full py-2.5 px-4 bg-[#0e4b5a] hover:bg-[#093540] text-[#ffd84d] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer';
          btn.textContent = 'Включить в радио ▶';
          btn.addEventListener('click', () => {
            if (window.reloadShopRadios) window.reloadShopRadios(state.ownedRadios, st.url);
            toast('📻 Включена волна: ' + st.name + '!');
          });
        } else {
          btn.disabled = !canBuy;
          btn.className = 'w-full py-2.5 px-4 bg-gradient-to-r from-[#ff9800] to-[#f57c00] hover:brightness-105 disabled:opacity-45 disabled:cursor-not-allowed text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer';
          btn.innerHTML = (canBuy ? '' : LOCK_ICON) + '<span>' + (canBuy ? ('Купить волну за ' + st.price + ' ✨') : ('Недостаточно (' + st.price + ' ✨)')) + '</span>';
          btn.addEventListener('click', async () => {
            const res = await postJson('/api/shop/buy-radio', { id: st.id, price: st.price });
            if (res) {
              if (window.reloadShopRadios) window.reloadShopRadios(res.ownedRadios, st.url);
              toast('📻 Радиостанция «' + st.name + '» куплена, добавлена в плеер и включена!');
            }
          });
        }
        card.append(top, btn);
        radiosGrid.appendChild(card);
      });
    }
  }

  tabSkinsBtn?.addEventListener('click', () => { tab = 'skins'; render(); });
  tabRadiosBtn?.addEventListener('click', () => { tab = 'radio'; render(); });
  boostBtn?.addEventListener('click', async () => {
    const res = await postJson('/api/shop/boost', {});
    if (res) toast('✨ Начислен бонус +200 Искр!');
  });

  fetch('/api/shop/state')
    .then(r => r.ok ? r.json() : null)
    .then(st => { if (st) { state = st; render(); } })
    .catch(() => render());
  render();
})();
