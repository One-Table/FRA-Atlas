"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import "../style.css"; // Adjust path as needed

const FRAAppLayout = dynamic(() => import("../../components/fraatlas/FRAAppLayout"), {
  ssr: false,
});

export default function Page() {
  return <FRAAppLayout />;
}
