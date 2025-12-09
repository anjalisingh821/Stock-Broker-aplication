import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CancelOrderButton } from "@/components/trading/cancel-order-button";

export default async function OrdersPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your order history and status
        </p>
      </div>

      {orders.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Symbol</th>
                    <th className="text-left py-3 px-4 font-semibold">Side</th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-right py-3 px-4 font-semibold">Quantity</th>
                    <th className="text-right py-3 px-4 font-semibold">Price</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="py-4 px-4 font-semibold">{order.symbol}</td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={
                            order.side === "BUY" ? "success" : "destructive"
                          }
                        >
                          {order.side}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline">{order.type}</Badge>
                      </td>
                      <td className="text-right py-4 px-4">{order.quantity}</td>
                      <td className="text-right py-4 px-4">
                        {order.averagePrice
                          ? formatCurrency(order.averagePrice)
                          : order.price
                          ? formatCurrency(order.price)
                          : "-"}
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={
                            order.status === "EXECUTED"
                              ? "success"
                              : order.status === "CANCELLED" ||
                                order.status === "REJECTED"
                              ? "destructive"
                              : "warning"
                          }
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {formatDateTime(order.createdAt)}
                      </td>
                      <td className="text-right py-4 px-4">
                        {(order.status === "PENDING" ||
                          order.status === "PLACED") && (
                          <CancelOrderButton orderId={order.id} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-4">No orders yet</p>
            <p className="text-sm text-gray-400">
              Start trading to see your orders here
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

