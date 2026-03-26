# Plan program de ofertare - Artizan Lemn

## 1) Obiectiv
Construim un modul intern de ofertare care transforma cererile primite din site in oferte profesionale (PDF + istoric), cu trasabilitate completa de la cerere la comanda.

Rezultat urmarit:
- oferta clara pentru client (tehnic + comercial + legal)
- lucru rapid pentru atelier (estimare, revizii, aprobare)
- conversie mai buna din `cerere` in `comanda`

## 2) Baza de date existenta pe care o reutilizam
Datele din site care trebuie folosite direct:
- Catalog produse: `data/products.ts`
  - `title`, `category`, `woodTypes`, `finishes`, `tags`, `suitableFor`
- Categorii: `data/categories.ts`
  - clasificare si context comercial
- Flux cereri: `app/api/inquiries/route.ts` + `lib/validation/inquirySchema.ts`
  - campuri reale trimise de client: nume, telefon, email, titlu proiect, descriere, dimensiuni, spatiu, buget, termen, atasamente
- Statusuri operative existente: `types/admin.ts`
  - `nou -> in_analiza -> oferta_trimisa -> acceptata -> transformata_in_comanda`
- Date juridice companie: `data/legal.ts`
  - operator, CUI, Reg. Comert, contact

Observatie importanta:
- Cererile sunt persistate in Supabase.
- Statusurile si notele din zona admin sunt inca locale in UI (nu persistente) si trebuie mutate in backend pentru modulul de ofertare.

## 3) Flux functional propus (cap-coada)
1. Cerere noua
- intrare din `/comanda-mobilier`
- status initial `nou`

2. Pre-calificare
- validare minima: date contact, buget orientativ, termen, fezabilitate
- incadrare in categorie (din `categories.ts`)

3. Estimare interna
- selectare produse de referinta din catalog (similare)
- alegere material/finisaj/complexitate
- calcul cost estimat (material + manopera + accesorii + montaj + transport)

4. Generare oferta v1
- document PDF branduit + pagina web interna
- 1-3 variante (Basic / Standard / Premium)

5. Revizii oferta
- istoric versiuni (v1, v2, v3)
- comparatie diferente de pret, termen, materiale

6. Trimitere si urmarire
- status `oferta_trimisa`
- reminder automat daca nu exista raspuns in X zile

7. Acceptare
- clientul accepta oferta
- status `acceptata`
- conversie in comanda (`transformata_in_comanda`)

8. Predare catre executie
- creare in zona comenzi cu pret agreat, avans, termen

## 4) Model de date nou (Supabase) pentru ofertare
### Tabel `offers`
- `id` (uuid)
- `inquiry_id` (fk -> inquiries)
- `offer_number` (ex: AL-2026-0001)
- `version` (int)
- `status` (`draft`, `trimisa`, `acceptata`, `respinsa`, `expirata`)
- `currency` (RON)
- `subtotal`, `discount_value`, `tva_value`, `total`
- `valid_until` (data expirare oferta)
- `estimated_execution_days`
- `payment_terms` (text/json)
- `warranty_months` (int)
- `legal_clauses_snapshot` (jsonb)
- `created_by`, `created_at`, `updated_at`

### Tabel `offer_items`
- `id`, `offer_id` (fk)
- `line_no`
- `item_type` (`produs`, `serviciu`, `transport`, `montaj`)
- `title`, `description`
- `category_slug` (din `categories.ts`)
- `reference_product_slug` (optional, din `products.ts`)
- `wood_type`, `finish`
- `qty`, `unit`, `unit_price`, `line_total`
- `complexity_factor` (numeric)

### Tabel `offer_revisions`
- istoric modificari intre versiuni
- motiv schimbare
- cine a modificat

### Tabel `offer_activity_log`
- audit trail: creare, editare, trimitere, acceptare

### Tabel `pricing_catalog` (intern)
- tarife de referinta pe:
  - categorie
  - esenta lemn
  - finisaj
  - tip operatiune

## 5) Motor de pret (estimare coerenta pentru atelier)
Formula recomandata:
- Cost total = Materiale + Manopera + Feronerie/consumabile + Finisaj + Ambalare + Transport/Montaj + Rezerva risc + Marja

Reguli:
- coeficient complexitate (drept, curbat, sculptat, imbinari speciale)
- coeficient urgenta (termen scurt)
- coeficient locatie (transport/montaj)
- discount controlat (procent fix sau suma)

Output:
- breakdown intern complet
- clientul vede forma simplificata, clara, profesionala

## 6) Structura ofertei catre client (sa arate premium)
1. Antet brand
- logo, date firma, date de contact
- numar oferta, data emiterii, perioada de valabilitate

2. Context proiect
- rezumat cerere client
- obiectiv estetic + functional

3. Solutie propusa
- descriere piese
- materiale, esente, finisaje
- imagini de referinta din catalog (din `products.ts`)

4. Deviz comercial
- linii de cost (fara ambiguitati)
- subtotal, discount, TVA, total

5. Termene
- termen proiectare
- termen executie
- termen livrare/montaj

6. Conditii comerciale
- avans, transe, modalitati de plata
- conditii de actualizare daca se schimba tema

7. Garantie si mentenanta
- garantie produs
- recomandari de intretinere
- limitari de garantie

8. Clauze legale esentiale
- oferta nu este contract pana la acceptare scrisa
- valabilitatea ofertei
- exceptii pentru variatii naturale ale lemnului

9. CTA clar
- buton/link: Accept oferta
- buton/link: Solicita revizie

## 7) Cerinte juridice si conformitate (Romania)
Minim obligatoriu in oferta:
- identificare comerciant: denumire, CUI, Nr. Reg. Comert, sediu, contact
- data emitere + data expirare oferta
- moneda, TVA, total, conditii de plata
- clarificare ca produsul este executat la comanda (personalizat)
- clauza privind variatii naturale ale materialului lemnos
- termeni de livrare/montaj si conditii acces locatie
- clauza de forta majora si intarzieri imputabile tertilor
- politica garantie + conditii de utilizare/intretinere
- referinta GDPR (scop, baza legala, perioada stocare, contact)

Recomandari juridice specifice:
- dreptul de retragere pentru produse personalizate: exceptie conform OUG 34/2014, art. 16 lit. c (de confirmat textual cu jurist)
- includere linkuri ANPC/SAL deja existente in proiect
- validare finala template oferta cu avocat + contabil (fiscal/TVA/facturare)

## 8) UX intern (admin ofertare)
Ecran 1: Inbox cereri
- filtre pe status, buget, termen
- scor de prioritate (buget, complexitate, deadline)

Ecran 2: Builder oferta
- preia automat date din cerere
- adauga linii de deviz din sabloane
- selecteaza produse de referinta din catalog
- preview instant PDF

Ecran 3: Revizii
- timeline versiuni
- diff pret/termen/materiale

Ecran 4: Trimitere
- email + WhatsApp link
- status automat `oferta_trimisa`

Ecran 5: Conversie
- click `Transforma in comanda`
- precompletare in modulul `comenzi`

## 9) Automatizari utile
- reminder la 48h/96h dupa trimitere oferta
- alerta interna pentru oferte ce expira in 2 zile
- raport saptamanal: cereri noi, oferte trimise, rata acceptare
- dashboard KPI:
  - timp mediu cerere -> oferta
  - rata acceptare oferta
  - valoare medie oferta
  - motive respingere

## 10) Plan de implementare in etape
Etapa 1 (MVP, 2-3 saptamani)
- schema DB `offers` + `offer_items`
- creare oferta din cerere
- export PDF v1
- status persistente pentru cereri

Etapa 2 (2 saptamani)
- revizii oferta
- trimitere email + tracking vizualizare
- conversie in comanda

Etapa 3 (2 saptamani)
- motor de pret avansat
- sabloane pe categorii de produse
- dashboard KPI

Etapa 4 (hardening)
- audit juridic/fiscal
- testare E2E
- backup/restore + loguri complete

## 11) Riscuri si masuri
Risc: preturi neuniforme intre oferte
- Masura: `pricing_catalog` + reguli standard + aprobare manager

Risc: statusuri nealiniate intre cereri/oferte/comenzi
- Masura: masina de stari unica si tranzitii controlate

Risc: probleme juridice in formulare/clauze
- Masura: template legal versionat + review periodic

Risc: atasamente multe/mari
- Masura: limite deja definite (8 fisiere, 10MB) + cleanup automat

## 12) Deliverabile concrete
- modul `/admin/oferte` (nou)
- API pentru creare/editare/trimitere oferta
- template PDF profesional (RO)
- sabloane oferte pe categorii (mese, paturi, scari, exterior etc.)
- integrare statusuri cu `cereri` si `comenzi`
- checklist juridic semnat intern

## 13) Ce este gata pentru implementare imediata (din proiectul actual)
- date catalog produse/categorii
- flux de colectare cereri + upload atasamente
- baza legala publica in paginile de termen/GDPR
- structura admin cu statusuri deja familiarizate echipei

Urmatorul pas recomandat:
- implementare MVP ofertare pe schema de mai sus, pornind de la cererile din `inquiries`.
