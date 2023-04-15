import dynamic from "next/dynamic";
import React from "react";
import { api } from "~/utils/api";

const AboutDetailFunc = dynamic(
  () => import("~/components/Blogs/BlogsDetail"),
  {
    ssr: false,
  }
);
export default function BlogsPage() {
  return <AboutDetailFunc />;
}
