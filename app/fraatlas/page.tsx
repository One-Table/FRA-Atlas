import Map from "@/components/fraatlas/Map";
import Fact from "@/components/fraatlas/Fact";
import SearchBox from "@/components/fraatlas/SearchBox";


export default function Home() {
  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 flex items-center justify-center bg-gray-200">
        <Map />
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
