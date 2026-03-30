# Visiplus - Kanban Node.js Server -  CECI A ETE REALISE A L AIDE DE DIFFERENTES IA, DOCUMENTATION RENDER, MONGO.

Serveur Express avec MongoDB pour application Kanban.

# Guide d'intégration continue CI_CD_STRATEGIE.md -  la partie CD sera fait dans Deploiement_guide.md

Ce guide décrit comment installer, exécuter les tests d'intégration de l'application en local, en mode developpement


## Structure du projet


## Prérequis

- Node.js (version 18 ou supérieure)
- MongoDB (local ou Atlas)
- npm ou yarn

## Installation

1. Installer les dépendances :
```bash
npm install
```
# Stratégie CI/CD
## Objectifs
- **Automatisation** :Automatiser le déploiement des changements de code en production pour réduire le temps de mise sur le marché , améliorer la qualité des déploiements et eviter les interventions manuelles
- **Fiabilité** : Garantir des déploiements stables et reproductibles.
- **Qualité** : Intégrer des tests automatiques pour détecter les régressions rapidement et réduire les coûts de développement
- 
## Déclencheurs du Pipeline
- **Push** sur la branche de developpement `development`.
- **Pull Request** vers la branche principale : `master`   // Attention le push reste accessible sur master pour le moment.
  
## Étapes Principales
1. **Installation** : Installation des dépendances et outils nécessaires.
2. **Test** : Exécution des tests unitaires, d’intégration et de non-régression.
  repertoire ./tests
   1. app.test.ts
   2. auth.test.ts
   3. columns.test.ts
   4. ofs.test.ts
3. **Build** : Compilation et création des images Docker et push vers DockerHub.
4. **Déploiement** : Déploiement sur les environnements production via Render + MongoDb Atlas
   
## extrait du pipeline fichier Ci_Cd.YML du 
on:
  push:
    branches: ["development"]
  pull_request:
    branches: ["master"]


## gestion des secrets : 
# .env + .env.docker pour gérer les environnements distinct entre le local et l'image docker
# utilisation des variables dans le Yaml Ci_cd
## env:
          JWT_SECRET: ${{ secrets.JWT_SECRET }}      # Injecte le secret
          MONGODB_URI: ${{ secrets.MONGODB_URI }}    # Injecte l'URI MongoDB
          NODE_ENV: test             
# déclaration des variables d'environnement dans GITHUB , DOCKERHUB, RENDER

