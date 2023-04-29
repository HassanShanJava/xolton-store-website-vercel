import { type NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
// import Homepage from "~/components/Homepage/Homepage";

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
