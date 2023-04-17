import dynamic from "next/dynamic";
import React from "react";
import { api } from "~/utils/api";

const ContactFunc = dynamic(() => import("~/components/Contact/ContactUs"), {
  ssr: false,
});
export default function FaqPage() {
  return <ContactFunc />;
}
