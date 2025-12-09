import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getMultipleQuotes } from "@/lib/market-data";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Wallet, Briefcase } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  const positions = await prisma.position.findMany({
    where: { userId: session.user.id },
  });

  const recentOrders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Get quotes for positions
  const symbols = positions.map((p) => p.symbol);
  const quotes = symbols.length > 0 ? await getMultipleQuotes(symbols) : [];

  // Calculate portfolio value
  let totalInvested = 0;
  let totalCurrent = 0;
  
  positions.forEach((position) => {
    const quote = quotes.find((q) => q.symbol === position.symbol);
    const currentPrice = quote?.price || position.currentPrice;
    totalInvested += position.averagePrice * position.quantity;
    totalCurrent += currentPrice * position.quantity;
  });

  const portfolioPnL = totalCurrent - totalInvested;
  const portfolioPnLPercent = totalInvested > 0 ? (portfolioPnL / totalInvested) * 100 : 0;
  const totalValue = (profile?.cashBalance || 0) + totalCurrent;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {session.user?.name || session.user?.email}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Wallet className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-gray-500">
              Cash: {formatCurrency(profile?.cashBalance || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <Briefcase className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCurrent)}</div>
            <p className="text-xs text-gray-500">
              Invested: {formatCurrency(totalInvested)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">P&L</CardTitle>
            {portfolioPnL >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                portfolioPnL >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(portfolioPnL)}
            </div>
            <p
              className={`text-xs ${
                portfolioPnL >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatPercentage(portfolioPnLPercent)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Holdings</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positions.length}</div>
            <p className="text-xs text-gray-500">Active positions</p>
          </CardContent>
        </Card>
      </div>

      {/* Positions */}
      {positions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Holdings</CardTitle>
            <CardDescription>Current positions in your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {positions.map((position) => {
                const quote = quotes.find((q) => q.symbol === position.symbol);
                const currentPrice = quote?.price || position.currentPrice;
                const pnl = (currentPrice - position.averagePrice) * position.quantity;
                const pnlPercent =
                  ((currentPrice - position.averagePrice) / position.averagePrice) * 100;

                return (
                  <div
                    key={position.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{position.symbol}</h3>
                        <Badge variant="outline">{position.quantity} shares</Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        Avg: {formatCurrency(position.averagePrice)} • Current:{" "}
                        {formatCurrency(currentPrice)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(currentPrice * position.quantity)}
                      </div>
                      <div
                        className={`text-sm ${
                          pnl >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {formatCurrency(pnl)} ({formatPercentage(pnlPercent)})
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4">
              <Link href="/portfolio">
                <button className="text-sm text-blue-600 hover:underline">
                  View all positions →
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Your latest trading activity</CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{order.symbol}</span>
                      <Badge
                        variant={
                          order.side === "BUY" ? "success" : "destructive"
                        }
                      >
                        {order.side}
                      </Badge>
                      <Badge variant="outline">{order.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {order.quantity} shares • {order.status}
                    </p>
                  </div>
                  <div className="text-right">
                    {order.averagePrice && (
                      <div className="font-semibold">
                        {formatCurrency(order.averagePrice)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No orders yet. Start trading to see your activity here.
            </p>
          )}
          <div className="mt-4">
            <Link href="/orders">
              <button className="text-sm text-blue-600 hover:underline">
                View all orders →
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

