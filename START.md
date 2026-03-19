# Guide de Démarrage

## Prérequis
- Docker et Docker Compose installés
- Ports 3000, 5000, et 3307 disponibles

## Démarrage de l'application

1. **Cloner ou naviguer dans le répertoire du projet**
   ```bash
   cd c:/Users/LEGION/Desktop/miage3/s5/cloud
   ```

2. **Démarrer tous les services**
   ```bash
   docker-compose up -d
   ```

3. **Vérifier que tous les conteneurs sont actifs**
   ```bash
   docker-compose ps
   ```

## Accès à l'application

- **Frontend React** : http://localhost:3000
- **Backend API** : http://localhost:5000/api
- **Base de données MySQL** : localhost:3307

## Test de l'API

### Vérifier la santé de l'API
```bash
curl http://localhost:5000/api/health
```

### Lister tous les utilisateurs
```bash
curl http://localhost:5000/api/users
```

## Fonctionnalités disponibles

- ✅ Création d'utilisateurs
- ✅ Lecture de la liste des utilisateurs
- ✅ Mise à jour d'utilisateurs
- ✅ Suppression d'utilisateurs
- ✅ Validation des données
- ✅ Interface responsive et moderne

## Arrêt de l'application

```bash
docker-compose down
```

## Développement

Pour le développement avec hot-reload :
```bash
docker-compose -f docker-compose.dev.yml up
```

## Structure du projet

```
cloud/
├── backend/          # API Node.js + Express
├── frontend/         # Application React
├── database/         # Scripts SQL
├── docker-compose.yml
└── README.md
```
