# Arrosage Automatique - Système d'Irrigation

## Description
Interface de surveillance et contrôle pour système d'irrigation intelligent.

## Structure du projet
```
arrosage-auto/
├── src/
│   └── input.css
├── dist/
│   └── style.css
├── connexion.html
├── tableau-bord.html
├── statistiques.html
├── proxy.js
├── tailwind.config.js
└── package.json
```

## Installation

1. **Cloner le projet**
```bash
git clone [url-du-projet]
cd arrosage-auto
```

2. **Installer les dépendances**
```bash
npm install
```

## Lancement

1. **Démarrer le serveur proxy**
```bash
npm start
```

2. **Lancer la compilation Tailwind** (nouveau terminal)
```bash
npm run dev
```

3. **Démarrer le serveur local** (nouveau terminal)
```bash
python -m http.server 8000
# OU
npx http-server

///////

ADMIN :
Utilisateur : user123
Mot de passe : ecoctrl2024

//////