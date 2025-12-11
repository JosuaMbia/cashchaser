import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary-600">CashChaser</div>
          <div className="flex gap-4">
            <Link href="/auth/signin" className="px-4 py-2 text-gray-600 hover:text-primary-600 transition">
              Connexion
            </Link>
            <Link href="/auth/signup" className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
              Essai gratuit
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Récupérez vos factures impayées
          <span className="block text-primary-600 mt-2">en automatique</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Automatisez vos relances par email et SMS. Gagnez du temps et améliorez votre trésorerie sans effort.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/signup" className="px-8 py-4 bg-primary-600 text-white rounded-lg text-lg font-semibold hover:bg-primary-700 transition shadow-lg">
            Démarrer gratuitement
          </Link>
          <Link href="#features" className="px-8 py-4 border-2 border-primary-600 text-primary-600 rounded-lg text-lg font-semibold hover:bg-primary-50 transition">
            Découvrir
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Pourquoi CashChaser ?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Automatisation totale</h3>
            <p className="text-gray-600">Configurez vos séquences de relance une fois, CashChaser s'occupe du reste.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Suivi en temps réel</h3>
            <p className="text-gray-600">Dashboard complet pour suivre l'état de vos factures et relances.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Améliorez votre cash-flow</h3>
            <p className="text-gray-600">Récupérez vos paiements plus rapidement et réduisez vos impayés.</p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-primary-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Prêt à automatiser vos relances ?</h2>
          <p className="text-xl mb-8 opacity-90">Rejoignez les entreprises qui optimisent leur trésorerie</p>
          <Link href="/auth/signup" className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition shadow-lg">
            Commencer maintenant
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 CashChaser. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
