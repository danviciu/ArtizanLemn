# GA4 Conversion Events - Artizan Lemn

Acest proiect emite evenimentele de mai jos pentru trafic Google Ads Search.

## Evenimente recomandate ca "Key events" in GA4

1. `lead_form_submit`
   - Cand se trimite formularul din `/comanda-mobilier` sau `/contact`
   - Parametri utili: `form_name`, `lead_channel`, `utm_source`, `utm_medium`, `utm_campaign`

## Evenimente de suport funnel

1. `cta_click`
   - Click pe CTA-urile principale (hero, carduri, header, pagini produs)
   - Parametri: `track_label`, `track_location`, `track_type`, `href`

1. `contact_click`
   - Click pe telefon, WhatsApp, email
   - Parametri: `track_label`, `track_location`, `track_type`, `href`

## Recomandari rapide Google Ads

1. Marcheaza `lead_form_submit` ca eveniment principal de conversie in GA4.
1. Importeaza conversia in Google Ads si seteaza atribuirea data-driven.
1. Segmenteaza rapoartele dupa `utm_campaign` pentru paginile de landing noi:
   - `/mobilier-la-comanda`
   - `/paturi-din-lemn-masiv`
   - `/mese-din-lemn`
