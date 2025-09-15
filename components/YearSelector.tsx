"use client";

import { useState } from "react";
import { years } from "@/lib/years";

const YearSelector = () => {
  const [selectedYear, setSelectedYear] = useState("");

  //On Change make an API call

  return (
    <select
      value={selectedYear}
      onChange={(e) => setSelectedYear(e.target.value)}
      className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none text-black"
    >
      <option value="">Select State</option>
      {years.map((state) => (
        <option key={state} value={state}>
          {state}
        </option>
      ))}
    </select>
  );
};

export default YearSelector;
