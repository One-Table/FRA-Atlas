import Map from "@/components/frarecords/Map";
import InfoG3 from "@/components/frarecords/InfoG3";
import InfoG4 from "@/components/frarecords/InfoG4";
import InfoG1 from "@/components/frarecords/InfoG1";
import InfoG2 from "@/components/frarecords/InfoG2";

export default function Page() {
  return (
    <div className="flex h-screen">
      {/* Left Section - 35% */}
      <div className="w-[35%] bg-gray-200 flex items-center justify-center">
        <Map />
      </div>

      {/* Right Section - 65% */}
      <div className="w-[65%] flex flex-col">
        {/* Top Row */}
        <div className="flex flex-1">
          <div className="w-1/2 bg-blue-200 flex items-center justify-center">
            <InfoG1 />
          </div>
          <div className="w-1/2 bg-blue-300 flex items-center justify-center">
            <InfoG2 />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-1">
          <div className="w-1/2 bg-green-200 flex items-center justify-center">
            <InfoG3 />
          </div>
          <div className="w-1/2 bg-green-300 flex items-center justify-center">
            <InfoG4 />
          </div>
        </div>
      </div>
    </div>
  );
}
