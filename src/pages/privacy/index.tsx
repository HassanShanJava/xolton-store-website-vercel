import dynamic from "next/dynamic";
import React from "react";

export async function getStaticProps() {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/web/page?store_id=${process.env.NEXT_PUBLIC_STORE_ID}&link=/privacy`,
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

  const storePrivacyData = result?.data;

  return { props: { storePrivacyData } };
}
const PrivacyFunc = dynamic(
  () => import("~/components/Privacy/PrivacyPolicy"),
  {
    ssr: true,
  }
);
export default function FaqPage({ storePrivacyData }: any) {
  return <PrivacyFunc storePrivacyData={storePrivacyData} />;
}
