"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui";
import { LogOut, User, Gamepad2, Search } from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Gamepad2 className="h-6 w-6" />
          <span>Playloggd</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link
                href="/"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Games
              </Link>
              <Link
                href="/search"
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
              >
                <Search className="h-4 w-4" />
                Search
              </Link>
              <Link
                href="/collection"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                My Collection
              </Link>

              {/* User Section */}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>{user?.username}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Games
              </Link>
              <Link
                href="/search"
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
              >
                <Search className="h-4 w-4" />
                Search
              </Link>
              <Button asChild variant="default" size="sm">
                <Link href="/login">Sign In</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
