import type { Metadata } from "next";
import localFont from "next/font/local";
import { Plus_Jakarta_Sans } from "next/font/google";
import FrappeProviderWrapper from "@/src/components/commons/FrappeProviderWrapper";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const codeNext = localFont({
  src: "../src/fonts/code-next/CodeNext-Trial-Regular.ttf",
  variable: "--font-code-next",
});

export const metadata: Metadata = {
  title: "My App",
  description: "App with custom fonts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakartaSans.variable} ${codeNext.variable} antialiased`}>
        <FrappeProviderWrapper>
          {children}
        </FrappeProviderWrapper>
      </body>
    </html>
  );
}