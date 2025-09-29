// components/fra-mpr/StateMap.tsx
// Interactive State Map Component

"use client";

import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import("react-leaflet").then(m => m.GeoJSON), { ssr: false });

interface StateMapProps {
  onStateSelect: (state: string | null) => void;
  selectedState: string | null;
  className?: string;
  height?: string;
  showTooltips?: boolean;
  interactive?: boolean;
}

const GEOJSON_URL = "/data/in.json";

const StateMap: React.FC<StateMapProps> = ({
  onStateSelect,
  selectedState,
  className = "",
  height = "500px",
  showTooltips = true,
  interactive = true
}) => {
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch(GEOJSON_URL)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to load map data: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setGeoData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading GeoJSON:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getStateFeatures = (geojson: any) => {
    if (!geojson) return null;
    
    return {
      ...geojson,
      features: geojson.features.filter(
        (f: any) =>
          (f.geometry.type === "MultiPolygon" || f.geometry.type === "Polygon") &&
          (f.properties.name || f.properties.NAME || f.properties.ST_NM)
      ),
    };
  };

  const getStateStyle = (stateName: string, isSelected: boolean) => {
    if (isSelected) {
      return {
        fillColor: "#1d4ed8",
        fillOpacity: 0.7,
        color: "#1e40af",
        weight: 3,
        opacity: 1
      };
    }
    
    return {
      fillColor: "#3b82f6",
      fillOpacity: 0.3,
      color: "#2563eb",
      weight: 1.5,
      opacity: 0.8
    };
  };

  const getHoverStyle = () => ({
    fillColor: "#60a5fa",
    fillOpacity: 0.6,
    color: "#1d4ed8",
    weight: 2.5,
    opacity: 1
  });

  const onEachFeature = (feature: any, layer: any) => {
    const stateName = feature.properties.name || 
                      feature.properties.NAME || 
                      feature.properties.ST_NM ||
                      feature.properties.st_nm;
    
    if (!stateName) return;

    const isSelected = stateName === selectedState;
    layer.setStyle(getStateStyle(stateName, isSelected));

    if (interactive) {
      layer.on({
        click: (e: any) => {
          e.stopPropagation();
          onStateSelect(selectedState === stateName ? null : stateName);
        },
        mouseover: (e: any) => {
          if (!isSelected) {
            layer.setStyle(getHoverStyle());
          }
        },
        mouseout: (e: any) => {
          if (!isSelected) {
            layer.setStyle(getStateStyle(stateName, false));
          }
        }
      });
    }

    if (showTooltips) {
      layer.bindTooltip(stateName, {
        permanent: false,
        direction: "center",
        className: "bg-gray-800 text-white px-2 py-1 rounded shadow-lg text-sm"
      });
    }
  };

  if (loading) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ height }}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-red-50 rounded-lg border border-red-200 ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <p className="text-sm text-red-600 mb-2">Failed to load map</p>
          <p className="text-xs text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  const filteredGeoData = getStateFeatures(geoData);

  return (
    <div className={`relative rounded-lg overflow-hidden shadow-sm border border-gray-200 ${className}`}>
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height, width: "100%" }}
        className="z-0"
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {filteredGeoData && (
          <GeoJSON
            key={selectedState}
            data={filteredGeoData}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
      
      {selectedState && (
        <div className="absolute top-4 left-4 z-[1000] bg-white px-3 py-2 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-sm font-medium text-gray-800">{selectedState}</span>
            <button
              onClick={() => onStateSelect(null)}
              className="ml-2 text-gray-400 hover:text-gray-600 text-sm"
              title="Clear selection"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StateMap;