import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getMultipleQuotes } from "@/lib/market-data";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

export default async function PortfolioPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  const positions = await prisma.position.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  // Get quotes for positions
  const symbols = positions.map((p) => p.symbol);
  const quotes = symbols.length > 0 ? await getMultipleQuotes(symbols) : [];

  // Calculate totals
  let totalInvested = 0;
  let totalCurrent = 0;

  positions.forEach((position) => {
    const quote = quotes.find((q) => q.symbol === position.symbol);
    const currentPrice = quote?.price || position.currentPrice;
    totalInvested += position.averagePrice * position.quantity;
    totalCurrent += currentPrice * position.quantity;
  });

  const totalPnL = totalCurrent - totalInvested;
  const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your holdings and performance
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Invested
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">
              Current Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCurrent)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">
              Total P&L
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totalPnL >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(totalPnL)}
            </div>
            <div
              className={`text-sm ${
                totalPnL >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatPercentage(totalPnLPercent)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Positions */}
      {positions.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Symbol</th>
                    <th className="text-right py-3 px-4 font-semibold">Quantity</th>
                    <th className="text-right py-3 px-4 font-semibold">Avg Price</th>
                    <th className="text-right py-3 px-4 font-semibold">Current Price</th>
                    <th className="text-right py-3 px-4 font-semibold">Value</th>
                    <th className="text-right py-3 px-4 font-semibold">P&L</th>
                    <th className="text-right py-3 px-4 font-semibold">P&L %</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((position) => {
                    const quote = quotes.find((q) => q.symbol === position.symbol);
                    const currentPrice = quote?.price || position.currentPrice;
                    const value = currentPrice * position.quantity;
                    const pnl = (currentPrice - position.averagePrice) * position.quantity;
                    const pnlPercent =
                      ((currentPrice - position.averagePrice) / position.averagePrice) * 100;

                    return (
                      <tr key={position.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-4 px-4">
                          <div className="font-semibold">{position.symbol}</div>
                        </td>
                        <td className="text-right py-4 px-4">
                          {position.quantity}
                        </td>
                        <td className="text-right py-4 px-4">
                          {formatCurrency(position.averagePrice)}
                        </td>
                        <td className="text-right py-4 px-4">
                          {formatCurrency(currentPrice)}
                        </td>
                        <td className="text-right py-4 px-4 font-semibold">
                          {formatCurrency(value)}
                        </td>
                        <td
                          className={`text-right py-4 px-4 font-semibold ${
                            pnl >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {formatCurrency(pnl)}
                        </td>
                        <td
                          className={`text-right py-4 px-4 ${
                            pnlPercent >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {formatPercentage(pnlPercent)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-4">No positions yet</p>
            <p className="text-sm text-gray-400">
              Start trading to build your portfolio
            </p>
          </CardContent>
        </Card>
      )}

      {/* Cash Balance */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {formatCurrency(profile?.cashBalance || 0)}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Available for trading
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

