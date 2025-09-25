'use client';


// Loading component for the dashboard
export default function TribalRepositoryLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Government Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xs">GOI</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">भारत सरकार अनुसूचित जाति कल्याण</div>
                <div className="text-lg font-semibold text-gray-900">MINISTRY OF TRIBAL AFFAIRS</div>
              </div>
            </div>

            {/* Main Title */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Tribal Digital Repository</h1>
              <div className="w-6 h-1 bg-blue-500 mx-auto mt-2 rounded animate-pulse"></div>
            </div>

            {/* Filters skeleton */}
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <div>
                  <div className="w-12 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div>
                  <div className="w-10 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Loading skeletons */}
          <div className="col-span-8 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4 text-center animate-pulse">
                  <div className="w-12 h-8 bg-gray-200 rounded mx-auto mb-2"></div>
                  <div className="w-16 h-4 bg-gray-200 rounded mx-auto"></div>
                </div>
              ))}
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="w-40 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-80 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 animate-pulse"></div>
            </div>

            {/* Chart Sections */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="w-44 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Loading skeletons */}
          <div className="col-span-4 space-y-6">
            {/* Document Types */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="w-28 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sectors */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="w-40 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-2">
                {[...Array(14)].map((_, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-6 h-3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4 items-center">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-64 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="text-right">
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="w-16 h-6 bg-gray-900 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}