import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, companyName } = await req.json();

    // Validation
    if (!name || !email || !password || !companyName) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await hash(password, 10);

    // Créer l'entreprise et l'utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        email,
              emailVerified: null,
        password: hashedPassword,
        companies: {
          create: {
            name: companyName,
          },
        },
      },
      include: {
        companies: true,
      },
    });


        // Vérifier que l'utilisateur a été créé
            if (!user) {
                    return NextResponse.json(
                              { error: 'Erreur lors de la création du compte' },
                                      { status: 500 }
                                            );
                                                }
    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: 'Compte créé avec succès',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du compte' },
      { status: 500 }
    );
  }
}
