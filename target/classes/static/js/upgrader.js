(() => {
  const sparksEl = document.getElementById('sparks');
  const badgePill = document.getElementById('badgePill');
  const statusEl = document.getElementById('upgraderStatus');
  const chancePctEl = document.getElementById('chancePct');
  const topChanceEl = document.getElementById('topChanceLabel');
  const multEl = document.getElementById('multLabel');
  const arcEl = document.getElementById('chanceArc');
  const needleEl = document.getElementById('needleWrap');
  const targetIconEl = document.getElementById('targetIcon');
  const targetNameEl = document.getElementById('targetName');
  const targetDescEl = document.getElementById('targetDescBox');
  const curStakeLabel = document.getElementById('curStakeLabel');
  const stakesGrid = document.getElementById('quickStakesGrid');
  const targetsBox = document.getElementById('targetsBox');
  const spinBtn = document.getElementById('spinBtn');
  const spinBtnText = document.getElementById('spinBtnText');
  const historyBox = document.getElementById('historyBox');
  const historyCount = document.getElementById('historyCount');
  const boostBtn = document.getElementById('upgBoostBtn');

  let sparks = 1000;
  let stakeVal = 100;
  let needleDeg = 0;
  let historyList = [];
  const QUICK = [50, 100, 250, 500, 1000, 2500];
  const TARGETS = [
    { val: 250, icon: '😎', name: 'Очки крутости', badge: '😎 На стиле', desc: 'Солнечный аксессуар и стильный значок в чате.' },
    { val: 500, icon: '🎵', name: 'Винил Ретро-Радио', badge: '🎵 Меломан', desc: 'Редкая пластинка с любимыми треками.' },
    { val: 1000, icon: '🧭', name: 'Золотой компас', badge: '🧭 Следопыт', desc: 'Сверхточный компас для нахождения друзей рядом.' },
    { val: 2500, icon: '⚡', name: 'Реактор позитива', badge: '⚡ Реактор', desc: 'Мощный генератор отличного настроения и искр.' },
    { val: 5000, icon: '💎', name: 'Бриллиант солнца', badge: '💎 Бриллиант', desc: 'Легендарная награда участника чата!' }
  ];
  let selectedTarget = TARGETS[1];

  function calcChance(s, t) {
    if (t <= s || s <= 0) return 0;
    return Math.min(85, Math.max(5, Math.round((s / t) * 88 * 10) / 10));
  }

  function renderStakes() {
    if (!stakesGrid) return;
    stakesGrid.innerHTML = '';
    QUICK.forEach(amt => {
      const b = document.createElement('button');
      b.type = 'button';
      const active = stakeVal === amt;
      b.className = 'py-2.5 px-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ' +
        (active ? 'bg-[#0e4b5a] text-[#ffd84d] border-[#0e4b5a] shadow-sm scale-[1.02]'
          : sparks >= amt ? 'bg-[#fffaf0] text-[#3e2723] border-[#ffe0b2] hover:border-[#ff9800]'
            : 'bg-gray-50 text-gray-400 border-gray-200');
      b.textContent = amt + ' ✨';
      b.addEventListener('click', () => {
        stakeVal = amt;
        if (selectedTarget.val <= stakeVal) {
          const next = TARGETS.find(t => t.val > stakeVal);
          if (next) selectedTarget = next;
        }
        renderStakes();
        renderTargets();
        updateGauge();
      });
      stakesGrid.appendChild(b);
    });
  }

  function renderTargets() {
    if (!targetsBox) return;
    const avail = TARGETS.filter(t => t.val > stakeVal);
    targetsBox.innerHTML = '';
    avail.forEach(t => {
      const ch = calcChance(stakeVal, t.val);
      const isSel = selectedTarget.val === t.val;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ' +
        (isSel ? 'bg-[#e0f2f1] border-[#00897b] ring-2 ring-[#00897b]/30' : 'bg-[#fffdfa] border-[#ffe0b2] hover:bg-[#fff8ec]');
      b.innerHTML =
        '<div class="flex items-center gap-2.5"><span class="text-2xl">' + t.icon + '</span><div><div class="text-xs font-bold text-[#3e2723]">' + t.name + '</div><div class="text-[11px] text-[#00796b] font-semibold">Шанс ' + ch + '% · ' + t.badge + '</div></div></div>' +
        '<span class="text-xs font-black text-[#0e4b5a]">' + t.val + ' ✨</span>';
      b.addEventListener('click', () => {
        selectedTarget = t;
        renderTargets();
        updateGauge();
      });
      targetsBox.appendChild(b);
    });
  }

  function updateGauge() {
    const ch = calcChance(stakeVal, selectedTarget.val);
    const mult = stakeVal > 0 ? (selectedTarget.val / stakeVal).toFixed(2) : '0';
    if (chancePctEl) chancePctEl.textContent = ch + '%';
    if (topChanceEl) topChanceEl.textContent = 'Шанс: ' + ch + '%';
    if (multEl) multEl.textContent = 'Множитель: x' + mult;
    if (targetIconEl) targetIconEl.textContent = selectedTarget.icon;
    if (targetNameEl) targetNameEl.textContent = selectedTarget.name;
    if (targetDescEl) targetDescEl.innerHTML = '<strong>Цель:</strong> ' + selectedTarget.desc;
    if (curStakeLabel) curStakeLabel.textContent = stakeVal + ' ✨';
    if (boostBtn) boostBtn.hidden = sparks >= 300;
    if (arcEl) {
      const circ = 2 * Math.PI * 92;
      arcEl.setAttribute('stroke-dasharray', ((ch / 100) * circ) + ' ' + circ);
    }
    const canAfford = sparks >= stakeVal && selectedTarget.val > stakeVal;
    if (spinBtn) spinBtn.disabled = !canAfford;
    if (spinBtnText) spinBtnText.textContent = canAfford ? 'Запустить Upgrader 🚀' : 'Недостаточно средств';
  }

  function renderHistory() {
    if (!historyBox || !historyCount) return;
    historyCount.textContent = 'Попыток: ' + historyList.length;
    if (historyList.length === 0) {
      historyBox.innerHTML = '<p class="text-xs text-gray-500 py-6 text-center">История пока пуста. Сделайте первый запуск Upgrader!</p>';
      return;
    }
    historyBox.innerHTML = '';
    historyList.forEach(h => {
      const row = document.createElement('div');
      row.className = 'p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ' + (h.won ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50/70 border-rose-200');
      row.innerHTML =
        '<div class="flex items-center gap-2 min-w-0"><span class="text-base">✨</span><span class="truncate font-semibold text-[#3e2723]">' + h.stake + ' ✨ → ' + h.toIcon + ' ' + h.toName + '</span></div>' +
        '<div class="flex items-center gap-2 shrink-0"><span class="text-[11px] text-gray-600">' + h.chance + '%</span>' +
        '<span class="px-2 py-0.5 rounded-md font-extrabold text-[10px] text-white ' + (h.won ? 'bg-emerald-600' : 'bg-rose-600') + '">' + (h.won ? 'УСПЕХ' : 'ПРОМАХ') + '</span></div>';
      historyBox.appendChild(row);
    });
  }

  async function load() {
    try {
      const r = await fetch('/api/upgrader/state');
      if (r.ok) {
        const d = await r.json();
        sparks = d.sparks;
        if (sparksEl) sparksEl.textContent = sparks + ' ✨';
        if (badgePill) {
          badgePill.textContent = 'Значок: ' + (d.equippedBadge || '');
          badgePill.hidden = !d.equippedBadge;
        }
      }
    } catch (e) {}
    renderStakes();
    renderTargets();
    updateGauge();
  }

  spinBtn?.addEventListener('click', async () => {
    if (sparks < stakeVal || selectedTarget.val <= stakeVal) return;
    spinBtn.disabled = true;
    if (spinBtnText) spinBtnText.textContent = 'Крутим колесо...';
    if (statusEl) statusEl.hidden = true;

    const r = await fetch('/api/upgrader/spin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stake: stakeVal, target: selectedTarget.val, targetName: selectedTarget.badge })
    });
    if (!r.ok) {
      spinBtn.disabled = false;
      updateGauge();
      return;
    }
    const res = await r.json();
    const chance = res.chance || calcChance(stakeVal, selectedTarget.val);
    const arcEnd = (chance / 100) * 360;
    const targetSector = res.won ? (8 + Math.random() * Math.max(4, arcEnd - 16)) : (arcEnd + 8 + Math.random() * Math.max(10, 340 - arcEnd));
    needleDeg += 1440 + ((targetSector - (needleDeg % 360) + 360) % 360);
    if (needleEl) {
      needleEl.style.transition = 'transform 2.2s cubic-bezier(0.14, 0.88, 0.22, 1)';
      needleEl.style.transform = 'rotate(' + needleDeg + 'deg)';
    }

    setTimeout(() => {
      sparks = res.sparks;
      if (sparksEl) sparksEl.textContent = sparks + ' ✨';
      if (badgePill && res.equippedBadge) {
        badgePill.textContent = 'Значок: ' + res.equippedBadge;
        badgePill.hidden = false;
      }
      if (statusEl) {
        statusEl.hidden = false;
        statusEl.className = 'w-full text-center text-xs font-bold p-2.5 rounded-xl border ' + (res.won ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200' : 'bg-rose-500/20 border-rose-400/40 text-rose-200');
        statusEl.textContent = res.won
          ? ('🎉 Апгрейд удался! Получено: ' + selectedTarget.icon + ' ' + selectedTarget.name)
          : ('💨 В этот раз стрелка прошла мимо (шанс был ' + chance + '%). Попробуй ещё!');
      }
      historyList.unshift({ stake: stakeVal, toIcon: selectedTarget.icon, toName: selectedTarget.name, chance, won: res.won });
      historyList = historyList.slice(0, 15);
      renderHistory();
      renderStakes();
      renderTargets();
      updateGauge();
    }, 2250);
  });

  boostBtn?.addEventListener('click', async () => {
    const r = await fetch('/api/shop/boost', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    if (r.ok) {
      const d = await r.json();
      sparks = d.sparks;
      if (sparksEl) sparksEl.textContent = sparks + ' ✨';
      renderStakes();
      updateGauge();
    }
  });

  load();
})();
