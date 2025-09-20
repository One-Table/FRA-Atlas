"use client";
import Link from "next/link";

export default function Footer() {
  const links = [
    { title: ".", href: "/" },
  ];

  return (
    <footer className="bg-gradient-to-r from-green-700 via-green-800 to-green-900 text-white px-8 py-12 w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Left Section: FRA Atlas Info */}
        <div className="md:w-1/2">
          <h2 className="text-2xl font-bold mb-4">FRA Atlas</h2>
          <p className="text-gray-200 text-lg">
            The FRA Atlas is a comprehensive platform providing insights and
            data sets on forests, biodiversity, and environmental trends. Explore
            reports, tools, and datasets to understand and protect our natural
            resources.
          </p>
        </div>

        {/* Right Section: Links */}
        <div className="md:w-1/2 flex flex-col md:flex-row justify-between md:items-start gap-6">
          {links.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="text-white font-semibold text-lg hover:text-green-300 transition-colors"
            >
              {link.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="mt-12 border-t border-green-600 pt-6 text-center text-gray-300 text-sm">
        &copy; {new Date().getFullYear()} FRA Atlas. All rights reserved.
      </div>
    </footer>
  );
}
