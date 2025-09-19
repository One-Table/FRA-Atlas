import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-row items-center justify-between bg-white text-white h-24 px-6">
      <div className="flex items-center py-24">

        <Image
      src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Ministry_of_Tribal_Affairs.svg"
      alt="Ministry of Tribal Affairs Logo"
      width={200}
      height={80}
    />
      </div>
      <div className="flex gap-6">  
      </div>
    </div>
    
  );
}