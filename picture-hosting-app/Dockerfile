# --- Builder Stage ---
    FROM node:18-alpine AS builder

    # Arbeitsverzeichnis setzen
    WORKDIR /app
    
    # Nur package.json und package-lock.json kopieren, um Layer Caching zu verbessern
    COPY package*.json ./
    
    # Nur Production-Abhängigkeiten installieren und Caches bereinigen
    RUN npm ci --production && npm cache clean --force
    
    # Quellcode kopieren und Next.js Projekt bauen
    COPY . .
    RUN npm run build
    
    # Unnötige Development-Abhängigkeiten entfernen
    RUN npm prune --production
    
    # --- Production Stage ---
    FROM gcr.io/distroless/nodejs18
    
    # Arbeitsverzeichnis setzen
    WORKDIR /app
    
    # Nur die notwendigen Dateien vom Build übernehmen
    COPY --from=builder /app/package*.json ./
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    
    # Port öffnen
    EXPOSE 3000
    
    # Startbefehl
    CMD ["npm", "start"]