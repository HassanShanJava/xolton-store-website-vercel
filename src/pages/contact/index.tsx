import dynamic from "next/dynamic";
import React from "react";

const ContactFunc = dynamic(() => import("~/components/Contact/ContactUs"), {
  ssr: true,
});
export default function FaqPage() {
  return <ContactFunc />;
}
