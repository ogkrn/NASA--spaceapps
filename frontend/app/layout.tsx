import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARES-LUNA | Planetary Analog Intelligence & Mission Simulator",
  description: "Source-linked Earth analog descriptions, illustrative Moon/Mars priority rankings and resource-budget scenarios for NASA Space Apps Challenge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-space-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-space-950">
        {children}
      </body>
    </html>
  );
}

