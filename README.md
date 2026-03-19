# Application de Gestion des Utilisateurs - Architecture 3-tiers

Une application complète de gestion des utilisateurs avec architecture conteneurisée :

- **Frontend** : React avec TypeScript et TailwindCSS
- **Backend** : Node.js + Express API REST
- **Base de données** : MySQL

## Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   React     │    │  Node.js    │    │   MySQL     │
│  Frontend   │────│   Express   │────│  Database   │
│   :3000     │    │   API       │    │   :3306     │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Fonctionnalités

- ✅ CRUD complet des utilisateurs
- ✅ Validation des données
- ✅ Gestion des erreurs
- ✅ Interface responsive
- ✅ Architecture scalable

## Démarrage rapide

```bash
docker-compose up --build
```

L'application sera accessible sur http://localhost:3000

## Technologies

- Frontend : React 18, TypeScript, TailwindCSS, Axios
- Backend : Node.js, Express, MySQL2, Joi
- Database : MySQL 8.0
- Containerisation : Docker & Docker Compose
