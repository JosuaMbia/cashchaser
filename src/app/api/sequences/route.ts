import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/sequences - List all sequences for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const sequences = await prisma.sequence.findMany({
      where: { userId: user.id },
      include: {
        steps: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: { steps: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(sequences);
  } catch (error) {
    console.error("Error fetching sequences:", error);
    return NextResponse.json(
      { error: "Failed to fetch sequences" },
      { status: 500 }
    );
  }
}

// POST /api/sequences - Create a new sequence
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, description, steps } = body;

    if (!name || !steps || steps.length === 0) {
      return NextResponse.json(
        { error: "Name and at least one step are required" },
        { status: 400 }
      );
    }

    // Create sequence with steps
    const sequence = await prisma.sequence.create({
      data: {
        name,
        description,
        userId: user.id,
        isActive: true,
        steps: {
          create: steps.map((step: any) => ({
            order: step.order,
            type: step.type,
            delayDays: step.delayDays,
            subject: step.subject,
            content: step.content,
          })),
        },
      },
      include: {
        steps: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(sequence, { status: 201 });
  } catch (error) {
    console.error("Error creating sequence:", error);
    return NextResponse.json(
      { error: "Failed to create sequence" },
      { status: 500 }
    );
  }
}

// PATCH /api/sequences - Toggle sequence active status
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { sequenceId, isActive } = body;

    if (!sequenceId || isActive === undefined) {
      return NextResponse.json(
        { error: "Sequence ID and isActive are required" },
        { status: 400 }
      );
    }

    // Verify the sequence belongs to the user
    const sequence = await prisma.sequence.findFirst({
      where: {
        id: sequenceId,
        userId: user.id,
      },
    });

    if (!sequence) {
      return NextResponse.json(
        { error: "Sequence not found" },
        { status: 404 }
      );
    }

    // Update the sequence
    const updatedSequence = await prisma.sequence.update({
      where: { id: sequenceId },
      data: { isActive },
      include: {
        steps: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(updatedSequence);
  } catch (error) {
    console.error("Error updating sequence:", error);
    return NextResponse.json(
      { error: "Failed to update sequence" },
      { status: 500 }
    );
  }
}

// DELETE /api/sequences - Delete a sequence
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const sequenceId = searchParams.get("id");

    if (!sequenceId) {
      return NextResponse.json(
        { error: "Sequence ID is required" },
        { status: 400 }
      );
    }

    // Verify the sequence belongs to the user
    const sequence = await prisma.sequence.findFirst({
      where: {
        id: sequenceId,
        userId: user.id,
      },
    });

    if (!sequence) {
      return NextResponse.json(
        { error: "Sequence not found" },
        { status: 404 }
      );
    }

    // Delete the sequence (steps will be cascade deleted)
    await prisma.sequence.delete({
      where: { id: sequenceId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting sequence:", error);
    return NextResponse.json(
      { error: "Failed to delete sequence" },
      { status: 500 }
    );
  }
}
