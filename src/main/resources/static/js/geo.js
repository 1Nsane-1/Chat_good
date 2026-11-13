window.Geo = (() => {
  let lastSent = 0, current = null;
  const listeners = [];

  function start(onError) {
    if (!navigator.geolocation) { onError && onError('Геолокация не поддерживается'); return; }
    navigator.geolocation.watchPosition(pos => {
      current = {lat: pos.coords.latitude, lon: pos.coords.longitude};
      listeners.forEach(f => f(current));
      if (Date.now() - lastSent > 10000) {
        lastSent = Date.now();
        fetch('/api/location', {method: 'POST', headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(current)}).catch(() => {});
      }
    }, err => onError && onError(err.message + ' (на телефоне нужен HTTPS)'),
    {enableHighAccuracy: true, maximumAge: 5000});
  }
  return {start, onPosition: f => listeners.push(f), get current() { return current; }};
})();
