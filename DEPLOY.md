# Deploy su Render

Un unico `Dockerfile` alla radice del repo produce un'unica immagine: l'API .NET
serve sia le rotte `/api/*` sia i file statici di Angular (build multi-stage:
`node` compila il frontend, `dotnet` compila/pubblica il backend, l'immagine
finale contiene solo il runtime ASP.NET con entrambi dentro). `MovieWorld.db`
già popolato (film, generi, cast, news, utenti e ordini di esempio) è incluso
nell'immagine.

## Deploy con Blueprint (`render.yaml`)

1. Su Render: **New > Blueprint**, seleziona questo repo. Render crea il servizio `movieworld` leggendo `render.yaml`.
2. Genera una chiave JWT robusta, es. `openssl rand -base64 64`, e impostala come variabile d'ambiente `Jwt__Key` sul servizio (richiesta al primo deploy, marcata come segreto — Render te la chiede in dashboard).
3. Deploy. Non serve configurare CORS o URL incrociati: frontend e API sono sullo stesso host/porta.

## Dati e persistenza — leggi con attenzione

Il database SQLite viene copiato **dentro l'immagine Docker** al momento della build, quindi ogni deploy parte già con il catalogo attuale (102 film, generi, cast, news, utenti e ordini) invece che vuoto.

Il piano gratuito di Render **non ha disco persistente**: qualsiasi scrittura fatta dall'app dopo l'avvio (nuovi film, ordini, utenti creati dall'admin in produzione) viene persa al riavvio/redeploy successivo, tornando allo stato "mockato" incluso nell'immagine. Per dati persistenti servirebbe un piano con Persistent Disk montato sulla working directory dell'API, oppure migrare a un database esterno (Postgres gestito da Render, incluso gratuitamente).

## Test locale con Docker Compose

```bash
export JWT_KEY="una-stringa-lunga-casuale"
docker compose up --build
```

App (frontend + API) su `http://localhost:8080`.
