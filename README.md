# Report vendite e clienti (Fake Store)

Applicazione che recupera i dati da [Fake Store API](https://fakestoreapi.com/) (`/products`, `/carts`, `/users`) e produce due report in JSON:

1. **Top 3 prodotti più venduti** (ranking per unità vendute)
2. **Top 3 clienti per volume di acquisto** (ranking per spesa totale)

Ogni report contiene la classifica per due periodi: **all time** e **ultimo mese**.

## Requisiti

- Node.js 18 o superiore (serve `fetch` nativo)
- npm

## Installazione

```bash
git clone <url-del-repository>
cd <nome-cartella>
npm install
```

## Avvio

```bash
npm start
```

Se nel `package.json` non c'è lo script `start`, compila ed esegui a mano:

```bash
npx tsc
node dist/main.js
```

I due report vengono stampati in console come JSON (primo il report prodotti, poi il report clienti).

## Struttura del progetto

| File | Contenuto |
|------|-----------|
| `type.ts` | Tipi TypeScript (prodotti, carrelli, utenti, report) |
| `api.ts` | Chiamate a Fake Store API |
| `logic.ts` | Calcolo dell'intervallo, classifiche e costruzione dei report |
| `main.ts` | Punto di ingresso: scarica i dati e stampa i report |

## Come ho definito «ultimo mese»

L'ultimo mese è l'intervallo che va da **un mese prima** alla **data dell'ordine più recente presente nei dati** (compresi gli estremi). Non si usa la data di oggi perché i dati di Fake Store sono statici e risalgono al 2020.

## Regole di ranking

- **Prodotti:** ordinati per unità vendute (decrescente). A parità: maggior fatturato, poi id più basso.
- **Clienti:** ordinati per spesa totale (decrescente). A parità: più ordini, poi più pezzi acquistati, poi id più basso.
- In classifica entrano **solo** prodotti con almeno 1 unità venduta e clienti con almeno 1 ordine nel periodo, quindi possono esserci meno di 3 elementi.
- Fatturato e spesa sono arrotondati a 2 decimali.

## Prodotti o utenti assenti dal catalogo/anagrafica

Un prodotto o un utente presente in un carrello ma non in `/products` o `/users` **non fa crashare il programma**: i prodotti sconosciuti contribuiscono 0 alla spesa (i pezzi vengono comunque contati) e gli utenti sconosciuti non compaiono in classifica.

## Struttura del JSON

```json
{
  "report": "top_3_prodotti",
  "generato_il": "2026-10-28T10:00:00.000Z",
  "data_riferimento": "2020-03-02T00:00:00.000Z",
  "all_time": {
    "intervallo": null,
    "classifica": [
      { "rank": 1, "id": 3, "titolo": "...", "categoria": "...", "prezzo_unitario": 0, "unita": 0, "fatturato": 0 }
    ]
  },
  "ultimo_mese": {
    "intervallo": {
      "inizio": "2020-02-02T00:00:00.000Z",
      "fine": "2020-03-02T00:00:00.000Z"
    },
    "classifica": []
  }
}
```

- `report`: etichetta che identifica il report (`top_3_prodotti` o `top_3_clienti`)
- `generato_il`: momento di generazione
- `data_riferimento`: data dell'ordine più recente, usata come ancoraggio per l'ultimo mese
- `all_time.intervallo`: sempre `null` (nessun limite temporale)
- `ultimo_mese.intervallo`: inizio e fine del periodo

Il report clienti ha la stessa struttura; ogni elemento della classifica contiene `rank`, `id`, `username`, `nome`, `email`, `ordini`, `quantita` e `spesa_totale`.