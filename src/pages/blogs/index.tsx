import dynamic from "next/dynamic";
import React from "react";
import { api } from "~/utils/api";

const BlogFunc = dynamic(() => import("~/components/Blogs/BlogsListing"), {
  ssr: true,
});
export default function BlogsPage() {
  return <BlogFunc />;
}
