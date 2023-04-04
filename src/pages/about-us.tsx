import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";

const AboutFunc = dynamic(() => import("../components/About/AboutUs"), {
  ssr: false,
});
export default function AboutPage() {
  return <AboutFunc />;
}