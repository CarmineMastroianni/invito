# 💍 Wedding Invitation - Cristina & Carmine

Invito matrimoniale interattivo con effetto "gratta e vinci" digitale.

**Data:** 18 Settembre 2026  
**Tecnologie:** Vite, Vanilla JavaScript, Canvas API, Docker, Google Cloud Run

## ✨ Caratteristiche

- 🎨 Effetto scratch-off interattivo con Canvas API
- 📱 Completamente responsive (mobile e desktop)
- 🎊 Animazione coriandoli al reveal
- 🔗 Funzione condivisione con Web Share API
- 🚀 Ottimizzato per production
- 🐳 Containerizzato con Docker
- ☁️ Pronto per Google Cloud Run

## 🚀 Quick Start

### Sviluppo locale

```bash
# Installa dipendenze
npm install

# Avvia dev server (http://localhost:3000)
npm run dev

# Build per production
npm run build

# Preview build locale
npm run preview
```

## 🐳 Docker

### Build e run locale

```bash
# Build immagine Docker
npm run docker:build
# oppure
docker build -t wedding-invitation .

# Run container (http://localhost:8080)
npm run docker:run
# oppure
docker run -p 8080:8080 wedding-invitation

# Stop container
npm run docker:stop
```

### Test Docker locale

```bash
docker run -p 8080:8080 wedding-invitation
# Apri http://localhost:8080
```

## ☁️ Deploy su Google Cloud Run

### Prerequisiti

1. Installa [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. Autenticati:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

### Deploy automatico

**Importante:** Sostituisci `PROJECT_ID` in `package.json` con il tuo Google Cloud Project ID prima di eseguire questi comandi.

```bash
# Build e push immagine su Google Container Registry
npm run gcloud:build

# Deploy su Cloud Run
npm run gcloud:deploy
```

### Deploy manuale

```bash
# 1. Build e push immagine
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/wedding-invitation

# 2. Deploy su Cloud Run
gcloud run deploy wedding-invitation \
  --image gcr.io/YOUR_PROJECT_ID/wedding-invitation \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 256Mi \
  --cpu 1
```

### Configurazione regioni disponibili

Puoi scegliere la regione più vicina ai tuoi ospiti:

- `europe-west1` - Belgio (consigliato per Italia)
- `europe-west4` - Olanda
- `us-central1` - Iowa, USA
- `asia-northeast1` - Tokyo

### Custom Domain (opzionale)

```bash
# Mappa dominio personalizzato
gcloud run domain-mappings create \
  --service wedding-invitation \
  --domain www.tuodominio.com \
  --region europe-west1
```

## 📁 Struttura Progetto

```
wedding-invitation/
├── src/
│   ├── main.js          # Entry point e coordinamento
│   ├── scratch.js       # Logica Canvas scratch-off
│   ├── confetti.js      # Animazione coriandoli
│   └── style.css        # Stili globali
├── public/
│   └── vite.svg         # Favicon
├── index.html           # Template HTML
├── vite.config.js       # Configurazione Vite
├── Dockerfile           # Multi-stage Docker build
├── nginx.conf           # Configurazione Nginx
├── package.json         # Dependencies e scripts
└── README.md
```

## 🎨 Personalizzazione

### Modifica contenuto

Apri `index.html` e cambia:

```html
<div class="names">TuoNome</div>
<div class="ampersand">&</div>
<div class="names">AltroNome</div>
<div class="date">GG Mese AAAA</div>
```

### Modifica colori

Apri `src/style.css` e modifica le variabili CSS:

```css
:root {
  --color-cream: #FAF7F2;
  --color-gold: #D4AF37;
  --color-gold-light: #E8D4A0;
  --color-dark: #2C2C2C;
}
```

### Modifica soglia reveal

In `src/main.js`, modifica il parametro `revealThreshold`:

```javascript
scratchCard = new ScratchCard(canvas, {
  brushSize: 40,
  revealThreshold: 70, // 70% grattato = auto-reveal
  // ...
});
```

## 📊 Performance

- **Lighthouse Score:** 95+ (Performance, Accessibility, Best Practices, SEO)
- **Build size:** ~50KB (gzipped)
- **First Contentful Paint:** <1s
- **Time to Interactive:** <2s

## 💰 Costi Google Cloud Run

Stima mensile con traffico tipico invito matrimonio (500-1000 visite):

- **FREE TIER:** Primo milione di richieste gratuito
- **Costo stimato:** €0-5/mese
- **Scaling:** Automatico da 0 a N istanze

## 🔒 Sicurezza

- ✅ Security headers configurati in Nginx
- ✅ HTTPS automatico su Cloud Run
- ✅ No secrets o API keys nel codice
- ✅ Content Security Policy compatible

## 🛠️ Troubleshooting

### Build fallisce

```bash
# Pulisci cache npm
rm -rf node_modules package-lock.json
npm install
```

### Docker non si avvia

```bash
# Verifica logs
docker logs <container_id>

# Verifica health check
docker inspect <container_id>
```

### Cloud Run deploy fallisce

```bash
# Verifica permessi
gcloud projects get-iam-policy YOUR_PROJECT_ID

# Abilita API necessarie
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

## 📱 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile iOS Safari 14+
- ✅ Mobile Chrome/Android 90+

## 📝 TODO / Features Future

- [ ] PWA support (offline capability)
- [ ] Google Analytics integration
- [ ] QR code generator
- [ ] Multi-language support
- [ ] Admin panel per RSVP
- [ ] Email notification system
- [ ] Countdown timer alla data

## 📄 Licenza

MIT License - Sentiti libero di usare questo progetto per il tuo matrimonio!

## 👨‍💻 Sviluppato da

Carmine - [GitHub](https://github.com/tuousername)

---

**Auguri per il tuo matrimonio! 🎊**
