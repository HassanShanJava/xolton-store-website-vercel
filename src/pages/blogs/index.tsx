import dynamic from "next/dynamic";
import React from "react";
import { api } from "~/utils/api";

const AboutFunc = dynamic(() => import("~/components/Blogs/BlogsListing"), {
  ssr: false,
});
export default function BlogsPage() {
  return <AboutFunc />;
}
