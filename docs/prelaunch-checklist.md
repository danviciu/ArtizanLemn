# Checklist pre-lansare Artizan Lemn

Ultima actualizare: 2026-03-18
Workspace: `G:\site Radu\artizanlemn-app`

## P0 - obligatoriu inainte de go-live

- [ ] Configureaza secretele de productie (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `NOTIFICATION_EMAIL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_AUTH_SECRET`).
- [ ] Seteaza credentiale admin puternice si un `ADMIN_AUTH_SECRET` lung, unic.
- [ ] Configureaza sender email valid pe domeniul propriu (nu fallback de test Resend).
- [ ] Verifica bucket-ul `inquiry-attachments` in Supabase (acces public doar pentru fisierele necesare).
- [ ] Verifica DNS + SSL pentru domeniul final (`artizanlemn.ro` + `www` daca e folosit).
- [ ] Ruleaza smoke test live:
  - [ ] `/`
  - [ ] `/produse`
  - [ ] `/produse/masa-cu-banci-h`
  - [ ] `/comanda-mobilier`
  - [ ] `/contact`
  - [ ] `/robots.txt`
  - [ ] `/sitemap.xml`
  - [ ] submit formular cerere (`/api/inquiries`) cu rezultat `success: true`
- [ ] Verifica redirectionarea catre `/admin-login` pentru utilizator neautentificat.

## P1 - recomandat inainte de trafic real

- [ ] Completeaza `socialLinks` in `data/navigation.ts` cu URL-uri reale (Instagram/Facebook/Pinterest), daca sunt disponibile.
- [ ] Activeaza monitorizare erori pentru runtime/API (Sentry sau alternativ).
- [ ] Configureaza backup periodic pentru baza Supabase.
- [ ] Ruleaza Lighthouse pe domeniul live si compara cu benchmark-ul local (`lighthouse-home.json`, `lighthouse-product.json`).

## P2 - dupa lansare (primele 7 zile)

- [ ] Urmareste erorile API si rata submit-urilor din formular.
- [ ] Optimizeaza performanta homepage (LCP/TBT), in special daca traficul mobil este dominant.
- [ ] Efectueaza o revizie SEO in Google Search Console (indexare, sitemap, pagini excluse).
