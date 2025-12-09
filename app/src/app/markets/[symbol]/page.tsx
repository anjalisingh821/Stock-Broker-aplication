import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getStockQuote, getOHLCV, type OHLCV } from "@/lib/market-data";
import { formatCurrency, formatPercentage, formatNumber } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { StockChart } from "@/components/charts/stock-chart";
import { OrderTicket } from "@/components/trading/order-ticket";

export default async function StockDetailPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  const { symbol: symbolParam } = await params;
  const symbol = symbolParam.toUpperCase();
  const quote = await getStockQuote(symbol);
  const ohlcvData = await getOHLCV(symbol, 30);

  if (!quote) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">Stock not found</p>
            <Link href="/markets">
              <Button className="mt-4">Back to Markets</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <Link href="/markets" className="text-blue-600 hover:underline mb-2 inline-block">
          ← Back to Markets
        </Link>
        <h1 className="text-3xl font-bold">{quote.symbol}</h1>
        <p className="text-gray-600 dark:text-gray-400">{quote.name}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Chart and Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-4xl font-bold">
                    {formatCurrency(quote.price)}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant={
                        quote.changePercent >= 0 ? "success" : "destructive"
                      }
                    >
                      {formatPercentage(quote.changePercent)}
                    </Badge>
                    <span className="text-lg">
                      {formatCurrency(quote.change)}
                    </span>
                  </div>
                </div>
                {quote.changePercent >= 0 ? (
                  <TrendingUp className="h-8 w-8 text-green-500" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-red-500" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Price Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <StockChart data={ohlcvData} symbol={symbol} />
            </CardContent>
          </Card>

          {/* Market Data */}
          <Card>
            <CardHeader>
              <CardTitle>Market Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Open</div>
                  <div className="text-lg font-semibold">
                    {formatCurrency(quote.open)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Previous Close</div>
                  <div className="text-lg font-semibold">
                    {formatCurrency(quote.previousClose)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">High</div>
                  <div className="text-lg font-semibold">
                    {formatCurrency(quote.high)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Low</div>
                  <div className="text-lg font-semibold">
                    {formatCurrency(quote.low)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Volume</div>
                  <div className="text-lg font-semibold">
                    {formatNumber(quote.volume)}
                  </div>
                </div>
                {quote.marketCap && (
                  <div>
                    <div className="text-sm text-gray-500">Market Cap</div>
                    <div className="text-lg font-semibold">
                      {formatCurrency(quote.marketCap)}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Ticket */}
        <div>
          <OrderTicket symbol={symbol} currentPrice={quote.price} />
        </div>
      </div>
    </div>
  );
}

