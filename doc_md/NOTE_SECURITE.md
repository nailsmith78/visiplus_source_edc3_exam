# NOTE_SECURITE.md
# Identifier deux risques techniques (ex. accès non autorisé, abus d’API, injection)
1. Accès non autorisé : 
   les routes sont accessibles si on connait les liens API
   même si les données ne sont pas accessible si on a pas de token, 
   il est simple de s'enregistrer(POST /api/auth/register), d'avoir un token, de se logger.
   il sera très simple dès lors d'accèder aux données api/columns, api/ofs etc..
   
2. Abus d’API / attaques par force brute
   Une personne peut envoyer un grand nombre de requêtes (login, register, etc.) pour saturer le serveur ou tenter de trouver les mots de passe.
   Cela peut provoquer un déni de service ou compromettre la sécurité des comptes.

# limitation des requêtes :express-rate-limit 
1. npm install express-rate-limit
2. ajout src/middlewares/security.middleware.js
3. appel dans app.ts

# Vérifier qu’une route protégée renvoie bien un code 429 avec une attaque  
1. tests/attack.test.ts

# Pour la limitation d'accès on pourra utiliser helmet 