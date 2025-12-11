'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      invoiceNumber: formData.get('invoiceNumber'),
      amount: parseFloat(formData.get('amount') as string),
      dueDate: formData.get('dueDate'),
      description: formData.get('description'),
      customer: {
        name: formData.get('customerName'),
        email: formData.get('customerEmail'),
        phone: formData.get('customerPhone') || null,
      },
    };

    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création');
      }

      router.push('/dashboard/invoices');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
                CashChaser
              </Link>
              <div className="flex gap-4">
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/invoices"
                  className="text-sm text-blue-600 font-semibold"
                >
                  Factures
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/dashboard/invoices"
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Retour aux factures
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Créer une nouvelle facture
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  N° de facture *
                </label>
                <input
                  type="text"
                  name="invoiceNumber"
                  id="invoiceNumber"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="FAC-2024-001"
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Montant (€) *
                </label>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1500.00"
                />
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'échéance *
                </label>
                <input
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Description de la facture..."
              />
            </div>

            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Informations client
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du client *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    id="customerName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Entreprise SARL"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      id="customerEmail"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="contact@entreprise.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      id="customerPhone"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Link
                href="/dashboard/invoices"
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Création...' : 'Créer la facture'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                💡 <strong>Astuce :</strong> Après avoir créé votre facture, vous pourrez
                configurer des relances automatiques pour maximiser vos chances de paiement.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
