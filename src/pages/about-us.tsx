import dynamic from "next/dynamic";
import React from "react";

const AboutFunc = dynamic(() => import("../components/About/AboutUs"), {
  ssr: false,
});
export default function AboutPage() {
  return <AboutFunc />;
}