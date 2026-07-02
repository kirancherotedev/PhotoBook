import type { Metadata } from "next";
import { Work_Sans, Libre_Caslon_Text } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { ToastProvider } from "@/components/Toast";

const hanken = Work_Sans({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

const playfair = Libre_Caslon_Text({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "PhotoBook Studio — Premium Photobooks & Custom Polaroids",
  description:
    "Design your own premium photobook or custom polaroid prints with complete creative freedom. Drag, resize, and layer photos and text on a free-form canvas. Hardcover, softcover, and leather options.",
  keywords: ["photobook", "custom photo book", "photo album", "custom polaroids", "wedding album", "premium photo book"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${hanken.variable} ${playfair.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
