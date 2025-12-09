import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { cancelOrder } from "@/lib/trading";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await cancelOrder(id, session.user.id);

    return NextResponse.json({ message: "Order cancelled" });
  } catch (error: any) {
    console.error("Order cancellation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to cancel order" },
      { status: 400 }
    );
  }
}

