import Image from "next/image";
import Header from "./../components/Header"
import Body from "@/components/Body";
import NavBar from "@/components/LandingPage/NavBar";
import LandBody from "@/components/LandingPage/LandBody";
import BottomSection from "@/components/LandingPage/LandBody/BottomSection";
import Footer from "@/components/LandingPage/footer";

export default function Home() {
  return (
    <div>
      <NavBar />
      <LandBody></LandBody>
      <BottomSection></BottomSection>
      <Footer></Footer>
      
    </div>
    
  );
}
