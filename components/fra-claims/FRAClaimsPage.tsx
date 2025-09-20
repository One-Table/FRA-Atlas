'use client';

import { Calendar, CheckCircle, Clock, Eye, FileText, Home, MapPin, Search, User, Users, XCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';

// Import data and utilities from external mock-data
import {
  districtBoundaries,
  handleEnhancedClaimSelect,
  mockFRACommunityResourceClaims,
  mockFRAIndividualClaims,
  type FRACommunityResourceClaim,
  type FRAIndividualClaim
} from './data/mock-data';

// Dynamic import for map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });

// Custom marker creation function
const createCustomIcon = (status: string, isIndividual: boolean) => {
  if (typeof window === 'undefined') return null;
  const L = require('leaflet');
  const color = status === 'approved' ? '#4CAF50' : status === 'pending' ? '#FF9800' : '#F44336';
  const icon = isIndividual ? '👤' : '👥';
  return L.divIcon({
    html: `<div style="background: ${color}; border-radius: 50%; padding: 8px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); font-size: 16px; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px;">${icon}</div>`,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

// District marker creation function for boundary center
const createDistrictIcon = () => {
  if (typeof window === 'undefined') return null;
  const L = require('leaflet');
  return L.divIcon({
    html: `<div style="background: #1976D2; border-radius: 50%; padding: 10px; border: 3px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.4); font-size: 18px; display: flex; align-items: center; justify-content: center; width: 50px; height: 50px; color: white;">🏛️</div>`,
    className: 'district-marker',
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50]
  });
};

// Selected claim marker with pulsing golden border
const createSelectedClaimIcon = (status: string, isIndividual: boolean) => {
  if (typeof window === 'undefined') return null;
  const L = require('leaflet');
  const color = status === 'approved' ? '#4CAF50' : status === 'pending' ? '#FF9800' : '#F44336';
  const icon = isIndividual ? '👤' : '👥';
  return L.divIcon({
    html: `<div style="background: ${color}; border-radius: 50%; padding: 12px; border: 4px solid #FFD700; box-shadow: 0 4px 8px rgba(0,0,0,0.4), 0 0 20px rgba(255,215,0,0.6); font-size: 20px; display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; animation: pulse 2s infinite;">${icon}</div>`,
    className: 'selected-marker',
    iconSize: [60, 60],
    iconAnchor: [30, 60],
    popupAnchor: [0, -60]
  });
};

const FRAClaimsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'location' | 'title'>('name');
  const [selectedClaim, setSelectedClaim] = useState<FRAIndividualClaim | FRACommunityResourceClaim | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.2961, 85.8245]);
  const [mapZoom, setMapZoom] = useState(7);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [claimTypeFilter, setClaimTypeFilter] = useState<'all' | 'individual' | 'community'>('all');
  const [isClient, setIsClient] = useState(false);
  const [highlightedDistrict, setHighlightedDistrict] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);

    // Add CSS animation for pulsing effect
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Filtering & search
  const filteredClaims = useMemo(() => {
    let individuals = mockFRAIndividualClaims;
    let communities = mockFRACommunityResourceClaims;

    if (statusFilter !== 'all') {
      individuals = individuals.filter(c => c.status === statusFilter);
      communities = communities.filter(c => c.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (searchType === 'name') {
        individuals = individuals.filter(c =>
          c.claimantName.toLowerCase().includes(q) ||
          c.spouseName?.toLowerCase().includes(q) ||
          c.fatherMotherName.toLowerCase().includes(q)
        );
        communities = communities.filter(c =>
          c.claimants.some(claimant => claimant.name.toLowerCase().includes(q))
        );
      } else if (searchType === 'location') {
        individuals = individuals.filter(c =>
          c.village.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q) ||
          c.tehsilTaluka.toLowerCase().includes(q) ||
          c.gramPanchayat.toLowerCase().includes(q)
        );
        communities = communities.filter(c =>
          c.village.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q) ||
          c.tehsilTaluka.toLowerCase().includes(q) ||
          c.gramPanchayat.toLowerCase().includes(q)
        );
      } else if (searchType === 'title') {
        individuals = individuals.filter(c =>
          c.titleNumber?.toLowerCase().includes(q)
        );
        communities = communities.filter(c =>
          c.titleNumber?.toLowerCase().includes(q)
        );
      }
    }
    return {
      individuals: claimTypeFilter === 'community' ? [] : individuals,
      communities: claimTypeFilter === 'individual' ? [] : communities,
    };
  }, [searchQuery, searchType, statusFilter, claimTypeFilter]);

  const allClaims = [...filteredClaims.individuals, ...filteredClaims.communities];

  const getStatusBadge = (status: string) => {
    const config = {
      approved: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
      rejected: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle }
    }[status] || { color: '', icon: null };
    const Icon = config.icon;
    if (!Icon) return null;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Handle claim selection with enhanced zoom and highlighting
  const handleClaimSelect = (claim: FRAIndividualClaim | FRACommunityResourceClaim) => {
    handleEnhancedClaimSelect(
      claim,
      setSelectedClaim,
      setMapCenter,
      setMapZoom,
      setHighlightedDistrict
    );
  };

  const isIndividualClaim = (claim: FRAIndividualClaim | FRACommunityResourceClaim): claim is FRAIndividualClaim => {
    return 'claimantName' in claim;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">

          {/* Left Logo + Title */}
          <div className="flex items-center gap-4">
            {/* Ministry Logo (replace src with correct logo path) */}
            <img
              src="/logo-emblem.png"
              alt="Emblem of India"
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                जनजातीय कार्य मंत्रालय
              </h1>
              <h2 className="text-xl font-bold text-gray-900">
                MINISTRY OF TRIBAL AFFAIRS
              </h2>
            </div>
          </div>

          {/* Right Stats */}
          <div className="flex items-center gap-8 text-gray-800">
            <div className="text-center">
              <div className="text-2xl font-bold">{allClaims.length}</div>
              <div className="text-sm text-gray-600">Total Claims</div>
            </div>
            <div className="w-px h-10 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">{allClaims.filter(c => c.status === 'approved').length}</div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="w-px h-10 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{allClaims.filter(c => c.status === 'pending').length}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>
      </header>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Search and Filters Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search Box */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Search size={20} className="text-green-600" />
              Search Claims
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search By</label>
                <select
                  value={searchType}
                  onChange={e => setSearchType(e.target.value as 'name' | 'location' | 'title')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black bg-white"
                >
                  <option value="name">Claimant Name</option>
                  <option value="location">Location (Village/District)</option>
                  <option value="title">Title Number</option>
                </select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={
                    searchType === 'name'
                      ? 'Enter claimant name...'
                      : searchType === 'location'
                        ? 'Enter village, district, or tehsil...'
                        : 'Enter title number...'
                  }
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black bg-white placeholder-gray-500"
                  style={{ color: '#000', backgroundColor: '#fff' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={claimTypeFilter}
                    onChange={e => setClaimTypeFilter(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black bg-white"
                  >
                    <option value="all">All Types</option>
                    <option value="individual">Individual</option>
                    <option value="community">Community</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-green-50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText size={20} className="text-green-600" />
                Search Results ({allClaims.length})
              </h3>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {allClaims.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-600">No claims found matching your search criteria.</p>
                  <p className="text-sm text-gray-500 mt-2">Try adjusting your search terms or filters.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {allClaims.map(claim => (
                    <div
                      key={claim.id}
                      onClick={() => handleClaimSelect(claim)}
                      className={`p-4 hover:bg-green-50 cursor-pointer transition-all duration-200 border-l-4 ${selectedClaim?.id === claim.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-transparent hover:border-green-300'
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {isIndividualClaim(claim) ? (
                              <User size={16} className="text-green-600" />
                            ) : (
                              <Users size={16} className="text-green-600" />
                            )}
                            <h4 className="font-medium text-gray-900">
                              {isIndividualClaim(claim) ? claim.claimantName : `${claim.village} Community`}
                            </h4>
                            {selectedClaim?.id === claim.id && (
                              <span className="ml-2 px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                                Selected
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin size={12} />
                              {claim.village}, {claim.district}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(claim.claimDate).toLocaleDateString('en-IN')}
                            </div>
                            {claim.titleNumber && (
                              <div className="text-xs text-green-600 font-mono bg-green-50 px-2 py-1 rounded">
                                {claim.titleNumber}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="ml-4">{getStatusBadge(claim.status)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map and Details Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-green-50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin size={20} className="text-green-600" />
                Claims Location Map
                {highlightedDistrict && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    📍 {highlightedDistrict} District
                  </span>
                )}
                {selectedClaim && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    🎯 {isIndividualClaim(selectedClaim) ? selectedClaim.claimantName : `${selectedClaim.village} Community`}
                  </span>
                )}
              </h3>
            </div>

            <div className="h-96">
              {isClient && (
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: '100%', width: '100%' }}
                  className="z-0"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

                  {/* District Highlight Circle */}
                  {highlightedDistrict && districtBoundaries[highlightedDistrict as keyof typeof districtBoundaries] && (
                    <>
                      <Circle
                        center={districtBoundaries[highlightedDistrict as keyof typeof districtBoundaries].center}
                        radius={districtBoundaries[highlightedDistrict as keyof typeof districtBoundaries].radius}
                        pathOptions={{
                          color: '#1976D2',
                          weight: 3,
                          fillColor: '#1976D2',
                          fillOpacity: 0.1
                        }}
                      />
                      <Marker
                        position={districtBoundaries[highlightedDistrict as keyof typeof districtBoundaries].center}
                        icon={createDistrictIcon()}
                      >
                        <Popup>
                          <div className="p-3 min-w-[200px]">
                            <h4 className="font-semibold text-gray-900 mb-2 text-center">🏛️ {highlightedDistrict} District</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div className="text-center">Administrative Boundary</div>
                              <div className="border-t pt-2 mt-2">
                                <div>📊 Claims in this district:</div>
                                <div className="ml-2">
                                  Individual: {filteredClaims.individuals.filter(c => c.district === highlightedDistrict).length}
                                </div>
                                <div className="ml-2">
                                  Community: {filteredClaims.communities.filter(c => c.district === highlightedDistrict).length}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    </>
                  )}

                  {/* Individual Claims Markers */}
                  {filteredClaims.individuals.map(claim => {
                    const isSelected = selectedClaim?.id === claim.id;
                    const icon = isSelected
                      ? createSelectedClaimIcon(claim.status, true)
                      : createCustomIcon(claim.status, true);
                    return icon ? (
                      <Marker key={claim.id} position={claim.coordinates} icon={icon}>
                        <Popup>
                          <div className="p-3 min-w-[200px]">
                            <h4 className="font-semibold text-gray-900 mb-2">{claim.claimantName}</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div className="flex items-center gap-1">
                                <MapPin size={12} />
                                {claim.village}, {claim.district}
                              </div>
                              <div className="flex items-center gap-1">
                                <Home size={12} />
                                Area: {claim.area} hectares
                              </div>
                              <div className="mt-2">{getStatusBadge(claim.status)}</div>
                              {isSelected && <div className="mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">🎯 Selected Claim</div>}
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ) : null;
                  })}

                  {/* Community Claims Markers */}
                  {filteredClaims.communities.map(claim => {
                    const isSelected = selectedClaim?.id === claim.id;
                    const icon = isSelected
                      ? createSelectedClaimIcon(claim.status, false)
                      : createCustomIcon(claim.status, false);
                    return icon ? (
                      <Marker key={claim.id} position={claim.coordinates} icon={icon}>
                        <Popup>
                          <div className="p-3 min-w-[200px]">
                            <h4 className="font-semibold text-gray-900 mb-2">{claim.village} Community</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div className="flex items-center gap-1">
                                <MapPin size={12} />
                                {claim.village}, {claim.district}
                              </div>
                              <div className="flex items-center gap-1">
                                <Home size={12} />
                                Area: {claim.area} hectares
                              </div>
                              <div>Claimants: {claim.claimants.length} members</div>
                              <div className="mt-2">{getStatusBadge(claim.status)}</div>
                              {isSelected && <div className="mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">🎯 Selected Claim</div>}
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ) : null;
                  })}
                </MapContainer>
              )}
            </div>
          </div>

          {/* Claim Details */}
          {selectedClaim && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-green-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Eye size={20} className="text-green-600" />
                    Claim Details - {selectedClaim.id}
                    <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      📍 {selectedClaim.district} District
                    </span>
                  </h3>
                  {getStatusBadge(selectedClaim.status)}
                </div>
              </div>

              <div className="p-6">
                {isIndividualClaim(selectedClaim) ? (
                  // Individual Claim Details
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 text-lg border-b border-green-200 pb-2">Personal Information</h4>
                        <div className="space-y-3 text-sm">
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Name:</span>
                            <span className="col-span-2 text-gray-900">{selectedClaim.claimantName}</span>
                          </div>
                          {selectedClaim.spouseName && (
                            <div className="grid grid-cols-3 gap-2">
                              <span className="font-medium text-gray-700">Spouse:</span>
                              <span className="col-span-2 text-gray-900">{selectedClaim.spouseName}</span>
                            </div>
                          )}
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Father/Mother:</span>
                            <span className="col-span-2 text-gray-900">{selectedClaim.fatherMotherName}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Address:</span>
                            <span className="col-span-2 text-gray-900">{selectedClaim.address}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Category:</span>
                            <span className="col-span-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedClaim.scheduledTribe ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                {selectedClaim.scheduledTribe ? 'Scheduled Tribe' : 'Other Traditional Forest Dweller'}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 text-lg border-b border-green-200 pb-2">Location Details</h4>
                        <div className="space-y-3 text-sm">
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Village:</span>
                            <span className="col-span-2 text-gray-900">{selectedClaim.village}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Gram Panchayat:</span>
                            <span className="col-span-2 text-gray-900">{selectedClaim.gramPanchayat}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Tehsil/Taluka:</span>
                            <span className="col-span-2 text-gray-900">{selectedClaim.tehsilTaluka}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">District:</span>
                            <span className="col-span-2 text-gray-900 font-semibold">{selectedClaim.district}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Coordinates:</span>
                            <span className="col-span-2 font-mono text-xs">{selectedClaim.coordinates[0]}, {selectedClaim.coordinates[1]}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Claim Date:</span>
                            <span className="col-span-2 text-gray-900">{new Date(selectedClaim.claimDate).toLocaleDateString('en-IN')}</span>
                          </div>
                          {selectedClaim.titleNumber && (
                            <div className="grid grid-cols-3 gap-2">
                              <span className="font-medium text-gray-700">Title Number:</span>
                              <span className="col-span-2 font-mono text-green-700 bg-green-50 px-2 py-1 rounded">{selectedClaim.titleNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {selectedClaim.familyMembers.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 text-lg border-b border-green-200 pb-2">
                          Family Members ({selectedClaim.familyMembers.length})
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                            <thead className="bg-green-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Age</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Relationship</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {selectedClaim.familyMembers.map((member, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 text-sm text-gray-900">{member.name}</td>
                                  <td className="px-6 py-4 text-sm text-gray-900">{member.age}</td>
                                  <td className="px-6 py-4 text-sm text-gray-900">{member.relationship}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 text-lg border-b border-green-200 pb-2">Land Claims</h4>
                      <div className="grid gap-4">
                        {selectedClaim.landClaims.map((landClaim, idx) => (
                          <div key={idx} className="p-5 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex justify-between items-start mb-3">
                              <h5 className="font-medium text-gray-900 capitalize text-lg">{landClaim.type.replace('-', ' ')}</h5>
                              <span className="text-lg font-semibold text-green-700">{landClaim.area} hectares</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">{landClaim.description}</p>
                            <div className="text-xs text-gray-600 bg-white p-2 rounded border">
                              <strong>Evidence:</strong> {landClaim.evidence.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Community Claims Details
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 text-lg border-b border-green-200 pb-2">Community Information</h4>
                        <div className="space-y-3 text-sm">
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Village/Gram Sabha:</span>
                            <span className="col-span-2 text-gray-900">{selectedClaim.village}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Gram Panchayat:</span>
                            <span className="col-span-2 text-gray-900">{selectedClaim.gramPanchayat}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Tehsil/Taluka:</span>
                            <span className="col-span-2 text-gray-900">{selectedClaim.tehsilTaluka}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">District:</span>
                            <span className="col-span-2 text-gray-900 font-semibold">{selectedClaim.district}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Area:</span>
                            <span className="col-span-2 text-gray-900 font-semibold">{selectedClaim.area} hectares</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Coordinates:</span>
                            <span className="col-span-2 text-gray-900 font-mono text-xs">{selectedClaim.coordinates[0]}, {selectedClaim.coordinates[1]}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Claim Date:</span>
                            <span className="col-span-2 text-gray-900">{new Date(selectedClaim.claimDate).toLocaleDateString('en-IN')}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 text-lg border-b border-green-200 pb-2">Administrative Details</h4>
                        <div className="space-y-3 text-sm">
                          {selectedClaim.khasraCompartmentNo && (
                            <div className="grid grid-cols-3 gap-2">
                              <span className="font-medium text-gray-700">Khasra/Compartment:</span>
                              <span className="col-span-2 text-gray-900">{selectedClaim.khasraCompartmentNo.join(', ')}</span>
                            </div>
                          )}
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Bordering Villages:</span>
                            <span className="col-span-2 text-gray-900">{selectedClaim.borderingVillages.join(', ')}</span>
                          </div>
                          {selectedClaim.titleNumber && (
                            <div className="grid grid-cols-3 gap-2">
                              <span className="font-medium text-gray-700">Title Number:</span>
                              <span className="col-span-2 font-mono text-green-700 bg-green-50 px-2 py-1 rounded">{selectedClaim.titleNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 text-lg border-b border-green-200 pb-2">Community Claimants ({selectedClaim.claimants.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedClaim.claimants.map((claimant, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                            <span className="text-sm font-medium text-gray-900">{claimant.name}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${claimant.status === 'ST' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                              {claimant.status === 'ST' ? 'Scheduled Tribe' : 'Other Traditional Forest Dweller'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 text-lg border-b border-green-200 pb-2">Community Rights</h4>
                      <div className="grid gap-4">
                        {selectedClaim.communityRights.map((right, idx) => (
                          <div key={idx} className="p-5 bg-green-50 rounded-lg border border-green-200">
                            <h5 className="font-medium text-gray-900 capitalize mb-2 text-lg">{right.type.replace('-', ' ')}</h5>
                            <p className="text-sm text-gray-700">{right.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 text-lg border-b border-green-200 pb-2">Resource Description</h4>
                      <div className="p-5 bg-gray-50 rounded-lg border">
                        <p className="text-sm text-gray-700 leading-relaxed">{selectedClaim.description}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 text-lg border-b border-green-200 pb-2">Supporting Evidence</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedClaim.evidence.map((evidence, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-medium border border-blue-200">{evidence}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FRAClaimsPage;
