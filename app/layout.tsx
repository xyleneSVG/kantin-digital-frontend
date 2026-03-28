import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Montserrat } from "next/font/google";
import FrappeProviderWrapper from "@/src/components/commons/FrappeProviderWrapper";
import "./globals.css";
import { NavbarComponent } from "@/src/components/commons/Navbar";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
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
      <body
        className={`${jakartaSans.variable} ${montserrat.variable} font-sans antialiased`}
      >
        <FrappeProviderWrapper>
          {children}
          <NavbarComponent />
        </FrappeProviderWrapper>
      </body>
    </html>
  );
}
