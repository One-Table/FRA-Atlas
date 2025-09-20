'use client'
import React, { useEffect, useRef, useState } from "react";
import L, { Map as LeafletMap, FeatureGroup } from "leaflet";
import "leaflet/dist/leaflet.css";

const fraData: Record<string, any> = {
  "Very High Potential": {
    districts: ["Kandhamal", "Mayurbhanj", "Rayagada", "Keonjhar", "Koraput", "Malkangiri", "Nabarangpur", "Sundargarh"],
    description: "High tribal population, significant forest cover, active CFR recognition",
    cfrPotential: "> 70%",
    color: "#27ae60",
  },
  "High Potential": {
    districts: ["Kalahandi", "Ganjam", "Angul", "Balangir", "Dhenkanal", "Sambalpur", "Gajapati"],
    description: "Moderate tribal population, good forest cover",
    cfrPotential: "50-70%",
    color: "#2ecc71",
  },
  "Moderate Potential": {
    districts: ["Nayagarh", "Nuapada", "Bargarh", "Boudh", "Deogarh"],
    description: "Moderate tribal population and forest cover",
    cfrPotential: "30-50%",
    color: "#f39c12",
  },
  "Low Potential": {
    districts: ["Jharsuguda", "Cuttack", "Jajpur", "Khordha"],
    description: "Lower tribal population or forest cover",
    cfrPotential: "10-30%",
    color: "#e74c3c",
  },
  "Very Low Potential": {
    districts: ["Puri", "Jagatsinghpur", "Bhadrak", "Balasore", "Kendrapara", "Sonepur"],
    description: "Coastal and urban areas, minimal forest",
    cfrPotential: "< 10%",
    color: "#95a6a6",
  },
};

const odishaDistrictCenters = [
  // Very High Potential
  {
    name: "Kandhamal", lat: 20.2792, lng: 84.0953, category: "Very High Potential",
    factSheet: { blocks: 12, gPs: 153, totalVillages: 2547, inhabitedVillages: 2380, uninhabitedVillages: 167, fraPotentialVillages: 2338, fraNonPotentialVillages: 42, unsurveyed: 35, forestFringeVillages: 1869, villagesWithForestLand: 2204, totalForestArea: 5711.65, potentialForestAreaUnderFRA: 3999.58, potentialIFRArea: 534.58, potentialCFRArea: 3465.00 }
  },
  {
    name: "Mayurbhanj", lat: 21.9288, lng: 86.7348, category: "Very High Potential",
    factSheet: { blocks: 26, gPs: 404, totalVillages: 3956, inhabitedVillages: 3755, uninhabitedVillages: 201, fraPotentialVillages: 3051, fraNonPotentialVillages: 704, unsurveyed: 24, forestFringeVillages: 381, villagesWithForestLand: 2985, totalForestArea: 4489.44, potentialForestAreaUnderFRA: 1559.64, potentialIFRArea: 248.46, potentialCFRArea: 1311.18 }
  },
  {
    name: "Rayagada", lat: 19.1668, lng: 83.4127, category: "Very High Potential",
    factSheet: { blocks: 11, gPs: 171, totalVillages: 2667, inhabitedVillages: 2467, uninhabitedVillages: 200, fraPotentialVillages: 2125, fraNonPotentialVillages: 342, unsurveyed: 33, forestFringeVillages: 1343, villagesWithForestLand: 1904, totalForestArea: 3196.91, potentialForestAreaUnderFRA: 2155.64, potentialIFRArea: 243.35, potentialCFRArea: 1912.29 }
  },
  {
    name: "Keonjhar", lat: 21.6290, lng: 85.5805, category: "Very High Potential",
    factSheet: { blocks: 13, gPs: 286, totalVillages: 2122, inhabitedVillages: 2069, uninhabitedVillages: 53, fraPotentialVillages: 1791, fraNonPotentialVillages: 278, unsurveyed: 38, forestFringeVillages: 622, villagesWithForestLand: 1709, totalForestArea: 3366.16, potentialForestAreaUnderFRA: 1537.98, potentialIFRArea: 252.84, potentialCFRArea: 1285.14 }
  },
  {
    name: "Koraput", lat: 18.8129, lng: 82.7109, category: "Very High Potential",
    factSheet: { blocks: 14, gPs: 226, totalVillages: 2029, inhabitedVillages: 1923, uninhabitedVillages: 106, fraPotentialVillages: 1536, fraNonPotentialVillages: 387, unsurveyed: 83, forestFringeVillages: 1148, villagesWithForestLand: 998, totalForestArea: 1960.15, potentialForestAreaUnderFRA: 1471.92, potentialIFRArea: 293.05, potentialCFRArea: 1178.87 }
  },
  {
    name: "Malkangiri", lat: 18.3477, lng: 81.8841, category: "Very High Potential",
    factSheet: { blocks: 7, gPs: 108, totalVillages: 1046, inhabitedVillages: 980, uninhabitedVillages: 66, fraPotentialVillages: 958, fraNonPotentialVillages: 22, unsurveyed: 112, forestFringeVillages: 563, villagesWithForestLand: 808, totalForestArea: 3364.23, potentialForestAreaUnderFRA: 3056.05, potentialIFRArea: 814.92, potentialCFRArea: 2241.13 }
  },
  {
    name: "Nabarangpur", lat: 19.2306, lng: 82.5493, category: "Very High Potential",
    factSheet: { blocks: 10, gPs: 169, totalVillages: 901, inhabitedVillages: 876, uninhabitedVillages: 25, fraPotentialVillages: 750, fraNonPotentialVillages: 126, unsurveyed: 9, forestFringeVillages: 372, villagesWithForestLand: 683, totalForestArea: 2519.29, potentialForestAreaUnderFRA: 2007.63, potentialIFRArea: 604.17, potentialCFRArea: 1403.46 }
  },
  {
    name: "Sundargarh", lat: 22.1179, lng: 84.0171, category: "Very High Potential",
    factSheet: { blocks: 17, gPs: 262, totalVillages: 1764, inhabitedVillages: 1723, uninhabitedVillages: 41, fraPotentialVillages: 1632, fraNonPotentialVillages: 91, unsurveyed: 46, forestFringeVillages: 1023, villagesWithForestLand: 1530, totalForestArea: 5551.52, potentialForestAreaUnderFRA: 2701.97, potentialIFRArea: 318.36, potentialCFRArea: 2383.61 }
  },
  // High Potential
  {
    name: "Kalahandi", lat: 19.9139, lng: 83.1656, category: "High Potential",
    factSheet: { blocks: 13, gPs: 273, totalVillages: 2236, inhabitedVillages: 2099, uninhabitedVillages: 137, fraPotentialVillages: 1771, fraNonPotentialVillages: 328, unsurveyed: 16, forestFringeVillages: 1370, villagesWithForestLand: 1523, totalForestArea: 2603.71, potentialForestAreaUnderFRA: 1305.88, potentialIFRArea: 507.18, potentialCFRArea: 798.70 }
  },
  {
    name: "Ganjam", lat: 19.3859, lng: 84.9694, category: "High Potential",
    factSheet: { blocks: 22, gPs: 475, totalVillages: 3212, inhabitedVillages: 2812, uninhabitedVillages: 400, fraPotentialVillages: 1394, fraNonPotentialVillages: 1418, unsurveyed: 53, forestFringeVillages: 1003, villagesWithForestLand: 798, totalForestArea: 3223.66, potentialForestAreaUnderFRA: 1886.33, potentialIFRArea: 572.78, potentialCFRArea: 1313.55 }
  },
  {
    name: "Angul", lat: 20.8400, lng: 85.1018, category: "High Potential",
    factSheet: { blocks: 8, gPs: 199, totalVillages: 1215, inhabitedVillages: 1076, uninhabitedVillages: 139, fraPotentialVillages: 859, fraNonPotentialVillages: 217, unsurveyed: 17, forestFringeVillages: 409, villagesWithForestLand: 795, totalForestArea: 1788.20, potentialForestAreaUnderFRA: 767.72, potentialIFRArea: 173.05, potentialCFRArea: 594.67 }
  },
  {
    name: "Balangir", lat: 20.7100, lng: 83.4900, category: "High Potential",
    factSheet: { blocks: 14, gPs: 285, totalVillages: 1794, inhabitedVillages: 1764, uninhabitedVillages: 30, fraPotentialVillages: 1425, fraNonPotentialVillages: 339, unsurveyed: 1, forestFringeVillages: 589, villagesWithForestLand: 1309, totalForestArea: 1615.32, potentialForestAreaUnderFRA: 603.90, potentialIFRArea: 250.85, potentialCFRArea: 353.05 }
  },
  {
    name: "Dhenkanal", lat: 20.6593, lng: 85.5951, category: "High Potential",
    factSheet: { blocks: 8, gPs: 199, totalVillages: 1215, inhabitedVillages: 1076, uninhabitedVillages: 139, fraPotentialVillages: 859, fraNonPotentialVillages: 217, unsurveyed: 17, forestFringeVillages: 409, villagesWithForestLand: 795, totalForestArea: 1788.20, potentialForestAreaUnderFRA: 767.72, potentialIFRArea: 173.05, potentialCFRArea: 594.67 }
  },
  {
    name: "Sambalpur", lat: 21.4704, lng: 83.9717, category: "High Potential",
    factSheet: { blocks: 9, gPs: 148, totalVillages: 1317, inhabitedVillages: 1233, uninhabitedVillages: 84, fraPotentialVillages: 1173, fraNonPotentialVillages: 60, unsurveyed: 7, forestFringeVillages: 696, villagesWithForestLand: 1130, totalForestArea: 3733.16, potentialForestAreaUnderFRA: 1801.81, potentialIFRArea: 309.00, potentialCFRArea: 1492.81 }
  },
  {
    name: "Gajapati", lat: 18.8500, lng: 84.1333, category: "High Potential",
    factSheet: { blocks: 7, gPs: 129, totalVillages: 1619, inhabitedVillages: 1512, uninhabitedVillages: 107, fraPotentialVillages: 1371, fraNonPotentialVillages: 141, unsurveyed: 54, forestFringeVillages: 484, villagesWithForestLand: 1261, totalForestArea: 2483.80, potentialForestAreaUnderFRA: 2114.51, potentialIFRArea: 539.33, potentialCFRArea: 1575.18 }
  },
  // Moderate Potential
  {
    name: "Nayagarh", lat: 20.1276, lng: 85.0977, category: "Moderate Potential",
    factSheet: { blocks: 8, gPs: 179, totalVillages: 1695, inhabitedVillages: 1531, uninhabitedVillages: 164, fraPotentialVillages: 1239, fraNonPotentialVillages: 292, unsurveyed: 3, forestFringeVillages: 714, villagesWithForestLand: 1163, totalForestArea: 2207.26, potentialForestAreaUnderFRA: 974.07, potentialIFRArea: 484.04, potentialCFRArea: 490.03 }
  },
  {
    name: "Nuapada", lat: 20.8076, lng: 82.5431, category: "Moderate Potential",
    factSheet: { blocks: 5, gPs: 109, totalVillages: 663, inhabitedVillages: 648, uninhabitedVillages: 15, fraPotentialVillages: 607, fraNonPotentialVillages: 41, unsurveyed: 7, forestFringeVillages: 329, villagesWithForestLand: 574, totalForestArea: 1907.35, potentialForestAreaUnderFRA: 1849.32, potentialIFRArea: 278.43, potentialCFRArea: 1570.89 }
  },
  {
    name: "Bargarh", lat: 21.3344, lng: 83.6191, category: "Moderate Potential",
    factSheet: { blocks: 12, gPs: 248, totalVillages: 1207, inhabitedVillages: 1180, uninhabitedVillages: 27, fraPotentialVillages: 887, fraNonPotentialVillages: 293, unsurveyed: 7, forestFringeVillages: 331, villagesWithForestLand: 845, totalForestArea: 1216.13, potentialForestAreaUnderFRA: 720.03, potentialIFRArea: 327.22, potentialCFRArea: 392.81 }
  },
  {
    name: "Boudh", lat: 20.8301, lng: 84.3299, category: "Moderate Potential",
    factSheet: { blocks: 3, gPs: 63, totalVillages: 1186, inhabitedVillages: 1115, uninhabitedVillages: 71, fraPotentialVillages: 909, fraNonPotentialVillages: 206, unsurveyed: 9, forestFringeVillages: 501, villagesWithForestLand: 847, totalForestArea: 1289.83, potentialForestAreaUnderFRA: 440.47, potentialIFRArea: 156.69, potentialCFRArea: 283.78 }
  },
  {
    name: "Deogarh", lat: 21.5363, lng: 84.7325, category: "Moderate Potential",
    factSheet: { blocks: 3, gPs: 60, totalVillages: 875, inhabitedVillages: 711, uninhabitedVillages: 164, fraPotentialVillages: 687, fraNonPotentialVillages: 24, unsurveyed: 12, forestFringeVillages: 515, villagesWithForestLand: 661, totalForestArea: 1560.30, potentialForestAreaUnderFRA: 1068.55, potentialIFRArea: 169.62, potentialCFRArea: 898.93 }
  },
  // Low Potential
  {
    name: "Jharsuguda", lat: 21.8579, lng: 84.0081, category: "Low Potential",
    factSheet: { blocks: 5, gPs: 78, totalVillages: 348, inhabitedVillages: 346, uninhabitedVillages: 2, fraPotentialVillages: 320, fraNonPotentialVillages: 26, unsurveyed: 5, forestFringeVillages: 116, villagesWithForestLand: 312, totalForestArea: 511.67, potentialForestAreaUnderFRA: 172.21, potentialIFRArea: 41.11, potentialCFRArea: 131.10 }
  },
  {
    name: "Cuttack", lat: 20.4625, lng: 85.8830, category: "Low Potential",
    factSheet: { blocks: 14, gPs: 342, totalVillages: 1950, inhabitedVillages: 1856, uninhabitedVillages: 94, fraPotentialVillages: 753, fraNonPotentialVillages: 1103, unsurveyed: 0, forestFringeVillages: 275, villagesWithForestLand: 705, totalForestArea: 841.36, potentialForestAreaUnderFRA: 344.68, potentialIFRArea: 134.12, potentialCFRArea: 210.56 }
  },
  {
    name: "Jajpur", lat: 20.8516, lng: 86.3261, category: "Low Potential",
    factSheet: { blocks: 10, gPs: 280, totalVillages: 1778, inhabitedVillages: 1575, uninhabitedVillages: 203, fraPotentialVillages: 352, fraNonPotentialVillages: 1223, unsurveyed: 0, forestFringeVillages: 39, villagesWithForestLand: 349, totalForestArea: 759.85, potentialForestAreaUnderFRA: 719.86, potentialIFRArea: 86.68, potentialCFRArea: 633.18 }
  },
  {
    name: "Khordha", lat: 20.1826, lng: 85.6187, category: "Low Potential",
    factSheet: { blocks: 10, gPs: 168, totalVillages: 1551, inhabitedVillages: 1358, uninhabitedVillages: 193, fraPotentialVillages: 340, fraNonPotentialVillages: 1018, unsurveyed: 4, forestFringeVillages: 48, villagesWithForestLand: 318, totalForestArea: 684.37, potentialForestAreaUnderFRA: 364.10, potentialIFRArea: 146.98, potentialCFRArea: 217.12 }
  },
  // Very Low Potential
  {
    name: "Puri", lat: 19.8135, lng: 85.8312, category: "Very Low Potential",
    factSheet: { blocks: 11, gPs: 230, totalVillages: 1715, inhabitedVillages: 1591, uninhabitedVillages: 124, fraPotentialVillages: 256, fraNonPotentialVillages: 1335, unsurveyed: 1, forestFringeVillages: 0, villagesWithForestLand: 255, totalForestArea: 223.97, potentialForestAreaUnderFRA: 123.36, potentialIFRArea: 11.76, potentialCFRArea: 111.60 }
  },
  {
    name: "Jagatsinghpur", lat: 20.2649, lng: 86.1764, category: "Very Low Potential",
    factSheet: { blocks: 8, gPs: 194, totalVillages: 1288, inhabitedVillages: 1227, uninhabitedVillages: 61, fraPotentialVillages: 275, fraNonPotentialVillages: 952, unsurveyed: 1, forestFringeVillages: 0, villagesWithForestLand: 274, totalForestArea: 155.32, potentialForestAreaUnderFRA: 131.86, potentialIFRArea: 0.84, potentialCFRArea: 131.02 }
  },
  {
    name: "Bhadrak", lat: 21.0570, lng: 86.5138, category: "Very Low Potential",
    factSheet: { blocks: 7, gPs: 218, totalVillages: 1310, inhabitedVillages: 1242, uninhabitedVillages: 68, fraPotentialVillages: 821, fraNonPotentialVillages: 421, unsurveyed: 0, forestFringeVillages: 0, villagesWithForestLand: 821, totalForestArea: 126.55, potentialForestAreaUnderFRA: 97.06, potentialIFRArea: 0.00, potentialCFRArea: 97.06 }
  },
  {
    name: "Balasore", lat: 21.4942, lng: 87.0347, category: "Very Low Potential",
    factSheet: { blocks: 12, gPs: 289, totalVillages: 2952, inhabitedVillages: 2587, uninhabitedVillages: 365, fraPotentialVillages: 613, fraNonPotentialVillages: 1974, unsurveyed: 1, forestFringeVillages: 56, villagesWithForestLand: 603, totalForestArea: 445.56, potentialForestAreaUnderFRA: 159.76, potentialIFRArea: 43.42, potentialCFRArea: 116.34 }
  },
  {
    name: "Kendrapara", lat: 20.4985, lng: 86.4220, category: "Very Low Potential",
    factSheet: { blocks: 9, gPs: 230, totalVillages: 1540, inhabitedVillages: 1407, uninhabitedVillages: 133, fraPotentialVillages: 346, fraNonPotentialVillages: 1061, unsurveyed: 0, forestFringeVillages: 56, villagesWithForestLand: 294, totalForestArea: 274.68, potentialForestAreaUnderFRA: 231.91, potentialIFRArea: 21.14, potentialCFRArea: 210.77 }
  },
  {
    name: "Sonepur", lat: 20.8329, lng: 83.9067, category: "Very Low Potential",
    factSheet: { blocks: 6, gPs: 96, totalVillages: 959, inhabitedVillages: 829, uninhabitedVillages: 130, fraPotentialVillages: 588, fraNonPotentialVillages: 241, unsurveyed: 0, forestFringeVillages: 301, villagesWithForestLand: 512, totalForestArea: 421.76, potentialForestAreaUnderFRA: 152.66, potentialIFRArea: 5.11, potentialCFRArea: 147.55 }
  }
];

const fraColorFor = (category: string) =>
  ({
    "Very High Potential": "#27ae60",
    "High Potential": "#2ecc71",
    "Moderate Potential": "#f39c12",
    "Low Potential": "#e74c3c",
    "Very Low Potential": "#95a6a6",
  }[category] || "#ccc");

// Legends Panel Component (20% width)
const LegendsPanel: React.FC = () => {
  return (
    <div style={{
      background: 'white',
      borderRadius: '10px',
      boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
      padding: '20px',
      height: '580px',
      overflow: 'auto'
    }}>
      <h3 style={{ 
        margin: '0 0 20px 0', 
        color: '#333', 
        fontSize: '18px',
        fontWeight: '600',
        borderBottom: '2px solid #3498db',
        paddingBottom: '10px'
      }}>
        FRA Potential Categories
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {Object.entries(fraData).map(([category, data]) => (
          <div key={category} style={{
            padding: '15px',
            borderRadius: '8px',
            border: '2px solid ' + data.color,
            background: data.color + '10'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
              <span
                style={{ 
                  width: '20px',
                  height: '20px',
                  backgroundColor: data.color,
                  display: 'inline-block',
                  marginRight: '10px',
                  borderRadius: '50%',
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              ></span>
              <h4 style={{ 
                margin: '0', 
                color: '#333', 
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {category}
              </h4>
            </div>
            
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>
              <strong>CFR Potential:</strong> {data.cfrPotential}
            </div>
            
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>
              {data.description}
            </div>
            
            <div style={{ fontSize: '10px', color: '#888' }}>
              <strong>Districts ({data.districts.length}):</strong><br/>
              {data.districts.slice(0, 3).join(', ')}
              {data.districts.length > 3 && ` +${data.districts.length - 3} more`}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#333' }}>
          Total Overview
        </h4>
        <div style={{ fontSize: '11px', color: '#666' }}>
          <div>• {odishaDistrictCenters.length} Districts</div>
          <div>• {Object.keys(fraData).length} Categories</div>
          <div>• Interactive Map Visualization</div>
        </div>
      </div>
    </div>
  );
};

// District Statistics Component (20% width)
const DistrictStatistics: React.FC<{ district: any; onClose: () => void }> = ({ district, onClose }) => {
  if (!district) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
        padding: '20px',
        height: '580px',
        overflow: 'auto'
      }}>
        <h3 style={{ 
          color: '#666', 
          textAlign: 'center', 
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          District Statistics
        </h3>
        <div style={{ textAlign: 'center', color: '#999' }}>
          {/* <div style={{
            width: '80px',
            height: '80px',
            margin: '40px auto',
            background: '#f0f0f0',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '30px' }}></span>
          </div> */}
          <p style={{ fontSize: '14px' }}>Click on a district marker to view detailed statistics</p>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      "Very High Potential": "#27ae60",
      "High Potential": "#2ecc71",
      "Moderate Potential": "#f39c12",
      "Low Potential": "#e74c3c",
      "Very Low Potential": "#95a6a6"
    };
    return colors[category as keyof typeof colors] || "#ccc";
  };

  const fraEfficiency = Math.round(
    (district.factSheet.fraPotentialVillages / district.factSheet.totalVillages) * 100
  );

  return (
    <div style={{
      background: 'white',
      borderRadius: '10px',
      boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
      overflow: 'hidden',
      height: '580px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        background: getCategoryColor(district.category),
        padding: '15px',
        color: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: '0 0 3px 0', fontSize: '18px', fontWeight: 'bold' }}>
              {district.name}
            </h2>
            <p style={{ margin: '0', fontSize: '12px', opacity: '0.9' }}>
              {district.category}
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              color: 'white',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '15px', flex: 1, overflow: 'auto' }}>
        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '15px' }}>
          <div style={{
            textAlign: 'center',
            padding: '10px',
            background: '#f8f9fa',
            borderRadius: '6px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '2px' }}>
              {district.factSheet.totalVillages.toLocaleString()}
            </div>
            <div style={{ fontSize: '10px', color: '#666' }}>Total Villages</div>
          </div>
          
          <div style={{
            textAlign: 'center',
            padding: '10px',
            background: '#f8f9fa',
            borderRadius: '6px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: getCategoryColor(district.category),
              marginBottom: '2px'
            }}>
              {fraEfficiency}%
            </div>
            <div style={{ fontSize: '10px', color: '#666' }}>FRA Potential</div>
          </div>
        </div>

        {/* Detailed Information Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Administrative Division */}
          <div>
            <h4 style={{ 
              margin: '0 0 6px 0', 
              color: '#333', 
              fontSize: '12px',
              borderLeft: '3px solid #3498db',
              paddingLeft: '6px'
            }}>
              Administrative
            </h4>
            <div style={{ fontSize: '11px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Blocks:</span>
                <span style={{ fontWeight: '600' }}>{district.factSheet.blocks}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>GPs:</span>
                <span style={{ fontWeight: '600' }}>{district.factSheet.gPs}</span>
              </div>
            </div>
          </div>

          {/* Village Statistics */}
          <div>
            <h4 style={{ 
              margin: '0 0 6px 0', 
              color: '#333', 
              fontSize: '12px',
              borderLeft: '3px solid #28a745',
              paddingLeft: '6px'
            }}>
              Villages
            </h4>
            <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Inhabited:</span>
                <span style={{ fontWeight: '600' }}>{district.factSheet.inhabitedVillages.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Uninhabited:</span>
                <span style={{ fontWeight: '600' }}>{district.factSheet.uninhabitedVillages.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Forest Fringe:</span>
                <span style={{ fontWeight: '600' }}>{district.factSheet.forestFringeVillages.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* FRA Analysis */}
          <div>
            <h4 style={{ 
              margin: '0 0 6px 0', 
              color: '#333', 
              fontSize: '12px',
              borderLeft: '3px solid #ffc107',
              paddingLeft: '6px'
            }}>
              FRA Analysis
            </h4>
            <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>FRA Potential:</span>
                <span style={{ fontWeight: '600', color: '#28a745' }}>{district.factSheet.fraPotentialVillages.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Non-Potential:</span>
                <span style={{ fontWeight: '600', color: '#dc3545' }}>{district.factSheet.fraNonPotentialVillages.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Unsurveyed:</span>
                <span style={{ fontWeight: '600', color: '#fd7e14' }}>{district.factSheet.unsurveyed.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Forest Coverage */}
          <div>
            <h4 style={{ 
              margin: '0 0 6px 0', 
              color: '#333', 
              fontSize: '12px',
              borderLeft: '3px solid #20c997',
              paddingLeft: '6px'
            }}>
              Forest Coverage (km²)
            </h4>
            <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Total:</span>
                <span style={{ fontWeight: '600' }}>{district.factSheet.totalForestArea.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>FRA Area:</span>
                <span style={{ fontWeight: '600' }}>{district.factSheet.potentialForestAreaUnderFRA.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>CFR:</span>
                <span style={{ fontWeight: '600' }}>{district.factSheet.potentialCFRArea.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>IFR:</span>
                <span style={{ fontWeight: '600' }}>{district.factSheet.potentialIFRArea.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginTop: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
            <span style={{ color: '#666' }}>FRA Potential</span>
            <span style={{ fontWeight: '600' }}>{fraEfficiency}%</span>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            background: '#e9ecef',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${fraEfficiency}%`,
              height: '100%',
              background: getCategoryColor(district.category),
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component with 3-column layout
const FRAAppLayout: React.FC = () => {
  const mapRef = useRef<LeafletMap | null>(null);
  const odishaLayerRef = useRef<FeatureGroup | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("map").setView([20.95, 84.8], 6);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);
      mapRef.current = map;
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (odishaLayerRef.current) {
      map.removeLayer(odishaLayerRef.current);
      odishaLayerRef.current = null;
    }

    const markers = L.featureGroup();
    odishaDistrictCenters.forEach((dist) => {
      const marker = L.circleMarker([dist.lat, dist.lng], {
        radius: 12,
        fillColor: fraColorFor(dist.category),
        color: "#fff",
        weight: 2,
        fillOpacity: 0.8,
      });
      
      // Add click handler
      marker.on('click', () => {
        setSelectedDistrict(dist);
      });
      
      marker.addTo(markers);
    });

    markers.addTo(map);
    odishaLayerRef.current = markers;

    const odishaBounds = markers.getBounds();
    if (odishaBounds.isValid()) {
      map.fitBounds(odishaBounds);
    }
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '20% 60% 20%', // Legends 20%, Map 60%, Statistics 20%
        gap: '20px',
        minWidth: '90vw',
        margin: '0 auto'
      }}>
        {/* Left Panel - Legends (20%) */}
        <LegendsPanel />
        
        {/* Center Panel - Map (60%) */}
        <div style={{
          background: 'white',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
        }}>
          <div id="map" style={{ 
            height: '580px',
            width: '100%'
          }}></div>
        </div>
        
        {/* Right Panel - Statistics (20%) */}
        <DistrictStatistics 
          district={selectedDistrict} 
          onClose={() => setSelectedDistrict(null)} 
        />
      </div>
    </div>
  );
};

export default FRAAppLayout;