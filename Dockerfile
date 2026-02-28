# Utilise une image officielle Node.js en version LTS
FROM node:18-alpine

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances de production uniquement
RUN npm ci --only=development

# Copie le reste du code source
COPY . .

# Expose le port utilisé par l'application (à adapter selon votre config)
EXPOSE 3000

# Commande pour lancer l'application
CMD ["npm", "start"]