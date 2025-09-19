import React, { useEffect, useRef, useState } from "react";
import L, { Map as LeafletMap, Layer, FeatureGroup } from "leaflet";
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

const getFactSheetHTML = (factSheet: any, districtName: string) => `
  <div style="
    background: black; 
    color: white; 
    padding: 15px; 
    border-radius: 8px; 
    font-family: Arial, sans-serif;
    min-width: 280px;
    max-width: 350px;
  ">
    <div style="
      text-align: center; 
      font-size: 16px; 
      font-weight: bold; 
      margin-bottom: 15px;
      border-bottom: 1px solid #444;
      padding-bottom: 8px;
    ">
      ${districtName.toUpperCase()} FACT SHEET
    </div>
    
    <table style="
      width: 100%; 
      font-size: 12px; 
      border-collapse: collapse;
    ">
      <tr style="background: #333;"><td style="padding: 5px; border-bottom: 1px solid #555;"><strong>No. of Blocks</strong></td><td style="padding: 5px; border-bottom: 1px solid #555; text-align: right;"><strong>${factSheet.blocks}</strong></td></tr>
      <tr><td style="padding: 5px; border-bottom: 1px solid #555;">No. of GPs</td><td style="padding: 5px; border-bottom: 1px solid #555; text-align: right;">${factSheet.gPs}</td></tr>
      <tr style="background: #333;"><td style="padding: 5px; border-bottom: 1px solid #555;"><strong>Total No. of Villages</strong></td><td style="padding: 5px; border-bottom: 1px solid #555; text-align: right;"><strong>${factSheet.totalVillages}</strong></td></tr>
      <tr><td style="padding: 5px; border-bottom: 1px solid #555;">No. of Inhabited Villages</td><td style="padding: 5px; border-bottom: 1px solid #555; text-align: right;">${factSheet.inhabitedVillages}</td></tr>
      <tr style="background: #333;"><td style="padding: 5px; border-bottom: 1px solid #555;">No. of Uninhabited Villages</td><td style="padding: 5px; border-bottom: 1px solid #555; text-align: right;">${factSheet.uninhabitedVillages}</td></tr>
      <tr><td style="padding: 5px; border-bottom: 1px solid #555;">No. of FRA Potential Villages</td><td style="padding: 5px; border-bottom: 1px solid #555; text-align: right;">${factSheet.fraPotentialVillages}</td></tr>
      <tr style="background: #333;"><td style="padding: 5px; border-bottom: 1px solid #555;">No. of FRA Non-Potential Villages</td><td style="padding: 5px; border-bottom: 1px solid #555; text-align: right;">${factSheet.fraNonPotentialVillages}</td></tr>
      <tr><td style="padding: 5px; border-bottom: 1px solid #555;">No. of Unsurveyed villages</td><td style="padding: 5px; border-bottom: 1px solid #555; text-align: right;">${factSheet.unsurveyed}</td></tr>
      <tr style="background: #333;"><td style="padding: 5px; border-bottom: 1px solid #555;"><strong>No. of Forest fringe villages</strong></td><td style="padding: 5px; border-bottom: 1px solid #555; text-align: right;"><strong>${factSheet.forestFringeVillages}</strong></td></tr>
      <tr><td style="padding: 5px; border-bottom: 1px solid #555;">No. of Villages with forest land within village boundary</td><td style="padding: 5px; border-bottom: 1px solid #555; text-align: right;">${factSheet.villagesWithForestLand}</td></tr>
      <tr style="background: #333;"><td style="padding: 5px; border-bottom: 1px solid #555;"><strong>Total Forest area (sq kms)</strong></td><td style="padding: 5px; border-bottom: 1px solid #555; text-align: right;"><strong>${factSheet.totalForestArea}</strong></td></tr>
      <tr><td style="padding: 5px; border-bottom: 1px solid #555;">Potential Forest area under FRA (sq kms)</td><td style="padding: 5px; border-bottom: 1px solid #555; text-align: right;">${factSheet.potentialForestAreaUnderFRA}</td></tr>
      <tr style="background: #333;"><td style="padding: 5px;">Potential IFR area (sq kms)</td><td style="padding: 5px; text-align: right;">${factSheet.potentialIFRArea}</td></tr>
      <tr><td style="padding: 5px;">Potential CFR area (sq kms)</td><td style="padding: 5px; text-align: right;">${factSheet.potentialCFRArea}</td></tr>
    </table>
  </div>
`;

const FRAAppLayout: React.FC = () => {
  const mapRef = useRef<LeafletMap | null>(null);
  const odishaLayerRef = useRef<FeatureGroup | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [modalDistrict, setModalDistrict] = useState("");
  const [modalCategory, setModalCategory] = useState("");

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
        radius: 10,
        fillColor: fraColorFor(dist.category),
        color: "#fff",
        weight: 2,
        fillOpacity: 0.8,
      });
      marker.bindPopup(getFactSheetHTML(dist.factSheet, dist.name));
      marker.addTo(markers);
    });

    markers.addTo(map);
    odishaLayerRef.current = markers;

    // Fit map to show all districts
    const odishaBounds = markers.getBounds();
    if (odishaBounds.isValid()) {
      map.fitBounds(odishaBounds);
    }
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1800px',
      margin: '0 auto',
      background: 'white',
      minHeight: '50vh',
      minWidth:'56vw',
      color: '#ffffff'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px',
        alignItems: 'start'
      }}>
        <div id="map" style={{ 
          height: '600px', 
          borderRadius: '10px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
          border: '2px solid #555',
          overflow: 'hidden'
        }}></div>

        <div style={{
          background: 'linear-gradient(135deg, #34495e 0%, rgba(0,0,0,0.2) 100%)',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          height: 'fit-content',
          border: '1px solid #444'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#ffffff', borderBottom: '2px solid #3498db', paddingBottom: '8px' }}>Legend</h3>
          <div>
            {Object.entries(fraData).map(([cat, data]) => (
              <div key={cat} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '12px',
                fontSize: '13px',
                padding: '8px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <span
                  style={{ 
                    width: '18px',
                    height: '18px',
                    backgroundColor: data.color,
                    display: 'inline-block',
                    marginRight: '10px',
                    borderRadius: '50%',
                    border: '2px solid #fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}
                ></span>
                <span style={{ color: '#ffffff', fontWeight: '500' }}>
                  {cat} - {data.cfrPotential}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            padding: '30px',
            borderRadius: '15px',
            maxWidth: '500px',
            width: '90%',
            border: '2px solid #555',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            color: '#ffffff'
          }}>
            <h3 style={{ color: '#ffffff', marginBottom: '15px' }}>{modalDistrict}</h3>
            <p style={{ color: '#bdc3c7' }}><b>Category:</b> {modalCategory}</p>
            <p style={{ color: '#bdc3c7' }}><b>CFR Potential:</b> {fraData[modalCategory]?.cfrPotential}</p>
            <p style={{ color: '#bdc3c7', marginBottom: '20px' }}>{fraData[modalCategory]?.description}</p>
            <button 
              onClick={() => setShowModal(false)}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 3px 8px rgba(0,0,0,0.3)'
              }}
            >Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FRAAppLayout;
