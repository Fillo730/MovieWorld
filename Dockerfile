# syntax=docker/dockerfile:1
#
# Build unico: l'immagine finale contiene sia l'API .NET che i file statici
# di Angular, serviti dallo stesso processo Kestrel (nessun Nginx separato).

# ---- Stage 1: build del frontend Angular ----
FROM node:20-alpine AS frontend-build
WORKDIR /frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/. .
RUN npm run build -- --configuration production

# ---- Stage 2: build del backend .NET ----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /src

COPY api/MovieWorld.csproj ./
RUN dotnet restore MovieWorld.csproj

COPY api/. .
RUN dotnet publish MovieWorld.csproj -c Release -o /app/publish --no-restore

# ---- Stage 3: runtime ----
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=backend-build /app/publish .

# File statici Angular pubblicati da Kestrel (UseDefaultFiles/UseStaticFiles in Program.cs)
COPY --from=frontend-build /frontend/dist/HelloWorld/browser ./wwwroot

# Il database SQLite non viene spedito nell'immagine: all'avvio l'app applica le
# migrazioni e, se il DB è vuoto, lo popola da Data/SeedData.sql (copiato nella
# publish output da MovieWorld.csproj).

ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080

# Render (e altri host) iniettano la porta da ascoltare tramite $PORT.
ENTRYPOINT ["/bin/sh", "-c", "ASPNETCORE_URLS=http://+:${PORT:-8080} dotnet MovieWorld.dll"]
