import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  ArrowRight,
  Check,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Professional Stock Trading
              <span className="block text-blue-200">Made Simple</span>
            </h1>
            <p className="mb-8 text-xl text-blue-100 md:text-2xl">
              Trade stocks, manage your portfolio, and access real-time market
              data all in one platform.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Everything you need to trade
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Powerful features designed for both beginners and professionals
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <TrendingUp className="mb-2 h-10 w-10 text-blue-600" />
                <CardTitle>Real-time Market Data</CardTitle>
                <CardDescription>
                  Get live stock prices, charts, and market insights
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <BarChart3 className="mb-2 h-10 w-10 text-blue-600" />
                <CardTitle>Advanced Charts</CardTitle>
                <CardDescription>
                  Professional charting tools with technical indicators
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="mb-2 h-10 w-10 text-blue-600" />
                <CardTitle>Fast Execution</CardTitle>
                <CardDescription>
                  Lightning-fast order execution and portfolio updates
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="mb-2 h-10 w-10 text-blue-600" />
                <CardTitle>Secure & Safe</CardTitle>
                <CardDescription>
                  Bank-level security to protect your data and funds
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <BarChart3 className="mb-2 h-10 w-10 text-blue-600" />
                <CardTitle>Portfolio Analytics</CardTitle>
                <CardDescription>
                  Track your performance with detailed analytics
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="mb-2 h-10 w-10 text-blue-600" />
                <CardTitle>Research Tools</CardTitle>
                <CardDescription>
                  Access research reports and market analysis
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to start trading?
          </h2>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
            Join thousands of traders using TradeHub
          </p>
          <Link href="/register">
            <Button size="lg">Create Free Account</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
