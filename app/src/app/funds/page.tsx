import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { FundActions } from "@/components/funds/fund-actions";

export default async function FundsPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Funds</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account balance
        </p>
      </div>

      {/* Balance Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            <CardTitle>Available Balance</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-4">
            {formatCurrency(profile?.cashBalance || 0)}
          </div>
          <p className="text-sm text-gray-500">
            This is virtual money for demo purposes
          </p>
        </CardContent>
      </Card>

      {/* Fund Actions */}
      <FundActions currentBalance={profile?.cashBalance || 0} />

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    {transaction.type === "DEPOSIT" ? (
                      <ArrowUpCircle className="h-5 w-5 text-green-500" />
                    ) : transaction.type === "WITHDRAWAL" ? (
                      <ArrowDownCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <Wallet className="h-5 w-5 text-blue-500" />
                    )}
                    <div>
                      <div className="font-semibold">{transaction.type}</div>
                      {transaction.description && (
                        <div className="text-sm text-gray-500">
                          {transaction.description}
                        </div>
                      )}
                      <div className="text-xs text-gray-400">
                        {formatDateTime(transaction.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`font-semibold ${
                      transaction.amount >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.amount >= 0 ? "+" : ""}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No transactions yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

