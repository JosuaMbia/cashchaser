import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CashChaser - Assistant de relance automatique',
  description: 'Récupérez vos factures en retard automatiquement',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
