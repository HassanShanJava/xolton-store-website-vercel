import dynamic from "next/dynamic";
import React from "react";

export async function getStaticProps() {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/web/page?store_id=${process.env.NEXT_PUBLIC_STORE_ID}&link=/faq`,
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

  const storeFaqData = result?.data;

  return { props: { storeFaqData } };
}
const FaqFunc = dynamic(() => import("~/components/Faq/Faqs"), {
  ssr: true,
});
export default function FaqPage({ storeFaqData }: any) {
  return <FaqFunc storeFaqData={storeFaqData} />;
}
