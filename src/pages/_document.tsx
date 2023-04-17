import { Html, Head, Main, NextScript } from "next/document";
import React from "react";
import { api } from "~/utils/api";
import { renderNFTIcon } from "~/utils/helper";

export default function Document({ details, isFetched }: any) {
  return (
    <Html>
      <Head>
        <title>{details && details.name}</title>
        <meta name="description" content={`${details && details.name} Store`} />
        <meta property="og:title" content={details && details.name} key="title" />
        <link rel="icon" href={renderNFTIcon(details)} />

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
      </Head>
      <body className="font-storeFont">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const { data: details, isFetched } = api.storeWeb.getStoreDetails.useQuery(
    {},
    {
      refetchOnWindowFocus: false,
    }
  );
  // Pass data to the page via props
  return { props: { details, isFetched } };
}
