# Visiplus - Kanban Node.js Server - 

Serveur Express avec MongoDB pour application Kanban.

# Guide de Déploiement Deploiement.md

Ce guide décrit comment installer, exécuter et déployer l'application en local, dans Docker, et en production.


## Structure du projet

```
├── src/
│   ├── main.ts                 # Entrée principale (création du serveur)
│   ├── server.ts               # Configuration Express
│   ├── app.ts                  # Exporte Express app (pour tests)
│   ├── config/
│   │   ├── env.ts              # Chargement et validation des variables d'environnement
│   │   ├── db.ts               # Connexion base de données (Mongoose)
│   │   └── logger.ts           # Logger (Pino)
│   ├── models/
│   │   ├── OF.ts               # Modèle Ordre de Fabrication
│   │   ├── Column.ts           # Modèle Colonne
│   │   └── User.ts             # Modèle Utilisateur
│   ├── routes/
│   │   ├── index.ts            # Regroupe les routes (OF, Columns, Auth)
│   │   ├── ofs.routes.ts
│   │   ├── columns.routes.ts
│   │   └── auth.routes.ts
│   ├── controllers/
│   │   ├── ofs.controller.ts   # Appelle les services (move, create, delete)
│   │   └── columns.controller.ts
│   └── middlewares/
│       ├── auth.middleware.ts  # Vérification JWT
│       ├── error.middleware.ts # Gestion globale des erreurs
│       └── validate.middleware.ts # Validation Zod
├── vitest.config.ts
├── tsconfig.json
└── package.json
```

## Prérequis

- Node.js (version 18 ou supérieure)
- MongoDB (local ou Atlas)
- npm ou yarn

## Installation

1. Installer les dépendances :
```bash
npm install
```


# deux configurations existe Developpement et Production
 
# docker-compose.yml      /  environnement mongo commun
# docker-compose.dev.yml  / application pour le developpement
# docker-compose.prod.yml / applicaiton pour la production


2. Créer un fichier `.env.docker` à la racine du projet 
```env.docker
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://root:example@mongo:27017/visiplus?authSource=admin 
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_EXPIRES_IN=20d
CORS_ORIGIN=*
```

3. lancement developpement
```bash
docker-compose -f docker-compose.yml +docker-compose.dev.yml up --build 
```
# deux conteneurs sont créés et relié par app-network l'application et la BDD MongoDB

# mongoDB est persistant avec la création d'un volume (défini dans le docker-compose)
 volumes:
      - mongo_data:/data/db
```

3. l'image de production se fait uniquement via une Pull request de development vers master
# récuperation de l'image build via le dev
# l'image est pull vers l'environnement de production après validation CI
.github\workflow\ci_cd.yml


# Rappel des commandes
docker-compose -f docker-compose.dev.yml up --build   / Construit les images et démarre les conteneurs
docker-compose -f docker-compose.dev.yml down         / Arrête et supprime les conteneurs
docker-compose -f docker-compose.dev.yml logs -f      / affiche les logs de l'application -  ceci est déjà présent dans votre terminal
docker images                                         / lister vos images
docker ps                                             / lister vos conteneurs


4. lancement Production via une Pull request de development vers master


# résumé des actions : 
# Dev branch (development) :push autorisé tests uniquement → pas de build Docker
# PR vers master : tests uniquement → vérifie que le merge est safe (pas de push - non réalisé pour le moment)
# Merge master : build + push Docker → image prod officielle
# Pas de rebuild inutile si le dev modifie seulement du code JS/TS
#Les secrets (JWT_SECRET, MONGODB_URI, DOCKER_HUB_*) sont injectés via GitHub Actions, pas dans le repo
