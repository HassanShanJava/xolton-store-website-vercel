import dynamic from "next/dynamic";
import React from "react";
import { api } from "~/utils/api";

const PrivacyFunc = dynamic(
  () => import("~/components/Privacy/PrivacyPolicy"),
  {
    ssr: false,
  }
);
export default function FaqPage() {
  return <PrivacyFunc />;
}
