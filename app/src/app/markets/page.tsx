"use client";

import { useEffect, useState } from "react";
import { getMultipleQuotes, searchStocks, type StockQuote } from "@/lib/market-data";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { POPULAR_STOCKS } from "@/lib/constants";

export default function MarketsPage() {
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [searchResults, setSearchResults] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadStocks();
    const interval = setInterval(loadStocks, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadStocks = async () => {
    try {
      const quotes = await getMultipleQuotes(POPULAR_STOCKS);
      setStocks(quotes);
      setLoading(false);
    } catch (error) {
      console.error("Error loading stocks:", error);
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await searchStocks(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearching(false);
    }
  };

  const displayStocks = searchQuery.length >= 2 ? searchResults : stocks;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Markets</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time stock prices and market data
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search stocks..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stock List */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : displayStocks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayStocks.map((stock) => (
            <Link key={stock.symbol} href={`/markets/${stock.symbol}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{stock.symbol}</h3>
                      <p className="text-sm text-gray-500">{stock.name}</p>
                    </div>
                    {stock.changePercent >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-bold">
                      {formatCurrency(stock.price)}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={
                          stock.changePercent >= 0 ? "success" : "destructive"
                        }
                      >
                        {formatPercentage(stock.changePercent)}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {formatCurrency(stock.change)}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Vol: {stock.volume.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">
              {searchQuery.length >= 2
                ? "No stocks found"
                : "No stocks available"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

