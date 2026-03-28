# Artizan Lemn - Website Next.js

Website premium pentru brandul romanesc de mobilier din lemn masiv `Artizan Lemn`.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Supabase (DB + Storage)
- Resend (email notificari)

## Rulare locala

Din `G:\site Radu\artizanlemn-app`:

```bash
npm install
npm run dev
```

Aplicatia porneste la [http://localhost:3000](http://localhost:3000).

## Scripturi utile

```bash
npm run lint
npm run build
npm run start
npm run build:catalog
npm run seed:catalog:dry-run
npm run seed:catalog
```

## Structura principala

- `app` - pagini App Router, metadata si API routes
- `components/layout` - header si footer
- `components/ui` - primitive reutilizabile
- `components/forms` - formulare contact si comanda mobilier
- `components/admin` - interfata admin
- `data` - continut fallback local
- `types` - tipuri TypeScript
- `lib` - utilitare, validare, actiuni, email, Supabase
- `public/images` - imagini organizate pentru website

## Configurare mediu

Copiaza `.env.local.example` in `.env.local` si completeaza valorile:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PRODUCT_IMAGES_BUCKET` (optional, implicit `catalog-images` pentru upload imagini produse din admin)
- `RESEND_API_KEY`
- `NOTIFICATION_EMAIL_FROM` (ex: `Artizan Lemn <noreply@artizanlemn.ro>`, domeniu verificat in Resend)
- `NOTIFICATION_EMAIL` (una sau mai multe adrese separate prin virgula)
- `WHATSAPP_ACCESS_TOKEN` (optional, pentru trimitere directa PDF in WhatsApp Business API)
- `WHATSAPP_PHONE_NUMBER_ID` (optional, ID numar WhatsApp Business Cloud)
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_AUTH_SECRET`

## Setup SQL in Supabase

Ruleaza in Supabase SQL Editor:

1. `docs/supabase-inquiries-setup.sql` pentru cereri + bucket atasamente
2. `docs/supabase-products-admin-setup.sql` pentru CRUD produse in admin
3. `docs/supabase-offers-setup.sql` pentru tabelele de ofertare (`offers`, `offer_items`, revizii, audit)

## Fluxuri active

- `/comanda-mobilier`:
  - validare client + server
  - upload fisiere in bucket `inquiry-attachments`
  - insert in tabela `inquiries`
  - notificare email prin Resend

- `/admin/produse`:
  - acces doar dupa login admin (cookie de sesiune HttpOnly)
  - listare produse persistente din `catalog_products`
  - adaugare produs nou (persistenta reala)
  - editare produs existent (persistenta reala)
  - upload imagini direct din formular in Supabase Storage (bucket public)
  - fallback local daca Supabase nu este configurat

## Nota de securitate

Zona `/admin` si endpoint-urile `/api/admin/*` sunt protejate prin autentificare server-side.
