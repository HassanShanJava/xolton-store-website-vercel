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

  // fs.writeFileSync("../../next-sitemap.config.js", sitemapData);
  console.log(sitemapData, "sitemapData");
  await fs.writeFileSync("next-sitemap.config.js", sitemapData, {
    encoding: "utf8",
    flag: "w",
  });
};


// Self-invocation async function
(async () => {
  await Promise.all([runAsync(), runSiteAsync()]);
})().catch((err) => {
  console.error(err);
  throw err;
});
