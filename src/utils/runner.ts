const fs = require("fs");
const loadEnvConfig = require("@next/env");
loadEnvConfig.loadEnvConfig(process.cwd());


// tailwindData
const runAsync = async () => {
  // find all scripts in subfolder
  const response = await fetch(

    `${process.env.NEXT_PUBLIC_API_URL}/web?&store_id=${process.env.NEXT_PUBLIC_STORE_ID}`,
    {
      headers: {
        "Content-Type": "application/json",
        referer: "xoltanmarketplace.com",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const result = await response.json();

  const storeThemeData = result?.data;
  const primaryFont = storeThemeData?.website?.theme?.fonts?.primary ?? "inter";
  const secondaryFont =
    storeThemeData?.website?.theme?.fonts?.secondary ?? "san-serif";
  const tailwindData = `import { type Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      storeFont: ["${primaryFont}", "${secondaryFont}"],
    },
    extend: {
      colors: {
        "ac-1": "#FB74B5",
        "ac-2": "#BF1065",
        "pm-3": "#A9A9A9",
        "pm-4": "#878787",
        "pm-6": "#3C3C3C",
        "pm-10": "#1E1E1E",
        "pm-11": "#DDD",
        "pm-12": "#777E90",
        "ct-1": "#090F1B",
        "ct-2": "#030607",
        "bg-1": ${storeThemeData?.website?.theme?.colors.background
      ? JSON.stringify(storeThemeData?.website?.theme?.colors.background)
      : "#F1F3F5"
    },
        "bg-2": ${storeThemeData?.website?.theme?.colors.header
      ? JSON.stringify(storeThemeData?.website?.theme?.colors.header)
      : "#F1F3F5"
    },
        "bg-3": ${storeThemeData?.website?.theme?.colors.button
      ? JSON.stringify(storeThemeData?.website?.theme?.colors.button)
      : "#000"
    },
        "gt-1": "#A0AEC0",
        "tx-1":"rgba(0,0,0,0.48)",
        "tx-2":"rgba(0,0,0,0.24)",
        "tx-3":"#9CA3AF",
      },
      backgroundImage: {
        "gradient-24":
          "linear-gradient(104.64deg, #030607 0%, #090F1B 70.15%);",
        "accentLinear-1": "linear-gradient(90.68deg, #FB74B5 0%, #BF1065 100%)",
      },
    },
    screens: {
      xss: "300px",
      xs: "340px",
      xxs: "540px",
      sx:"580px",
      sm: "640px",


      // => @media (min-width: 640px) { ... }

      md: "768px",
      mdx: "920px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }
      xlg:"1200px",
      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
  },
} satisfies Config;
`;
  // fs.writeFileSync("../../tailwind.config.ts", tailwindData);
  console.log(tailwindData, "tailwindData");
  await fs.writeFileSync("tailwind.config.ts", tailwindData, {
    encoding: "utf8",
    flag: "w",
  });
};

// sitemapData
const runSiteAsync = async () => {
  // find all scripts in subfolder
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/web?&store_id=${process.env.NEXT_PUBLIC_STORE_ID}`,
    {
      headers: {
        "Content-Type": "application/json",
        referer: "xoltanmarketplace.com",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const result = await response.json();

  // console.log({ result }, "result v")
  const storeDetail = result?.data;
  const domainName = storeDetail?.website?.domain_name;

  // SEO
  let robotFlag;
  let robotContentFlag;
  let sitemapFlag;
  if (storeDetail?.seo) {
    robotFlag = storeDetail?.seo?.robot?.robot
    robotContentFlag = storeDetail?.seo?.robot?.robot_content
    sitemapFlag = storeDetail?.seo?.sitemap
  }

  const sitemapData = `/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl:"https://${domainName}.${process.env.NEXT_PUBLIC_LIVE_URL}",
  generateRobotsTxt: ${robotFlag}, // (optional)
  generateIndexSitemap: ${sitemapFlag},
  ${robotFlag ?
      `robotsTxtOptions: {
          transformRobotsTxt: async () => 
          ${JSON.stringify(robotContentFlag)}
      }`: ""
    }
};`


  console.log(sitemapData, "sitemapData");
  await fs.writeFileSync("next-sitemap.config.js", sitemapData, {
    encoding: "utf8",
    flag: "w",
  });
};


// google tag manager script 
// sitemapData
const runDocument = async () => {
  // find all scripts in subfolder
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/web?&store_id=${process.env.NEXT_PUBLIC_STORE_ID}`,
    {
      headers: {
        "Content-Type": "application/json",
        referer: "xoltanmarketplace.com",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const result = await response.json();

  // console.log({ result }, "result v")
  const storeDetail = result?.data;
  const siteAnalytics = storeDetail?.analytics;
  const tagmanager = siteAnalytics?.tag_manager?.tag_manager_id;
  console.log(siteAnalytics, "siteAnalytics")



  const documentData = `import { useQuery } from "@tanstack/react-query";
  import { Html, Head, Main, NextScript } from "next/document";
  
  import React from "react";
  
  import { renderNFTIcon } from "~/utils/helper";
  
  export default function Document() {
    return (
      <>
      <Html>
        <Head>
          <meta name="description" content={"Store"} />
          <meta property="og:title" content={"store detail"} key="title" />
          
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css"
            integrity="sha512-SzlrxWUlpfuzQ+pcUCosxcglQRNAq/DZjVsC0lE40xsADsfeQoEypE+enwcOiGjk/bSuGGKHEyjSoQ1zVisanQ=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Roboto:wght@100;300;400;500;700;900&family=Ubuntu:wght@300;400;500;700&display=swap"
            rel="stylesheet"
          />
  

          ${tagmanager ? `
          <script
          dangerouslySetInnerHTML={{
            __html: ${"`" + `
            <!-- Google Tag Manager -->
            <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${tagmanager}');</script>
            <!-- End Google Tag Manager -->`+ "`"},
          }}
          `: ""}
        />
        </Head>
        <body className="font-storeFont">
          <Main />
          <NextScript />

        ${tagmanager ? `          
        <script
          dangerouslySetInnerHTML={{
            __html: ${"`" + `
            <!-- Google Tag Manager (noscript) -->
              <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${tagmanager}"
              height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
            <!-- End Google Tag Manager (noscript) -->`+ "`"},
          }}
        />`: ""}
        </body>
      </Html>
      </>
    );
  }
  `;

  console.log(documentData, "documentData")
  await fs.writeFileSync("src/pages/_document.tsx", documentData, {
    encoding: "utf8",
    flag: "w",
  });
};

// Self-invocation async function
(async () => {
  await Promise.all([runAsync(), runSiteAsync(), runDocument()]);
})().catch((err) => {
  console.error(err);
  throw err;
});
