import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { invoiceNumber, amount, dueDate, description, customer } = body;

    // Validation
    if (!invoiceNumber || !amount || !dueDate || !customer?.name || !customer?.email) {
      return NextResponse.json(
        { error: 'Tous les champs requis doivent être remplis' },
        { status: 400 }
      );
    }

    // Récupérer l'entreprise de l'utilisateur
    const userCompany = await prisma.company.findFirst({
      where: {
        users: {
          some: {
            email: session.user?.email!,
          },
        },
      },
    });

    if (!userCompany) {
      return NextResponse.json(
        { error: 'Aucune entreprise trouvée' },
        { status: 404 }
      );
    }

    // Vérifier si le client existe déjà
    let existingCustomer = await prisma.customer.findFirst({
      where: {
        email: customer.email,
        companyId: userCompany.id,
      },
    });

    // Créer le client s'il n'existe pas
    if (!existingCustomer) {
      existingCustomer = await prisma.customer.create({
        data: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone || null,
          companyId: userCompany.id,
        },
      });
    }

    // Créer la facture
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        description: description || null,
        status: 'UNPAID',
        companyId: userCompany.id,
        customerId: existingCustomer.id,
      },
      include: {
        customer: true,
      },
    });

    return NextResponse.json(
      {
        invoice,
        message: 'Facture créée avec succès',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Invoice creation error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la facture' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const invoices = await prisma.invoice.findMany({
      where: {
        company: {
          users: {
            some: {
              email: session.user?.email!,
            },
          },
        },
      },
      include: {
        customer: true,
      },
      orderBy: {
        dueDate: 'desc',
      },
    });

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error('Invoices fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des factures' },
      { status: 500 }
    );
  }
}
