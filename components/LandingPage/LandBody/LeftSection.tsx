import { useEffect, useState } from "react";

export default function LeftSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-1/2 h-full bg-gradient-to-br from-green-700 via-green-800 to-green-900">
      <div className="w-full h-full backdrop-blur-lg bg-green-900/20 border-r border-green-500/20 p-10 flex flex-col justify-center text-white">
        {loaded ? (
          <div className="animate-fadeIn space-y-6">
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-green-300 bg-clip-text text-transparent tracking-wide">
              Forest Rights Act
            </h2>
            <p className="text-lg leading-relaxed text-gray-200">
              The Forest Rights Act (FRA) 2006 is a milestone in the legislative history of independent India.
              The Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006
              is a result of the protracted struggle by the marginal and tribal communities of our country to assert
              their rights over the forestland over which they were traditionally dependent. This Act is crucial to
              the rights of millions of tribals and other forest dwellers in different parts of our country as it provides
              for the restitution of deprived forest rights across India, including both individual rights to cultivated land
              in forestland and community rights over common property resources.
              <br />
              <br />
              This is due to its mandate to{" "}
              <span className="font-semibold text-cyan-300">‘undo the historical injustice’</span> 
              done to millions of forest-dwelling tribal and other communities whose pre-existing rights were not recognized 
              during the consolidation of state forests.
            </p>

            <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-green-500 text-gray-900 font-semibold hover:from-cyan-300 hover:to-green-400 transition duration-300 shadow-md">
              Read More →
            </button>
          </div>
        ) : (
          <p className="text-gray-300 text-xl animate-pulse">Loading...</p>
        )}
      </div>
    </div>
  );
}
