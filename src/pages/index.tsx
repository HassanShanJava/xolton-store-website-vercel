import { type NextPage } from "next";
import Head from "next/head";
import Homepage from "~/components/Homepage/Homepage";
import { websiteInfo } from "~/utils/helper";

const Home: NextPage = ({ navData, webData }: any) => {
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
        <Homepage webData={webData} navData={navData} />
      </main>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const response: any = await websiteInfo();

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const result: any = await response.json();

  const navData = result?.data?.navbar || [];
  const webData = result?.data?.website || {};

  return { props: { navData, webData } };
}
