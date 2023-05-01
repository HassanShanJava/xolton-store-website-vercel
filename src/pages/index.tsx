import { type NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import fs from "fs";

// import Homepage from "~/components/Homepage/Homepage";
// export async function getStaticProps() {
//   const response: any = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/web?&store_id=${process.env.NEXT_PUBLIC_STORE_ID}`
//   );
//   if (!response.ok) {
//     throw new Error("Network response was not ok");
//   }
//   const result: any = await response.json();

//   const storeThemeData = result?.data;
//   console.log(storeThemeData?.website?.theme?.colors.header, "storeThemeData");
//   const tailwindData = `import { type Config } from "tailwindcss";

// export default {
//   darkMode: "class",
//   content: [
    
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     fontFamily: {
//       storeFont: ['inter', 'sans-serif'],
//     },
//     extend: {
//       colors: {
//         "ac-1": "#FB74B5",
//         "ac-2": "#BF1065",
//         "pm-3": "#A9A9A9",
//         "pm-4": "#878787",
//         "pm-6": "#3C3C3C",
//         "pm-10": "#1E1E1E",
//         "pm-11": "#DDD",
//         "pm-12": "#777E90",
//         "ct-1": "#090F1B",
//         "ct-2": "#030607",
//         "bg-1": ${
//           storeThemeData?.website?.theme?.colors.background
//             ? JSON.stringify(storeThemeData?.website?.theme?.colors.background)
//             : "#F1F3F5"
//         },
//         "bg-2": ${
//           storeThemeData?.website?.theme?.colors.header
//             ? JSON.stringify(storeThemeData?.website?.theme?.colors.header)
//             : "#F1F3F5"
//         },
//         "bg-3": ${
//           storeThemeData?.website?.theme?.colors.button
//             ? JSON.stringify(storeThemeData?.website?.theme?.colors.button)
//             : "#000"
//         },
//         "gt-1": "#A0AEC0",
//         "tx-1":"rgba(0,0,0,0.48)",
//         "tx-2":"rgba(0,0,0,0.24)",
//         "tx-3":"#9CA3AF",
//       },
//       backgroundImage: {
//         "gradient-24":
//           "linear-gradient(104.64deg, #030607 0%, #090F1B 70.15%);",
//         "accentLinear-1": "linear-gradient(90.68deg, #FB74B5 0%, #BF1065 100%)",
//       },
//     },
//     screens: {
//       xss: "300px",
//       xs: "340px",
//       sx:"580px",
//       sm: "640px",
//       // => @media (min-width: 640px) { ... }

//       md: "768px",
//       mdx: "920px",
//       // => @media (min-width: 768px) { ... }

//       lg: "1024px",
//       // => @media (min-width: 1024px) { ... }
//       xlg:"1200px",
//       xl: "1280px",
//       // => @media (min-width: 1280px) { ... }

//       "2xl": "1536px",
//       // => @media (min-width: 1536px) { ... }
//     },
//   },
// } satisfies Config;
// `;
//   // fs.writeFileSync("../../tailwind.config.ts", tailwindData);
//   console.log(tailwindData, "tailwindData");
//   await fs.writeFileSync("tailwind.config.ts", tailwindData, {
//     encoding: "utf8",
//     flag: "w",
//   });
//   return { props: { storeThemeData } };
// }
const Homepage = dynamic(() => import("~/components/Homepage/Homepage"), {
  ssr: true,
});

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css"
          integrity="sha512-SzlrxWUlpfuzQ+pcUCosxcglQRNAq/DZjVsC0lE40xsADsfeQoEypE+enwcOiGjk/bSuGGKHEyjSoQ1zVisanQ=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>
      <main>
        <Homepage />
      </main>
    </>
  );
};

export default Home;
