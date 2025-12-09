# TradeHub - Professional Stock Trading Platform

A full-featured stock trading platform built with Next.js, featuring real-time market data, portfolio management, order execution, and comprehensive trading tools.

## Features

### Core Functionality
- **User Authentication**: Secure email/password authentication with NextAuth.js
- **Real-time Market Data**: Live stock prices and market information
- **Trading**: Place market and limit orders for buying/selling stocks
- **Portfolio Management**: Track holdings, P&L, and portfolio performance
- **Order Management**: View order history and cancel pending orders
- **Funds Management**: Virtual wallet for deposits and withdrawals
- **Price Alerts**: Set alerts for price movements
- **Research Tools**: Top gainers, losers, most active stocks, and market news
- **Advanced Charts**: Interactive candlestick charts with technical indicators

### User Interface
- **Modern Design**: Clean, professional UI with dark mode support
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates**: Live price updates and portfolio refresh
- **Intuitive Navigation**: Easy-to-use sidebar and navigation

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Charts**: Lightweight Charts
- **UI Components**: Custom components with Tailwind CSS
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ (or use Docker)
- npm or yarn
- Docker (optional, for containerized setup)

### Installation

#### Option 1: Local Development (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd Stock_broker/app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the `app` directory:
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Option 2: Docker (Virtual Environment)

1. Build and run with Docker Compose:
```bash
docker-compose up --build
```

This will:
- Create an isolated container environment
- Install all dependencies
- Set up the database
- Start the development server

The app will be available at [http://localhost:3000](http://localhost:3000)

#### Option 3: Node Version Management

If you use `nvm` (Node Version Manager), the project includes `.nvmrc` file:

```bash
nvm use
npm install
npm run dev
```

This ensures you're using the correct Node.js version (18.0.0).

## Project Structure

```
app/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── api/          # API routes
│   │   ├── dashboard/    # Dashboard page
│   │   ├── markets/      # Markets and stock details
│   │   ├── portfolio/    # Portfolio management
│   │   ├── orders/       # Order history
│   │   ├── research/     # Research tools
│   │   ├── funds/        # Funds management
│   │   ├── alerts/       # Price alerts
│   │   ├── settings/     # User settings
│   │   └── profile/      # User profile
│   ├── components/       # React components
│   │   ├── ui/           # UI components
│   │   ├── layout/       # Layout components
│   │   ├── charts/       # Chart components
│   │   ├── trading/      # Trading components
│   │   └── funds/        # Funds components
│   ├── lib/              # Utility functions and services
│   │   ├── auth.ts       # Authentication config
│   │   ├── db.ts         # Database client
│   │   ├── market-data.ts # Market data service
│   │   └── trading.ts    # Trading service
│   └── types/            # TypeScript types
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## Key Features Explained

### Authentication
- Users can register and login with email/password
- Sessions are managed with NextAuth.js
- Protected routes require authentication

### Market Data
- Mock market data service (can be replaced with real API)
- Real-time price updates
- Stock search functionality
- Top gainers, losers, and most active stocks

### Trading
- Place market and limit orders
- Order validation and execution
- Automatic position updates
- Order cancellation for pending orders

### Portfolio
- View all holdings
- Real-time P&L calculation
- Portfolio value tracking
- Cash balance management

### Funds
- Virtual wallet system
- Deposit and withdraw virtual funds
- Transaction history
- Balance tracking

## Database Schema

The application uses SQLite with the following main models:
- **User**: User accounts
- **Profile**: User profiles with KYC status and cash balance
- **Order**: Trading orders
- **Position**: Stock holdings
- **Transaction**: Fund transactions
- **Alert**: Price alerts
- **Watchlist**: Stock watchlists

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/auth/register` - User registration
- `/api/orders` - Order management
- `/api/funds` - Funds management
- `/api/alerts` - Price alerts
- `/api/settings` - User settings

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
npm start
```

### Database Migrations
```bash
npx prisma migrate dev
```

### Prisma Studio
```bash
npx prisma studio
```

## Notes

- This is a demo application with virtual trading
- Market data is mocked (replace with real API for production)
- Default cash balance: ₹1,00,000
- All trading is simulated for demonstration purposes

## Future Enhancements

- Integration with real market data APIs
- Advanced charting with more indicators
- Watchlist functionality
- More order types (stop-loss, bracket orders)
- Real-time notifications
- Mobile app
- Advanced analytics and reporting

## License

This project is for demonstration purposes.

## Support

For issues and questions, please open an issue in the repository.
