import { auth } from "@/auth/auth";
import LoginPage from "./(auth)/login/page";
import HomePage from "./home/page";
import { Metadata } from "next";
import Script from "next/script";
import { Fragment } from "react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata | null> {
  const session = await auth();
  const url =
    process.env.NEXT_PUBLIC_BASE_URL || "https://freetalk-whdr.onrender.com";
  const ogImage = `${url}/opengraph.png`;

  if (session) {
    return {
      robots: { index: false, follow: false },
    };
  }

  const baseTitle = "Freetalk - Log in or Sign up";
  const description =
    "Join Freetalk to share moments, connect with friends, and explore communities!";

  return {
    title: {
      default: baseTitle,
      template: "%s | Freetalk",
    },
    description,
    keywords: [
      "Freetalk login",
      "Freetalk sign up",
      "social media login",
      "connect with friends",
      "join communities",
      "share moments online", // নতুন কীওয়ার্ড
      "explore communities Freetalk", // নতুন কীওয়ার্ড
      "Freetalk social platform", // নতুন কীওয়ার্ড
    ],
    metadataBase: new URL(url),
    authors: [{ name: "Freetalk Team", url }],
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
  };
}

export default async function Home() {
  try {
    const session = await auth();
    const currentUser = !!session;
    const url =
      process.env.NEXT_PUBLIC_BASE_URL || "https://freetalk-whdr.onrender.com";

    if (currentUser) {
      return <HomePage />;
    }

    return (
      <Fragment>
        {/* স্ট্রাকচার্ড ডেটা যোগ করা হয়েছে লগইন পেজের জন্য */}
        <Script
          id="website-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Freetalk",
              url: url,
              description:
                "Join Freetalk to share moments, connect with friends, and explore communities!",
              publisher: {
                "@type": "Organization",
                name: "Freetalk",
                logo: {
                  "@type": "ImageObject",
                  url: `${url}/icons8-facebook-logo-color-152.png`, // আপনার লোগোর URL
                },
              },
              potentialAction: {
                "@type": "SearchAction",
                target: `${url}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <LoginPage />
      </Fragment>
    );
  } catch (error) {
    console.error("Authentication error:", error);
    return <div>Error loading page. Please try again.</div>;
  }
}
