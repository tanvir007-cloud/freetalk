import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import QueryProvider from "@/components/QueryProvider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Freetalk - Connect with Friends",
    template: "%s | Freetalk",
  },
  description:
    "Join Freetalk to connect with friends, share updates, and discover communities.",
  keywords:
    "Freetalk, social media, connect, friends, share, posts, communities",
  authors: [{ name: "Your Name", url: "https://freetalk-whdr.onrender.com" }],
  metadataBase: new URL("https://freetalk-whdr.onrender.com"),
  alternates: {
    canonical: "https://freetalk-whdr.onrender.com",
  },
  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Freetalk - Connect with Friends",
    description:
      "Join Freetalk to connect with friends, share updates, and discover communities.",
    url: "https://freetalk-whdr.onrender.com",
    siteName: "Freetalk",
    images: [
      {
        url: "https://freetalk-whdr.onrender.com/opengraph.png", // Full URL is safer for OG
        width: 1200,
        height: 630,
        alt: "Freetalk",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Freetalk - Connect with Friends",
    description:
      "Join Freetalk to connect with friends, share updates, and discover communities.",
    images: ["https://freetalk-whdr.onrender.com/opengraph.png"],
  },

  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/favicon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
