import dynamic from "next/dynamic";
import React from "react";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";



export async function getStaticPaths() {
  // const { data: storeAllData, isFetched } =
  //   api.storeBlogs.getStoreBlogs.useQuery(
  //     {},
  //     {
  //       refetchOnWindowFocus: false,
  //     }
  //   );
// const storeAllData=await prisma.storeBlogs.findMany({
//   where:{
//     store_id:process.env.STORE_ID
//   }
// })
  return {
    paths: ["1","2"]?.map((post) => {
      return {
        params: {
          id: `${post}`,
        },
      };
    }),
    fallback: false,
  };
}

export async function getStaticProps({params} :any) {

  // console.log(params)
  // // fetch single post detail
  // const { data: storeBlogsData } = api.storeBlogs.getStoreBlogsById.useQuery(
  //   { id:params.id },
  //   {
  //     refetchOnWindowFocus: false,
  //   }
  // );


  return {
    props: 'storeBlogsData',
  };
}



const AboutDetailFunc = dynamic(
  () => import("~/components/Blogs/BlogsDetail"),
  {
    ssr: true,
  }
);
export default function BlogsPage() {
  return <AboutDetailFunc />;
}
