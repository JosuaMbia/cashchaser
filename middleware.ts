// Middleware temporaire pour désactiver l'authentification
// À supprimer une fois l'authentification corrigée

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Pour le moment, on autorise tous les accès sans vérification
  return NextResponse.next()
}

// Configuration optionnelle : définir les chemins protégés
// Pour désactiver complètement, on peut commenter la ligne ci-dessous
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}