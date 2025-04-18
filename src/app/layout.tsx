import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import QueryProvider from "@/components/QueryProvider";
import { Toaster } from "react-hot-toast";
import type { Metadata, Viewport } from "next";
import { auth } from "@/auth/auth";
import Script from "next/script";
import LoginModal from "@/components/LoginModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateViewport(): Promise<Viewport> {
  return {
    width: "device-width",
    initialScale: 1,
  };
}

const url = process.env.NEXT_PUBLIC_BASE_URL || "https://freetalk-whdr.onrender.com";
const ogImage = `${url}/opengraph.png`;
const baseTitle = "Freetalk - Social Media Platform";
const description =
  "Connect with friends, share updates, and join communities on Freetalk.";

export const metadata: Metadata = {
  title: {
    default: baseTitle,
    template: "%s | Freetalk",
  },
  description,
  authors: [{ name: "Freetalk Team", url }],
  metadataBase: new URL(url),
  alternates: {
    canonical: url,
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: baseTitle,
    description,
    url,
    siteName: "Freetalk",
    images: [
      {
        url: ogImage,
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
    title: baseTitle,
    description,
    images: [ogImage],
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = !!(await auth());
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#f2f4f7" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          id="theme-color-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const setThemeColor = () => {
                  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const meta = document.querySelector('meta[name="theme-color"]') || document.createElement('meta');
                  meta.setAttribute('name', 'theme-color');
                  meta.setAttribute('content', isDark ? '#09090b' : '#f2f4f7');
                  if (!meta.parentNode) document.head.appendChild(meta);
                };
                setThemeColor();
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setThemeColor);
              })();
            `,
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoginModal currentUser={currentUser} />
          <Toaster />
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
