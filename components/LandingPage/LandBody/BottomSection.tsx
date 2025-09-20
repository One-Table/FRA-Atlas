"use client";
import Link from "next/link";

export default function BottomSection() {
  const cards = [
    { title: "FRA Implementation Records", href: "/documentation" },
    { title: "Documentation", href: "/frarecords" },
    { title: "NGOs", href: "/NGOS" },
    { title: "FRA Atlas", href: "/fraatlas" },
    { title: "FRA Claims", href: "/fra-claims" },

  ];

  

  return (
    <div className="relative flex justify-center py-16 bg-gradient-to-br from-green-200 via-green-100 to-white overflow-hidden">
      {/* Background image layer with increased opacity and smaller tiles */}
      <div
        className="absolute inset-0 bg-repeat"
        style={{
          backgroundImage:
            "url('https://www.memeraki.com/cdn/shop/articles/warli-art-tribal-art-of-india-603167.jpg?v=1661327710')",
          backgroundSize: "100px 100px", // smaller tile size for denser pattern
          backgroundPosition: "center",
          opacity: 0.4, // increased opacity for clearer image
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Content layer */}
      <div className="flex flex-wrap justify-center gap-8 max-w-6xl w-full relative z-10">
        {cards.map((card, idx) => (
          <Link key={idx} href={card.href}>
            <div className="cursor-pointer flex flex-col items-center justify-center bg-white rounded-2xl p-8 w-56 h-40 hover:scale-105 transition-transform duration-300 shadow-lg border border-green-300">
              {/* Solid background, no blur for vibrancy */}
              <h2 className="text-xl font-extrabold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent text-center">
                {card.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
