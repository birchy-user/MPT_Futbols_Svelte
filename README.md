## PD2 kursā "DatZ5032 : Modernās programmēšanas tehnoloģijas"
## Autors: Roberts Pelle rp18023

<br />

# Kā palaist projektu
## 1. Lejupielādē visas nepieciešamās pakotnes:
```bash
npm install
```

## 2. Izvēlas vidi, kādā palaist projektu:
```bash
# 2.1. Izstrādes (dev) vide:
npm run dev
# ... lai varētu uzreiz atvērt vietni jaunā cilnē:
npm run dev -- --open

# Rezultātā tiks iedarbināts lokāls dev serveris, kas būs pieejams saitē http://localhost:5173/

# 2.2. Gatava produkcijas (production) vide:
npm run build
# ... lai to varētu atvērt vaļā un apskatīt:
npm run preview
```