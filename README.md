# CTF Platform - Next.js

Une plateforme de Capture The Flag (CTF) moderne construite avec Next.js, Firebase et Tailwind CSS.

## 🚀 Fonctionnalités

- **Page d'accueil** - Soumettre des flags et participer aux challenges
- **Panel Admin** (/ifno) - Créer et gérer les challenges
- **Scoreboard** (/scoreboard) - Voir les classements et challenges actifs
- **Firebase Integration** - Authentification et base de données temps réel
- **Responsive Design** - Fonctionne sur tous les appareils

## 📦 Installation

```bash
npm install
```

## 🔧 Développement

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

## 🏗️ Build & Déploiement

```bash
npm run build
npm start
```

Déploiement sur **Vercel**:
```bash
git push origin main
```

## 📁 Structure

```
ctf-app/
├── app/
│   ├── page.tsx           # Page d'accueil
│   ├── layout.tsx         # Layout global
│   ├── globals.css        # Styles globaux
│   ├── ifno/
│   │   └── page.tsx       # Panel Admin
│   └── scoreboard/
│       └── page.tsx       # Scoreboard
├── lib/
│   └── firebase.ts        # Configuration Firebase
├── components/            # Composants réutilisables
└── package.json          # Dépendances
```

## 🔐 Variables d'Environnement

Les clés Firebase sont configurées dans `lib/firebase.ts`.

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 📝 Notes

- Email admin authentifié: vima40422@gmail.com
- Les flags sont hasés en SHA-256
- Animation smooth avec CSS gradients
