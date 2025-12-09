"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { ORDER_TYPES } from "@/lib/constants";

interface OrderTicketProps {
  symbol: string;
  currentPrice: number;
}

export function OrderTicket({ symbol, currentPrice }: OrderTicketProps) {
  const { data: session } = useSession();
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [type, setType] = useState<"MARKET" | "LIMIT">("MARKET");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState(currentPrice.toString());
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast.error("Please login to place orders");
      return;
    }

    const qty = parseInt(quantity);
    if (!qty || qty <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol,
          side,
          type,
          quantity: qty,
          price: type === "LIMIT" ? parseFloat(price) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      toast.success(`Order placed successfully`);
      setQuantity("");
      setPrice(currentPrice.toString());
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const estimatedValue = quantity
    ? (type === "MARKET" ? currentPrice : parseFloat(price) || 0) *
      parseInt(quantity)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Buy/Sell Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={side === "BUY" ? "success" : "outline"}
              onClick={() => setSide("BUY")}
              className="w-full"
            >
              Buy
            </Button>
            <Button
              type="button"
              variant={side === "SELL" ? "destructive" : "outline"}
              onClick={() => setSide("SELL")}
              className="w-full"
            >
              Sell
            </Button>
          </div>

          {/* Order Type */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={type === "MARKET" ? "default" : "outline"}
              onClick={() => setType("MARKET")}
              className="w-full"
            >
              Market
            </Button>
            <Button
              type="button"
              variant={type === "LIMIT" ? "default" : "outline"}
              onClick={() => setType("LIMIT")}
              className="w-full"
            >
              Limit
            </Button>
          </div>

          {/* Current Price */}
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-500">Current Price</div>
            <div className="text-xl font-bold">{formatCurrency(currentPrice)}</div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label htmlFor="quantity" className="text-sm font-medium">
              Quantity
            </label>
            <Input
              id="quantity"
              type="number"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              required
            />
          </div>

          {/* Limit Price */}
          {type === "LIMIT" && (
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Limit Price
              </label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          )}

          {/* Estimated Value */}
          {quantity && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-sm text-gray-500">Estimated Value</div>
              <div className="text-xl font-bold">
                {formatCurrency(estimatedValue)}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            variant={side === "BUY" ? "success" : "destructive"}
            disabled={loading || !quantity}
          >
            {loading ? "Placing..." : `${side} ${symbol}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

