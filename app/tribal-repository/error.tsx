'use client';

import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function TribalRepositoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Government Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
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
              <div className="text-red-500 text-sm mt-1">System Error</div>
            </div>

            {/* Home Button */}
            <div className="text-right">
              <button 
                onClick={() => window.location.href = '/'}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                <Home className="h-6 w-6 text-gray-600 hover:text-blue-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Dashboard Temporarily Unavailable
            </h2>
            
            <p className="text-gray-600 mb-6 text-lg">
              We're experiencing technical difficulties loading the Tribal Digital Repository dashboard. 
              Our team has been notified and is working to resolve this issue.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Error Details:</h3>
              <p className="text-sm text-gray-600 font-mono">
                {error.message || 'An unexpected error occurred'}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-1">
                  Error ID: {error.digest}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={reset}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Try Again
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Home className="h-5 w-5 mr-2" />
                Return Home
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">
                If the problem persists, you can:
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Check your internet connection</li>
                <li>• Clear your browser cache and cookies</li>
                <li>• Contact technical support at support@tribal.gov.in</li>
              </ul>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Alternative Access
            </h3>
            <p className="text-blue-800 mb-4">
              While we work on fixing this issue, you can still access other parts of the Ministry's digital services:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a 
                href="/fra-claims" 
                className="block p-4 bg-white rounded border border-blue-200 hover:border-blue-300 transition-colors"
              >
                <h4 className="font-semibold text-blue-900">FRA Claims Portal</h4>
                <p className="text-sm text-blue-700 mt-1">Access forest rights claims and documentation</p>
              </a>
              <a 
                href="/fraatlas" 
                className="block p-4 bg-white rounded border border-blue-200 hover:border-blue-300 transition-colors"
              >
                <h4 className="font-semibold text-blue-900">FRA Atlas</h4>
                <p className="text-sm text-blue-700 mt-1">Interactive mapping and geographical data</p>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Ministry of Tribal Affairs, Government of India
            </p>
            <p className="text-xs text-gray-500 mt-1">
              For technical support, contact: support@tribal.gov.in
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}