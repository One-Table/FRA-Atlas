import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const links = [
    { title: "Home", href: "/" },
    { title: "Datasets", href: "/datasets" },
    { title: "Reports", href: "/reports" },
    { title: "Tools", href: "/tools" },
  ];

  return (
    <div className="flex flex-row items-center justify-between bg-white text-black h-24 px-6 shadow-md">
      {/* Logo Section */}
      <div className="flex items-center">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Ministry_of_Tribal_Affairs.svg"
          alt="Ministry of Tribal Affairs Logo"
          width={200}
          height={80}
        />
      </div>

      {/* Navbar Links */}
      <div className="flex gap-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-4 py-2 rounded-md hover:bg-gray-200 transition"
          >
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
