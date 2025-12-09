import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, amount } = body;

    if (!type || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    if (type === "WITHDRAWAL" && amount > profile.cashBalance) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Update balance
    const newBalance =
      type === "DEPOSIT"
        ? profile.cashBalance + amount
        : profile.cashBalance - amount;

    await prisma.profile.update({
      where: { userId: session.user.id },
      data: { cashBalance: newBalance },
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId: session.user.id,
        type,
        amount: type === "DEPOSIT" ? amount : -amount,
        description:
          type === "DEPOSIT"
            ? `Deposited ₹${amount.toLocaleString()}`
            : `Withdrew ₹${amount.toLocaleString()}`,
      },
    });

    return NextResponse.json({
      message: "Transaction successful",
      newBalance,
    });
  } catch (error: any) {
    console.error("Funds transaction error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

