"use client";
import Fact from "@/components/fraatlas/Fact";
import SearchBox from "@/components/fraatlas/SearchBox";
import dynamic from "next/dynamic";
const EnhancedFRAMap = dynamic(
  () => import("@/components/fraatlas/EnhancedFRAMap"),
  { ssr: false }
);


export default function Home() {
  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 flex items-center justify-center bg-gray-200">
        <EnhancedFRAMap />
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex flex-col">
        {/* Top Right */}
        <div className="flex-1 flex items-center justify-center bg-gray-300">
          <SearchBox />
          
        </div>

        {/* Bottom Right */}
        <div className="flex-1 flex items-center justify-center bg-gray-400">
          <Fact />
        </div>
      </div>
    </div>
  );
}
