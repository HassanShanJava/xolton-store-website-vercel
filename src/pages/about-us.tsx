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
  const responseWeb: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/web?&store_id=${process.env.NEXT_PUBLIC_STORE_ID}`,
    {
      headers: {
        "Content-Type": "application/json",
        referer: "xoltanmarketplace.com",
      },
    }
  );

  if (!response.ok ) {
    throw new Error("Network response was not ok");
  }
  if (!responseWeb.ok) {
    throw new Error("Network response was not ok");
  }
  const resultWeb: any = await responseWeb.json();

  const navData = resultWeb?.data?.navbar || [];
  const webData = resultWeb?.data?.website || {};


  const result: any = await response.json();

  const storeAboutData = result?.data;

  return { props: { storeAboutData,navData,webData } };
}
const AboutFunc = dynamic(() => import("../components/About/AboutUs"), {
  ssr: true,
});
export default function AboutPage({ storeAboutData, navData, webData }: any) {
  return <AboutFunc storeAboutData={storeAboutData} navData={navData} webData={webData}/>;
}
