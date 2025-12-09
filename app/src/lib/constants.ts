export const APP_NAME = "TradeHub";
export const APP_DESCRIPTION = "Professional Stock Trading Platform";

export const MARKET_STATUS = {
  OPEN: "OPEN",
  CLOSED: "CLOSED",
  PRE_MARKET: "PRE_MARKET",
  POST_MARKET: "POST_MARKET",
} as const;

export const ORDER_TYPES = {
  MARKET: "MARKET",
  LIMIT: "LIMIT",
  STOP_LOSS: "STOP_LOSS",
  STOP_LOSS_LIMIT: "STOP_LOSS_LIMIT",
} as const;

export const ORDER_SIDES = {
  BUY: "BUY",
  SELL: "SELL",
} as const;

export const ORDER_STATUS = {
  PENDING: "PENDING",
  PLACED: "PLACED",
  EXECUTED: "EXECUTED",
  PARTIALLY_EXECUTED: "PARTIALLY_EXECUTED",
  CANCELLED: "CANCELLED",
  REJECTED: "REJECTED",
} as const;

export const DEFAULT_CASH_BALANCE = 100000; // ₹1,00,000 virtual cash

export const POPULAR_STOCKS = [
  "RELIANCE",
  "TCS",
  "HDFCBANK",
  "INFY",
  "HINDUNILVR",
  "ICICIBANK",
  "SBIN",
  "BHARTIARTL",
  "ITC",
  "KOTAKBANK",
];

