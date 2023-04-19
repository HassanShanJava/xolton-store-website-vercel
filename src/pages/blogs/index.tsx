import dynamic from "next/dynamic";
import React from "react";
import { api } from "~/utils/api";


const BlogFunc = dynamic(() => import("~/components/Blogs/BlogsListing"), {
  ssr: true,
});
export default function BlogsPage() {
  return <BlogFunc />;
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