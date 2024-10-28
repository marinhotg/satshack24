import type { Metadata } from "next";
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/src/components/Header';
import "./globals.css";

export const metadata: Metadata = {
  title: "SatsHack 24",
  description: "PrivateBills (?)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <Header />
          <main className="pt-16"> 
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}