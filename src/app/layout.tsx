import type { Metadata } from "next";
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
        {children}
      </body>
    </html>
  );
}