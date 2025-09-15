import Map from "./Map";
import UploadedDocs from "./UploadedDocs";
import InfoG1 from "./InfoG1";
import InfoG2 from "./InfoG2";

const Body = () => {
  return (
    <div className="flex h-[calc(100vh-80px)] text-black"> 
      {/* Left side - 60% */}
      <div className="w-3/5 overflow-y-auto p-4 bg-gray-100 flex flex-col gap-4">

        <Map></Map>
        <UploadedDocs></UploadedDocs>

        
      </div>

      {/* Right side - 40% */}
      <div className="w-2/5 overflow-y-auto p-4 bg-gray-200 gap-4 flex flex-col">
        <InfoG1></InfoG1>
        <InfoG2></InfoG2>


      </div>
    </div>
  );
};

export default Body;
