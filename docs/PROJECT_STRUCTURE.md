# CashChaser - Structure du Projet

## Vision Produit

**Nom** : CashChaser
**Promesse** : "Récupère tes factures en retard automatiquement, sans envoyer un seul email toi-même."

**Cible v1** :
- Freelances / agences / petites boîtes SaaS utilisant Stripe (ou export CSV)
- Niveau technique faible à moyen

**Objectif v1** :
- Onboarding < 10 minutes
- 1 séquence de relance prête à l'emploi activable en 1 clic
- Dashboard montrant clairement : "Montant récupéré grâce à l'outil ce mois-ci"

---

## Architecture Technique

### Stack recommandée
- **Frontend** : Next.js 14+ (App Router) + TypeScript + Tailwind CSS
- **Backend** : Next.js API Routes + Vercel Serverless Functions
- **Base de données** : PostgreSQL (Vercel Postgres ou Supabase)
- **ORM** : Prisma
- **Auth** : NextAuth.js
- **Email** : SendGrid ou Postmark
- **SMS** : Twilio
- **Paiements/Stripe** : Stripe SDK + Webhooks
- **Jobs/Cron** : Vercel Cron Jobs

---

## Structure des Dossiers

```
cashchaser/
├── .github/
│   └── workflows/         # CI/CD workflows
├── docs/                  # Documentation
│   ├── PROJECT_STRUCTURE.md
│   ├── API.md
│   ├── DATABASE_SCHEMA.md
│   └── DEPLOYMENT.md
├── prisma/
│   ├── schema.prisma      # Schéma de la base de données
│   └── migrations/
├── public/                # Assets statiques
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Dashboard principal
│   │   │   ├── invoices/
│   │   │   │   └── page.tsx       # Liste des factures
│   │   │   ├── sequence/
│   │   │   │   └── page.tsx       # Configuration séquence
│   │   │   ├── connect/
│   │   │   │   └── page.tsx       # Connexion Stripe/CSV
│   │   │   └── settings/
│   │   │       └── page.tsx       # Paramètres
│   │   ├── api/
│   │   │   ├── auth/              # Routes auth NextAuth
│   │   │   ├── webhooks/
│   │   │   │   └── stripe/        # Webhooks Stripe
│   │   │   ├── invoices/
│   │   │   ├── sequences/
│   │   │   └── reminders/
│   │   ├── layout.tsx
│   │   └── page.tsx               # Landing page
│   ├── components/
│   │   ├── ui/                    # Composants UI réutilisables
│   │   ├── dashboard/
│   │   ├── invoices/
│   │   └── shared/
│   ├── lib/
│   │   ├── db.ts                  # Prisma client
│   │   ├── stripe.ts              # Stripe client
│   │   ├── email.ts               # Email service
│   │   ├── sms.ts                 # SMS service
│   │   └── utils.ts
│   ├── services/
│   │   ├── invoice.service.ts
│   │   ├── reminder.service.ts
│   │   └── sequence.service.ts
│   └── types/
│       └── index.ts
├── .env.example
├── .env.local
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

---

## Schéma de Base de Données

### Entités principales

```prisma
model User {
  id               String    @id @default(cuid())
  email            String    @unique
  name             String?
  stripeAccountId  String?   @unique
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  
  invoices         Invoice[]
  sequenceConfig   SequenceConfig?
}

model Invoice {
  id             String    @id @default(cuid())
  userId         String
  externalId     String    // ID Stripe ou référence CSV
  clientName     String
  clientEmail    String
  clientPhone    String?
  amount         Float
  currency       String    @default("EUR")
  dueDate        DateTime
  status         InvoiceStatus
  overdueSince   DateTime?
  isTracked      Boolean   @default(true)
  isPaused       Boolean   @default(false)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  
  user           User      @relation(fields: [userId], references: [id])
  reminderLogs   ReminderLog[]
  
  @@index([userId, status])
  @@index([overdueSince])
}

enum InvoiceStatus {
  PENDING
  OVERDUE
  PAID
  CANCELLED
}

model SequenceConfig {
  id        String   @id @default(cuid())
  userId    String   @unique
  enabled   Boolean  @default(true)
  useSms    Boolean  @default(false)
  steps     Json     // Array de steps [{type, dayOffset, templateId}]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user      User     @relation(fields: [userId], references: [id])
}

model ReminderLog {
  id          String   @id @default(cuid())
  invoiceId   String
  stepType    String   // "email" | "sms"
  stepName    String   // "email#1", "sms#1"
  sentAt      DateTime @default(now())
  status      String   // "sent" | "failed"
  metadata    Json?    // Provider message_id, etc.
  
  invoice     Invoice  @relation(fields: [invoiceId], references: [id])
  
  @@index([invoiceId])
  @@index([sentAt])
}

model Activity {
  id          String   @id @default(cuid())
  userId      String
  type        String   // "sms_sent", "email_sent", "invoice_paid"
  description String
  metadata    Json?
  createdAt   DateTime @default(now())
  
  @@index([userId, createdAt])
}
```

---

## Parcours Utilisateur (5 Écrans)

### 1. Écran Onboarding (`/onboarding`)
- Steps visuels 1-2-3
- Bouton "Commencer la configuration"
- Redirect vers `/connect`

### 2. Écran Connexion Factures (`/connect`)
- Bouton "Se connecter à Stripe" (OAuth)
- Alternative : Import CSV
- Redirect vers `/sequence`

### 3. Écran Séquence de Relance (`/sequence`)
- 2-3 séquences pré-configurées
- Aperçu des templates
- Toggle SMS on/off
- Bouton "Activer cette séquence"
- Redirect vers `/dashboard`

### 4. Dashboard Principal (`/dashboard`)
**KPIs :**
- Montant en retard
- Montant récupéré ce mois-ci
- Factures sous surveillance

**Graphique :**
- Évolution mensuelle (en retard vs récupéré)

**Fil d'activité :**
- Dernières actions (SMS envoyé, email ouvert, facture payée)

**Switch global :**
- Relances automatiques ON/OFF

### 5. Factures Suivies (`/invoices`)
- Tableau : Client, Facture, Montant, Statut, Prochaine action
- Boutons par ligne : Pause, Relancer maintenant, Marquer payée
- Détail facture avec timeline des relances

---

## Flux Technique

### Webhooks Stripe
```
invoice.created → Créer/Update Invoice (status: PENDING)
invoice.payment_failed → Passer en OVERDUE
invoice.overdue → Passer en OVERDUE + définir overdueSince
invoice.paid → Passer en PAID + stopper relances
```

### Job Récurrent (Cron)
```typescript
// Toutes les 6 heures ou quotidien
1. Lister factures OVERDUE + isTracked + !isPaused
2. Pour chaque facture:
   - Calculer quelle étape de séquence envoyer
   - Vérifier historique ReminderLog
   - Envoyer email/SMS selon config
   - Créer ReminderLog + Activity
```

---

## Priorités MVP (Sprint Plan)

### Sprint 1 : Foundation
- [ ] Setup Next.js + TypeScript + Tailwind
- [ ] Configuration Prisma + PostgreSQL
- [ ] Modèles de base (User, Invoice, SequenceConfig, ReminderLog)
- [ ] Auth avec NextAuth.js

### Sprint 2 : Connexion Stripe
- [ ] OAuth Stripe
- [ ] Webhooks Stripe (invoice events)
- [ ] Sync factures Stripe → DB

### Sprint 3 : Séquences & Relances
- [ ] Configuration séquence par défaut
- [ ] Templates email pré-remplis
- [ ] Service d'envoi email (SendGrid)
- [ ] Job cron relances

### Sprint 4 : Dashboard
- [ ] KPIs (montant retard, récupéré, factures suivies)
- [ ] Fil d'activité
- [ ] Graphique simple

### Sprint 5 : Gestion Factures
- [ ] Liste factures
- [ ] Détail facture + timeline
- [ ] Actions (pause, relancer, marquer payée)

### Sprint 6 : Polish & Deploy
- [ ] Tests
- [ ] Deploy Vercel
- [ ] Documentation

---

## Variables d'Environnement

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
SENDGRID_API_KEY="..."
SENDGRID_FROM_EMAIL="noreply@cashchaser.com"

# SMS (optionnel v1)
TWILIO_ACCOUNT_SID="..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="..."
```

---

## Next Steps

1. Initialiser le projet Next.js
2. Configurer Prisma + créer les migrations
3. Setup Auth
4. Implémenter la connexion Stripe
5. Développer les écrans principaux
6. Tester le flux complet
7. Déployer sur Vercel
