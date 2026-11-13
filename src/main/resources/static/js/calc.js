(() => {
  const disp = document.getElementById('disp');
  const hist = document.getElementById('hist');
  const logCard = document.getElementById('calcHistoryCard');
  const logBox = document.getElementById('calcHistoryList');
  const clearHistBtn = document.getElementById('clearCalcHistory');
  let a = null, op = null, cur = '0', reset = false;
  let historyLog = [];

  const ops = {
    '+': (x, y) => x + y, '−': (x, y) => x - y, '-': (x, y) => x - y,
    '×': (x, y) => x * y, '*': (x, y) => x * y, '÷': (x, y) => y === 0 ? NaN : x / y, '/': (x, y) => y === 0 ? NaN : x / y
  };
  const fmt = v => String(+Number(v).toFixed(10));
  const show = () => { if (disp) disp.textContent = cur; };

  function renderHistory() {
    if (!logCard || !logBox) return;
    logCard.hidden = historyLog.length === 0;
    logBox.innerHTML = '';
    historyLog.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'flex justify-between py-0.5 border-b border-gray-50 last:border-0';
      const num = document.createElement('span');
      num.className = 'text-gray-500';
      num.textContent = '#' + (historyLog.length - idx);
      const val = document.createElement('span');
      val.className = 'font-semibold text-[#0e4b5a]';
      val.textContent = item;
      row.append(num, val);
      logBox.appendChild(row);
    });
  }

  function calc() {
    if (op === null) return;
    const b = parseFloat(cur);
    const r = ops[op](a, b);
    const expr = a + ' ' + op + ' ' + b + ' =';
    if (hist) hist.textContent = expr;
    cur = isFinite(r) ? fmt(r) : 'Ошибка';
    if (isFinite(r)) {
      historyLog = [expr + ' ' + cur, ...historyLog.slice(0, 7)];
      renderHistory();
    }
    a = isFinite(r) ? r : null;
    reset = true;
  }

  function press(k) {
    if (cur === 'Ошибка' && !/^[0-9C]$/.test(k)) return;
    if (/^[0-9]$/.test(k)) {
      if (reset || cur === '0' || cur === 'Ошибка') { cur = k; reset = false; } else cur += k;
    } else if (k === '.') {
      if (reset) { cur = '0.'; reset = false; } else if (!cur.includes('.')) cur += '.';
    } else if (k === 'C') {
      cur = '0'; a = null; op = null; reset = false; if (hist) hist.textContent = ' ';
    } else if (k === '⌫') {
      cur = cur.length > 1 && !reset ? cur.slice(0, -1) : '0';
    } else if (k === '±') {
      cur = fmt(-parseFloat(cur));
    } else if (k === '%') {
      cur = fmt(parseFloat(cur) / 100);
    } else if (k === '√') {
      const v = Math.sqrt(parseFloat(cur));
      cur = isNaN(v) ? 'Ошибка' : fmt(v); reset = true;
    } else if (k === '=') {
      calc(); op = null;
    } else if (ops[k]) {
      if (op && !reset) calc(); else a = parseFloat(cur);
      op = k; reset = true;
      if (hist) hist.textContent = a + ' ' + k;
    }
    show();
  }

  document.getElementById('keys')?.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (b && b.dataset.k) press(b.dataset.k);
  });

  clearHistBtn?.addEventListener('click', () => {
    historyLog = [];
    renderHistory();
  });

  window.addEventListener('keydown', e => {
    if (e.key.length === 1 && '0123456789.+-*/'.includes(e.key)) { e.preventDefault(); press(e.key === '*' ? '×' : e.key === '/' ? '÷' : e.key === '-' ? '−' : e.key); }
    else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); press('='); }
    else if (e.key === 'Backspace') { e.preventDefault(); press('⌫'); }
    else if (e.key === 'Escape') { e.preventDefault(); press('C'); }
  });
})();
