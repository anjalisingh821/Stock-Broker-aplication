"use client";

import { useEffect, useState } from "react";
import { getTopGainers, getTopLosers, getMostActive, type StockQuote } from "@/lib/market-data";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import Link from "next/link";

export default function ResearchPage() {
  const [gainers, setGainers] = useState<StockQuote[]>([]);
  const [losers, setLosers] = useState<StockQuote[]>([]);
  const [mostActive, setMostActive] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [gainersData, losersData, activeData] = await Promise.all([
        getTopGainers(),
        getTopLosers(),
        getMostActive(),
      ]);
      setGainers(gainersData);
      setLosers(losersData);
      setMostActive(activeData);
      setLoading(false);
    } catch (error) {
      console.error("Error loading research data:", error);
      setLoading(false);
    }
  };

  const StockList = ({
    stocks,
    title,
    icon: Icon,
  }: {
    stocks: StockQuote[];
    title: string;
    icon: any;
  }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : stocks.length > 0 ? (
          <div className="space-y-3">
            {stocks.map((stock) => (
              <Link
                key={stock.symbol}
                href={`/markets/${stock.symbol}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-semibold">{stock.symbol}</div>
                  <div className="text-sm text-gray-500">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(stock.price)}</div>
                  <Badge
                    variant={
                      stock.changePercent >= 0 ? "success" : "destructive"
                    }
                    className="mt-1"
                  >
                    {formatPercentage(stock.changePercent)}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No data available</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Research</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Market insights and stock analysis
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <StockList stocks={gainers} title="Top Gainers" icon={TrendingUp} />
        <StockList stocks={losers} title="Top Losers" icon={TrendingDown} />
        <StockList stocks={mostActive} title="Most Active" icon={Activity} />
      </div>

      {/* News Section */}
      <Card>
        <CardHeader>
          <CardTitle>Market News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">
                Indian Markets Open Higher on Positive Global Cues
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Indian stock markets opened higher today following positive
                global market trends. The Sensex gained 0.5% in early trading
                session.
              </p>
              <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">
                Banking Sector Shows Strong Performance
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Banking stocks continue to show strong performance with major
                banks reporting better-than-expected quarterly results.
              </p>
              <p className="text-xs text-gray-500 mt-2">5 hours ago</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">
                Tech Stocks Rebound After Recent Correction
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Technology stocks showed signs of recovery after the recent
                market correction, with IT majors leading the gains.
              </p>
              <p className="text-xs text-gray-500 mt-2">1 day ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

