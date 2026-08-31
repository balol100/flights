/* analytics.js — Google Tag Manager bootstrap + affiliate outbound-click tracking.
 *
 * Page views alone say nothing about revenue; the metric that matters is the
 * outbound click to a paying partner. This file pushes an `affiliate_click`
 * event (and, for Aviasales specifically, `aviasales_outbound_click`) into the
 * GTM dataLayer for every monetized link on the site.
 *
 * Two ways to fire an event:
 *   1. Declaratively — put data-aff-* attributes on the <a>/<button>:
 *        data-aff-partner="aviasales"      (required)
 *        data-aff-placement="primary_card" (where on the page)
 *        data-aff-dest="ATH"               (IATA or city, optional)
 *      A delegated listener picks it up, so markup rendered later still works.
 *   2. Imperatively — window.trackAffiliateClick(partner, {placement, dest, url}).
 *      Used where we call window.open() instead of following an href.
 */
(function () {
  'use strict';

  var GTM_ID = 'GTM-TJD7RD42';
  var MARKER = '764091';

  window.dataLayer = window.dataLayer || [];

  /* ---------------------------------------------------------------- GTM ---- */
  (function bootGtm() {
    if (document.querySelector('script[src*="googletagmanager.com/gtm.js"]')) return;
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(s);
  })();

  /* ------------------------------------------------------------- tracking -- */
  // Only Aviasales / Hotellook / tp.media links must carry the marker; anything
  // else is monetized by the Drive script's click-time rewrite instead.
  function markerOk(url) {
    if (!url) return true;
    if (!/aviasales\.com|hotellook\.com|tp\.media|emrld\.ltd/.test(url)) return true;
    return url.indexOf('marker=' + MARKER) !== -1;
  }

  function push(partner, opts) {
    opts = opts || {};
    var payload = {
      event: 'affiliate_click',
      affiliate_partner: partner,
      affiliate_placement: opts.placement || 'unknown',
      affiliate_destination: opts.dest || '',
      affiliate_url: opts.url || '',
      affiliate_marker: MARKER,
      // False ONLY for the real failure case: a Travelpayouts URL that lost the
      // marker and would therefore earn nothing. Partners monetized by the Drive
      // script (Trip.com, Airalo, EKTA) carry no marker by design and stay true,
      // so this stays usable as an alert condition in GTM.
      affiliate_marker_ok: markerOk(opts.url)
    };
    window.dataLayer.push(payload);

    // Aviasales is the main earner, so give it its own event for a simple trigger.
    if (partner === 'aviasales') {
      window.dataLayer.push({
        event: 'aviasales_outbound_click',
        affiliate_placement: payload.affiliate_placement,
        affiliate_destination: payload.affiliate_destination,
        affiliate_url: payload.affiliate_url,
        affiliate_marker_ok: payload.affiliate_marker_ok
      });
    }
    return payload;
  }

  window.trackAffiliateClick = push;

  /* Delegated listener: catches anything carrying data-aff-partner, including
     markup injected after load (search results, travel-deals blocks). */
  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest && e.target.closest('[data-aff-partner]');
    if (!el) return;
    push(el.getAttribute('data-aff-partner'), {
      placement: el.getAttribute('data-aff-placement'),
      dest: el.getAttribute('data-aff-dest'),
      url: el.getAttribute('href') || el.getAttribute('data-aff-url') || ''
    });
  }, true);
})();
