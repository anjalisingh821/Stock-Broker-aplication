import { prisma } from "./db";
import { getStockQuote } from "./market-data";
import { ORDER_STATUS, ORDER_TYPES } from "./constants";

export interface CreateOrderInput {
  userId: string;
  symbol: string;
  side: "BUY" | "SELL";
  type: "MARKET" | "LIMIT" | "STOP_LOSS" | "STOP_LOSS_LIMIT";
  quantity: number;
  price?: number;
  stopPrice?: number;
}

export async function createOrder(input: CreateOrderInput) {
  const { userId, symbol, quantity, side, type, price, stopPrice } = input;

  // Validate order
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  // Get current stock price
  const quote = await getStockQuote(symbol);
  if (!quote) {
    throw new Error("Stock not found");
  }

  // Get user profile for balance check
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error("User profile not found");
  }

  // For BUY orders, check if user has enough cash
  if (side === "BUY") {
    const orderValue = type === "MARKET" 
      ? quote.price * quantity 
      : (price || quote.price) * quantity;
    
    if (orderValue > profile.cashBalance) {
      throw new Error("Insufficient balance");
    }
  }

  // For SELL orders, check if user has enough shares
  if (side === "SELL") {
    const position = await prisma.position.findUnique({
      where: { userId_symbol: { userId, symbol } },
    });

    if (!position || position.quantity < quantity) {
      throw new Error("Insufficient shares");
    }
  }

  // Create order
  const order = await prisma.order.create({
    data: {
      userId,
      symbol,
      side,
      type,
      quantity,
      price,
      stopPrice,
      status: ORDER_STATUS.PENDING,
    },
  });

  // Execute market orders immediately
  if (type === ORDER_TYPES.MARKET) {
    await executeOrder(order.id);
  }

  return order;
}

export async function executeOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order || order.status !== ORDER_STATUS.PENDING) {
    return;
  }

  const quote = await getStockQuote(order.symbol);
  if (!quote) {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: ORDER_STATUS.REJECTED },
    });
    return;
  }

  let executionPrice = quote.price;

  // For limit orders, check if price condition is met
  if (order.type === ORDER_TYPES.LIMIT && order.price) {
    if (order.side === "BUY" && quote.price > order.price) {
      // Price too high, keep pending
      return;
    }
    if (order.side === "SELL" && quote.price < order.price) {
      // Price too low, keep pending
      return;
    }
    executionPrice = order.price;
  }

  // Execute the order
  const profile = await prisma.profile.findUnique({
    where: { userId: order.userId },
  });

  if (!profile) {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: ORDER_STATUS.REJECTED },
    });
    return;
  }

  const orderValue = executionPrice * order.quantity;

  if (order.side === "BUY") {
    // Deduct cash, add shares
    await prisma.profile.update({
      where: { userId: order.userId },
      data: { cashBalance: { decrement: orderValue } },
    });

    // Update or create position
    const existingPosition = await prisma.position.findUnique({
      where: { userId_symbol: { userId: order.userId, symbol: order.symbol } },
    });

    if (existingPosition) {
      const newQuantity = existingPosition.quantity + order.quantity;
      const newAveragePrice =
        (existingPosition.averagePrice * existingPosition.quantity +
          executionPrice * order.quantity) /
        newQuantity;

      await prisma.position.update({
        where: { id: existingPosition.id },
        data: {
          quantity: newQuantity,
          averagePrice: newAveragePrice,
          currentPrice: quote.price,
        },
      });
    } else {
      await prisma.position.create({
        data: {
          userId: order.userId,
          symbol: order.symbol,
          quantity: order.quantity,
          averagePrice: executionPrice,
          currentPrice: quote.price,
        },
      });
    }

    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId: order.userId,
        type: "ORDER_EXECUTION",
        amount: -orderValue,
        description: `Bought ${order.quantity} ${order.symbol} @ ${executionPrice}`,
      },
    });
  } else {
    // SELL order
    const position = await prisma.position.findUnique({
      where: { userId_symbol: { userId: order.userId, symbol: order.symbol } },
    });

    if (!position || position.quantity < order.quantity) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: ORDER_STATUS.REJECTED },
      });
      return;
    }

    // Add cash, reduce shares
    await prisma.profile.update({
      where: { userId: order.userId },
      data: { cashBalance: { increment: orderValue } },
    });

    const newQuantity = position.quantity - order.quantity;
    if (newQuantity === 0) {
      await prisma.position.delete({
        where: { id: position.id },
      });
    } else {
      await prisma.position.update({
        where: { id: position.id },
        data: {
          quantity: newQuantity,
          currentPrice: quote.price,
        },
      });
    }

    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId: order.userId,
        type: "ORDER_EXECUTION",
        amount: orderValue,
        description: `Sold ${order.quantity} ${order.symbol} @ ${executionPrice}`,
      },
    });
  }

  // Update order status
  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: ORDER_STATUS.EXECUTED,
      filledQuantity: order.quantity,
      averagePrice: executionPrice,
    },
  });
}

export async function cancelOrder(orderId: string, userId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order || order.userId !== userId) {
    throw new Error("Order not found");
  }

  if (order.status !== ORDER_STATUS.PENDING && order.status !== ORDER_STATUS.PLACED) {
    throw new Error("Cannot cancel order in current status");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: ORDER_STATUS.CANCELLED },
  });
}

