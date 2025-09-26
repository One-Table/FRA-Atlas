"use client";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";

// Dynamically import react-leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import("react-leaflet").then(m => m.GeoJSON), { ssr: false });

interface StateMapProps {
  onStateSelect: (state: string) => void;
  selectedState: string;
  mapRef?: any;
  geoJsonLayerRef?: any;
}

// Use the correct public path (relative to /public)
const GEOJSON_URL = "/data/in.json";

const StateMap: React.FC<StateMapProps> = (props) => {
  const { onStateSelect, selectedState, mapRef, geoJsonLayerRef } = props;
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then(res => res.json())
      .then(setGeoData)
      .catch(() => setGeoData(null));
  }, []);

  const getStateFeatures = (geojson: any) => {
    if (!geojson) return null;
    return {
      ...geojson,
      features: geojson.features.filter(
        (f: any) =>
          (f.geometry.type === "MultiPolygon" || f.geometry.type === "Polygon") &&
          typeof f.properties.name === "string"
      ),
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const stateName = feature.properties.name;
    layer.on({
      click: () => onStateSelect(stateName),
    });
    if (stateName === selectedState) {
      layer.setStyle({ fillColor: "#1d4ed8", fillOpacity: 0.35, color: "#1e40af", weight: 2 }); // Tailwind blue-700
    } else {
      layer.setStyle({ fillColor: "#60a5fa", fillOpacity: 0.15, color: "#2563eb", weight: 1.2 }); // Tailwind blue-400
    }
    layer.bindTooltip(stateName, { permanent: false });
  };

  const CustomGeoJSON = (props: any) => {
    const map = useMap();
    useEffect(() => {
      if (mapRef) mapRef.current = map;
    }, [map]);
    return (
      <GeoJSON
        {...props}
        ref={layer => {
          if (geoJsonLayerRef) geoJsonLayerRef.current = layer;
        }}
      />
    );
  };

  return (
    <div className="h-80 w-full rounded-lg overflow-hidden">
      <MapContainer center={[22, 83]} zoom={5} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoData && (
          <CustomGeoJSON data={getStateFeatures(geoData) as any} onEachFeature={onEachFeature} />
        )}
      </MapContainer>

      
    </div>
  );
};

export default StateMap;