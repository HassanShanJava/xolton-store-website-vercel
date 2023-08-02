import { useQuery } from "@tanstack/react-query";
  import { Html, Head, Main, NextScript } from "next/document";
  
  import React from "react";
  
  import { renderNFTIcon } from "~/utils/helper";
  
  export default function Document() {
    return (
      <>
      <Html>
        <Head>
        
          <script
          dangerouslySetInnerHTML={{
            __html: `
            <!-- Google Tag Manager -->
            <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','sdsda');</script>
            <!-- End Google Tag Manager -->`,
          }}
          ></script>
          

          {/* Google Analytics Measurement ID*/}
          
          <script async src={"https://www.googletagmanager.com/gtag/js?id=dsadsadsa"} ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'dsadsadsa', {
                  page_path: window.location.pathname
                });
              `,
            }}
            ></script>
          

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
  

          
        </Head>
        <body className="font-storeFont">
        
                  
        <script
          dangerouslySetInnerHTML={{
            __html: `
            <!-- Google Tag Manager (noscript) -->
              <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=sdsda"
              height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
            <!-- End Google Tag Manager (noscript) -->`,
          }}
        ></script>

          <Main />
          <NextScript />

        </body>
      </Html>
      </>
    );
  }
  