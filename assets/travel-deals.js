/* travel-deals.js — shared Travelpayouts monetization blocks.
 *
 * Per-page config comes from <meta> tags (all optional):
 *   <meta name="tp-iata"    content="ATH">      IATA of the destination airport
 *   <meta name="tp-city-en" content="Athens">   English city name (Hotellook search term)
 *   <meta name="tp-city-he" content="אתונה">    Hebrew city name (display only)
 *   <meta name="tp-esim"    content="greece">   Airalo country slug -> /{slug}-esim
 *   <meta name="tp-blocks"  content="flights,hotels,esim">  which blocks to render
 *
 * Renders into #travel-deals when present, otherwise just before <footer>.
 * All outbound links carry marker=561903; the Travelpayouts Drive script in
 * <head> converts the remaining partner links (Airalo, EKTA) on click.
 */
(function () {
  'use strict';

  var MARKER = '561903';

  function meta(name, fallback) {
    var el = document.querySelector('meta[name="' + name + '"]');
    var v = el && el.getAttribute('content');
    return (v && v.trim()) || fallback || '';
  }

  var iata   = meta('tp-iata').toUpperCase();
  var cityEn = meta('tp-city-en');
  var cityHe = meta('tp-city-he', cityEn);
  var esimC  = meta('tp-esim');
  var blocks = meta('tp-blocks', 'hotels,esim').split(',').map(function (s) { return s.trim(); });
  var has    = function (b) { return blocks.indexOf(b) !== -1; };

  /* ---------- date helpers ---------- */
  function iso(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' +
           String(d.getDate()).padStart(2, '0');
  }
  function plusDays(n) { var d = new Date(); d.setDate(d.getDate() + n); return d; }
  function ddmm(isoStr) {                       // "2026-10-05" -> "0510"
    var p = String(isoStr || '').split('-');
    return p.length === 3 ? p[2] + p[1] : '';
  }
  var DEF_OUT = iso(plusDays(30));
  var DEF_IN  = iso(plusDays(37));
  var TODAY   = iso(new Date());

  /* ---------- affiliate link builders ---------- */
  // https://www.aviasales.com/search/{ORIGIN}{DDMM}{DEST}[{DDMM_return}]{PAX}
  function aviasalesUrl(origin, dest, dateOut, dateIn, pax) {
    var code = origin + ddmm(dateOut) + dest + (dateIn ? ddmm(dateIn) : '') + (pax || 1);
    return 'https://www.aviasales.com/search/' + code +
           '?marker=' + MARKER + '&currency=ils&locale=he';
  }
  function hotellookUrl(city, checkIn, checkOut, adults) {
    return 'https://search.hotellook.com/?marker=' + MARKER +
           '&destination=' + encodeURIComponent(city) +
           '&checkIn=' + checkIn + '&checkOut=' + checkOut +
           '&adults=' + (adults || 2) + '&currency=ils&language=he';
  }

  /* ---------- markup ---------- */
  function field(id, label, type, value, extra) {
    return '<div class="td-field"><label for="' + id + '">' + label + '</label>' +
           '<input id="' + id + '" type="' + type + '" value="' + value + '" ' +
           (extra || '') + '></div>';
  }

  function flightsBlock() {
    if (!iata) return '';
    return '' +
      '<div class="td-block td-primary">' +
        '<span class="td-primary-badge">המחיר הזול ביותר</span>' +
        '<div class="td-brand">' +
          '<div class="td-brand-mark">A</div>' +
          '<div><div class="td-brand-name">Aviasales</div>' +
          '<div class="td-brand-desc">סורק למעלה מ-700 חברות תעופה וסוכנויות ומציג את המחיר הזול ביותר</div></div>' +
        '</div>' +
        '<p class="td-sub">בדקו מחירי טיסות ל' + cityHe + ' (' + iata + ') מנתב״ג:</p>' +
        '<div class="td-form">' +
          field('tdFlightOut', 'תאריך יציאה', 'date', DEF_OUT, 'min="' + TODAY + '"') +
          field('tdFlightIn', 'תאריך חזרה', 'date', DEF_IN, 'min="' + TODAY + '"') +
          '<div class="td-field"><label for="tdFlightPax">נוסעים</label>' +
          '<select id="tdFlightPax"><option value="1">1</option><option value="2" selected>2</option>' +
          '<option value="3">3</option><option value="4">4</option></select></div>' +
        '</div>' +
        '<button type="button" class="td-btn td-btn-flights" id="tdFlightGo">' +
          'בדקו מחירי טיסות ל' + cityHe + '</button>' +
        '<p class="td-note">החיפוש נפתח בלשונית חדשה ב-Aviasales</p>' +
      '</div>';
  }

  function hotelsBlock() {
    var placeholder = cityEn ? '' : ' placeholder="לדוגמה: Athens"';
    return '' +
      '<div class="td-block">' +
        '<div class="td-title">מלונות' + (cityHe ? ' ב' + cityHe : '') + '</div>' +
        '<p class="td-sub">Hotellook משווה מחירים ב-Booking, Agoda, Expedia ועוד ומציג את ההצעה הזולה ביותר לאותו חדר.</p>' +
        '<div class="td-form">' +
          '<div class="td-field"><label for="tdHotelCity">יעד</label>' +
          '<input id="tdHotelCity" type="text" value="' + (cityEn || '') + '"' + placeholder + '></div>' +
          field('tdHotelIn', 'צ׳ק-אין', 'date', DEF_OUT, 'min="' + TODAY + '"') +
          field('tdHotelOut', 'צ׳ק-אאוט', 'date', DEF_IN, 'min="' + TODAY + '"') +
          '<div class="td-field"><label for="tdHotelAdults">אורחים</label>' +
          '<select id="tdHotelAdults"><option value="1">1</option><option value="2" selected>2</option>' +
          '<option value="3">3</option><option value="4">4</option></select></div>' +
        '</div>' +
        '<button type="button" class="td-btn td-btn-hotels" id="tdHotelGo">השוו מחירי מלונות</button>' +
        '<p class="td-note">החיפוש נפתח בלשונית חדשה ב-Hotellook</p>' +
      '</div>';
  }

  function esimBlock() {
    var airalo = esimC ? 'https://www.airalo.com/' + esimC + '-esim' : 'https://www.airalo.com/';
    return '' +
      '<div class="td-block">' +
        '<div class="td-title">אינטרנט וביטוח נסיעות</div>' +
        '<p class="td-sub">שני הדברים שהכי משתלם לסדר לפני שיוצאים, ולא בשדה התעופה.</p>' +
        '<div class="td-esim-grid">' +
          '<a class="td-card" href="' + airalo + '" target="_blank" rel="sponsored noopener">' +
            '<div class="td-ico">eSIM</div><div><div class="td-nm">Airalo' +
            (cityHe ? ' — חבילת גלישה ל' + cityHe : ' — חבילות גלישה') + '</div>' +
            '<div class="td-ds">כרטיס SIM דיגיטלי, מופעל בסריקת קוד. בלי חיפוש סים מקומי ובלי נדידה יקרה.</div></div></a>' +
          '<a class="td-card" href="https://ekta.com/" target="_blank" rel="sponsored noopener">' +
            '<div class="td-ico">EKTA</div><div><div class="td-nm">ביטוח נסיעות</div>' +
            '<div class="td-ds">כיסוי רפואי לחו״ל, רכישה אונליין תוך דקות, כולל אפשרות לספורט אתגרי.</div></div></a>' +
        '</div>' +
      '</div>';
  }

  var DISCLOSURE = 'האתר מכיל קישורי שותפים. רכישה דרכם תומכת בפיתוח שירותים חינמיים נוספים.';

  /* ---------- render ---------- */
  function render() {
    var html = '';
    if (has('flights')) html += flightsBlock();
    if (has('hotels'))  html += hotelsBlock();
    if (has('esim'))    html += esimBlock();
    if (!html) { addDisclosure(); return; }

    // Pages that want control over placement ship their own <section id="travel-deals">;
    // those inherit the surrounding content width. Anywhere else we append before the
    // footer and mark it "standalone" so the CSS supplies its own width — blog articles
    // wrap content in .article, not .container, so we cannot rely on a shared wrapper.
    var host = document.getElementById('travel-deals');
    if (host) {
      host.className = 'td-section';
    } else {
      host = document.createElement('section');
      host.id = 'travel-deals';
      host.className = 'td-section td-standalone';
      var footer = document.querySelector('footer');
      if (footer && footer.parentNode) footer.parentNode.insertBefore(host, footer);
      else document.body.appendChild(host);
    }
    host.innerHTML = html;

    wire();
    addDisclosure();
  }

  function openTab(url) { window.open(url, '_blank', 'noopener'); }

  function wire() {
    var fGo = document.getElementById('tdFlightGo');
    if (fGo) {
      fGo.addEventListener('click', function () {
        var out  = document.getElementById('tdFlightOut').value;
        var back = document.getElementById('tdFlightIn').value;
        var pax  = document.getElementById('tdFlightPax').value;
        if (!out) { alert('בחרו תאריך יציאה'); return; }
        if (back && back < out) { alert('תאריך החזרה חייב להיות אחרי תאריך היציאה'); return; }
        openTab(aviasalesUrl('TLV', iata, out, back, pax));
      });
    }
    var hGo = document.getElementById('tdHotelGo');
    if (hGo) {
      hGo.addEventListener('click', function () {
        var city = document.getElementById('tdHotelCity').value.trim();
        var ci   = document.getElementById('tdHotelIn').value;
        var co   = document.getElementById('tdHotelOut').value;
        var ad   = document.getElementById('tdHotelAdults').value;
        if (!city) { alert('הזינו יעד'); return; }
        if (!ci || !co) { alert('בחרו תאריכי שהייה'); return; }
        if (co <= ci) { alert('תאריך היציאה מהמלון חייב להיות אחרי תאריך הכניסה'); return; }
        openTab(hotellookUrl(city, ci, co, ad));
      });
    }
  }

  function addDisclosure() {
    if (document.querySelector('.td-disclosure')) return;
    var footer = document.querySelector('footer');
    if (!footer) return;
    var p = document.createElement('p');
    p.className = 'td-disclosure';
    p.textContent = DISCLOSURE;
    footer.appendChild(p);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render, { once: true });
  } else {
    render();
  }
})();
