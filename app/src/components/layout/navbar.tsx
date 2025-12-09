"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Wallet,
  User,
  LogOut,
  Menu,
  Search,
} from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-gray-950/95">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            TradeHub
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
          >
            Dashboard
          </Link>
          <Link
            href="/markets"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
          >
            Markets
          </Link>
          <Link
            href="/portfolio"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
          >
            Portfolio
          </Link>
          <Link
            href="/orders"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
          >
            Orders
          </Link>
          <Link
            href="/research"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
          >
            Research
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <Link href="/funds">
                <Button variant="outline" size="sm">
                  <Wallet className="h-4 w-4 mr-2" />
                  Funds
                </Button>
              </Link>
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {session.user?.name || session.user?.email}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link
              href="/dashboard"
              className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Dashboard
            </Link>
            <Link
              href="/markets"
              className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Markets
            </Link>
            <Link
              href="/portfolio"
              className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Portfolio
            </Link>
            <Link
              href="/orders"
              className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Orders
            </Link>
            <Link
              href="/research"
              className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Research
            </Link>
            {session && (
              <>
                <Link
                  href="/funds"
                  className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Funds
                </Link>
                <Link
                  href="/profile"
                  className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

