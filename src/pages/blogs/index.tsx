import dynamic from "next/dynamic";
import React from "react";
import { api } from "~/utils/api";



import { prisma } from "~/server/db";
export async function getStaticProps() {
  const storeBlogsData = await prisma.storeBlogs.findMany({
    where: {
      store_id: process.env.NEXT_PUBLIC_STORE_ID,
    },
  });
  // for (const element of storeBlogsData) {
  //   element.created_at = element?.created_at.toLocaleTimeString()
  //   element.updated_at = element?.updated_at.toLocaleTimeString()
  // }
  // console.log(storeBlogsData,"statoic storeBlogsData")
  storeBlogsData.forEach((listing:any) => {
    Object.entries(listing).forEach(([key, prop]) => {
      if (prop instanceof Date) {
        listing[key] = prop.toString();
      }
    });
  });

  return { props: {storeBlogsData} } ;
}


const BlogFunc = dynamic(() => import("~/components/Blogs/BlogsListing"), {
  ssr: true,
});
export default function BlogsPage({storeBlogsData}:any) {
  return <BlogFunc storeBlogsData={storeBlogsData}/>;
}


// export async function getStaticProps() {
//   // Call an external API endpoint to get posts.
//   // You can use any data fetching library

//   // By returning { props: { posts } }, the Blog component
//   // will receive `posts` as a prop at build time
//   const { data: storeBlogsData, isFetched } =
//     api.storeBlogs.getStoreBlogs.useQuery(
//       {},
//       {
//         refetchOnWindowFocus: false,
//       }
//     );
//   return {
//     props: {
//       storeBlogsData, isFetched 
//     },
//   }
// }