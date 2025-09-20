import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  // ✅ Use direct image URLs from Pexels/Unsplash (download button → "copy image address")
  "https://images.pexels.com/photos/9078372/pexels-photo-9078372.jpeg?auto=compress&cs=tinysrgb&w=1200",  
  "https://cdn.pixabay.com/photo/2017/11/28/21/10/tribal-people-nature-2939285_1280.jpg",
];

export default function RightSection() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-1/2 h-full relative overflow-hidden bg-gray-950/90 backdrop-blur-lg border-l border-white/20 shadow-inner">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Tribal slide ${index}`}
          className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-in-out object-contain bg-black ${
            index === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        />
      ))}

      {/* Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-5 w-full flex justify-center gap-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-500 ${
              index === current ? "bg-cyan-400 w-6" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
