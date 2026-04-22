"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  ShoppingCart,
  Package,
  BarChart3,
  LogOut,
} from "lucide-react";
import { logoutUser } from "@/src/services/auth";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: Home },
  { label: "Daftar Pesanan", href: "/admin/order-lists", icon: ShoppingCart },
  { label: "Kelola Menu", href: "/admin/menu", icon: Package },
  { label: "Pembelian Stok", href: "/admin/stock", icon: BarChart3 },
];

export function Sidebar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();

  if (pathname === "/admin/login") return null;

  const handleLogoutClick = async () => {
    if (confirm("Yakin ingin keluar?")) {
      setIsLoggingOut(true);
      await logoutUser();
      setIsLoggingOut(false);
      router.push("/admin")
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[70] rounded-lg border border-gray-200 bg-white p-2 lg:hidden"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <aside
        className={`bg-background border-sidebar-border fixed top-0 left-0 z-[65] flex h-full w-64 flex-col border-r transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 pt-14 lg:pt-6">
          <h1 className="text-xl font-bold text-emerald-600">POS Kantin</h1>
          <p className="text-sidebar-foreground/60 mt-1 text-xs">
            Sistem Penjualan Kantin
          </p>
        </div>

        <nav className="flex-1 space-y-2 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
              >
                <div
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    isActive
                      ? "bg-emerald-50 font-semibold text-emerald-600"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="border-sidebar-border border-t p-4">
          <button
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            <LogOut
              className={`h-5 w-5 flex-shrink-0 ${isLoggingOut ? "animate-spin" : ""}`}
            />
            <span className="text-sm font-medium">
              {isLoggingOut ? "Keluar..." : "Logout"}
            </span>
          </button>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="lg:ml-64">
        <div className="h-16 lg:h-0" />
      </div>
    </>
  );
}
