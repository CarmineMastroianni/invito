# Deployment su Google Cloud Run

Questa guida ti aiuterà a deployare l'applicazione Wedding Invitation su Google Cloud Run.

## Prerequisiti

1. **Account Google Cloud Platform**
   - Crea un account su [Google Cloud](https://cloud.google.com/)
   - Crea un nuovo progetto o usa uno esistente
   - Abilita la fatturazione (Cloud Run offre un tier gratuito generoso)

2. **Google Cloud SDK (gcloud CLI)**
   ```bash
   # macOS
   brew install google-cloud-sdk

   # Linux
   curl https://sdk.cloud.google.com | bash

   # Windows
   # Scarica l'installer da: https://cloud.google.com/sdk/docs/install
   ```

3. **Autenticazione**
   ```bash
   # Login a Google Cloud
   gcloud auth login

   # Configura il progetto
   gcloud config set project YOUR_PROJECT_ID

   # Verifica la configurazione
   gcloud config list
   ```

## Metodo 1: Deployment Automatico (Consigliato)

### Usa lo script di deployment

```bash
./deploy-cloudrun.sh
```

Lo script eseguirà automaticamente:
- Verifica dei prerequisiti
- Abilitazione delle API necessarie
- Build dell'immagine Docker con Cloud Build
- Deploy su Cloud Run
- Configurazione del servizio

## Metodo 2: Deployment Manuale

### Step 1: Abilita le API necessarie

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Step 2: Build dell'immagine

```bash
# Build con Cloud Build (automatica)
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/wedding-invitation

# Oppure build locale e push
docker build -t gcr.io/YOUR_PROJECT_ID/wedding-invitation .
docker push gcr.io/YOUR_PROJECT_ID/wedding-invitation
```

### Step 3: Deploy su Cloud Run

```bash
gcloud run deploy wedding-invitation \
  --image gcr.io/YOUR_PROJECT_ID/wedding-invitation \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 256Mi \
  --cpu 1 \
  --max-instances 10 \
  --min-instances 0
```

## Metodo 3: Deployment con Cloud Build (CI/CD)

### Configurazione Cloud Build Trigger

1. **Collega il repository GitHub**
   ```bash
   # Nella console di Cloud Build, vai su Triggers
   # Clicca "Connect Repository" e segui la procedura
   ```

2. **Crea un trigger automatico**
   ```bash
   gcloud builds triggers create github \
     --repo-name=YOUR_REPO_NAME \
     --repo-owner=YOUR_GITHUB_USERNAME \
     --branch-pattern="^main$" \
     --build-config=cloudbuild.yaml
   ```

3. **Deploy automatico ad ogni push su main**
   - Ogni commit su `main` trigghererà automaticamente la build e il deploy

## Configurazione Avanzata

### Variabili d'Ambiente

Se hai bisogno di variabili d'ambiente:

```bash
gcloud run deploy wedding-invitation \
  --image gcr.io/YOUR_PROJECT_ID/wedding-invitation \
  --set-env-vars="KEY1=value1,KEY2=value2"
```

### Custom Domain

1. **Mappa un dominio personalizzato**
   ```bash
   gcloud run domain-mappings create \
     --service wedding-invitation \
     --domain www.yourdomain.com \
     --region europe-west1
   ```

2. **Segui le istruzioni per configurare i DNS records**

### Regioni Disponibili

Cloud Run è disponibile in diverse regioni. Per l'Europa:
- `europe-west1` (Belgio) - Default
- `europe-west4` (Paesi Bassi)
- `europe-west3` (Francoforte)
- `europe-southwest1` (Madrid)

## Monitoraggio e Log

### Visualizza i log

```bash
# Log in tempo reale
gcloud run services logs tail wedding-invitation --region europe-west1

# Ultimi 50 log
gcloud run services logs read wedding-invitation --region europe-west1 --limit 50
```

### Monitoring nella Console

Visita la [Google Cloud Console](https://console.cloud.google.com/run) per:
- Metriche di traffico
- Latenza
- Errori
- Utilizzo risorse

## Gestione del Servizio

### Aggiorna il servizio

```bash
# Dopo modifiche al codice, riesegui il deployment
./deploy-cloudrun.sh
```

### Visualizza informazioni sul servizio

```bash
gcloud run services describe wedding-invitation --region europe-west1
```

### Elimina il servizio

```bash
gcloud run services delete wedding-invitation --region europe-west1
```

## Costi e Limiti

### Free Tier (sempre gratuito)
- 2 milioni di richieste al mese
- 360,000 GB-secondi di memoria
- 180,000 vCPU-secondi
- 1 GB di traffico in uscita dal Nord America al mese

### Stima costi per questa applicazione
Con la configurazione attuale (256Mi RAM, 1 CPU):
- Per traffico medio/basso: **Gratis** (dentro il free tier)
- Per 1000 richieste/giorno: ~$0.50/mese
- Per 10000 richieste/giorno: ~$5/mese

## Troubleshooting

### Errore: "Permission denied"
```bash
# Assicurati di avere i permessi necessari
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="user:your-email@gmail.com" \
  --role="roles/run.admin"
```

### Errore: "API not enabled"
```bash
# Abilita le API manualmente
gcloud services enable cloudbuild.googleapis.com run.googleapis.com
```

### Container non parte
- Verifica che l'app ascolti sulla porta 8080
- Controlla i log: `gcloud run services logs read wedding-invitation`

## Risorse Utili

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Run Pricing](https://cloud.google.com/run/pricing)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Best Practices](https://cloud.google.com/run/docs/best-practices)

## Supporto

Per problemi o domande:
- Controlla i log del servizio
- Consulta la documentazione ufficiale
- Verifica lo status di Google Cloud: https://status.cloud.google.com/
