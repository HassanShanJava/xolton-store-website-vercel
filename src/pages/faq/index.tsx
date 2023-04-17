import dynamic from "next/dynamic";
import React from "react";
import { api } from "~/utils/api";

const FaqFunc = dynamic(() => import("~/components/Faq/Faqs"), {
  ssr: true,
});
export default function FaqPage() {
  return <FaqFunc />;
}