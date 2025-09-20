import Image from "next/image";
import StateSelector from "./StateSelector";
import YearSelector from "./YearSelector";

const Header = () => {
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
      {/* <div className="flex gap-6">
        <StateSelector></StateSelector>
        <YearSelector></YearSelector>
        
      </div> */}
    </div>
  );
};

export default Header;
