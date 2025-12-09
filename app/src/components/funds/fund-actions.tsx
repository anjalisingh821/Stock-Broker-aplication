"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

interface FundActionsProps {
  currentBalance: number;
}

export function FundActions({ currentBalance }: FundActionsProps) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<"deposit" | "withdraw" | null>(null);

  const handleSubmit = async (type: "DEPOSIT" | "WITHDRAWAL") => {
    const amt = parseFloat(amount);
    
    if (!amt || amt <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (type === "WITHDRAWAL" && amt > currentBalance) {
      toast.error("Insufficient balance");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/funds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          amount: amt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Transaction failed");
      }

      toast.success(
        type === "DEPOSIT" ? "Funds added successfully" : "Funds withdrawn successfully"
      );
      setAmount("");
      setAction(null);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  if (action) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {action === "deposit" ? "Add Funds" : "Withdraw Funds"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount (₹)
            </label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              max={action === "withdraw" ? currentBalance : undefined}
            />
            {action === "withdraw" && (
              <p className="text-xs text-gray-500">
                Available: ₹{currentBalance.toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => handleSubmit(action === "deposit" ? "DEPOSIT" : "WITHDRAWAL")}
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Processing..." : "Confirm"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setAction(null);
                setAmount("");
              }}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setAction("deposit")}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <ArrowUpCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold">Add Funds</h3>
              <p className="text-sm text-gray-500">Deposit virtual money</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setAction("withdraw")}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <ArrowDownCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold">Withdraw Funds</h3>
              <p className="text-sm text-gray-500">Withdraw virtual money</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

