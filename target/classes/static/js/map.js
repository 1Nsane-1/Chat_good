const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const status = document.getElementById('status');

Geo.start(msg => { if (status) status.textContent = msg; });
Geo.onPosition(() => { if (status) status.textContent = 'Твоя позиция отправляется на карту ✅'; });

if (window.ymaps && document.getElementById('map')) {
  ymaps.ready(() => {
    const map = new ymaps.Map('map', {center: [55.75, 37.62], zoom: 10, controls: ['zoomControl', 'geolocationControl', 'typeSelector']});
    const coll = new ymaps.GeoObjectCollection();
    map.geoObjects.add(coll);
    let first = true;

    async function refresh() {
      try {
        const list = await (await fetch('/api/locations')).json();
        coll.removeAll();
        list.forEach(u => coll.add(new ymaps.Placemark([u.lat, u.lon], {
          balloonContentHeader: esc(u.name) + (u.me ? ' (ты)' : ''),
          balloonContentBody: esc(u.mood) + '<br>' + esc(u.city),
          hintContent: esc(u.name)
        }, {preset: u.me ? 'islands#darkOrangeCircleDotIcon' : 'islands#tealCircleDotIcon'})));
        if (first && list.length) {
          first = false;
          if (list.length === 1) map.setCenter([list[0].lat, list[0].lon], 15);
          else map.setBounds(coll.getBounds(), {checkZoomRange: true, zoomMargin: 40});
        }
      } catch (e) {}
    }
    refresh();
    setInterval(refresh, 10000);
  });
}
