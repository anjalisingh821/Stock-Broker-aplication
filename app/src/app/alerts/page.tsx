"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { Bell, Plus, Trash2 } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface Alert {
  id: string;
  symbol: string;
  type: string;
  value: number;
  condition: string;
  triggered: boolean;
  createdAt: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    symbol: "",
    type: "PRICE",
    value: "",
    condition: "ABOVE",
  });

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const response = await fetch("/api/alerts");
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error("Error loading alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.symbol || !formData.value) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: formData.symbol.toUpperCase(),
          type: formData.type,
          value: parseFloat(formData.value),
          condition: formData.condition,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create alert");
      }

      toast.success("Alert created successfully");
      setFormData({ symbol: "", type: "PRICE", value: "", condition: "ABOVE" });
      setShowForm(false);
      loadAlerts();
    } catch (error: any) {
      toast.error(error.message || "Failed to create alert");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this alert?")) {
      return;
    }

    try {
      const response = await fetch(`/api/alerts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete alert");
      }

      toast.success("Alert deleted");
      loadAlerts();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete alert");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alerts</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set price alerts for your favorite stocks
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Alert
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="symbol" className="text-sm font-medium">
                    Symbol
                  </label>
                  <Input
                    id="symbol"
                    placeholder="RELIANCE"
                    value={formData.symbol}
                    onChange={(e) =>
                      setFormData({ ...formData, symbol: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">
                    Alert Type
                  </label>
                  <select
                    id="type"
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value="PRICE">Price</option>
                    <option value="PERCENTAGE">Percentage Change</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="value" className="text-sm font-medium">
                    Value
                  </label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="condition" className="text-sm font-medium">
                    Condition
                  </label>
                  <select
                    id="condition"
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                    value={formData.condition}
                    onChange={(e) =>
                      setFormData({ ...formData, condition: e.target.value })
                    }
                  >
                    <option value="ABOVE">Above</option>
                    <option value="BELOW">Below</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Create Alert</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      symbol: "",
                      type: "PRICE",
                      value: "",
                      condition: "ABOVE",
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-500 py-8">Loading...</p>
          ) : alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold">{alert.symbol}</span>
                      <Badge variant={alert.triggered ? "success" : "outline"}>
                        {alert.triggered ? "Triggered" : "Active"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Alert when price {alert.condition.toLowerCase()} ₹
                      {alert.value.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Created {formatDateTime(alert.createdAt)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(alert.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No alerts yet. Create one to get notified about price movements.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

