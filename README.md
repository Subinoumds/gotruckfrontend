# GoTruck Frontend

Frontend React + Vite pour l'application GoTruck.

## Structure du projet

```
src/
  ├── pages/          # Pages de l'application
  │   ├── LoginPage.jsx
  │   ├── SignupPage.jsx
  │   └── HomePage.jsx
  ├── components/     # Composants réutilisables
  │   └── ProtectedRoute.jsx
  ├── contexts/       # Contextes React (Auth, etc.)
  │   └── AuthContext.jsx
  ├── services/       # Services API
  │   ├── api.js
  │   └── authService.js
  └── styles/         # Fichiers CSS
      ├── index.css
      ├── LoginPage.css
      ├── SignupPage.css
      └── HomePage.css
```

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

Le serveur démarre sur http://localhost:5173

## Variables d'environnement

Crée un fichier `.env` avec :

```
VITE_API_URL=http://localhost:3000
```

## Notes

- Les pages sont dans `src/pages/`
- Les styles CSS sont dans `src/styles/` (un fichier par page)
- Pour intégrer tes maquettes Figma, modifie les fichiers CSS correspondants
- L'authentification utilise des cookies HttpOnly (gérés automatiquement par le navigateur)
