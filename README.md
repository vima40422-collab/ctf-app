
# ctf-app — Plateforme de soumission de Flag CTF (Next.js)

Une application CTF (Capture The Flag) légère construite avec Next.js, TypeScript, Tailwind CSS et Firebase.

**Objectif** : fournir une base fonctionnelle pour organiser des challenges, soumettre des flags et afficher un classement.

## 🚀 Fonctionnalités principales

- Soumission de flags depuis l'interface utilisateur
- Tableau des scores (`/scoreboard`)
- Interface d'administration pour gérer les challenges (`/ifno`)
- Authentification et stockage via Firebase
- UI responsive avec Tailwind CSS

## 🧰 Stack technique

- Framework : Next.js
- Langage : TypeScript
- UI : Tailwind CSS
- Backend / Auth / DB : Firebase (Firestore + Auth)

## Démarrage rapide

1. Installer les dépendances :

```bash
npm install
```

2. Configurer les variables d'environnement (voir section suivante).

3. Lancer en développement :

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`.

Pour construire :

```bash
npm run build
npm start
```

## 🔐 Configuration et variables d'environnement

Créez un fichier `.env.local` à la racine et ajoutez vos valeurs privées. Exemple de variables utilisées par l'application (noms indicatifs) :

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
FIREBASE_PRIVATE_KEY=your_private_key_if_needed
```

Le fichier `lib/firebase.ts` lit ces variables pour initialiser Firebase.

## Structure du projet

Arborescence principale :

```
app/
	├── page.tsx         # Page d'accueil
	├── layout.tsx       # Layout global
	├── globals.css      # Styles globaux
	├── ifno/            # Interface d'administration
	└── scoreboard/      # Page du classement
components/            # Composants réutilisables
lib/                   # Helpers (ex: `firebase.ts`)
package.json
tsconfig.json
vercel.json
```

## Déploiement

Site: https://ctf-app-ten.vercel.app/

## Contribution

Contributions bienvenues : ouvrez une issue pour discuter des changements souhaités puis soumettez une PR.

Checklist minimale pour une PR :

- Description de la fonctionnalité / bugfix
- Pas de secrets committés
- Tests ou vérifications manuelles décrites

## Sécurité & confidentialité

- Ne publiez pas vos clés Firebase dans le dépôt.

## Ressources & aide

- Code lié : `lib/firebase.ts`
- Pages importantes : `app/page.tsx`, `app/ifno/page.tsx`, `app/scoreboard/page.tsx`
