# Flights Blog Agent — Memory

## Site
- **Domain:** flights.lior-ai.com
- **Repo:** balol100/flights (GitHub)
- **Hosting:** Netlify
- **Supabase project:** evufisyrxfrwksequajt

## Blog Articles (all in /blog/)

| # | File | Title | Date |
|---|------|-------|------|
| 1 | cheap-flights-tips.html | 10 טיפים למציאת טיסות זולות מנתב״ג 2026 | Aug 2026 |
| 2 | low-cost-airlines-israel.html | חברות לואו-קוסט שטסות מישראל — המדריך המלא | Aug 2026 |
| 3 | cheapest-destinations-august-2026.html | לאן הכי זול לטוס מישראל באוגוסט 2026? | Aug 2026 |
| 4 | cheap-flights-greece-2026.html | טיסות זולות ליוון 2026 — כל מה שצריך לדעת | Aug 2026 |
| 5 | israeli-airlines-comparison.html | חברות תעופה ישראליות — אל על, ישראייר, ארקיע: מה ההבדל? | Aug 2026 |
| 6 | black-friday-flights-2026.html | איך למצוא טיסות זולות ב-Black Friday 2026 | Aug 2026 |
| 7 | flights-turkey-from-israel.html | טיסות לטורקיה מנתב״ג — יעדים, מחירים וטיפים | Aug 2026 |
| 8 | batumi-vs-athens-budget-destinations.html | בטומי או אתונה? השוואת יעדי חופשה זולים מישראל | Aug 2026 |
| 9 | tishrei-flights-2026.html | טיסות זולות לחגי תשרי 2026 — להזמין עכשיו לפני שיקפצו | Aug 13, 2026 |
| 10 | rosh-hashana-flights-2026.html | טיסות זולות לראש השנה 2026 — המדריך המלא | Aug 23, 2026 |
| 11 | rosh-hashana-long-weekend-2026.html | סופ״ש ארוך בראש השנה 2026 — 4 ימים עם יום חופש אחד | Aug 23, 2026 |
| 12 | rosh-hashana-vs-sukkot-flights-2026.html | ראש השנה או סוכות 2026? מתי באמת משתלם לטוס | Aug 23, 2026 |
| 13 | rosh-hashana-family-destinations-2026.html | יעדים לראש השנה 2026 עם ילדים | Aug 23, 2026 |
| 14 | rosh-hashana-last-minute-flights-2026.html | לאסט מינוט לראש השנה 2026 | Aug 23, 2026 |
| 15 | rosh-hashana-september-weather-2026.html | מזג האוויר בספטמבר 2026 — לאן לטוס לפי אקלים | Aug 23, 2026 |
| — | hanukkah-flights-2026.html | טיסות זולות לחנוכה 2026 | Aug 20, 2026 |
| — | election-long-weekend-october-2026.html | סופ״ש ארוך בבחירות 2026 — 24–28 באוקטובר (TASK-ELEC-FLIGHTS; neutral, no politics; tp-blocks incl. car; car.lior-ai.com cross-link) | Sep 3, 2026 |

## Short URLs Created
- s.lior-ai.com/tishrei26 → flights.lior-ai.com/blog/tishrei-flights-2026.html

## X Posts
- Tweet ID: 2087879851034193925 — Tishrei flights article promo (Aug 13, 2026)

## Technical Notes
- All blog posts: Hebrew RTL, Heebo font, inline accessibility widget
- JSON-LD: Article + FAQPage schemas
- Sitemap: sitemap.xml (manually updated)
- Blog index: blog/index.html (cards, newest first)
- OG image: stored in Supabase storage (lior-ai-assets/og-flights.png)
- Post to X: via Supabase Edge Function `post-to-x`
- Short URLs: Supabase `short_links` table (code, target_url, title)
- Do NOT use word "כלי" in Hebrew content

## Tishrei / Rosh Hashana 5787 — Verified Dates (Aug 23, 2026)
Computed from the Hebrew calendar, not copied from prior-year content:
- Erev Rosh Hashana: **Fri 11 Sep 2026**
- Rosh Hashana: **Sat–Sun 12–13 Sep 2026**
- Erev Yom Kippur: Sun 20 Sep · Yom Kippur: **Mon 21 Sep 2026**
- Erev Sukkot: Fri 25 Sep · Sukkot I: **Sat 26 Sep** · Simchat Torah: **Sat 3 Oct 2026**
- Practical implication: RH falls on Shabbat → natural break is Fri–Sun (3 days, 0 vacation days);
  +1 day off Mon 14.9 → 4 days. Sukkot chol hamoed Sun 27.9 – Fri 2.10 is the real week off.

### ⚠️ Bug fixed Aug 23, 2026
`tishrei-flights-2026.html` originally listed RH as 22–23 Sep, YK 1 Oct, Sukkot 6–12 Oct —
those are the **2025** dates. Corrected to the 2026 dates above (3 body locations + FAQ JSON-LD
was unaffected; `dateModified` bumped to 2026-08-23).
**Lesson: always compute holiday dates for the target year; do not carry them over between articles.**

## Article Template Notes (Aug 23, 2026)
- Canonical CSS + accessibility widget: copy from `hanukkah-flights-2026.html` (clean version).
  The a11y block in `tishrei/greece/black-friday` articles is truncated/broken HTML — fix if touched.
- New articles include 3 JSON-LD blocks: Article + FAQPage + BreadcrumbList.
- All new articles carry a price-disclaimer line (estimates as of Aug 2026, verify before booking).
- Generator scripts used: /tmp/gen/build.py + a1..a6.py (not committed).
