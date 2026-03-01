# Utilise une image officielle Node.js en version LTS
FROM node:20-alpine as builder

# Définit le répertoire de travail dans le conteneur
WORKDIR /app


COPY package*.json ./

# Installe les dépendances 
RUN npm install
# Copie le reste du code source
COPY . .
RUN npm run build


# Étape 2 : Runtime (exécution du code compilé)
FROM node:20-alpine 
WORKDIR /app
COPY package*.json ./
RUN npm install --production  # Installe uniquement les dépendances de production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modul

# Définit les variables d'environnement (pour la production)
ENV NODE_ENV=production \
    PORT=3000 \
    MONGODB_URI=mongodb://mongo:27017/visiplus \
    JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long \
    JWT_EXPIRES_IN=20d \
    CORS_ORIGIN=*


STOPSIGNAL SIGTERM
HEALTHCHECK --interval=30s --timeout=5s \
CMD curl --fail http://localhost || exit 1

# Expose le port utilisé par l'application (à adapter selon votre config)
EXPOSE 3000

# Commande pour lancer l'application
CMD ["npm", "start"]