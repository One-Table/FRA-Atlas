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

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar", "Dadra and Nagar Haveli", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const indianStatesBounds: Record<string, [[number, number], [number, number]]> = {
  "Andhra Pradesh": [[12.41, 77.0], [19.07, 84.93]],
  "Arunachal Pradesh": [[26.91, 91.35], [29.39, 97.15]],
  "Assam": [[24.0, 89.5], [28.27, 96.05]],
  "Bihar": [[24.5, 83.0], [27.7, 88.2]],
  "Chhattisgarh": [[17.2, 80.9], [24.1, 84.7]],
  "Goa": [[14.8, 73.7], [15.7, 74.3]],
  "Gujarat": [[20.1, 68.1], [24.75, 74.4]],
  "Haryana": [[27.6, 74.5], [30.9, 77.1]],
  "Himachal Pradesh": [[30.4, 75.3], [33.2, 79.1]],
  "Jharkhand": [[22.0, 83.3], [24.3, 86.6]],
  "Karnataka": [[11.6, 74.0], [18.5, 78.5]],
  "Kerala": [[8.1, 74.0], [12.6, 77.4]],
  "Madhya Pradesh": [[21.2, 74.0], [26.5, 82.8]],
  "Maharashtra": [[15.6, 72.6], [22.0, 80.9]],
  "Manipur": [[23.8, 93.0], [25.9, 94.9]],
  "Meghalaya": [[25.0, 89.5], [26.5, 92.2]],
  "Mizoram": [[21.5, 92.3], [23.3, 93.3]],
  "Nagaland": [[25.0, 93.3], [27.3, 95.3]],
  "Odisha": [[17.5, 81.3], [22.5, 87.5]],
  "Punjab": [[29.4, 73.8], [32.3, 76.9]],
  "Rajasthan": [[23.3, 69.5], [30.1, 78.2]],
  "Sikkim": [[27.0, 88.0], [28.0, 88.9]],
  "Tamil Nadu": [[8.0, 76.1], [13.5, 80.3]],
  "Telangana": [[15.9, 77.95], [19.42, 80.46]],
  "Tripura": [[22.5, 91.2], [24.0, 92.0]],
  "Uttar Pradesh": [[24.4, 77.0], [31.0, 84.0]],
  "Uttarakhand": [[28.6, 77.5], [31.3, 81.0]],
  "West Bengal": [[21.45, 85.3], [27.1, 89.9]],
  "Andaman and Nicobar Islands": [[6.5, 92.0], [13.0, 94.0]],
  "Chandigarh": [[30.7, 76.7], [30.8, 76.8]],
  "Dadra and Nagar Haveli": [[20.0, 72.8], [20.3, 73.2]],
  "Delhi": [[28.4, 76.84], [28.88, 77.34]],
  "Jammu and Kashmir": [[32.17, 73.75], [37.09, 80.3]],
  "Ladakh": [[32.67, 76.12], [34.54, 79.3]],
  "Lakshadweep": [[10.5, 71.0], [12.0, 73.5]],
  "Puducherry": [[11.9, 79.7], [12.0, 79.9]],
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
  const currentHighlightRef = useRef<Layer | null>(null);

  const [selectedState, setSelectedState] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalDistrict, setModalDistrict] = useState("");
  const [modalCategory, setModalCategory] = useState("");

  const getDistrictCategory = (districtName: string) => {
    for (const [category, data] of Object.entries(fraData) as [string, any][]) {
      if (data.districts.includes(districtName)) return category;
    }
    return "Unknown";
  };

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
  }, []);

  useEffect(() => {
    if (!selectedState || !mapRef.current) return;
    const map = mapRef.current;

    if (currentHighlightRef.current) {
      map.removeLayer(currentHighlightRef.current);
      currentHighlightRef.current = null;
    }

    const bounds = indianStatesBounds[selectedState];
    if (bounds && bounds.length === 2 && bounds[0].length === 2 && bounds[1].length === 2) {
      const highlight = L.rectangle(bounds, {
        color: "#e74c3c",
        weight: 3,
        fillOpacity: 0.1,
        dashArray: "10,5",
      }).addTo(map);
      currentHighlightRef.current = highlight;
      map.fitBounds(bounds);

      if (selectedState === "Odisha" && odishaLayerRef.current) {
        const odishaBounds = odishaLayerRef.current.getBounds();
        if (odishaBounds.isValid()) {
          map.fitBounds(odishaBounds);
        }
      }
    } else {
      console.error("Invalid or missing bounds for selected state:", selectedState);
    }
  }, [selectedState]);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1400px',
      margin: '0 auto',
      background: '#1a1a1a',
      minHeight: '100vh',
      color: '#ffffff'
    }}>
      <header style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.1) 100%)',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        border: '1px solid #444'
      }}>
        <h1 style={{ 
          margin: '0 0 10px 0', 
          color: '#ffffff',
          fontSize: '2.5rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>FRA Atlas of Odisha</h1>
        <p style={{ 
          margin: 0, 
          color: '#bdc3c7',
          fontSize: '1.1rem'
        }}>Interactive Map - Forest Rights Act Implementation Potential</p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1fr',
        gap: '20px',
        alignItems: 'start'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #34495e 0%, rgba(0,0,0,0.2) 100%)',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          height: 'fit-content',
          border: '1px solid #444'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="stateSelect" style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#ffffff'
            }}>Select State</label>
            <select
              id="stateSelect"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #555',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'rgba(0,0,0,0.2)',
                color: '#ffffff',
                outline: 'none'
              }}
            >
              <option value="">-- Select --</option>
              {indianStates.map((state) => (
                <option key={state} value={state} style={{ background: 'black', color: '#ffffff' }}>
                  {state}
                </option>
              ))}
            </select>
            <button 
              onClick={() => setSelectedState("")}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '12px',
                background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
              }}
            >Reset View</button>
          </div>

          <div>
            <h3 style={{ marginBottom: '15px', color: '#ffffff', borderBottom: '2px solid #3498db', paddingBottom: '8px' }}>About Forest Rights Act (FRA) 2006</h3>
            <p style={{ 
              fontSize: '14px', 
              lineHeight: '1.6',
              color: '#bdc3c7',
              margin: 0
            }}>
              The Forest Rights Act recognizes forest-dwelling Scheduled Tribes and
              traditional forest dwellers' rights over forests and land.
            </p>
          </div>
        </div>

        <div id="map" style={{ 
          height: '500px', 
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
