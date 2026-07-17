# syntax=docker/dockerfile:1
#
# Build unico: l'immagine finale contiene sia l'API .NET che i file statici
# di Angular, serviti dallo stesso processo Kestrel (nessun Nginx separato).

# ---- Stage 1: build del frontend Angular ----
FROM node:20-alpine AS frontend-build
WORKDIR /frontend

COPY MovieWorld_FrontEnd/package.json MovieWorld_FrontEnd/package-lock.json ./
RUN npm ci

COPY MovieWorld_FrontEnd/. .
RUN npm run build -- --configuration production

# ---- Stage 2: build del backend .NET ----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /src

COPY MovieWorld_API/MovieWorld/MovieWorld.csproj ./
RUN dotnet restore MovieWorld.csproj

COPY MovieWorld_API/MovieWorld/. .
RUN dotnet publish MovieWorld.csproj -c Release -o /app/publish --no-restore

# ---- Stage 3: runtime ----
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=backend-build /app/publish .

# File statici Angular pubblicati da Kestrel (UseDefaultFiles/UseStaticFiles in Program.cs)
COPY --from=frontend-build /frontend/dist/HelloWorld/browser ./wwwroot

# Database SQLite già popolato (film, generi, cast, news, utenti, ordini di esempio),
# cosi il servizio non parte vuoto al primo deploy.
COPY MovieWorld_API/MovieWorld/MovieWorld.db ./MovieWorld.db

ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080

# Render (e altri host) iniettano la porta da ascoltare tramite $PORT.
ENTRYPOINT ["/bin/sh", "-c", "ASPNETCORE_URLS=http://+:${PORT:-8080} dotnet MovieWorld.dll"]
