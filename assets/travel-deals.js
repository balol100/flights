/* travel-deals.js — shared Travelpayouts monetization blocks.
 *
 * Per-page config comes from <meta> tags (all optional):
 *   <meta name="tp-iata"    content="ATH">      IATA of the destination airport
 *   <meta name="tp-city-en" content="Athens">   English city name (Hotellook search term)
 *   <meta name="tp-city-he" content="אתונה">    Hebrew city name (display only)
 *   <meta name="tp-esim"    content="greece">   Airalo country slug -> /{slug}-esim
 *   <meta name="tp-gocity"  content="barcelona"> Go City city path -> gocity.com/{path}
 *   <meta name="tp-blocks"  content="flights,hotels,esim,gocity">  which blocks to render
 *
 * Renders into #travel-deals when present, otherwise just before <footer>.
 *
 * MARKER is the Travelpayouts affiliate id and must appear in every Aviasales /
 * Hotellook / tp.media URL — a link without it looks identical but earns nothing.
 * TRS is the traffic-source id (the value encoded in the Drive script filename);
 * it is NOT the marker. The Drive script in <head> converts the remaining partner
 * links (Airalo, EKTA) on click.
 */
(function () {
  'use strict';

  var MARKER = '764091';
  var TRS = '561903';

  function meta(name, fallback) {
    var el = document.querySelector('meta[name="' + name + '"]');
    var v = el && el.getAttribute('content');
    return (v && v.trim()) || fallback || '';
  }

  var iata   = meta('tp-iata').toUpperCase();
  var cityEn = meta('tp-city-en');
  var cityHe = meta('tp-city-he', cityEn);
  var esimC  = meta('tp-esim');
  var goCity = meta('tp-gocity');
  var airHelpVariant = meta('tp-airhelp', 'full');
  var blocks = meta('tp-blocks', 'hotels,esim').split(',').map(function (s) { return s.trim(); });
  var has    = function (b) { return blocks.indexOf(b) !== -1; };

  function track(partner, placement, url) {
    if (typeof window.trackAffiliateClick === 'function') {
      window.trackAffiliateClick(partner, { placement: placement, dest: iata || cityEn, url: url });
    }
  }

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
  // Go City runs through the Travelpayouts redirector, which is also what reveals
  // the current discount code — so we never publish a code in the markup.
  function goCityUrl(cityPath) {
    return 'https://tp.media/r?campaign_id=62&marker=' + MARKER + '&p=1942&trs=' + TRS +
           '&u=' + encodeURIComponent('https://gocity.com' + (cityPath ? '/' + cityPath : ''));
  }
  // Same pattern for AirHelp: the redirector carries the AirHelp+ discount, so the
  // code stays out of the HTML.
  function airHelpUrl() {
    return 'https://tp.media/r?campaign_id=120&marker=' + MARKER + '&p=9139&trs=' + TRS +
           '&u=' + encodeURIComponent('https://airhelp.com');
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
          '<a class="td-card" href="' + airalo + '" target="_blank" rel="sponsored noopener"' +
            ' data-aff-partner="airalo" data-aff-placement="esim_card">' +
            '<div class="td-ico">eSIM</div><div><div class="td-nm">Airalo' +
            (cityHe ? ' — חבילת גלישה ל' + cityHe : ' — חבילות גלישה') + '</div>' +
            '<div class="td-ds">כרטיס SIM דיגיטלי, מופעל בסריקת קוד. בלי חיפוש סים מקומי ובלי נדידה יקרה.</div></div></a>' +
          '<a class="td-card" href="https://ekta.com/" target="_blank" rel="sponsored noopener"' +
            ' data-aff-partner="ekta" data-aff-placement="insurance_card">' +
            '<div class="td-ico">EKTA</div><div><div class="td-nm">ביטוח נסיעות</div>' +
            '<div class="td-ds">כיסוי רפואי לחו״ל, רכישה אונליין תוך דקות, כולל אפשרות לספורט אתגרי.</div></div></a>' +
        '</div>' +
      '</div>';
  }

  /* Go City seasonal campaigns. The discount code itself is deliberately NOT in
     the markup — the Travelpayouts landing page reveals it. We only advertise the
     window and the size of the saving, and the banner disappears once it lapses. */
  var GOCITY_PROMOS = [
    { cities: ['barcelona', 'prague', 'madrid'], from: '2026-09-04', to: '2026-09-07', off: '10%' },
    { cities: ['new-york'],                      from: '2026-09-04', to: '2026-09-07', off: '10%' }
  ];

  function activePromo(cityPath) {
    var today = iso(new Date());
    for (var i = 0; i < GOCITY_PROMOS.length; i++) {
      var p = GOCITY_PROMOS[i];
      if (p.cities.indexOf(cityPath) !== -1 && today >= p.from && today <= p.to) return p;
    }
    return null;
  }

  function heDate(isoStr) {                       // "2026-09-04" -> "4.9"
    var p = String(isoStr).split('-');
    return parseInt(p[2], 10) + '.' + parseInt(p[1], 10);
  }

  function goCityBlock() {
    if (!goCity) return '';
    var url = goCityUrl(goCity);
    var promo = activePromo(goCity);
    var banner = promo
      ? '<div class="gc-promo">מבצע לזמן מוגבל · ' + heDate(promo.from) + '–' + heDate(promo.to) +
        ' · עד ' + promo.off + ' הנחה נוספת</div>'
      : '';
    return '' +
      '<div class="td-block gc-block">' +
        '<div class="gc-head">' +
          '<span class="gc-logo">Go City</span>' +
          '<span class="gc-tag">כרטיס אחד · עשרות אטרקציות</span>' +
        '</div>' +
        banner +
        '<div class="gc-title">חסכו עד 10% עם Go City All-Inclusive Pass' +
          (cityHe ? ' ב' + cityHe : '') + '</div>' +
        '<p class="gc-sub">כרטיס אחד שנותן כניסה לעשרות אטרקציות, מוזיאונים וסיורים ' +
          (cityHe ? 'ב' + cityHe : 'ביעד') + ' — במקום לשלם על כל אתר בנפרד. ' +
          'משתלם במיוחד לטיול עירוני קצר שבו מספיקים 3–5 אתרים ביום.</p>' +
        '<a class="td-btn gc-btn" href="' + url + '" target="_blank" rel="sponsored noopener"' +
          ' data-aff-partner="gocity" data-aff-placement="gocity_card"' +
          ' data-aff-dest="' + (goCity || '') + '">לחצו לחשיפת קוד ההנחה ←</a>' +
        '<p class="td-note gc-note">הקוד נחשף בעמוד המבצע של Go City. המחיר והזמינות עשויים להשתנות.</p>' +
      '</div>';
  }

  /* AirHelp — flight-delay/cancellation compensation. The AirHelp+ discount code
     is deliberately not in the markup; the redirector applies it. */
  var AIRHELP_PROMO = { from: '2026-09-01', to: '2026-11-30', off: '11%' };

  function airHelpBlock() {
    var url = airHelpUrl();
    var today = iso(new Date());
    var promoOn = today >= AIRHELP_PROMO.from && today <= AIRHELP_PROMO.to;
    var promo = promoOn
      ? '<div class="ah-promo">מבצע לזמן מוגבל · ' + heDate(AIRHELP_PROMO.from) + '–' +
        heDate(AIRHELP_PROMO.to) + ' · ' + AIRHELP_PROMO.off + ' הנחה על מנוי AirHelp+</div>'
      : '';
    var cta = '<a class="td-btn ah-btn" href="' + url + '" target="_blank" rel="sponsored noopener"' +
              ' data-aff-partner="airhelp" data-aff-placement="' +
              (airHelpVariant === 'compact' ? 'airhelp_compact' : 'airhelp_full') + '"' +
              ' data-aff-dest="' + (iata || '') + '">בדקו זכאות לפיצוי ←</a>';

    if (airHelpVariant === 'compact') {
      return '' +
        '<div class="td-block ah-block ah-compact">' +
          '<div class="ah-title">טיסה התעכבה או בוטלה? בדקו אם מגיע לכם פיצוי</div>' +
          '<p class="ah-sub">עיכוב של 3 שעות ומעלה, ביטול או סירוב עלייה לטיסה עשויים לזכות אתכם ' +
            'בפיצוי של עד 600 יורו — גם על טיסות מלפני שנים. הבדיקה חינם.</p>' +
          promo + cta +
        '</div>';
    }
    return '' +
      '<div class="td-block ah-block">' +
        '<div class="ah-head"><span class="ah-logo">AirHelp</span>' +
          '<span class="ah-tag">פיצוי על טיסות · בדיקה חינם</span></div>' +
        promo +
        '<div class="ah-title">טיסה התעכבה או בוטלה? ייתכן שמגיע לכם פיצוי</div>' +
        '<p class="ah-sub">תקנות האיחוד האירופי (EC 261) וחוק שירותי תעופה הישראלי מזכים נוסעים ' +
          'בפיצוי על עיכוב של 3 שעות ומעלה, ביטול טיסה או סירוב עלייה — עד 600 יורו לנוסע, ' +
          'ולעיתים גם על טיסות מלפני שנים. רוב הנוסעים פשוט לא מגישים תביעה.</p>' +
        '<ul class="ah-list">' +
          '<li>בדיקת זכאות חינם, בלי התחייבות</li>' +
          '<li>AirHelp מנהלת את התביעה מול חברת התעופה</li>' +
          '<li>עמלה נגבית רק אם התביעה מצליחה</li>' +
        '</ul>' +
        cta +
        '<p class="td-note ah-note">שירות של צד שלישי. תנאי השירות והעמלה מפורטים באתר AirHelp.</p>' +
      '</div>';
  }

  var DISCLOSURE = 'האתר מכיל קישורי שותפים. רכישה דרכם תומכת בפיתוח שירותים חינמיים נוספים.';

  /* ---------- render ---------- */
  function render() {
    // AirHelp is the highest-margin placement, so a page may pull it out of the
    // stack and mount it high in the content via <div id="airhelp-slot">.
    var ahSlot = has('airhelp') ? document.getElementById('airhelp-slot') : null;
    if (ahSlot) {
      ahSlot.className = 'td-section' + (ahSlot.closest('.container') ? '' : ' td-standalone');
      ahSlot.innerHTML = airHelpBlock();
    }

    var html = '';
    if (has('flights')) html += flightsBlock();
    if (has('hotels'))  html += hotelsBlock();
    if (has('gocity'))  html += goCityBlock();
    if (has('airhelp') && !ahSlot) html += airHelpBlock();
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
        var url = aviasalesUrl('TLV', iata, out, back, pax);
        track('aviasales', 'widget_flights', url);
        openTab(url);
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
        var hurl = hotellookUrl(city, ci, co, ad);
        track('hotellook', 'widget_hotels', hurl);
        openTab(hurl);
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
