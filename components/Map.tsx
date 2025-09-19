'use client'
import dynamic from "next/dynamic";
const FRAAppLayout = dynamic(() => import("./fraatlas/FRAAppLayout"), {
  ssr: false,
});
const Map = () => {
  return <div className="flex w-full h-96 border-amber-300 border-4">
    <FRAAppLayout/>
  </div>;
}

export default Map;