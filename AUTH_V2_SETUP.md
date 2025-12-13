# 🔐 CashChaser Auth V2 - Setup Propre

## Problème identifié
L'ancien setup avait des problèmes de connexion Prisma → Neon en environnement serverless Vercel.

## Nouvelle approche

### 1. Configuration Prisma optimisée pour serverless
- Utilisation de connection pooling Neon
- Configuration `@prisma/client/edge` pour Vercel
- Gestion propre des connexions avec singleton pattern

### 2. NextAuth configuration minimale
- CredentialsProvider pour email/password
- Stratégie JWT (pas de sessions en DB)
- Variables d'environnement validées

### 3. Structure des fichiers
```
src/
├── lib/
│   ├── prisma.ts          # Client Prisma singleton
│   ├── auth.ts            # Configuration NextAuth
│   └── auth-utils.ts      # Utilitaires (bcrypt, validation)
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/route.ts
│   │       └── signup/route.ts
│   └── auth/
│       ├── signin/page.tsx
│       └── signup/page.tsx
```

### 4. Variables d'environnement requises
```
DATABASE_URL="postgresql://user:password@host-pooler.neon.tech/db?sslmode=require"
NEXTAUTH_URL="https://cashchaser.vercel.app"
NEXTAUTH_SECRET="[généré avec: openssl rand -base64 32]"
```

### 5. Tests avant déploiement
- [ ] Test local avec `npm run dev`
- [ ] Vérification connexion Neon
- [ ] Test signup + signin
- [ ] Test protection routes dashboard

