export default function Page() {
  return (
    <div className="flex h-screen">
      {/* Left Section - 50% */}
      <div className="w-1/2 bg-gray-200 flex items-center justify-center">
        Left
      </div>

      {/* Right Section - 50% */}
      <div className="w-1/2 flex flex-col">
        {/* Top - 20% */}
        <div className="h-[20%] bg-blue-200 flex items-center justify-center">
          Right Top
        </div>

        {/* Bottom - 80% */}
        <div className="h-[80%] flex flex-col">
          <div className="h-1/2 bg-green-200 flex items-center justify-center">
            Bottom Left
          </div>
          <div className="h-1/2 bg-green-300 flex items-center justify-center">
            Bottom Right
          </div>
        </div>
      </div>
    </div>
  );
}
