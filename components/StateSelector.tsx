"use client";

import { useState } from "react";
import { indianStates } from "@/lib/states";

const StateSelector = () => {
  const [selectedState, setSelectedState] = useState("");

  //OnChange Make an API call

  return (
    <select
      value={selectedState}
      onChange={(e) => setSelectedState(e.target.value)}
      className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none text-black"
    >
      <option value="">Select State</option>
      {indianStates.map((state) => (
        <option key={state} value={state}>
          {state}
        </option>
      ))}
    </select>
  );
};

export default StateSelector;
