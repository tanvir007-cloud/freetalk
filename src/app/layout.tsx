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
  authors: [{ name: "Your Name", url: "https://yourwebsite.com" }],
  metadataBase: new URL("https://yourfreetalk.com"),
  alternates: {
    canonical: "https://yourfreetalk.com",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Freetalk - Connect with Friends",
    description:
      "Join Freetalk to connect with friends, share updates, and discover communities.",
    url: "https://yourfreetalk.com",
    siteName: "Freetalk",
    images: [
      {
        url: "/icons8-facebook-logo-color-152.png",
        width: 1200,
        height: 630,
        alt: "Freetalk",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Freetalk - Connect with Friends",
    description:
      "Join Freetalk to connect with friends, share updates, and discover communities.",
    images: ["/icons8-facebook-logo-color-152.png"],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SocialNetwork",
              name: "Facebook Clone",
              url: "https://yourfacebookclone.com",
              logo: "https://yourfacebookclone.com/icons8-facebook-logo-color-152.png",
              description:
                "A social media platform where you can connect with friends, share posts, and discover communities.",
              sameAs: [
                "https://twitter.com/yourusername",
                "https://linkedin.com/in/yourusername",
              ],
            }),
          }}
        />
      </head>
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
