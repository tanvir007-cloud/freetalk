"use client";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import Script from "next/script";
import React, { Fragment, useEffect, useState } from "react";

const Ad = () => {
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // অ্যাডসেন্স উপলব্ধ কিনা চেক করুন
    if ((window as any).adsbygoogle) {
      setAdLoaded(true);
    }
  }, []);
  return (
    <Fragment>
      {/* গুগল অ্যাডসেন্স বিজ্ঞাপন */}
      {adLoaded && (
        <div className="p-4 bg-white dark:bg-zinc-900 rounded-md shadow-md">
          <Script
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            strategy="afterInteractive"
            onError={(e) => {
              console.error("অ্যাডসেন্স স্ক্রিপ্ট লোড করতে ব্যর্থ হয়েছে", e);
              setAdLoaded(false);
            }}
            onLoad={() => {
              setAdLoaded(true);
            }}
          />
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-XXXXXXXXXXXX"
            data-ad-slot="XXXXXXXXXXX"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
          <Script
            id="adsense-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (adsbygoogle = window.adsbygoogle || []).push({});
              `,
            }}
          />
        </div>
      )}

      {/* ম্যানুয়াল বিজ্ঞাপন */}
      <div className="p-4 bg-white dark:bg-zinc-900 rounded-md shadow-md flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-zinc-500 dark:text-zinc-400">
            Sponsored Ads
          </span>
          <Ellipsis />
        </div>
        <div className="aspect-video relative">
          <Image
            src={"/nature.jpg"}
            fill
            alt="sponsered image"
            className="rounded-md"
          />
        </div>
        <div className="flex items-center gap-4">
          <Image
            src={"/nature.jpg"}
            alt=""
            width={24}
            height={24}
            className="rounded-full w-6 h-6 object-cover"
          />
          <span className="text-blue-600 font-medium text-sm">
            BigChef Lounge
          </span>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum veniam
          provident corporis accusantium consequuntur minus possimus similique
          eaque amet veritatis!
        </p>
        <Button variant={"outline"} className="w-full">
          Learn more
        </Button>
      </div>
    </Fragment>
  );
};

export default Ad;
