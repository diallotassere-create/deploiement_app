# Déploiement de l'Application de Gestion des Utilisateurs

## 🚀 Déploiement Local

### Prérequis
- Docker et Docker Compose installés
- Git installé

### Étapes de déploiement

1. **Cloner le dépôt**
```bash
git clone https://github.com/diallotassere-create/deploiement_app.git
cd deploiement_app
```

2. **Configurer les variables d'environnement**
```bash
cp .env.example .env
# Modifier .env selon votre configuration
```

3. **Démarrer les services**
```bash
docker-compose up -d
```

4. **Vérifier le déploiement**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Base de données: localhost:3307

### Comptes par défaut
- **Admin**: admin@usermanagement.com / admin123
- **Utilisateur**: jean.dupont@email.com / user123

## 🌐 Déploiement Distant (Northflank)

### Configuration
Le fichier `.env.example` contient déjà la configuration pour Northflank:
```env
HOST=ton-service--projet--equipe.code.run
```

### Étapes

1. **Préparer l'environnement**
```bash
# Cloner le dépôt sur le serveur
git clone https://github.com/diallotassere-create/deploiement_app.git
cd deploiement_app
```

2. **Adapter la configuration**
```bash
# Copier et modifier les variables d'environnement
cp .env.example .env
# Adapter DB_HOST, DB_USER, DB_PASSWORD pour la base de données distante
```

3. **Construire et déployer**
```bash
docker-compose -f docker-compose.yml up -d --build
```

4. **Vérifier le déploiement**
- Application: https://ton-service--projet--equipe.code.run
- API: https://ton-service--projet--equipe.code.run/api

## 📋 Services Docker

### Services inclus
- **mysql-db**: Base de données MySQL 8.0 (port 3307)
- **node-api**: Backend Node.js/Express (port 5000)
- **react-frontend**: Frontend React/TypeScript (port 3000)

### Volumes
- **mysql_data**: Persistance des données MySQL
- **node_modules**: Cache des dépendances

### Réseaux
- **cloud-network**: Réseau Docker isolé pour la communication entre services

## 🔧 Maintenance

### Mise à jour de l'application
```bash
# Récupérer les dernières modifications
git pull origin master

# Reconstruire et redémarrer les services
docker-compose down
docker-compose up -d --build
```

### Sauvegarde de la base de données
```bash
# Exporter la base de données
docker exec mysql-db mysqldump -u app_user -papp_password user_management > backup.sql

# Importer une sauvegarde
docker exec -i mysql-db mysql -u app_user -papp_password user_management < backup.sql
```

### Logs
```bash
# Voir les logs de tous les services
docker-compose logs

# Logs d'un service spécifique
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
```

## 🛠️ Dépannage

### Problèmes courants

1. **Port déjà utilisé**
```bash
# Vérifier les ports utilisés
netstat -tulpn | grep :3000
netstat -tulpn | grep :5000
netstat -tulpn | grep :3307

# Arrêter les services conflictuels
docker-compose down
```

2. **Base de données inaccessible**
```bash
# Redémarrer le service MySQL
docker-compose restart mysql

# Vérifier les logs
docker-compose logs mysql
```

3. **Frontend ne compile pas**
```bash
# Reconstruire le frontend
docker-compose exec frontend npm install
docker-compose restart frontend
```

### Performance
- **CPU**: 1-2 cores recommandés
- **RAM**: 2-4 GB minimum
- **Stockage**: 10 GB minimum

## 📊 Monitoring

### Health checks
- Frontend: http://localhost:3000 (page de login)
- Backend: http://localhost:5000/api/auth/login (endpoint API)
- Database: Connection via MySQL client

### Métriques
- Utilisation CPU/RAM: `docker stats`
- Espace disque: `docker system df`
- Logs: `docker-compose logs -f`

## 🔒 Sécurité

### Bonnes pratiques
- Changer les mots de passe par défaut
- Utiliser HTTPS en production
- Limiter l'accès à la base de données
- Mettre à jour régulièrement les dépendances

### Variables sensibles
- Ne jamais commiter de vrais mots de passe
- Utiliser des secrets Docker ou variables d'environnement
- Rotation régulière des tokens JWT

## 📞 Support

Pour toute question ou problème:
1. Vérifier les logs Docker
2. Consulter la documentation du projet
3. Créer une issue sur GitHub: https://github.com/diallotassere-create/deploiement_app/issues
