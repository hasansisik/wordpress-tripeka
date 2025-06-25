"use client";
import dynamic from "next/dynamic";

const Services5 = dynamic(() => import("@/components/sections/Services5"), {
  ssr: false,
});

export default function SectionProjects() {
  return (
    <>
      {/* Services 5 */}
      <Services5 />
    </>
  );
}
