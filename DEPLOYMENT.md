# Déploiement GoTruck Frontend

Ce document explique comment configurer le déploiement automatique du frontend sur votre VPS.

## 📋 Prérequis sur le VPS

### 1. Installer Node.js et PM2

```bash
# Installer Node.js 22 (LTS)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer PM2 globalement
sudo npm install -g pm2

# Vérifier les installations
node --version
npm --version
pm2 --version
```

### 2. Créer le répertoire de déploiement

```bash
# Créer le répertoire
sudo mkdir -p /var/www/gotruck-frontend
sudo chown -R $USER:$USER /var/www/gotruck-frontend

# Cloner le repo (première fois seulement)
cd /var/www
git clone <votre-repo-frontend-url> gotruck-frontend
cd gotruck-frontend

# Installer les dépendances
npm install

# Build initial
npm run build
```

### 3. Configurer PM2

```bash
# Démarrer l'application avec PM2
cd /var/www/gotruck-frontend
pm2 start ecosystem.config.js

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer au boot
pm2 startup
# Suivre les instructions affichées
```

## 🔑 Configuration GitHub Secrets

1. Aller dans votre repo GitHub → **Settings** → **Secrets and variables** → **Actions**
2. Cliquer sur **New repository secret**
3. Ajouter les secrets suivants :

### Secrets requis :

| Nom | Description | Exemple |
|-----|-------------|---------|
| `VPS_HOST` | Adresse IP de votre VPS | `123.45.67.89` |
| `VPS_USER` | Utilisateur SSH | `root` ou `ubuntu` |
| `VPS_SSH_KEY` | Clé SSH privée | Contenu de `~/.ssh/id_rsa` |

### Générer une clé SSH pour GitHub Actions

```bash
# Sur votre machine locale
ssh-keygen -t ed25519 -C "github-actions-gotruck" -f ~/.ssh/github_actions_gotruck

# Copier la clé publique sur le VPS
ssh-copy-id -i ~/.ssh/github_actions_gotruck.pub user@your-vps-ip

# Afficher la clé privée (à copier dans GitHub Secrets)
cat ~/.ssh/github_actions_gotruck
```

**Important :** Copiez TOUT le contenu de la clé privée, y compris les lignes `-----BEGIN` et `-----END`.

## 🚀 Utilisation

Une fois configuré, le déploiement est **automatique** :

1. **Développez** votre code localement
2. **Commit** vos changements
3. **Push** sur la branche `main`
4. **GitHub Actions** se déclenche automatiquement
5. **Déploiement** sur le VPS en quelques secondes

### Vérifier le déploiement

```bash
# Se connecter au VPS
ssh user@your-vps-ip

# Vérifier les logs PM2
pm2 logs gotruck-frontend

# Vérifier le status
pm2 status

# Redémarrer manuellement si nécessaire
pm2 restart gotruck-frontend
```

## 🔧 Commandes utiles

```bash
# Voir les logs en temps réel
pm2 logs gotruck-frontend --lines 100

# Redémarrer l'application
pm2 restart gotruck-frontend

# Arrêter l'application
pm2 stop gotruck-frontend

# Supprimer l'application de PM2
pm2 delete gotruck-frontend

# Voir les métriques
pm2 monit
```

## 🐛 Troubleshooting

### Le déploiement échoue

1. Vérifier les logs GitHub Actions (onglet **Actions** dans votre repo)
2. Vérifier que les secrets sont bien configurés
3. Vérifier que la clé SSH fonctionne :
   ```bash
   ssh -i ~/.ssh/github_actions_gotruck user@your-vps-ip
   ```

### L'application ne démarre pas

```bash
# Vérifier les logs PM2
pm2 logs gotruck-frontend --err

# Vérifier que le build fonctionne
cd /var/www/gotruck-frontend
npm run build

# Redémarrer PM2
pm2 restart gotruck-frontend
```

### Port déjà utilisé

```bash
# Vérifier quel processus utilise le port 5173
sudo lsof -i :5173

# Tuer le processus si nécessaire
sudo kill -9 <PID>
```

## 🌐 Configuration Nginx (optionnel)

Pour servir l'application via un nom de domaine :

```nginx
server {
    listen 80;
    server_name votredomaine.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/gotruck-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 📝 Notes

- Le workflow se déclenche uniquement sur la branche `main`
- PM2 redémarre automatiquement l'application en cas de crash
- Les logs sont conservés par PM2
- Le build est fait à chaque déploiement

## ✅ Checklist de déploiement

- [ ] Node.js et PM2 installés sur le VPS
- [ ] Répertoire `/var/www/gotruck-frontend` créé
- [ ] Repo cloné sur le VPS
- [ ] PM2 configuré et sauvegardé
- [ ] Clé SSH générée et ajoutée au VPS
- [ ] Secrets GitHub configurés (`VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`)
- [ ] Premier push sur `main` pour tester le déploiement
- [ ] Vérification que l'application fonctionne
