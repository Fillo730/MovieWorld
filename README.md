# MovieWorld

MovieWorld è un e-commerce full-stack per la vendita di film: catalogo con ricerca e filtri avanzati, carrello, checkout multi-punto-vendita, area utente con ordini/recensioni/wishlist e un pannello di amministrazione completo.

## Stack tecnologico

**Backend**
- ASP.NET Core 8 Web API (C#)
- Entity Framework Core 8 + SQLite
- Autenticazione JWT
- BCrypt.Net per l'hashing delle password
- MailKit per l'invio email (relay SMTP, es. SendGrid)
- ClosedXML per l'export Excel

**Frontend**
- Angular 20 (standalone components, Signals)
- PrimeNG 20 + Bootstrap 5 per la UI pubblica
- Angular Material per il pannello admin
- ngx-translate per l'internazionalizzazione (it/en)
- Chart.js (ng2-charts) per le statistiche in dashboard

**Deploy**
- Build unico Docker: il frontend Angular viene compilato e servito come file statici dallo stesso processo Kestrel dell'API (nessun Nginx separato)
- `render.yaml` per il deploy su Render.com

## Funzionalità principali

- **Catalogo**: ricerca, filtri (nome, genere, anno, regista, attore, prezzo), ordinamento (rilevanza, voto, prezzo), export Excel
- **Barra di ricerca globale** in header con risultati live
- **Dettaglio film**: trailer, cast, film correlati, recensioni con voto a stelle, media voto
- **Wishlist**: aggiunta/rimozione dai cuoricini su ogni card, pagina dedicata
- **Home page**: hero con carosello film cult, sezione "Visti di recente" (localStorage), sezione "I più votati"
- **Carrello e checkout**: selezione punto vendita (anche per distanza geografica), codici sconto/coupon, email di conferma ordine
- **Area utente**: profilo con modifica dati, cambio password, reset password via email, notifiche email ordini, punto vendita preferito, storico ordini con filtri, storico recensioni, avatar generati automaticamente
- **Pannello Admin**: gestione utenti, film, cast, news, ordini, coupon sconto; dashboard statistiche (vendite, generi, utenti)

## Struttura del progetto

```
MovieWorld/
├── api/            API .NET 8 (Controllers, Services, Repositories, Models, Migrations)
├── frontend/        Applicazione Angular 20
├── Dockerfile        Build multi-stage (frontend + backend in un'unica immagine)
├── docker-compose.yml
└── render.yaml       Configurazione deploy Render.com
```

Il backend segue un'architettura a layer: `Controller → Service → Repository → EF Core DbContext`, con DTO e mapper dedicati per ogni entità.

## Avvio in locale

### Prerequisiti
- .NET 8 SDK
- Node.js 20+
- (opzionale) `dotnet-ef` CLI per le migrazioni: `dotnet tool install --global dotnet-ef`

### Backend

```bash
cd api
dotnet user-secrets set "Jwt:Key" "una-chiave-segreta-lunga-a-piacere"
dotnet run
```

L'API parte su `http://localhost:5246` e usa il database SQLite già presente (`api/MovieWorld.db`), popolato con dati di esempio (film, generi, cast, utenti, ordini).

Per applicare eventuali nuove migrazioni:

```bash
cd api
dotnet ef database update
```

### Frontend

```bash
cd frontend
npm install
npm start
```

L'app parte su `http://localhost:4200` e punta all'API su `http://localhost:5246` (vedi `frontend/src/app/constants/app.config.ts`).

### Invio email (opzionale)

L'invio email (conferma ordine, reset password) è disattivato finché non si configura un relay SMTP. Esempio con SendGrid, in `api/appsettings.Development.json`:

```json
"Email": {
  "Host": "smtp.sendgrid.net",
  "Port": "587",
  "Username": "apikey",
  "FromAddress": "tuo-indirizzo-verificato@example.com",
  "FromName": "MovieWorld"
}
```

La password/API key va impostata separatamente, senza committarla:

```bash
dotnet user-secrets set "Email:Password" "la-tua-api-key"
```

Se `Email:Host` non è configurato, il servizio logga un warning e non blocca mai il flusso principale (es. la creazione dell'ordine va comunque a buon fine anche senza email configurata).

## Deploy con Docker

```bash
JWT_KEY="una-chiave-segreta-lunga-a-piacere" docker compose up --build
```

L'immagine finale contiene sia l'API .NET che i file statici Angular pubblicati, serviti tutti dalla stessa porta (`8080` di default, configurabile con `PORT`).

## Note

- Il database SQLite viene committato nel repository per avere sempre dati di demo pronti all'uso in sviluppo e nel primo deploy.
- Le migrazioni EF Core si trovano in `api/Migrations`; ogni modifica al modello dati richiede una nuova migrazione (`dotnet ef migrations add NomeMigrazione`) seguita da `dotnet ef database update`.
