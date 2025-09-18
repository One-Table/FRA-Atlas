"use client";
import domtoimage from 'dom-to-image-more';
import jsPDF from 'jspdf';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useRef, useState } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import Select from 'react-select';

// FRA Data with temporal aspects
type TemporalFRAData = {
  state: string;
  stateCode: string;
  year: number;
  individualClaims: number;
  communityClaims: number;
  totalClaims: number;
  individualTitles: number;
  communityTitles: number;
  totalTitles: number;
  individualLand: number;
  communityLand: number;
  totalLand: number;
  districts: DistrictData[];
};

type DistrictData = {
  district: string;
  individualClaims: number;
  communityClaims: number;
  totalClaims: number;
  individualTitles: number;
  communityTitles: number;
  totalTitles: number;
  coordinates: [number, number];
};

// Sample temporal data (2023-2025)
const temporalFRAData: TemporalFRAData[] = [
  {
    state: "Chhattisgarh", stateCode: "CG", year: 2023,
    individualClaims: 890220, communityClaims: 57259, totalClaims: 947479,
    individualTitles: 481432, communityTitles: 52636, totalTitles: 534068,
    individualLand: 949.770, communityLand: 9102.957, totalLand: 10052.728,
    districts: [
      { district: "Raipur", individualClaims: 45000, communityClaims: 2500, totalClaims: 47500, individualTitles: 32000, communityTitles: 1800, totalTitles: 33800, coordinates: [21.2514, 81.6296] },
      { district: "Bilaspur", individualClaims: 38000, communityClaims: 2200, totalClaims: 40200, individualTitles: 28000, communityTitles: 1600, totalTitles: 29600, coordinates: [22.0797, 82.1409] },
      { district: "Durg", individualClaims: 42000, communityClaims: 2800, totalClaims: 44800, individualTitles: 30000, communityTitles: 2000, totalTitles: 32000, coordinates: [21.1938, 81.2849] }
    ]
  },
  {
    state: "Chhattisgarh", stateCode: "CG", year: 2024,
    individualClaims: 895220, communityClaims: 58259, totalClaims: 953479,
    individualTitles: 485432, communityTitles: 53636, totalTitles: 539068,
    individualLand: 955.770, communityLand: 9150.957, totalLand: 10106.728,
    districts: [
      { district: "Raipur", individualClaims: 46000, communityClaims: 2600, totalClaims: 48600, individualTitles: 33000, communityTitles: 1900, totalTitles: 34900, coordinates: [21.2514, 81.6296] },
      { district: "Bilaspur", individualClaims: 39000, communityClaims: 2300, totalClaims: 41300, individualTitles: 29000, communityTitles: 1700, totalTitles: 30700, coordinates: [22.0797, 82.1409] },
      { district: "Durg", individualClaims: 43000, communityClaims: 2900, totalClaims: 45900, individualTitles: 31000, communityTitles: 2100, totalTitles: 33100, coordinates: [21.1938, 81.2849] }
    ]
  },
  {
    state: "Odisha", stateCode: "OR", year: 2023,
    individualClaims: 691948, communityClaims: 32444, totalClaims: 724392,
    individualTitles: 461475, communityTitles: 8776, totalTitles: 470251,
    individualLand: 673.849, communityLand: 737.201, totalLand: 1411.051,
    districts: [
      { district: "Bhubaneswar", individualClaims: 35000, communityClaims: 1800, totalClaims: 36800, individualTitles: 25000, communityTitles: 1200, totalTitles: 26200, coordinates: [20.2961, 85.8245] },
      { district: "Cuttack", individualClaims: 32000, communityClaims: 1600, totalClaims: 33600, individualTitles: 23000, communityTitles: 1100, totalTitles: 24100, coordinates: [20.4625, 85.8828] }
    ]
  }
];

// India states GeoJSON (simplified - you'll need the full version)
const indiaStatesGeoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "NAME_1": "Chhattisgarh",
        "ST_NM": "Chhattisgarh"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[80.5, 17.5], [84.5, 17.5], [84.5, 25.5], [80.5, 25.5], [80.5, 17.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "NAME_1": "Odisha",
        "ST_NM": "Odisha"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[84, 17], [87, 17], [87, 22.5], [84, 22.5], [84, 17]]]
      }
    }
    // Add more states here - you'll need complete GeoJSON data
  ]
};

interface SearchOption {
  value: string;
  label: string;
}

const EnhancedFRAMap: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'claims' | 'titles' | 'land'>('claims');
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<SearchOption | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showDistricts, setShowDistricts] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // Get data for selected year
  const getCurrentYearData = () => {
    return temporalFRAData.filter(data => data.year === selectedYear);
  };

  // Search options for states
  const searchOptions: SearchOption[] = temporalFRAData
    .filter(data => data.year === selectedYear)
    .map(data => ({
      value: data.state,
      label: data.state
    }));

  // Color calculation functions
  const getColorByTotalClaims = (claims: number): string => {
    if (claims > 800000) return '#8B0000';
    if (claims > 600000) return '#DC143C';
    if (claims > 400000) return '#FF6347';
    if (claims > 200000) return '#FFA500';
    if (claims > 100000) return '#FFD700';
    return '#90EE90';
  };

  const getColorByTotalTitles = (titles: number): string => {
    if (titles > 400000) return '#0000CD';
    if (titles > 300000) return '#4169E1';
    if (titles > 200000) return '#6495ED';
    if (titles > 100000) return '#87CEEB';
    if (titles > 50000) return '#ADD8E6';
    return '#F0F8FF';
  };

  const getColorByTotalLand = (land: number): string => {
    if (land > 5000) return '#006400';
    if (land > 3000) return '#228B22';
    if (land > 2000) return '#32CD32';
    if (land > 1000) return '#7CFC00';
    if (land > 500) return '#9AFF9A';
    return '#F0FFF0';
  };

  const getColorForState = (stateName: string): string => {
    const stateData = getCurrentYearData().find(data => data.state === stateName);
    if (!stateData) return '#CCCCCC';

    switch (selectedMetric) {
      case 'claims':
        return getColorByTotalClaims(stateData.totalClaims);
      case 'titles':
        return getColorByTotalTitles(stateData.totalTitles);
      case 'land':
        return getColorByTotalLand(stateData.totalLand);
      default:
        return '#CCCCCC';
    }
  };

  // Map event handlers
  const onEachFeature = (feature: any, layer: any) => {
    const stateName = feature.properties.NAME_1 || feature.properties.ST_NM;
    const stateData = getCurrentYearData().find(data => data.state === stateName);

    if (stateData) {
      layer.bindPopup(`
        <div style="font-family: 'Segoe UI', Arial, sans-serif; min-width: 250px;">
          <h3 style="color: #1857b2; margin-bottom: 10px; font-size: 16px;">${stateData.state} (${selectedYear})</h3>
          <div style="font-size: 13px;">
            <strong>📊 Claims Data:</strong><br/>
            <span style="margin-left: 10px;">Total: ${stateData.totalClaims.toLocaleString()}</span><br/>
            <span style="margin-left: 10px;">Individual: ${stateData.individualClaims.toLocaleString()}</span><br/>
            <span style="margin-left: 10px;">Community: ${stateData.communityClaims.toLocaleString()}</span><br/><br/>
            
            <strong>📋 Titles Data:</strong><br/>
            <span style="margin-left: 10px;">Total: ${stateData.totalTitles.toLocaleString()}</span><br/>
            <span style="margin-left: 10px;">Individual: ${stateData.individualTitles.toLocaleString()}</span><br/>
            <span style="margin-left: 10px;">Community: ${stateData.communityTitles.toLocaleString()}</span><br/><br/>
            
            <strong>🌿 Land Area (000 acres):</strong><br/>
            <span style="margin-left: 10px;">Total: ${stateData.totalLand.toLocaleString()}</span><br/>
            <span style="margin-left: 10px;">Individual: ${stateData.individualLand.toLocaleString()}</span><br/>
            <span style="margin-left: 10px;">Community: ${stateData.communityLand.toLocaleString()}</span><br/><br/>
            
            <strong>🏘️ Districts:</strong> ${stateData.districts.length} districts available
          </div>
        </div>
      `);

      layer.on({
        mouseover: (e: any) => {
          e.target.setStyle({
            weight: 3,
            color: '#1857b2',
            dashArray: '',
            fillOpacity: 0.8
          });
          setSelectedState(stateName);
        },
        mouseout: (e: any) => {
          e.target.setStyle({
            weight: 1,
            color: '#666',
            fillOpacity: 0.6
          });
          setSelectedState(null);
        },
        click: (e: any) => {
          e.target.openPopup();
          // Center map on clicked state
          if (mapRef.current) {
            mapRef.current.flyToBounds(e.target.getBounds(), { maxZoom: 8 });
          }
        }
      });
    }
  };

  const style = (feature: any) => {
    const stateName = feature.properties.NAME_1 || feature.properties.ST_NM;
    return {
      fillColor: getColorForState(stateName),
      weight: 1,
      opacity: 1,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.6
    };
  };

  // Search functionality
  const handleSearch = (option: SearchOption | null) => {
    setSearchValue(option);
    if (option && mapRef.current) {
      const stateData = getCurrentYearData().find(data => data.state === option.value);
      if (stateData && stateData.districts.length > 0) {
        // Focus on the state's first district as center point
        const centerPoint = stateData.districts[0].coordinates;
        mapRef.current.flyTo(centerPoint, 7, { duration: 1.5 });
        setSelectedState(option.value);
      }
    }
  };

  // Export to PDF functionality
  const exportToPDF = async () => {
    if (!mapContainerRef.current) return;
    
    setIsExporting(true);
    
    try {
      const element = mapContainerRef.current;
      
      // Wait for map to be fully rendered
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dataUrl = await domtoimage.toPng(element, {
        width: 1200,
        height: 800,
        quality: 0.95,
        bgcolor: '#ffffff'
      });

      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = 297; // A4 landscape width
      const pdfHeight = 210; // A4 landscape height
      
      // Add title
      pdf.setFontSize(16);
      pdf.setTextColor(24, 87, 178); // #1857b2
      pdf.text(`FRA Implementation Map - ${selectedMetric.toUpperCase()} (${selectedYear})`, 20, 20);
      
      // Add map image
      pdf.addImage(dataUrl, 'PNG', 10, 30, pdfWidth - 20, pdfHeight - 60);
      
      // Add footer with timestamp
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 20, pdfHeight - 10);
      
      pdf.save(`FRA_Map_${selectedMetric}_${selectedYear}_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Export to image
  const exportToImage = async () => {
    if (!mapContainerRef.current) return;
    
    try {
      const dataUrl = await domtoimage.toPng(mapContainerRef.current, {
        width: 1200,
        height: 800,
        quality: 0.95
      });

      const link = document.createElement('a');
      link.download = `FRA_Map_${selectedMetric}_${selectedYear}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export image:', error);
    }
  };

  // District drill-down functionality
  const showDistrictData = (stateName: string) => {
    const stateData = getCurrentYearData().find(data => data.state === stateName);
    if (stateData && stateData.districts.length > 0) {
      setShowDistricts(true);
      // You would implement district overlay here
    }
  };

  return (
    <div className="w-full h-full bg-[#f8f9fd] rounded-lg shadow-md border border-[#e2e8f0]">
      {/* Enhanced Controls */}
      <div className="p-6 border-b border-[#e2e8f0] space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1857b2] mb-2">
              FRA Implementation Interactive Map - India
            </h2>
            <p className="text-sm text-gray-600">
              Comprehensive visualization with temporal analysis, search, and export capabilities
            </p>
          </div>

          {/* Export Controls */}
          <div className="flex gap-2">
            <button
              onClick={exportToImage}
              disabled={isExporting}
              className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-all"
            >
              📷 Export PNG
            </button>
            <button
              onClick={exportToPDF}
              disabled={isExporting}
              className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-all"
            >
              {isExporting ? '⏳ Exporting...' : '📄 Export PDF'}
            </button>
          </div>
        </div>

        {/* Search and Controls Row */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Search States
            </label>
            <Select
              value={searchValue}
              onChange={handleSearch}
              options={searchOptions}
              placeholder="Search for a state..."
              isClearable
              className="text-sm"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: '#e2e8f0',
                  boxShadow: 'none',
                  '&:hover': { borderColor: '#1857b2' }
                })
              }}
            />
          </div>

          {/* Year Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📅 Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 border border-[#e2e8f0] rounded-md text-sm focus:ring-2 focus:ring-[#1857b2] focus:border-transparent"
            >
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
            </select>
          </div>

          {/* Metric Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📊 Metric
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMetric('claims')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedMetric === 'claims'
                    ? 'bg-[#1857b2] text-white'
                    : 'bg-white text-[#1857b2] border border-[#1857b2] hover:bg-[#1857b2] hover:text-white'
                }`}
              >
                Claims
              </button>
              <button
                onClick={() => setSelectedMetric('titles')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedMetric === 'titles'
                    ? 'bg-[#1857b2] text-white'
                    : 'bg-white text-[#1857b2] border border-[#1857b2] hover:bg-[#1857b2] hover:text-white'
                }`}
              >
                Titles
              </button>
              <button
                onClick={() => setSelectedMetric('land')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedMetric === 'land'
                    ? 'bg-[#1857b2] text-white'
                    : 'bg-white text-[#1857b2] border border-[#1857b2] hover:bg-[#1857b2] hover:text-white'
                }`}
              >
                Land
              </button>
            </div>
          </div>

          {/* District Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🏘️ View
            </label>
            <button
              onClick={() => setShowDistricts(!showDistricts)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                showDistricts
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-purple-600 border border-purple-600 hover:bg-purple-600 hover:text-white'
              }`}
            >
              {showDistricts ? 'Hide Districts' : 'Show Districts'}
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} className="h-[700px] relative">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          className="rounded-b-lg"
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <GeoJSON
            data={indiaStatesGeoJSON}
            style={style}
            onEachFeature={onEachFeature}
            key={`${selectedMetric}-${selectedYear}`}
          />
        </MapContainer>

        {/* Enhanced Legend */}
        <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-[#e2e8f0] max-w-xs">
          <h4 className="font-semibold text-sm text-[#1857b2] mb-3">
            {selectedMetric === 'claims' && `Total Claims Legend (${selectedYear})`}
            {selectedMetric === 'titles' && `Total Titles Legend (${selectedYear})`}
            {selectedMetric === 'land' && `Total Land Legend (${selectedYear}) - 000 acres`}
          </h4>
          <div className="space-y-2 text-xs">
            {selectedMetric === 'claims' && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#8B0000] rounded"></div>
                  <span>800,000+ claims</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#DC143C] rounded"></div>
                  <span>600,000+ claims</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#FF6347] rounded"></div>
                  <span>400,000+ claims</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#FFA500] rounded"></div>
                  <span>200,000+ claims</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#FFD700] rounded"></div>
                  <span>100,000+ claims</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#90EE90] rounded"></div>
                  <span>0-100,000 claims</span>
                </div>
              </>
            )}
            
            {selectedMetric === 'titles' && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#0000CD] rounded"></div>
                  <span>400,000+ titles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#4169E1] rounded"></div>
                  <span>300,000+ titles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#6495ED] rounded"></div>
                  <span>200,000+ titles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#87CEEB] rounded"></div>
                  <span>100,000+ titles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#ADD8E6] rounded"></div>
                  <span>50,000+ titles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#F0F8FF] rounded"></div>
                  <span>0-50,000 titles</span>
                </div>
              </>
            )}
            
            {selectedMetric === 'land' && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#006400] rounded"></div>
                  <span>5,000+ thousand acres</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#228B22] rounded"></div>
                  <span>3,000+ thousand acres</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#32CD32] rounded"></div>
                  <span>2,000+ thousand acres</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#7CFC00] rounded"></div>
                  <span>1,000+ thousand acres</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#9AFF9A] rounded"></div>
                  <span>500+ thousand acres</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#F0FFF0] rounded"></div>
                  <span>0-500 thousand acres</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Year-over-Year Change Indicator */}
        <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg border border-[#e2e8f0]">
          <div className="text-xs text-gray-600 mb-1">Temporal Analysis</div>
          <div className="text-sm font-medium text-[#1857b2]">
            📈 Year: {selectedYear}
          </div>
          {selectedYear > 2023 && (
            <div className="text-xs text-green-600 mt-1">
              📊 Comparing with previous year
            </div>
          )}
        </div>
      </div>

      {/* Enhanced State Info Panel */}
      {selectedState && (
        <div className="p-4 border-t border-[#e2e8f0] bg-[#f8f9fd]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-sm space-y-1">
              <div>
                <span className="font-medium text-[#1857b2]">🎯 Selected State: </span>
                <span className="text-gray-700 font-semibold">{selectedState}</span>
              </div>
              <div>
                <span className="text-gray-500">
                  📅 Viewing {selectedYear} data • 📊 {selectedMetric.toUpperCase()} metric
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => showDistrictData(selectedState)}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                🏘️ View Districts
              </button>
              <button
                onClick={() => {
                  const stateData = getCurrentYearData().find(data => data.state === selectedState);
                  if (stateData) {
                    alert(`📊 ${selectedState} Summary:\n\nTotal ${selectedMetric}: ${
                      selectedMetric === 'claims' ? stateData.totalClaims.toLocaleString() :
                      selectedMetric === 'titles' ? stateData.totalTitles.toLocaleString() :
                      stateData.totalLand.toLocaleString() + ' thousand acres'
                    }\n\nYear: ${selectedYear}`);
                  }
                }}
                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
              >
                📋 Quick Stats
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedFRAMap;
