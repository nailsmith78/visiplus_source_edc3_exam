# cette etude de cas a été réalisé avec l'aide de certaines IA comme Mistral ou chatGPT. Aucune IA noCode.
# la consultation de certains forums (reddit par exemple), la documentation des add on on permis d'aboutir à une version de l'étude de cas fonctionnel jusqu'au déploiement


# Dépot GIT : https://github.com/nailsmith78/visiplus_source_edc3_exam.git

# présentation du projet et du context
L’entreprise Jaydee  a développé une application interne appelée Jaydee Kanban, basée sur une API Node.js / Express 
connectée à une base de données MongoDB.  
Nous intervenons en tant que développeur DevOps chargé de préparer la mise en production de cette application.  
L’objectif est d’en assurer la testabilité, la sécurité et la reproductibilité du   
déploiement, tout en respectant les bonnes pratiques de maintenance et de   
documentation.

Nos actions : 
1. analyser un code Node.js existant afin d’en identifier les risques et la   
structure technique ;  
2. mettre en place quelques tests d’intégration pour garantir la fiabilité de   
l’API ;  
3. préparer un déploiement simple et reproductible, notamment via Docker ;  
4. rédiger une stratégie CI/CD adaptée au contexte de l’entreprise ;  
5. ajouter des mesures de sécurité concrètes dans l’application ;  
6. documenter l’ensemble du processus pour qu’un tiers puisse relancer le   
projet sans aide.


# ANALYSE_EXISTANT.md 

1. les dépendances principales  (package.json)
  1.1 Express   : permet de gérer l'API REST avec une nommenclature : Routes / controller / Middleware/ models
  1.2 TypeScript: Typage du code pour contrôler celui ci à la compilation
  1.3 Mongoose  : ODM permettant l’interaction avec MongoDB
  1.4 jsonwebtoken : Gestion de l'authentification via JWT (token)
  1.5 bcryptjs  : hashage des mots de passe
  
2. les dépendances secondaires
  2.1 dotenv    : Chargement des variables d’environnement depuis un fichier .env.
  2.2 cors      : Gestion des accès cross-origin.
  2.3 pino      : Journalisation des logs de l'application
  2.4 zod       : bibiothéque permettant la validation, le parsing de données, gestion des erreurs et gere le typage de TypeScript à partir de schema
  
3. les dépendances de Tests 
  3.1 Vitest    : Framework de tests unitaires et d’intégration pour l’API
  3.2 Supertest : Tests des API HTTP
  
  
4. les variables d'environnement (fichier .env)
  4.1 PORT : Port d’écoute du serveur Express
  4.2 MONGO_URI : Chaîne de connexion à la base de données MongoDB
  4.3 JWT_SECRET :Clé secrète utilisée pour signer et vérifier les Tokens
  4.4 JWT_EXPIRES_IN : Durée de validité des tokens JWT
  4.5 NODE_ENV : Définir l'environnement d’exécution (development, production, test)
  
5. les fichiers Clé du projet
  5.1 Points d’entrée
    5.1.1 src/main.ts   : Point de démarrage de l’application en appelant app.ts et server.ts
    5.1.2 src/app.ts    : Initialisation de l’application Express, middlewares globaux et routes
    5.1.3 src/server.ts : Création et lancement du serveur HTTP
  5.2 Routes
    5.2.1 src/routes/index.ts                         : Regroupe l’ensemble des routes de l’API
    5.2.2 src/routes/auth.routes.ts                   : Permet de gérer les routes liées l’authentification (login, register)
    5.2.3 src/routes/ofs.routes.ts, columns.routes.ts : Routes métier pour les colonnes et les taches
  5.3 Controllers
    5.3.1 src/controllers/auth.controller.ts                        : Logique d'authentification (login, register)
    5.3.2 src/controllers/ofs.controller.ts, columns.controller.ts  : Logique métier des ressources
  5.4 Models
    5.4.1 src/models/User.ts            : Modèle utilisateur
    5.4.2 src/models/OF.ts, Column.ts   : Modèles de données MongoDB
  5.5 Middleware
    5.5.1 src/middlewares/auth.middleware.ts      : Vérification des JWT
    5.5.2 src/middlewares/error.middleware.ts     : Gestion centralisée des erreurs avec zod
    5.5.3 src/middlewares/validate.middleware.ts  : Validation des entrées avec Zod
  5.6 Configuration
    5.6.1 src/config/env.ts     : Chargement et validation des variables d’environnement
    5.6.2 src/config/db.ts      : Connexion à la base de données MongoDB
    5.6.3 src/config/logger.ts  : Configuration pour les logs (info, debug, silent etc..) en fonction des environnements
  5.7 test
    5.7.1 tests/setup.ts                                      : setup de configuration pour utliser MongoMemoryServer avec vitest
    5.7.2 tests/helper.ts                                     : utilitaire permettant de créer un user, une colonne, une tache, de retourner un token
    5.7.3 tests/app.test.ts   /auth.test.ts   / ofs.test.ts   : présence de tests opérationnel
    
  A Noter que le projet ne comporte aucune structure de type FRONT.
  
# test d'intégration
tests/columns.test.ts : operationnel : npm test columns.test.ts

✓ tests/columns.test.ts (4 tests) 2480ms
   ✓ column (4)
     ✓ GET /api/Columns (2)
       ✓ Retourne un tableau vide si pas de colonne 287ms
       ✓ Retourne un body avec un data des colonnes présentes 162ms
     ✓ POST /api/columns (2)
       ✓ creation de colonne 243ms
       ✓ test si manque le name en insert 136ms
       
# CI_CD_STRATEGIE.md
# Visiplus - Kanban Node.js Server -  CECI A ETE REALISE A L AIDE DE DIFFERENTES IA, DOCUMENTATION RENDER, MONGO.

  # Guide d'intégration continue CI_CD_STRATEGIE.md -  la partie CD sera fait dans Deploiement_guide.md
  ## Prérequis

  - Node.js (version 18 ou supérieure)
  - GitHub (validation pullRequest)
  - Mongo Compass (local, production)
  - npm
  
  1. Stratégie CI/CD
    1.1 Objectifs
      **Automatisation** :Automatiser le déploiement des changements de code en production pour réduire le temps de mise sur le marché , améliorer la qualité des déploiements et eviter les interventions manuelles
      **Fiabilité** : Garantir des déploiements stables et reproductibles.
      **Qualité** : Intégrer des tests automatiques pour détecter les régressions rapidement et réduire les coûts de développement
    
    1.2 Déclencheurs du Pipeline
    - **Push** sur la branche de developpement `development`.
    - **Pull Request** vers la branche principale : `master`   // Attention le push reste accessible sur master pour le moment. Pas de contrainte 
      
    1.3 Étapes Principales - job - ci_cd.yml
      1.3.1 **Install** : Installation des dépendances et outils nécessaires.
      1.3.2 **Test** : Exécution des tests unitaires, d’intégration et de non-régression.
              /!\ ne peut s'executer si Install est False 
              repertoire ./tests
               A. app.test.ts
               B. auth.test.ts
               C. columns.test.ts
               D. ofs.test.ts
      1.3.3 **docker-build** : Compilation et création des images Docker et push vers DockerHub.
              /!\ ne peut s'executer si Test est False 
      1.3.4 **Déploiement** : Déploiement sur les environnements production via Render + MongoDb Atlas (donc non gérer dans notre cas, le déploiement se fera manuellement sur Render).
       
  2. Extrait du pipeline fichier Ci_Cd.YML du 
  on:
    push:
      branches: ["development"]
    pull_request:
      branches: ["master"]


  3. Gestion des secrets : 
  3.1 .env + .env.docker pour gérer les environnements distinct entre le local et l'image docker

  3.2 utilisation des variables dans le Yaml Ci_cd
  ## env:
            JWT_SECRET: ${{ secrets.JWT_SECRET }}      # Injecte le secret
            MONGODB_URI: ${{ secrets.MONGODB_URI }}    # Injecte l'URI MongoDB
            NODE_ENV: test             
  # déclaration des variables d'environnement dans GITHUB , DOCKERHUB, RENDER
  
  
# DEPLOIEMENT_GUIDE.md
# Visiplus - Kanban Node.js Server -  CECI A ETE REALISE A L AIDE DE DIFFERENTES IA, DOCUMENTATION RENDER, MONGO.

Ce guide décrit comment installer, exécuter et déployer l'application en local, dans Docker, et en production.

  ## Prérequis

  - Node.js (version 18 ou supérieure)
  - Docker Desktop
  - Docker HUB
  - Accès compte Render
  - Accès compte Mongo Atlas
  - Mongo Compass (local, production)
  - npm
`


  # deux configurations docker existe Developpement et Production
   
  1. docker-compose.yml      / environnement mongo commun
  2. docker-compose.dev.yml  / application pour le developpement (local)
  3. docker-compose.prod.yml / application pour le serveur de production

  # Gestion configuration des environnements
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

  3. Créer un fichier `.env.docker` à la racine du projet pour l'utilisation de conteneur
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

  # si serveur de production pour utilisation conteneur MongoDB :  docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d pour récuprérer l'image


  architecture finale : 

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



# NOTE_SECURITE.md.  

  1 Identifier deux risques techniques (ex. accès non autorisé, abus d’API, injection)
    1.1. Accès non autorisé : 
       les routes sont accessibles si on connait les liens API
       même si les données ne sont pas accessible si on a pas de token, 
       il est simple de s'enregistrer(POST /api/auth/register), d'avoir un token, de se logger.
       il sera très simple dès lors d'accèder aux données api/columns, api/ofs etc..
       
    2.2 Abus d’API / attaques par force brute
       Une personne peut envoyer un grand nombre de requêtes (login, register, etc.) pour saturer le serveur ou tenter de trouver les mots de passe.
       Cela peut provoquer un déni de service ou compromettre la sécurité des comptes.

  2 limitation des requêtes :express-rate-limit 
    2.1. npm install express-rate-limit
    2.2. ajout src/middlewares/security.middleware.js
    2.3. appel dans app.ts

  # Vérifier qu’une route protégée renvoie bien un code 429 avec une attaque  
  1. tests/attack.test.ts
  
  retour console : 
      reponse page : 429

     ✓ tests/attack.test.ts (1 test) 1553ms
       ✓ Security - Rate limit (1)
         ✓ suis je bloqué après 40 requetes 291ms

     Test Files  1 passed (1)
          Tests  1 passed (1)
       Start at  23:10:10
       Duration  3.50s (transform 273ms, setup 895ms, collect 622ms, tests 1.55s, environment 0ms, prepare 25ms)

  # Pour la limitation d'accès on pourra utiliser helmet 


