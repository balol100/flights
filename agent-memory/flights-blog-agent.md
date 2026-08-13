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
