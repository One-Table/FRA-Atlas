"use client";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";

export default function MidSection() {
  return (
    <div className="flex w-full h-[75vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      <LeftSection />
      <RightSection />
    </div>
  );
}
