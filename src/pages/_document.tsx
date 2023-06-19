import { useQuery } from "@tanstack/react-query";
import { Html, Head, Main, NextScript } from "next/document";
import React from "react";

import { renderNFTIcon } from "~/utils/helper";


// changed to runner script file
export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="description" content={`Store`} />
        <meta property="og:title" content={"store detail"} key="title" />
        {/* <link rel="icon" href={renderNFTIcon(details?.data?.web)} /> */}

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

        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
        <!-- Google Tag Manager -->
        <script async src="https://www.googletagmanager.com/gtag/js?id="</script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', '');
        </script>

        <!-- End Google Tag Manager -->
      `,
          }}
        />
      </Head>
      <body className="font-storeFont">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
