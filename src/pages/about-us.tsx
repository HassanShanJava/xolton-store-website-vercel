import dynamic from "next/dynamic";
import React from "react";
export async function getStaticProps() {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/web/page?store_id=${process.env.NEXT_PUBLIC_STORE_ID}&link=/about-us`,
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
  const result: any = await response.json();

  const storeAboutData = result?.data;

  return { props: { storeAboutData } };
}
const AboutFunc = dynamic(() => import("../components/About/AboutUs"), {
  ssr: true,
});
export default function AboutPage({ storeAboutData }: any) {
  return <AboutFunc storeAboutData={storeAboutData} />;
}
