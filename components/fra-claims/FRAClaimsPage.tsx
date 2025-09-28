'use client';

import {
  AlertTriangle,
  Briefcase,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Droplets,
  ExternalLink,
  Eye,
  FileText,
  Home,
  Image as ImageIcon,
  Leaf,
  MapPin,
  Search,
  Send,
  Tractor,
  User,
  Users,
  XCircle
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

// Import data and utilities from external mock-data - UPDATE THIS IMPORT TO USE THE 44-ENTRY DATASET
import {
  districtBoundaries,
  handleEnhancedClaimSelect,
  mockFRACommunityResourceClaims,
  mockFRAIndividualClaims,
  type FRACommunityResourceClaim,
  type FRAIndividualClaim
} from './data/mock-data'; // Updated import path

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
    popupAnchor: [0, -40],
  });
};

// District marker creation function for boundary center
const createDistrictIcon = () => {
  if (typeof window === 'undefined') return null;
  
  const L = require('leaflet');
  return L.divIcon({
    html: `<div style="background: #1976D2; border-radius: 50%; padding: 10px; border: 3px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.4); font-size: 18px; display: flex; align-items: center; justify-content: center; width: 50px; height: 50px; color: white;">📍</div>`,
    className: 'district-marker',
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
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
    popupAnchor: [0, -60],
  });
};

// Scheme Icons mapping
const getSchemeIcon = (schemeType: string) => {
  const iconMap: Record<string, React.ElementType> = {
    pmKisan: DollarSign,
    dajgua: Tractor,
    jalJeevanYojana: Droplets,
    pmAwasYojana: Building,
    mgnrega: Briefcase,
    forestRightsIncentive: Leaf
  };
  return iconMap[schemeType] || FileText;
};

const getSchemeColor = (status: string) => {
  const colorMap: Record<string, string> = {
    enrolled: 'text-green-600 bg-green-50 border-green-200',
    pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    not_enrolled: 'text-gray-500 bg-gray-50 border-gray-200'
  };
  return colorMap[status] || 'text-gray-500 bg-gray-50 border-gray-200';
};

const getSchemeName = (schemeType: string) => {
  const nameMap: Record<string, string> = {
    pmKisan: 'PM-KISAN',
    dajgua: 'DAJGUA',
    jalJeevanYojana: 'Jal Jeevan Yojana',
    pmAwasYojana: 'PM Awas Yojana',
    mgnrega: 'MGNREGA',
    forestRightsIncentive: 'Forest Rights Incentive'
  };
  return nameMap[schemeType] || schemeType;
};

// Simple Notification System
const useSimpleNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const showSuccess = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return { showNotification, notificationMessage, showSuccess };
};

// Success Popup Component
const SuccessPopup: React.FC<{ show: boolean; message: string }> = ({ show, message }) => {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#22c55e',
      color: 'white',
      padding: '20px 30px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '16px',
      fontWeight: '500',
      animation: 'fadeInOut 3s ease-in-out'
    }}>
      <CheckCircle size={24} />
      {message}
      
      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          15% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
      `}</style>
    </div>
  );
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
  const [showSchemeDetails, setShowSchemeDetails] = useState(false);
  const [showAtlas, setShowAtlas] = useState(false);
  
  const { showNotification, notificationMessage, showSuccess } = useSimpleNotification();

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
    
    return () => document.head.removeChild(style);
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
        individuals = individuals.filter(c => c.titleNumber?.toLowerCase().includes(q));
        communities = communities.filter(c => c.titleNumber?.toLowerCase().includes(q));
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
      'approved': { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      'pending': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
      'rejected': { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle }
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
    handleEnhancedClaimSelect(claim, setSelectedClaim, setMapCenter, setMapZoom, setHighlightedDistrict);
  };

  const isIndividualClaim = (claim: FRAIndividualClaim | FRACommunityResourceClaim): claim is FRAIndividualClaim => {
    return 'claimantName' in claim;
  };

  // Get eligible schemes count for notification
  const getEligibleSchemesCount = (claim: FRAIndividualClaim) => {
    let count = 0;
    Object.entries(claim.schemeEligibility).forEach(([scheme, details]) => {
      if (details.eligible && details.status === 'not_enrolled') {
        count++;
      }
    });
    return count;
  };

  // Handle notification button click
  const handleSendNotification = (claim: FRAIndividualClaim) => {
    const eligibleCount = getEligibleSchemesCount(claim);
    const totalEligible = Object.values(claim.schemeEligibility).filter(s => s.eligible).length;
    
    showSuccess(`Notification sent to ${claim.claimantName} for ${totalEligible} eligible scheme(s)`);
  };

  // Enhanced Individual FRA Atlas Component with Atlas Reference
  const IndividualFRAAtlas = ({ claim }: { claim: FRAIndividualClaim }) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mt-6">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MapPin size={20} className="text-green-600" />
          Individual FRA Atlas - {claim.claimantName}
          <span className="ml-auto text-sm text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded">
            ID: {claim.id}
          </span>
        </h3>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Atlas Map Preview & Reference */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 border-b border-green-200 pb-2">
                Land Classification & Usage
              </h4>
              {claim.fraAtlasReference && (
                <div className="flex items-center gap-2 text-xs text-blue-600">
                  <ImageIcon size={14} />
                  <span>Atlas Reference Available</span>
                </div>
              )}
            </div>
            
            {/* FRA Atlas Reference Display */}
            {claim.fraAtlasReference && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-blue-800 flex items-center gap-2">
                    <FileText size={16} />
                    FRA Atlas Reference
                  </h5>
                  <button 
                    onClick={() => {
                      // In a real implementation, this would open the actual atlas file
                      showSuccess(`Opening FRA Atlas: ${claim.fraAtlasReference}`);
                    }}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                  >
                    <ExternalLink size={12} />
                    View Atlas
                  </button>
                </div>
                <div className="text-sm text-blue-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Reference File:</span>
                    <code className="bg-blue-100 px-2 py-1 rounded text-xs">
                      {claim.fraAtlasReference}
                    </code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>District Atlas:</span>
                    <span className="font-medium">{claim.district} Forest Atlas</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Coordinates:</span>
                    <span className="font-mono text-xs">
                      {claim.coordinates[0].toFixed(4)}°N, {claim.coordinates[1].toFixed(4)}°E
                    </span>
                  </div>
                  <div className="mt-3 p-2 bg-white rounded border text-xs">
                    <strong>Atlas Integration:</strong> This claim is mapped in the comprehensive FRA Atlas 
                    system providing detailed forest rights visualization and geographic context.
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg p-6 text-center">
              <div className="w-full h-48 bg-gradient-to-br from-green-200 to-blue-200 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <MapPin size={48} className="text-green-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-800">
                    {claim.village} Forest Atlas
                  </div>
                  <div className="text-sm text-gray-600">
                    {claim.coordinates[0].toFixed(4)}°N, {claim.coordinates[1].toFixed(4)}°E
                  </div>
                  <div className="text-xs text-blue-600 mt-2 font-medium">
                    Referenced in: FRA_ATLAS_TEST.jpg
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-green-500 text-white p-2 rounded">
                  <div>Forest Land</div>
                  <div className="font-semibold">{((claim.area || 0) * 0.6).toFixed(1)} ha</div>
                </div>
                <div className="bg-yellow-500 text-white p-2 rounded">
                  <div>Cultivation</div>
                  <div className="font-semibold">{((claim.area || 0) * 0.3).toFixed(1)} ha</div>
                </div>
                <div className="bg-blue-500 text-white p-2 rounded">
                  <div>Habitation</div>
                  <div className="font-semibold">{((claim.area || 0) * 0.1).toFixed(1)} ha</div>
                </div>
              </div>
            </div>
          </div>

          {/* Land Rights Summary */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 border-b border-green-200 pb-2">
              Forest Rights Summary
            </h4>
            <div className="space-y-3">
              {claim.landClaims.map((landClaim, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      landClaim.type === 'habitation' ? 'bg-blue-500' :
                      landClaim.type === 'self-cultivation' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <span className="text-sm font-medium capitalize">
                      {landClaim.type.replace('-', ' ')}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {landClaim.area} ha
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Leaf size={16} className="text-green-600" />
                <span className="font-semibold text-green-800">Conservation Impact</span>
              </div>
              <div className="text-sm text-green-700">
                This FRA claim contributes to forest conservation through traditional knowledge
                and sustainable practices, protecting {claim.area} hectares of forest ecosystem.
              </div>
            </div>

            {/* Atlas Integration Status */}
            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon size={16} className="text-purple-600" />
                <span className="font-semibold text-purple-800">Atlas Integration</span>
              </div>
              <div className="text-sm text-purple-700 space-y-1">
                <div>✓ Mapped in digital FRA atlas system</div>
                <div>✓ GPS coordinates verified and documented</div>
                <div>✓ Land use classification completed</div>
                <div>✓ Reference: {claim.fraAtlasReference}</div>
              </div>
            </div>
          </div>
        </div>

        {/* District Context with Atlas Reference */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-semibold text-blue-800">District Context: {claim.district}</h5>
              <p className="text-sm text-blue-700">
                Part of Odisha's forest conservation initiative with {
                  filteredClaims.individuals.filter(c => c.district === claim.district).length
                } total claims in this district. All claims reference the comprehensive FRA Atlas database.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {claim.scheduledTribe ? 'ST' : 'OTFD'}
              </div>
              <div className="text-xs text-blue-600">Category</div>
              {claim.fraAtlasReference && (
                <div className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                  <FileText size={10} />
                  Atlas Ref
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Success Notification Popup */}
      <SuccessPopup show={showNotification} message={notificationMessage} />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Left: Logo & Title */}
          <div className="flex items-center gap-4">
            <Image 
              src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Ministry_of_Tribal_Affairs.svg" 
              alt="Ministry of Tribal Affairs Logo" 
              width={200} 
              height={80} 
            />
          </div>
          
          {/* Right: Stats */}
          <div className="flex items-center gap-8 text-gray-800">
            <div className="text-center">
              <div className="text-2xl font-bold">{allClaims.length}</div>
              <div className="text-sm text-gray-600">Total Claims</div>
            </div>
            <div className="w-px h-10 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {allClaims.filter(c => c.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="w-px h-10 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {allClaims.filter(c => c.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="w-px h-10 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredClaims.individuals.filter(c => c.fraAtlasReference).length}
              </div>
              <div className="text-sm text-gray-600">Atlas Linked</div>
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
                  onChange={(e) => setSearchType(e.target.value as 'name' | 'location' | 'title')}
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
                    searchType === 'name' ? 'Enter claimant name...' :
                    searchType === 'location' ? 'Enter village, district, or tehsil...' :
                    'Enter title number...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black bg-white placeholder-gray-500"
                  style={{ color: '#000', backgroundColor: '#fff' }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value as any)}
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
                    onChange={(e) => setClaimTypeFilter(e.target.value as any)}
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
                  {allClaims.map((claim) => (
                    <div
                      key={claim.id}
                      onClick={() => handleClaimSelect(claim)}
                      className={`p-4 hover:bg-green-50 cursor-pointer transition-all duration-200 border-l-4 ${
                        selectedClaim?.id === claim.id 
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
                            {isIndividualClaim(claim) && claim.fraAtlasReference && (
                              <span className="ml-1 px-1 py-0.5 bg-blue-100 text-blue-600 text-xs rounded flex items-center gap-1">
                                <ImageIcon size={10} />
                                Atlas
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
                    {highlightedDistrict} District
                  </span>
                )}
                {selectedClaim && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {isIndividualClaim(selectedClaim) ? selectedClaim.claimantName : `${selectedClaim.village} Community`}
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
                            <h4 className="font-semibold text-gray-900 mb-2 text-center">
                              {highlightedDistrict} District
                            </h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div className="text-center">Administrative Boundary</div>
                              <div className="border-t pt-2 mt-2">
                                <div>Claims in this district:</div>
                                <div className="ml-2">• Individual: {filteredClaims.individuals.filter(c => c.district === highlightedDistrict).length}</div>
                                <div className="ml-2">• Community: {filteredClaims.communities.filter(c => c.district === highlightedDistrict).length}</div>
                                <div className="ml-2">• Atlas Linked: {filteredClaims.individuals.filter(c => c.district === highlightedDistrict && c.fraAtlasReference).length}</div>
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    </>
                  )}

                  {/* Individual Claims Markers */}
                  {filteredClaims.individuals.map((claim) => {
                    const isSelected = selectedClaim?.id === claim.id;
                    const icon = isSelected 
                      ? createSelectedClaimIcon(claim.status, true)
                      : createCustomIcon(claim.status, true);
                    
                    return icon ? (
                      <Marker 
                        key={claim.id} 
                        position={claim.coordinates} 
                        icon={icon}
                      >
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
                              {claim.fraAtlasReference && (
                                <div className="flex items-center gap-1 text-blue-600">
                                  <ImageIcon size={12} />
                                  FRA Atlas Reference
                                </div>
                              )}
                              <div className="mt-2">{getStatusBadge(claim.status)}</div>
                              {isSelected && (
                                <div className="mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  Selected Claim
                                </div>
                              )}
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ) : null;
                  })}

                  {/* Community Claims Markers */}
                  {filteredClaims.communities.map((claim) => {
                    const isSelected = selectedClaim?.id === claim.id;
                    const icon = isSelected 
                      ? createSelectedClaimIcon(claim.status, false)
                      : createCustomIcon(claim.status, false);
                    
                    return icon ? (
                      <Marker 
                        key={claim.id} 
                        position={claim.coordinates} 
                        icon={icon}
                      >
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
                              {isSelected && (
                                <div className="mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  Selected Claim
                                </div>
                              )}
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
                      {selectedClaim.district} District
                    </span>
                    {isIndividualClaim(selectedClaim) && selectedClaim.fraAtlasReference && (
                      <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-600 text-sm rounded-full flex items-center gap-1">
                        <ImageIcon size={12} />
                        Atlas Linked
                      </span>
                    )}
                  </h3>
                  <div className="flex gap-2">
                    {isIndividualClaim(selectedClaim) && (
                      <>
                        <button
                          onClick={() => setShowSchemeDetails(!showSchemeDetails)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            showSchemeDetails 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          }`}
                        >
                          <DollarSign size={16} className="inline mr-1" />
                          Schemes
                        </button>
                        <button
                          onClick={() => setShowAtlas(!showAtlas)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            showAtlas 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                          }`}
                        >
                          <MapPin size={16} className="inline mr-1" />
                          Atlas
                        </button>
                      </>
                    )}
                    {getStatusBadge(selectedClaim.status)}
                  </div>
                </div>
              </div>

              {/* Scheme Eligibility Section */}
              {showSchemeDetails && isIndividualClaim(selectedClaim) && (
                <div className="p-6 border-b border-gray-200 bg-blue-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <DollarSign size={20} className="text-blue-600" />
                      Government Scheme Eligibility
                    </h4>
                    
                    {/* Always Green Notification Button */}
                    <button
                      onClick={() => handleSendNotification(selectedClaim)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
                    >
                      <Send size={16} />
                      Send Notifications ({Object.values(selectedClaim.schemeEligibility).filter(s => s.eligible).length})
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(selectedClaim.schemeEligibility).map(([schemeKey, scheme]) => {
                      const IconComponent = getSchemeIcon(schemeKey);
                      const colorClass = getSchemeColor(scheme.status);
                      
                      return (
                        <div key={schemeKey} className={`p-4 rounded-lg border-2 ${colorClass}`}>
                          <div className="flex items-center gap-3 mb-3">
                            <IconComponent size={20} />
                            <div>
                              <h5 className="font-semibold">{getSchemeName(schemeKey)}</h5>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                scheme.eligible ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                              }`}>
                                {scheme.eligible ? 'Eligible' : 'Not Eligible'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Status:</span>
                              <span className={`font-medium ${
                                scheme.status === 'enrolled' ? 'text-green-600' :
                                scheme.status === 'pending' ? 'text-yellow-600' : 'text-gray-600'
                              }`}>
                                {scheme.status === 'enrolled' ? '✓ Enrolled' :
                                 scheme.status === 'pending' ? '⏳ Pending' : '○ Not Enrolled'}
                              </span>
                            </div>
                            
                            {scheme.amount && (
                              <div className="flex justify-between">
                                <span>Amount:</span>
                                <span className="font-semibold text-green-600">₹{scheme.amount}</span>
                              </div>
                            )}
                            
                            {scheme.reason && (
                              <div className="text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                                <AlertTriangle size={12} className="inline mr-1" />
                                {scheme.reason}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary */}
                  <div className="mt-6 p-4 bg-white rounded-lg border">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {Object.values(selectedClaim.schemeEligibility).filter(s => s.eligible).length}
                        </div>
                        <div className="text-sm text-gray-600">Eligible Schemes</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {Object.values(selectedClaim.schemeEligibility).filter(s => s.status === 'enrolled').length}
                        </div>
                        <div className="text-sm text-gray-600">Enrolled</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">
                          {Object.values(selectedClaim.schemeEligibility).filter(s => s.eligible && s.status === 'not_enrolled').length}
                        </div>
                        <div className="text-sm text-gray-600">Pending Enrollment</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Individual FRA Atlas with Atlas Reference */}
              {showAtlas && isIndividualClaim(selectedClaim) && (
                <IndividualFRAAtlas claim={selectedClaim} />
              )}

              <div className="p-6">
                {isIndividualClaim(selectedClaim) ? (
                  /* Individual Claim Details with FRA Atlas Reference */
                  <div className="space-y-8">
                    {/* FRA Atlas Reference Section */}
                    {selectedClaim.fraAtlasReference && (
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-purple-800 flex items-center gap-2">
                            <FileText size={18} />
                            FRA Atlas Reference
                          </h4>
                          <button 
                            onClick={() => showSuccess(`Opening FRA Atlas: ${selectedClaim.fraAtlasReference}`)}
                            className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-100 px-3 py-1 rounded transition-colors"
                          >
                            <ExternalLink size={14} />
                            View Atlas
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-purple-700">Reference File:</span>
                            <code className="block bg-purple-100 px-2 py-1 rounded mt-1 text-xs">
                              {selectedClaim.fraAtlasReference}
                            </code>
                          </div>
                          <div>
                            <span className="font-medium text-purple-700">Atlas Coverage:</span>
                            <div className="mt-1 text-purple-600">
                              {selectedClaim.district} District Forest Atlas
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 text-lg border-b border-green-200 pb-2">Personal Information</h4>
                        <div className="space-y-3 text-sm">
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Name</span>
                            <span className="col-span-2 text-gray-900">{selectedClaim.claimantName}</span>
                          </div>
                          {selectedClaim.spouseName && (
                            <div className="grid grid-cols-3 gap-2">
                              <span className="font-medium text-gray-700">Spouse</span>
                              <span className="col-span-2 text-gray-900">{selectedClaim.spouseName}</span>
                            </div>
                          )}
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Father/Mother</span>
                            <span className="col-span-2 text-gray-900">{selectedClaim.fatherMotherName}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Address</span>
                            <span className="col-span-2 text-gray-900">{selectedClaim.address}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Category</span>
                            <span className="col-span-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                selectedClaim.scheduledTribe ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
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
                            <span className="font-medium text-gray-700">Village</span>
                            <span className="col-span-2 text-gray-900">{selectedClaim.village}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Gram Panchayat</span>
                            <span className="col-span-2 text-gray-900">{selectedClaim.gramPanchayat}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Tehsil/Taluka</span>
                            <span className="col-span-2 text-gray-900">{selectedClaim.tehsilTaluka}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">District</span>
                            <span className="col-span-2 text-gray-900 font-semibold">{selectedClaim.district}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Coordinates</span>
                            <span className="col-span-2 font-mono text-xs">{selectedClaim.coordinates[0]}, {selectedClaim.coordinates[1]}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Claim Date</span>
                            <span className="col-span-2 text-gray-900">{new Date(selectedClaim.claimDate).toLocaleDateString('en-IN')}</span>
                          </div>
                          {selectedClaim.titleNumber && (
                            <div className="grid grid-cols-3 gap-2">
                              <span className="font-medium text-gray-700">Title Number</span>
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
                              <h5 className="font-medium text-gray-900 capitalize text-lg">
                                {landClaim.type.replace('-', ' ')}
                              </h5>
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
                  /* Community Claims Details */
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 text-lg border-b border-green-200 pb-2">Community Information</h4>
                        <div className="space-y-3 text-sm">
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Village/Gram Sabha</span>
                            <span className="col-span-2 text-gray-900">{selectedClaim.village}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Gram Panchayat</span>
                            <span className="col-span-2 text-gray-900">{selectedClaim.gramPanchayat}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Tehsil/Taluka</span>
                            <span className="col-span-2 text-gray-900">{selectedClaim.tehsilTaluka}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">District</span>
                            <span className="col-span-2 text-gray-900 font-semibold">{selectedClaim.district}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Area</span>
                            <span className="col-span-2 text-gray-900 font-semibold">{selectedClaim.area} hectares</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Coordinates</span>
                            <span className="col-span-2 text-gray-900 font-mono text-xs">{selectedClaim.coordinates[0]}, {selectedClaim.coordinates[1]}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Claim Date</span>
                            <span className="col-span-2 text-gray-900">{new Date(selectedClaim.claimDate).toLocaleDateString('en-IN')}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 text-lg border-b border-green-200 pb-2">Administrative Details</h4>
                        <div className="space-y-3 text-sm">
                          {selectedClaim.khasraCompartmentNo && (
                            <div className="grid grid-cols-3 gap-2">
                              <span className="font-medium text-gray-700">Khasra/Compartment</span>
                              <span className="col-span-2 text-gray-900">{selectedClaim.khasraCompartmentNo.join(', ')}</span>
                            </div>
                          )}
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium text-gray-700">Bordering Villages</span>
                            <span className="col-span-2 text-gray-900">{selectedClaim.borderingVillages.join(', ')}</span>
                          </div>
                          {selectedClaim.titleNumber && (
                            <div className="grid grid-cols-3 gap-2">
                              <span className="font-medium text-gray-700">Title Number</span>
                              <span className="col-span-2 font-mono text-green-700 bg-green-50 px-2 py-1 rounded">{selectedClaim.titleNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 text-lg border-b border-green-200 pb-2">
                        Community Claimants ({selectedClaim.claimants.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedClaim.claimants.map((claimant, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                            <span className="text-sm font-medium text-gray-900">{claimant.name}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              claimant.status === 'ST' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
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
                          <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-medium border border-blue-200">
                            {evidence}
                          </span>
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