# Visiplus - Kanban Node.js Server -  CECI A ETE REALISE A L AIDE DE DIFFERENTES IA, DOCUMENTATION RENDER, MONGO.

Serveur Express avec MongoDB pour application Kanban.

# Guide de Déploiement Deploiement.md

Ce guide décrit comment installer, exécuter et déployer l'application en local, dans Docker, et en production.


## Prérequis

- Node.js (version 18 ou supérieure)
- Docker Desktop
- Docker HUB
- Accès compte Render
- Accès compte Mongo Atlas
- Mongo Compass (local, production)
- npm ou yarn

## Installation

1. Installer les dépendances :
```bash
npm install
```


# deux configurations existe Developpement et Production
 
# docker-compose.yml      /  environnement mongo commun
# docker-compose.dev.yml  / application pour le developpement
# docker-compose.prod.yml / application pour ke serveur de production


2. Créer un fichier `.env` pour les tests locaux
````.env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/visiplus
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_EXPIRES_IN=20d
CORS_ORIGIN=*
DOTENV_CONFIG_QUIET=true
```` 

3. Créer un fichier `.env.docker` à la racine du projet 
```env.docker
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://root:example@mongo:27017/visiplus?authSource=admin 
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_EXPIRES_IN=20d
CORS_ORIGIN=*
```

4. Création + déclenchement conteneur en local - Developpement
```bash
docker-compose -f docker-compose.yml +docker-compose.dev.yml up --build 
```
# deux conteneurs sont créés et reliés par app-network l'application et la BDD MongoDB

# mongoDB est persistant avec la création d'un volume (défini dans le docker-compose)
```
 volumes:
      - mongo_data:/data/db
```


5. la création de l'image de production et le push sur DockHub se fait uniquement via une Pull request de development vers master
# ceci permet de ne pas faire des rebuild de l'image à chaque push de la branche development 
# récuperation de l'image build via le dev
# l'image est pull vers l'environnement de production après validation CI
.github\workflow\ci_cd.yml

# if: ${{ github.event_name == 'pull_request' && github.event.pull_request.base.ref == 'master' && github.event.pull_request.head.ref == 'development' }}
  seul les pull_request de development vers master engendre Build and push Docker image
                                         
   

6. RENDER fait un pull de l'image DockerHUB
# configuration pour prendre en compte l'image via DockerHub et pas de rebuild
# configuration MongoDB Atlas cf jlarpy_latest.env pour l'accès à mongoDb Atlas
# accès prod url : https://jlarpy-latest.onrender.com
# test des API auth, Columns, Ofs réalisé : OK

# si serveur de production propre :  docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d pour récuprérer l'image


architecture final : 

DEV
docker-compose.dev.yml
        │
        │ build local
        ▼
   tests locaux

        │
        │ push git
        ▼

CI/CD (GitHub Actions)
        │
        │ tests
        │ docker build (push → PR → merge)
        │ docker push
        ▼

DockerHub
        │
        │
        ▼

PROD SERVER RENDER
docker-compose.prod.yml
image: nailsmith78/jlarpy:latest
docker pull
↓
run container /!\ Pas de run du container Mongo (Render ne gere pas les multiconteneur)



# Rappel des commandes
docker-compose -f docker-compose.dev.yml up --build   / Construit les images et démarre les conteneurs
docker-compose -f docker-compose.dev.yml down         / Arrête et supprime les conteneurs
docker-compose -f docker-compose.dev.yml logs -f      / affiche les logs de l'application -  ceci est déjà présent dans votre terminal
docker images                                         / lister vos images
docker ps                                             / lister vos conteneurs