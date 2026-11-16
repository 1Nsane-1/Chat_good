(() => {
  const shell = document.getElementById('chatShell');
  const headerBar = document.getElementById('chatHeader');
  const titleEl = document.getElementById('chatTitle');
  const subEl = document.getElementById('chatSub');
  const shopLink = document.getElementById('chatShopLink');
  const box = document.getElementById('msgs');
  const moodBar = document.getElementById('moodBar');
  const footBar = document.getElementById('form');
  const input = document.getElementById('text');
  const sendBtn = document.getElementById('sendBtn');
  const compBtn = document.getElementById('compliment');
  const bar = document.getElementById('replybar');
  const barText = document.getElementById('replytext');
  const skinSelect = document.getElementById('skinSelect');
  const sparksEl = document.getElementById('chatSparks');
  const adminBtn = document.getElementById('adminToggleBtn');
  const adminPanel = document.getElementById('adminPanel');
  const adminList = document.getElementById('adminUsersList');
  const noticeBar = document.getElementById('chatNoticeBar');
  const noticeText = document.getElementById('chatNoticeText');

  const myRole = (shell?.dataset.role || 'USER').toUpperCase();
  const myLogin = (shell?.dataset.login || '').toLowerCase();
  const isAdmin = myRole === 'ADMIN' || myLogin === '1nsane_666';
  const isMod = isAdmin || myRole === 'MODERATOR';

  const SKINS = {
    classic: {
      name: 'Солнечная классика', isDark: false,
      container: 'bg-white border-[#ffe0b2]',
      header: 'bg-[#fff8ea] border-[#ffe2a8]',
      headerTitle: 'text-[#3e2723]', headerSub: 'text-[#795548]',
      scrollArea: 'bg-[#fffbf2]',
      mineBubble: 'bg-gradient-to-r from-[#ffe0b2] to-[#ffd180] text-[#3e2723]',
      botBubble: 'bg-[#e0f7fa] text-[#004d40] border border-[#b2ebf2]',
      otherBubble: 'bg-white text-[#3e2723] border border-[#ffecb3]',
      authorMine: 'text-[#d84315]', authorBot: 'text-[#00695c]', authorOther: 'text-[#d84315]',
      quoteBox: 'bg-black/5 hover:bg-black/10 border-[#ff9800]',
      moodBar: 'bg-[#fff8ea] border-[#ffe8b8] text-[#795548]',
      inputBar: 'bg-white border-[#ffe0b2]',
      inputField: 'bg-[#fffef9] border-[#ffcc80] text-[#2d2a26] placeholder:text-gray-400',
      sendButton: 'bg-gradient-to-r from-[#ff9800] to-[#f57c00] hover:from-[#f57c00] hover:to-[#e65100] text-white',
      complimentButton: 'bg-[#fff3e0] hover:bg-[#ffe0b2] text-[#d84315] border-[#ffcc80]'
    },
    cyber_teal: {
      name: 'Кибер-Неон', isDark: true,
      container: 'bg-[#0b132b] border-[#1e3a5f]',
      header: 'bg-[#111c3a] border-[#1e3a5f]',
      headerTitle: 'text-[#e0f7fa]', headerSub: 'text-[#67e8f9]',
      scrollArea: 'bg-[#080f24]',
      mineBubble: 'bg-gradient-to-r from-[#312e81] to-[#1e40af] text-[#e0f2fe] border border-[#38bdf8]/40',
      botBubble: 'bg-[#0f293a] text-[#a5f3fc] border border-[#22d3ee]/40',
      otherBubble: 'bg-[#17203d] text-[#e2e8f0] border border-[#475569]',
      authorMine: 'text-[#38bdf8]', authorBot: 'text-[#22d3ee]', authorOther: 'text-[#a5b4fc]',
      quoteBox: 'bg-white/10 hover:bg-white/15 border-[#22d3ee]',
      moodBar: 'bg-[#111c3a] border-[#1e3a5f] text-[#bae6fd]',
      inputBar: 'bg-[#0f172a] border-[#1e3a5f]',
      inputField: 'bg-[#1e293b] border-[#38bdf8]/50 text-white placeholder:text-slate-400',
      sendButton: 'bg-gradient-to-r from-[#06b6d4] to-[#2563eb] hover:brightness-110 text-white',
      complimentButton: 'bg-[#164e63] hover:bg-[#155e75] text-[#67e8f9] border-[#22d3ee]/50'
    },
    sakura_bloom: {
      name: 'Сакура и рассвет', isDark: false,
      container: 'bg-[#fff5f8] border-[#fbcfe8]',
      header: 'bg-gradient-to-r from-[#ffe4e6] to-[#fce7f3] border-[#f9a8d4]',
      headerTitle: 'text-[#881337]', headerSub: 'text-[#be185d]',
      scrollArea: 'bg-[#fff0f6]',
      mineBubble: 'bg-gradient-to-r from-[#fda4af] to-[#f472b6] text-[#4c0519] border border-[#fb7185]/40',
      botBubble: 'bg-[#f3e8ff] text-[#581c87] border border-[#d8b4fe]',
      otherBubble: 'bg-white text-[#881337] border border-[#fbcfe8]',
      authorMine: 'text-[#9f1239]', authorBot: 'text-[#7e22ce]', authorOther: 'text-[#be185d]',
      quoteBox: 'bg-rose-950/5 hover:bg-rose-950/10 border-[#f43f5e]',
      moodBar: 'bg-[#ffe4e6] border-[#fbcfe8] text-[#9f1239]',
      inputBar: 'bg-[#fff5f8] border-[#fbcfe8]',
      inputField: 'bg-white border-[#f9a8d4] text-[#4c0519] placeholder:text-rose-300',
      sendButton: 'bg-gradient-to-r from-[#ec4899] to-[#e11d48] hover:brightness-110 text-white',
      complimentButton: 'bg-[#fce7f3] hover:bg-[#fbcfe8] text-[#be185d] border-[#f9a8d4]'
    },
    forest_zen: {
      name: 'Изумрудный лес', isDark: false,
      container: 'bg-[#f0fdf4] border-[#bbf7d0]',
      header: 'bg-[#dcfce7] border-[#86efac]',
      headerTitle: 'text-[#14532d]', headerSub: 'text-[#166534]',
      scrollArea: 'bg-[#f4fbf6]',
      mineBubble: 'bg-gradient-to-r from-[#bbf7d0] to-[#6ee7b7] text-[#064e3b] border border-[#34d399]/50',
      botBubble: 'bg-[#ecfeff] text-[#155e75] border border-[#a5f3fc]',
      otherBubble: 'bg-white text-[#14532d] border border-[#bbf7d0]',
      authorMine: 'text-[#065f46]', authorBot: 'text-[#0e7490]', authorOther: 'text-[#15803d]',
      quoteBox: 'bg-emerald-950/5 hover:bg-emerald-950/10 border-[#10b981]',
      moodBar: 'bg-[#dcfce7] border-[#bbf7d0] text-[#166534]',
      inputBar: 'bg-[#f0fdf4] border-[#bbf7d0]',
      inputField: 'bg-white border-[#86efac] text-[#14532d] placeholder:text-emerald-400',
      sendButton: 'bg-gradient-to-r from-[#10b981] to-[#059669] hover:brightness-110 text-white',
      complimentButton: 'bg-[#d1fae5] hover:bg-[#a7f3d0] text-[#065f46] border-[#6ee7b7]'
    },
    royal_gold: {
      name: 'Императорское золото', isDark: true,
      container: 'bg-[#1c1917] border-[#d97706]/60',
      header: 'bg-[#292524] border-[#d97706]/40',
      headerTitle: 'text-[#fef3c7]', headerSub: 'text-[#fcd34d]',
      scrollArea: 'bg-[#141210]',
      mineBubble: 'bg-gradient-to-r from-[#78350f] to-[#92400e] text-[#fef3c7] border border-[#fbbf24]/50',
      botBubble: 'bg-[#292524] text-[#fde68a] border border-[#f59e0b]/40',
      otherBubble: 'bg-[#262626] text-[#f5f5f4] border border-[#525252]',
      authorMine: 'text-[#fbbf24]', authorBot: 'text-[#fcd34d]', authorOther: 'text-[#fdba74]',
      quoteBox: 'bg-white/10 hover:bg-white/15 border-[#fbbf24]',
      moodBar: 'bg-[#292524] border-[#d97706]/40 text-[#fde68a]',
      inputBar: 'bg-[#1c1917] border-[#d97706]/40',
      inputField: 'bg-[#292524] border-[#f59e0b]/50 text-[#fef3c7] placeholder:text-stone-400',
      sendButton: 'bg-gradient-to-r from-[#fbbf24] to-[#d97706] hover:brightness-110 text-black',
      complimentButton: 'bg-[#451a03] hover:bg-[#78350f] text-[#fcd34d] border-[#d97706]/60'
    },
    retro_vapor: {
      name: 'Ретровейв 80-х', isDark: true,
      container: 'bg-[#1e1b4b] border-[#c084fc]/60',
      header: 'bg-gradient-to-r from-[#2e1065] to-[#4c1d95] border-[#a855f7]/50',
      headerTitle: 'text-[#fdf4ff]', headerSub: 'text-[#f0abfc]',
      scrollArea: 'bg-gradient-to-b from-[#17153b] to-[#2b1055]',
      mineBubble: 'bg-gradient-to-r from-[#be185d] to-[#9d174d] text-[#fdf2f8] border border-[#f472b6]/50',
      botBubble: 'bg-[#31105f] text-[#e9d5ff] border border-[#c084fc]/50',
      otherBubble: 'bg-[#251b4d] text-[#f5f3ff] border border-[#6d28d9]/60',
      authorMine: 'text-[#f9a8d4]', authorBot: 'text-[#d8b4fe]', authorOther: 'text-[#67e8f9]',
      quoteBox: 'bg-white/10 hover:bg-white/15 border-[#f472b6]',
      moodBar: 'bg-[#2e1065] border-[#a855f7]/40 text-[#f5d0fe]',
      inputBar: 'bg-[#1e1b4b] border-[#a855f7]/40',
      inputField: 'bg-[#2e1065] border-[#c084fc]/60 text-white placeholder:text-purple-300',
      sendButton: 'bg-gradient-to-r from-[#ec4899] to-[#8b5cf6] hover:brightness-110 text-white',
      complimentButton: 'bg-[#4c1d95] hover:bg-[#5b21b6] text-[#f0abfc] border-[#c084fc]/50'
    }
  };

  let activeSkinId = shell?.dataset.skin || 'classic';
  let last = 0, face = 'smile', replyTo = null;
  let allMessages = [];

  function skin() { return SKINS[activeSkinId] || SKINS.classic; }

  function applySkinClasses() {
    const s = skin();
    if (shell) shell.className = 'flex flex-col h-[calc(100vh-165px)] md:h-[calc(100vh-185px)] max-h-[820px] rounded-2xl border shadow-sm overflow-hidden mb-16 md:mb-0 relative transition-colors ' + s.container;
    if (headerBar) headerBar.className = 'px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-2 transition-colors ' + s.header;
    if (titleEl) titleEl.className = 'text-sm font-bold ' + s.headerTitle;
    if (subEl) subEl.className = 'text-[11px] ' + s.headerSub;
    if (skinSelect) skinSelect.className = 'text-[11px] font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer ' + (s.isDark ? 'bg-black/40 text-white border-white/25' : 'bg-white text-[#3e2723] border-[#ffcc80]');
    if (shopLink) shopLink.className = 'px-2.5 py-1 text-[11px] font-bold rounded-lg border flex items-center gap-1 transition-colors cursor-pointer ' + s.complimentButton;
    if (box) box.className = 'flex-1 p-3 md:p-4 overflow-y-auto space-y-3 transition-colors ' + s.scrollArea;
    if (bar) bar.className = 'border-t px-4 py-2 flex items-center justify-between text-xs ' + s.moodBar;
    if (moodBar) moodBar.className = 'px-3 py-1.5 border-t flex items-center justify-between gap-2 overflow-x-auto transition-colors ' + s.moodBar;
    if (compBtn) compBtn.className = 'text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap ' + s.complimentButton;
    if (footBar) footBar.className = 'p-2 md:p-3 border-t flex gap-2 transition-colors ' + s.inputBar;
    if (input) input.className = 'flex-1 px-4 py-2.5 text-sm border focus:border-[#ff9800] focus:ring-2 focus:ring-[#ff9800]/30 rounded-xl outline-none transition-all ' + s.inputField;
    if (sendBtn) sendBtn.className = 'px-4 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed font-bold rounded-xl shadow-xs transition-all flex items-center justify-center cursor-pointer ' + s.sendButton;
  }

  function showNotice(txt) {
    if (!noticeBar || !noticeText) return;
    noticeText.textContent = txt;
    noticeBar.hidden = false;
    setTimeout(() => { noticeBar.hidden = true; }, 3500);
  }

  const MOUTH = '<path d="M7 14q5 5 10 0" fill="none" stroke="#5a3a00" stroke-width="1.6" stroke-linecap="round"/>';
  const EYES = '<circle cx="8.5" cy="10" r="1.4"/><circle cx="15.5" cy="10" r="1.4"/>';
  const FACES = {
    smile: EYES + MOUTH,
    laugh: '<path d="M6.5 10.5q2-3 4 0M13.5 10.5q2-3 4 0" fill="none" stroke="#5a3a00" stroke-width="1.6" stroke-linecap="round"/><path d="M7 13.5h10q-1 5.5-5 5.5t-5-5.5z"/>',
    love: '<path d="M8.5 12.4 6 9.8a1.6 1.6 0 0 1 2.5-2 1.6 1.6 0 0 1 2.5 2z" fill="#e0245e"/><path d="M15.5 12.4 13 9.8a1.6 1.6 0 0 1 2.5-2 1.6 1.6 0 0 1 2.5 2z" fill="#e0245e"/>' + MOUTH,
    cool: '<rect x="4.5" y="8" width="6.5" height="4.2" rx="1.6" fill="#111"/><rect x="13" y="8" width="6.5" height="4.2" rx="1.6" fill="#111"/><path d="M11 9.3h2" stroke="#111" stroke-width="1.4"/>' + MOUTH,
    wink: '<circle cx="8.5" cy="10" r="1.4"/><path d="M14 10.4q1.5-1.7 3 0" fill="none" stroke="#5a3a00" stroke-width="1.6" stroke-linecap="round"/>' + MOUTH,
    sleep: '<path d="M7 10.5q1.5 1.5 3 0M14 10.5q1.5 1.5 3 0" fill="none" stroke="#5a3a00" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="16" r="1.6"/>'
  };
  const faceSvg = (k, sz) => '<svg width="' + sz + '" height="' + sz + '" class="shrink-0" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#ffd84d" stroke="#e0a100"/><g fill="#5a3a00">' + (FACES[k] || FACES.smile) + '</g></svg>';
  const REPLY_SVG = '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>';
  const TRASH_SVG = '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>';
  const BAN_SVG = '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>';
  const UNBAN_SVG = '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>';
  const MUTE_SVG = '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" x2="22" y1="2" y2="22"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/><path d="M5 10v2a7 7 0 0 0 12 5"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/><line x1="12" x2="12" y1="19" y2="22"/></svg>';
  const MIC_SVG = '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>';

  const compliments = [
    'Ты сегодня сияешь!',
    'С тобой всегда легко и весело ✨',
    'Твоя улыбка заразительна!',
    'Ты делаешь этот чат теплее 💛',
    'У тебя отличное чувство юмора!',
    'Ты молодец, правда!'
  ];

  const faces = document.getElementById('emojis');
  if (faces) {
    Object.keys(FACES).forEach(k => {
      const b = document.createElement('button');
      b.type = 'button'; b.dataset.k = k; b.innerHTML = faceSvg(k, 22);
      b.className = 'p-1 rounded-xl transition-all cursor-pointer ' + (k === face ? 'bg-[#ffd54f] scale-110 shadow-xs ring-2 ring-[#ff9800]' : 'hover:bg-black/10 opacity-75 hover:opacity-100');
      b.addEventListener('click', () => {
        face = k;
        faces.querySelectorAll('button').forEach(x => {
          const on = x === b;
          x.className = 'p-1 rounded-xl transition-all cursor-pointer ' + (on ? 'bg-[#ffd54f] scale-110 shadow-xs ring-2 ring-[#ff9800]' : 'hover:bg-black/10 opacity-75 hover:opacity-100');
        });
      });
      faces.appendChild(b);
    });
  }

  async function loadShopSkin() {
    try {
      const r = await fetch('/api/shop/state');
      if (!r.ok) return;
      const st = await r.json();
      activeSkinId = st.activeSkin || 'classic';
      if (shell) shell.dataset.skin = activeSkinId;
      if (sparksEl) sparksEl.textContent = st.sparks;
      if (skinSelect) {
        const list = st.ownedSkins || ['classic'];
        skinSelect.innerHTML = '';
        list.forEach(id => {
          const opt = document.createElement('option');
          opt.value = id;
          opt.className = 'text-black bg-white';
          opt.textContent = '🎨 ' + ((SKINS[id] && SKINS[id].name) || id);
          if (id === activeSkinId) opt.selected = true;
          skinSelect.appendChild(opt);
        });
        skinSelect.hidden = list.length <= 1;
      }
      applySkinClasses();
      renderAllMessages(false);
    } catch (e) {}
  }

  if (skinSelect) {
    skinSelect.addEventListener('change', async () => {
      activeSkinId = skinSelect.value;
      if (shell) shell.dataset.skin = activeSkinId;
      applySkinClasses();
      renderAllMessages(false);
      await fetch('/api/shop/apply-skin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: activeSkinId, price: 0 })
      });
    });
  }

  function setReply(m) {
    replyTo = m.id;
    const whoEl = document.getElementById('replyAuthor');
    if (whoEl) whoEl.textContent = 'Ответ для ' + m.author + ':';
    if (barText) barText.textContent = m.text;
    if (bar) bar.hidden = false;
    input?.focus();
  }
  function clearReply() { replyTo = null; if (bar) bar.hidden = true; }
  document.getElementById('replycancel')?.addEventListener('click', clearReply);

  async function modPost(url, payload, msgText) {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (r.ok && msgText) showNotice(msgText);
    await reloadMessages();
    if (adminPanel && !adminPanel.hidden) loadAdminUsers();
  }

  function buildMessageEl(m) {
    const s = skin();
    const wrap = document.createElement('div');
    wrap.id = 'm-' + m.id;
    wrap.className = 'flex flex-col transition-all duration-300 ' + (m.mine ? 'items-end' : 'items-start');

    const bubble = document.createElement('div');
    const shapeCls = m.mine ? (s.mineBubble + ' rounded-tr-xs') : m.bot ? (s.botBubble + ' rounded-tl-xs') : (s.otherBubble + ' rounded-tl-xs');
    const bgCls = m.authorBanned ? 'bg-red-50 text-red-950 border border-red-300 opacity-75' : shapeCls;
    bubble.className = 'max-w-[88%] md:max-w-[70%] rounded-2xl p-3 shadow-xs relative group ' + bgCls;

    const head = document.createElement('div');
    head.className = 'flex items-center gap-1.5 mb-1 pb-1 border-b text-xs ' + (s.isDark && !m.authorBanned ? 'border-white/10' : 'border-black/5');

    const faceHolder = document.createElement('span');
    faceHolder.innerHTML = faceSvg(m.emoji, 18);
    const authorSpan = document.createElement('span');
    authorSpan.className = 'font-bold ' + (m.authorBanned ? 'text-red-700 line-through' : m.mine ? s.authorMine : m.bot ? s.authorBot : s.authorOther);
    authorSpan.textContent = m.author;
    head.append(faceHolder, authorSpan);

    if (m.badge) {
      const bg = document.createElement('span');
      bg.className = 'text-[9px] bg-[#ffd84d] text-black font-extrabold px-1.5 py-0.2 rounded-full';
      bg.textContent = m.badge;
      head.appendChild(bg);
    }

    if (m.role === 'ADMIN') {
      const rp = document.createElement('span');
      rp.className = 'text-[9px] bg-purple-600 text-white px-1.5 py-0.2 rounded-full font-bold';
      rp.textContent = '👑 Админ';
      head.appendChild(rp);
    } else if (m.role === 'MODERATOR') {
      const rp = document.createElement('span');
      rp.className = 'text-[9px] bg-blue-600 text-white px-1.5 py-0.2 rounded-full font-bold';
      rp.textContent = '🛡️ Модер';
      head.appendChild(rp);
    } else if (m.bot) {
      const rp = document.createElement('span');
      rp.className = 'text-[9px] bg-teal-600 text-white px-1.5 py-0.2 rounded font-bold';
      rp.textContent = '🤖 Бот';
      head.appendChild(rp);
    } else {
      const rp = document.createElement('span');
      rp.className = 'text-[9px] bg-gray-200 text-gray-700 px-1.5 py-0.2 rounded font-medium';
      rp.textContent = '👤 Участник';
      head.appendChild(rp);
    }

    if (m.authorBanned) {
      const bn = document.createElement('span');
      bn.className = 'text-[9px] bg-red-600 text-white px-1 rounded font-bold';
      bn.textContent = 'ЗАБАНЕН';
      head.appendChild(bn);
    } else if (m.authorMuted) {
      const mt = document.createElement('span');
      mt.className = 'text-[9px] bg-amber-600 text-white px-1 rounded font-bold';
      mt.textContent = 'МУТ';
      head.appendChild(mt);
    }

    const time = document.createElement('span');
    time.className = 'text-[10px] ml-auto mr-1 ' + (s.isDark && !m.authorBanned ? 'text-white/60' : 'text-gray-500');
    time.textContent = new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    head.appendChild(time);

    const rb = document.createElement('button');
    rb.type = 'button';
    rb.className = 'p-0.5 rounded transition-colors cursor-pointer ' + (s.isDark && !m.authorBanned ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-[#d84315]');
    rb.title = 'Ответить на сообщение';
    rb.innerHTML = REPLY_SVG;
    rb.addEventListener('click', () => setReply(m));
    head.appendChild(rb);

    if (isMod) {
      const modGroup = document.createElement('div');
      modGroup.className = 'flex items-center gap-0.5 ml-1 pl-1 border-l ' + (s.isDark && !m.authorBanned ? 'border-white/15' : 'border-black/10');

      if (isAdmin && !m.mine && m.authorLogin && m.authorLogin !== '1nsane_666') {
        const bb = document.createElement('button');
        bb.type = 'button';
        bb.className = (m.authorBanned ? 'text-green-500 hover:text-green-400' : 'text-red-500 hover:text-red-400') + ' p-0.5 rounded cursor-pointer';
        bb.title = m.authorBanned ? ('Разбанить ' + m.author) : ('Забанить ' + m.author);
        bb.innerHTML = m.authorBanned ? UNBAN_SVG : BAN_SVG;
        bb.addEventListener('click', () => modPost('/api/admin/ban', { login: m.authorLogin, value: !m.authorBanned }, (m.authorBanned ? 'Разбанен ' : 'Забанен ') + m.author));
        modGroup.appendChild(bb);

        const mb = document.createElement('button');
        mb.type = 'button';
        mb.className = (m.authorMuted ? 'text-blue-400 hover:text-blue-300' : 'text-amber-500 hover:text-amber-400') + ' p-0.5 rounded cursor-pointer';
        mb.title = m.authorMuted ? ('Снять мут с ' + m.author) : ('Мут ' + m.author + ' на 15 мин');
        mb.innerHTML = m.authorMuted ? MIC_SVG : MUTE_SVG;
        mb.addEventListener('click', () => modPost('/api/admin/mute', { login: m.authorLogin, value: !m.authorMuted, minutes: 15 }, (m.authorMuted ? 'Снят мут с ' : 'Выдан мут ') + m.author));
        modGroup.appendChild(mb);
      }

      const db = document.createElement('button');
      db.type = 'button';
      db.className = 'text-gray-400 hover:text-red-500 p-0.5 rounded cursor-pointer';
      db.title = 'Удалить сообщение';
      db.innerHTML = TRASH_SVG;
      db.addEventListener('click', async () => {
        const r = await fetch('/api/messages/' + m.id, { method: 'DELETE' });
        if (r.ok) {
          allMessages = allMessages.filter(x => x.id !== m.id);
          wrap.remove();
        }
      });
      modGroup.appendChild(db);
      head.appendChild(modGroup);
    }

    bubble.appendChild(head);

    if (m.replyId) {
      const q = document.createElement('div');
      q.className = 'mb-1.5 px-2.5 py-1 border-l-3 rounded text-xs cursor-pointer transition-colors ' + s.quoteBox;
      const qa = document.createElement('div');
      qa.className = 'font-semibold text-[11px] flex items-center gap-1 ' + s.authorOther;
      qa.textContent = '↳ ' + (m.replyAuthor || 'Сообщение');
      const qt = document.createElement('div');
      qt.className = 'truncate text-[11px] ' + (s.isDark && !m.authorBanned ? 'text-white/75' : 'text-gray-600');
      qt.textContent = m.replyText || '...';
      q.append(qa, qt);
      q.addEventListener('click', () => {
        const target = document.getElementById('m-' + m.replyId);
        if (!target) return;
        target.scrollIntoView({ block: 'center', behavior: 'smooth' });
        target.classList.add('flash');
        setTimeout(() => target.classList.remove('flash'), 1500);
      });
      bubble.appendChild(q);
    }

    const p = document.createElement('p');
    p.className = 'text-sm leading-relaxed whitespace-pre-wrap select-text break-words';
    p.textContent = m.text;
    bubble.appendChild(p);

    if (m.authorBanned) {
      const banNote = document.createElement('div');
      banNote.className = 'mt-1 pt-1 border-t border-red-200 text-[10px] text-red-600 italic';
      banNote.textContent = '⚠️ Автор сейчас заблокирован администратором.';
      bubble.appendChild(banNote);
    }

    wrap.appendChild(bubble);
    return wrap;
  }

  function renderAllMessages(scrollToBottom) {
    if (!box) return;
    box.innerHTML = '';
    allMessages.forEach(m => box.appendChild(buildMessageEl(m)));
    if (scrollToBottom) box.scrollTop = box.scrollHeight;
  }

  function add(m) {
    last = Math.max(last, m.id);
    if (document.getElementById('m-' + m.id)) return;
    allMessages.push(m);
    const nearBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 90;
    box.appendChild(buildMessageEl(m));
    if (nearBottom || m.mine) box.scrollTop = box.scrollHeight;
  }

  async function poll() {
    try {
      const r = await fetch('/api/messages?after=' + last);
      if (r.status === 401) { location = '/login'; return; }
      (await r.json()).forEach(add);
    } catch (e) {}
  }

  async function reloadMessages() {
    last = 0;
    allMessages = [];
    if (box) box.innerHTML = '';
    await poll();
  }

  async function loadAdminUsers() {
    if (!adminList) return;
    const r = await fetch('/api/admin/users');
    if (!r.ok) return;
    const users = await r.json();
    adminList.innerHTML = '';
    users.forEach(u => {
      const card = document.createElement('div');
      card.className = 'p-2.5 rounded-xl border flex flex-col justify-between transition-colors ' + (u.banned ? 'bg-red-50 border-red-300' : u.muted ? 'bg-amber-50 border-amber-300' : u.login === myLogin ? 'bg-purple-50/60 border-purple-200' : 'bg-white border-[#ffe0b2]');

      const top = document.createElement('div');
      const titleRow = document.createElement('div');
      titleRow.className = 'flex items-center justify-between mb-1';
      const nameB = document.createElement('span');
      nameB.className = 'font-bold text-[#3e2723] truncate';
      nameB.textContent = (u.displayName || u.login) + ' (@' + u.login + ')';
      titleRow.appendChild(nameB);
      if (u.login === '1nsane_666') {
        const cr = document.createElement('span');
        cr.className = 'text-[9px] bg-purple-700 text-white px-1.5 py-0.2 rounded font-extrabold';
        cr.textContent = 'Создатель';
        titleRow.appendChild(cr);
      }
      top.appendChild(titleRow);

      const roleWrap = document.createElement('div');
      roleWrap.className = 'mt-1 mb-2';
      const rlLbl = document.createElement('label');
      rlLbl.className = 'block text-[9px] text-[#795548] font-bold uppercase mb-0.5';
      rlLbl.textContent = 'Назначенная роль:';
      const sel = document.createElement('select');
      sel.disabled = u.login === '1nsane_666';
      sel.className = 'w-full text-[10px] font-bold px-2 py-1 bg-white border border-[#ffcc80] rounded-lg outline-none cursor-pointer disabled:opacity-60 text-[#3e2723]';
      ['USER', 'MODERATOR', 'ADMIN', 'BOT'].forEach(rl => {
        const o = document.createElement('option');
        o.value = rl; o.textContent = rl;
        if (u.role === rl) o.selected = true;
        sel.appendChild(o);
      });
      sel.addEventListener('change', () => modPost('/api/admin/role', { login: u.login, role: sel.value }, 'Роль для @' + u.login + ' изменена на ' + sel.value));
      roleWrap.append(rlLbl, sel);
      top.appendChild(roleWrap);

      const stDiv = document.createElement('div');
      stDiv.className = 'text-[10px] text-gray-500 mb-2';
      stDiv.innerHTML = 'Статус: ' + (u.banned ? '<span class="text-red-600 font-bold">🚫 Заблокирован</span>' : u.muted ? '<span class="text-amber-700 font-bold">🔇 В муте</span>' : '<span class="text-green-600 font-semibold">🟢 Активен</span>');
      top.appendChild(stDiv);
      card.appendChild(top);

      if (u.login !== '1nsane_666') {
        const act = document.createElement('div');
        act.className = 'flex items-center gap-1 pt-1.5 border-t border-black/5';

        const bBtn = document.createElement('button');
        bBtn.type = 'button';
        bBtn.className = 'flex-1 py-1 text-white rounded text-[10px] font-bold cursor-pointer ' + (u.banned ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700');
        bBtn.textContent = u.banned ? 'Разбанить' : 'Бан';
        bBtn.addEventListener('click', () => modPost('/api/admin/ban', { login: u.login, value: !u.banned }));

        const mBtn = document.createElement('button');
        mBtn.type = 'button';
        mBtn.className = 'flex-1 py-1 text-white rounded text-[10px] font-bold cursor-pointer ' + (u.muted ? 'bg-blue-600 hover:bg-blue-700' : 'bg-amber-600 hover:bg-amber-700');
        mBtn.textContent = u.muted ? 'Размут' : 'Мут (10м)';
        mBtn.addEventListener('click', () => modPost('/api/admin/mute', { login: u.login, value: !u.muted, minutes: 10 }));

        act.append(bBtn, mBtn);
        card.appendChild(act);
      }

      adminList.appendChild(card);
    });
  }

  adminBtn?.addEventListener('click', () => {
    if (!adminPanel) return;
    adminPanel.hidden = !adminPanel.hidden;
    if (!adminPanel.hidden) loadAdminUsers();
  });
  document.getElementById('closeAdminPanel')?.addEventListener('click', () => {
    if (adminPanel) adminPanel.hidden = true;
  });

  if (footBar) {
    footBar.addEventListener('submit', async e => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      const body = { text, emoji: face, replyTo };
      const r = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (r.ok) {
        input.value = '';
        clearReply();
        await poll();
        await loadShopSkin();
      } else if (r.status === 403) {
        showNotice('Отправка сообщений ограничена администратором (бан или мут).');
      }
    });
  }

  compBtn?.addEventListener('click', () => {
    if (!input) return;
    input.value = compliments[Math.floor(Math.random() * compliments.length)];
    input.focus();
  });

  loadShopSkin();
  poll();
  setInterval(poll, 2000);
})();
