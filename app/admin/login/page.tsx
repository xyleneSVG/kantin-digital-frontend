"use client";

import React, { useState } from "react";
import { Button } from "@/src/components/ui/og-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/og-input";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ASSETS } from "@/src/constants/assets";
import { adminLogin } from "@/src/services/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const userData = await adminLogin(email, password);

      if (userData && userData.api_key && userData.api_secret) {
        localStorage.setItem("api_key", userData.api_key);
        localStorage.setItem("api_secret", userData.api_secret);
        localStorage.setItem("company", userData.company);
        localStorage.setItem("adminEmail", email);

        router.push("/admin");
      } else {
        throw {
          message: "Data user tidak ditemukan",
          highlight: "Silakan hubungi admin pusat.",
        };
      }
    } catch (err: any) {
      setError(
        err?.highlight ||
        err?.message ||
        "Terjadi kesalahan saat login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src={ASSETS.SPLASHSCREEN}
            alt="Splash Screen Logo"
            width={160}
            height={120}
            className="mb-4 h-35 w-35"
          />
          <h1 className="text-3xl font-bold text-gray-900">Admin Kantin</h1>
          <p className="mt-2 text-gray-600">Masuk ke dashboard admin</p>
        </div>

        <Card className="border-emerald-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Masukkan email dan password Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
                  ⚠️ {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full gap-2 bg-emerald-600 py-6 text-white hover:bg-emerald-700"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Memvalidasi...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Masuk Sekarang
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-xs text-gray-400">
          &copy; 2026 Kantin Stemba
        </p>
      </div>
    </div>
  );
}