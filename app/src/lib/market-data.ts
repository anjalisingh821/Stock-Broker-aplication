// Mock market data service - In production, this would connect to Yahoo Finance API or similar

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  marketCap?: number;
}

export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Mock stock data
const MOCK_STOCKS: Record<string, StockQuote> = {
  RELIANCE: {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    price: 2456.75,
    change: 12.50,
    changePercent: 0.51,
    volume: 1250000,
    high: 2470.00,
    low: 2440.00,
    open: 2445.00,
    previousClose: 2444.25,
    marketCap: 16600000000000,
  },
  TCS: {
    symbol: "TCS",
    name: "Tata Consultancy Services Ltd",
    price: 3421.50,
    change: -15.25,
    changePercent: -0.44,
    volume: 850000,
    high: 3440.00,
    low: 3410.00,
    open: 3430.00,
    previousClose: 3436.75,
    marketCap: 12500000000000,
  },
  HDFCBANK: {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    price: 1654.30,
    change: 8.75,
    changePercent: 0.53,
    volume: 2100000,
    high: 1660.00,
    low: 1645.00,
    open: 1648.00,
    previousClose: 1645.55,
    marketCap: 12400000000000,
  },
  INFY: {
    symbol: "INFY",
    name: "Infosys Ltd",
    price: 1523.40,
    change: -5.60,
    changePercent: -0.37,
    volume: 1800000,
    high: 1535.00,
    low: 1518.00,
    open: 1528.00,
    previousClose: 1529.00,
    marketCap: 6300000000000,
  },
  HINDUNILVR: {
    symbol: "HINDUNILVR",
    name: "Hindustan Unilever Ltd",
    price: 2456.80,
    change: 18.20,
    changePercent: 0.75,
    volume: 650000,
    high: 2465.00,
    low: 2438.00,
    open: 2440.00,
    previousClose: 2438.60,
    marketCap: 5800000000000,
  },
  ICICIBANK: {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd",
    price: 985.45,
    change: 12.30,
    changePercent: 1.26,
    volume: 3200000,
    high: 990.00,
    low: 975.00,
    open: 978.00,
    previousClose: 973.15,
    marketCap: 6900000000000,
  },
  SBIN: {
    symbol: "SBIN",
    name: "State Bank of India",
    price: 612.75,
    change: -3.25,
    changePercent: -0.53,
    volume: 4500000,
    high: 618.00,
    low: 610.00,
    open: 615.00,
    previousClose: 616.00,
    marketCap: 5450000000000,
  },
  BHARTIARTL: {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel Ltd",
    price: 1123.50,
    change: 25.75,
    changePercent: 2.35,
    volume: 2800000,
    high: 1130.00,
    low: 1105.00,
    open: 1108.00,
    previousClose: 1097.75,
    marketCap: 6200000000000,
  },
  ITC: {
    symbol: "ITC",
    name: "ITC Ltd",
    price: 456.30,
    change: 4.20,
    changePercent: 0.93,
    volume: 3800000,
    high: 458.00,
    low: 452.00,
    open: 453.00,
    previousClose: 452.10,
    marketCap: 5650000000000,
  },
  KOTAKBANK: {
    symbol: "KOTAKBANK",
    name: "Kotak Mahindra Bank Ltd",
    price: 1689.25,
    change: -8.50,
    changePercent: -0.50,
    volume: 950000,
    high: 1700.00,
    low: 1685.00,
    open: 1695.00,
    previousClose: 1697.75,
    marketCap: 3350000000000,
  },
};

// Generate mock OHLCV data
function generateMockOHLCV(symbol: string, days: number = 30): OHLCV[] {
  const basePrice = MOCK_STOCKS[symbol]?.price || 1000;
  const data: OHLCV[] = [];
  const now = Date.now();
  
  for (let i = days; i >= 0; i--) {
    const timestamp = now - i * 24 * 60 * 60 * 1000;
    const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
    const open = basePrice * (1 + variation);
    const close = open * (1 + (Math.random() - 0.5) * 0.01);
    const high = Math.max(open, close) * (1 + Math.random() * 0.005);
    const low = Math.min(open, close) * (1 - Math.random() * 0.005);
    const volume = Math.floor(Math.random() * 2000000) + 500000;
    
    data.push({ timestamp, open, high, low, close, volume });
  }
  
  return data;
}

export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  const stock = MOCK_STOCKS[symbol.toUpperCase()];
  if (!stock) return null;
  
  // Add some random variation to simulate real-time updates
  const variation = (Math.random() - 0.5) * 0.01;
  return {
    ...stock,
    price: stock.price * (1 + variation),
    change: stock.change + (Math.random() - 0.5) * 2,
  };
}

export async function getMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
  const quotes = await Promise.all(
    symbols.map((symbol) => getStockQuote(symbol))
  );
  return quotes.filter((q): q is StockQuote => q !== null);
}

export async function searchStocks(query: string): Promise<StockQuote[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  
  const upperQuery = query.toUpperCase();
  return Object.values(MOCK_STOCKS).filter(
    (stock) =>
      stock.symbol.includes(upperQuery) ||
      stock.name.toUpperCase().includes(upperQuery)
  );
}

export async function getOHLCV(
  symbol: string,
  days: number = 30
): Promise<OHLCV[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return generateMockOHLCV(symbol, days);
}

export async function getTopGainers(): Promise<StockQuote[]> {
  const stocks = Object.values(MOCK_STOCKS);
  return stocks
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 10);
}

export async function getTopLosers(): Promise<StockQuote[]> {
  const stocks = Object.values(MOCK_STOCKS);
  return stocks
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 10);
}

export async function getMostActive(): Promise<StockQuote[]> {
  const stocks = Object.values(MOCK_STOCKS);
  return stocks.sort((a, b) => b.volume - a.volume).slice(0, 10);
}

