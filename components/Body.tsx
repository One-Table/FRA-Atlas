'use client'
import Map from "./Map";
import InfoG1 from "./InfoG1";
import InfoG2 from "./InfoG2";
import UploadedDocs from "./UploadedDocs";
import React, { useState } from "react";

const Body = () => {
  return (
    <div className="flex h-[calc(100vh-80px)] text-black"> 
      {/* Left side - 60% */}
      <div className="w-full overflow-y-auto p-4 bg-gray-100 flex flex-col gap-4">

        <Map></Map>

      </div>
    </div>
  );
};

export default Body;
