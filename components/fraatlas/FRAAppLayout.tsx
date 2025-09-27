'use client'

import L, { GeoJSON as LeafletGeoJSON, Map as LeafletMap } from "leaflet";

import "leaflet/dist/leaflet.css";

import React, { useEffect, useRef, useState } from "react";

const fraData: Record<string, { districts: string[]; description: string; cfrPotential: string; color: string }> = {
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

// IMPROVED Forest Coverage Donut Chart Component
const ForestCoverageChart: React.FC<{ selectedDistrict?: any }> = ({ selectedDistrict }) => {
  const getForestData = () => {
    if (selectedDistrict) {
      const cfrArea = selectedDistrict.factSheet.potentialCFRArea;
      const ifrArea = selectedDistrict.factSheet.potentialIFRArea;
      const totalArea = selectedDistrict.factSheet.totalForestArea;
      const fraArea = selectedDistrict.factSheet.potentialForestAreaUnderFRA;
      const nonFraArea = totalArea - fraArea;

      return [
        { category: "CFR", area: cfrArea, color: "#22c55e", lightColor: "#dcfce7" },
        { category: "IFR", area: ifrArea, color: "#3b82f6", lightColor: "#dbeafe" },
        { category: "Non-FRA", area: nonFraArea, color: "#64748b", lightColor: "#f1f5f9" }
      ];
    } else {
      return [
        { category: "CFR", area: 798.7, color: "#22c55e", lightColor: "#dcfce7" },
        { category: "IFR", area: 507.18, color: "#3b82f6", lightColor: "#dbeafe" },
        { category: "Non-FRA", area: 1297.83, color: "#64748b", lightColor: "#f1f5f9" }
      ];
    }
  };

  const forestData = getForestData();
  const totalArea = forestData.reduce((sum, item) => sum + item.area, 0);

  const getChartTitle = () => {
    if (selectedDistrict) {
      return selectedDistrict.name;
    }
    return "All Districts";
  };

  // Calculate angles for each segment
  let currentAngle = 0;
  const segments = forestData.map((item) => {
    const percentage = (item.area / totalArea) * 100;
    const angle = (item.area / totalArea) * 360;
    const segment = {
      ...item,
      percentage: percentage.toFixed(1),
      startAngle: currentAngle,
      endAngle: currentAngle + angle
    };
    currentAngle += angle;
    return segment;
  });

  const createArcPath = (centerX: number, centerY: number, radius: number, innerRadius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const innerStart = polarToCartesian(centerX, centerY, innerRadius, endAngle);
    const innerEnd = polarToCartesian(centerX, centerY, innerRadius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "L", innerEnd.x, innerEnd.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e2e8f0',
      marginBottom: '16px'
    }}>
      {/* Header Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
          Forest Coverage
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>
            {getChartTitle()}
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#0f766e' }}>
            {totalArea.toFixed(1)} km²
          </div>
        </div>
      </div>

      {/* Chart and Legend Container */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {/* Donut Chart */}
        <div style={{ flex: '0 0 140px', height: '140px', position: 'relative' }}>
          <svg width="140" height="140" style={{ overflow: 'visible' }}>
            {/* Background circle */}
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="20"
            />

            {/* Segments */}
            {segments.map((segment, index) => (
              <path
                key={index}
                d={createArcPath(70, 70, 60, 40, segment.startAngle, segment.endAngle)}
                fill={segment.color}
                stroke="white"
                strokeWidth="2"
              />
            ))}

            {/* Center Text */}
            <text x="70" y="66" textAnchor="middle" fontSize="11" fontWeight="600" fill="#64748b">
              Forest
            </text>
            <text x="70" y="78" textAnchor="middle" fontSize="11" fontWeight="600" fill="#64748b">
              Coverage
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {segments.map((segment, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: segment.color,
                    marginRight: '8px'
                  }}
                />
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#475569' }}>
                  {segment.category}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>
                  {segment.area.toFixed(1)} km²
                </div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>
                  {segment.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// NEW: District Percentage Potentials Data
interface DistrictPercentagePotentials {
  district: string;
  fraPercentage: number;
  dajguaPercentage: number;
  pmKisanPercentage: number;
  jalShaktiPercentage: number;
}

const odishaDistrictPotentialsPercentages: DistrictPercentagePotentials[] = [
  { district: 'Angul', fraPercentage: 35, dajguaPercentage: 40, pmKisanPercentage: 55, jalShaktiPercentage: 60 },
  { district: 'Balangir', fraPercentage: 65, dajguaPercentage: 70, pmKisanPercentage: 85, jalShaktiPercentage: 88 },
  { district: 'Balasore', fraPercentage: 20, dajguaPercentage: 25, pmKisanPercentage: 78, jalShaktiPercentage: 75 },
  { district: 'Bargarh', fraPercentage: 40, dajguaPercentage: 45, pmKisanPercentage: 65, jalShaktiPercentage: 80 },
  { district: 'Bhadrak', fraPercentage: 10, dajguaPercentage: 12, pmKisanPercentage: 70, jalShaktiPercentage: 75 },
  { district: 'Boudh', fraPercentage: 30, dajguaPercentage: 35, pmKisanPercentage: 60, jalShaktiPercentage: 65 },
  { district: 'Cuttack', fraPercentage: 20, dajguaPercentage: 22, pmKisanPercentage: 90, jalShaktiPercentage: 78 },
  { district: 'Deogarh', fraPercentage: 30, dajguaPercentage: 32, pmKisanPercentage: 40, jalShaktiPercentage: 68 },
  { district: 'Dhenkanal', fraPercentage: 45, dajguaPercentage: 48, pmKisanPercentage: 75, jalShaktiPercentage: 75 },
  { district: 'Gajapati', fraPercentage: 55, dajguaPercentage: 58, pmKisanPercentage: 50, jalShaktiPercentage: 90 },
  { district: 'Ganjam', fraPercentage: 60, dajguaPercentage: 63, pmKisanPercentage: 88, jalShaktiPercentage: 78 },
  { district: 'Jagatsinghpur', fraPercentage: 15, dajguaPercentage: 18, pmKisanPercentage: 65, jalShaktiPercentage: 65 },
  { district: 'Jajpur', fraPercentage: 20, dajguaPercentage: 25, pmKisanPercentage: 72, jalShaktiPercentage: 70 },
  { district: 'Jharsuguda', fraPercentage: 25, dajguaPercentage: 28, pmKisanPercentage: 42, jalShaktiPercentage: 68 },
  { district: 'Kalahandi', fraPercentage: 50, dajguaPercentage: 52, pmKisanPercentage: 78, jalShaktiPercentage: 88 },
  { district: 'Kandhamal', fraPercentage: 70, dajguaPercentage: 75, pmKisanPercentage: 65, jalShaktiPercentage: 90 },
  { district: 'Kendrapara', fraPercentage: 15, dajguaPercentage: 18, pmKisanPercentage: 80, jalShaktiPercentage: 72 },
  { district: 'Keonjhar', fraPercentage: 60, dajguaPercentage: 62, pmKisanPercentage: 78, jalShaktiPercentage: 75 },
  { district: 'Khordha', fraPercentage: 22, dajguaPercentage: 25, pmKisanPercentage: 70, jalShaktiPercentage: 73 },
  { district: 'Koraput', fraPercentage: 75, dajguaPercentage: 78, pmKisanPercentage: 68, jalShaktiPercentage: 85 },
  { district: 'Malkangiri', fraPercentage: 80, dajguaPercentage: 82, pmKisanPercentage: 66, jalShaktiPercentage: 80 },
  { district: 'Mayurbhanj', fraPercentage: 70, dajguaPercentage: 72, pmKisanPercentage: 85, jalShaktiPercentage: 90 },
  { district: 'Nabarangpur', fraPercentage: 65, dajguaPercentage: 68, pmKisanPercentage: 70, jalShaktiPercentage: 85 },
  { district: 'Nayagarh', fraPercentage: 35, dajguaPercentage: 38, pmKisanPercentage: 72, jalShaktiPercentage: 72 },
  { district: 'Nuapada', fraPercentage: 40, dajguaPercentage: 42, pmKisanPercentage: 70, jalShaktiPercentage: 78 },
  { district: 'Puri', fraPercentage: 10, dajguaPercentage: 12, pmKisanPercentage: 75, jalShaktiPercentage: 68 },
  { district: 'Rayagada', fraPercentage: 70, dajguaPercentage: 74, pmKisanPercentage: 70, jalShaktiPercentage: 82 },
  { district: 'Sambalpur', fraPercentage: 50, dajguaPercentage: 52, pmKisanPercentage: 68, jalShaktiPercentage: 70 },
  { district: 'Subarnapur', fraPercentage: 25, dajguaPercentage: 28, pmKisanPercentage: 72, jalShaktiPercentage: 73 },
  { district: 'Sundargarh', fraPercentage: 60, dajguaPercentage: 65, pmKisanPercentage: 75, jalShaktiPercentage: 80 },
];

interface PotentialChartProps {
  selectedDistrict: any;
}

const PotentialChart: React.FC<PotentialChartProps> = ({ selectedDistrict }) => {
  if (!selectedDistrict) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #e2e8f0',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '8px' }}>📊 Scheme Potentials</div>
        <div>Select a district to view potential analysis</div>
      </div>
    );
  }

  const districtName = selectedDistrict.name;

  // Find percentage potentials for the district
  const getPercentageForDistrict = (district: string) => {
    const found = odishaDistrictPotentialsPercentages.find(d => d.district === district);
    return found || {
      fraPercentage: 0,
      dajguaPercentage: 0,
      pmKisanPercentage: 0,
      jalShaktiPercentage: 0
    };
  };

  const percentages = getPercentageForDistrict(districtName);

  // Color mapping for percentage levels
  const getColorForPercentage = (percentage: number) => {
    if (percentage >= 70) return '#22c55e'; // Very High - Green
    if (percentage >= 50) return '#16a34a'; // High - Dark Green
    if (percentage >= 30) return '#f59e0b'; // Moderate - Orange
    return '#ef4444'; // Low - Red
  };

  // Horizontal Bar component for percentage levels
  const HorizontalBar: React.FC<{ percentage: number; color: string }> = ({ percentage, color }) => (
    <div style={{
      width: '100%',
      height: '24px',
      backgroundColor: '#f1f5f9',
      borderRadius: '12px',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        width: `${percentage}%`,
        height: '100%',
        backgroundColor: color,
        borderRadius: '12px',
        transition: 'width 0.8s ease-in-out',
        position: 'relative'
      }}>
        {/* Gradient overlay for better visual appeal */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(90deg, ${color}, ${color}aa)`,
          borderRadius: '12px'
        }} />
      </div>
      {/* Percentage text overlay */}
      <div style={{
        position: 'absolute',
        right: '8px',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '12px',
        fontWeight: '700',
      }}>
      </div>
    </div>
  );

  const schemes = [
    { name: 'FRA', fullName: 'Forest Rights Act', percentage: percentages.fraPercentage, icon: '🌲' },
    { name: 'DAJGUA', fullName: 'Dharti Aaba Janjatiya Gram Utkarsh Abhiyan', percentage: percentages.dajguaPercentage, icon: '🏘️' },
    { name: 'PM Kisan', fullName: 'PM Kisan Samman Nidhi', percentage: percentages.pmKisanPercentage, icon: '🌾' },
    { name: 'Jal Shakti', fullName: 'Jal Jeevan Mission', percentage: percentages.jalShaktiPercentage, icon: '💧' }
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e2e8f0',
      margin: '16px 0'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '12px',
        borderBottom: '2px solid #f1f5f9'
      }}>
        <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
          Scheme Potentials
        </div>
        <div style={{
          marginLeft: '12px',
          padding: '4px 8px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#475569'
        }}>
          {districtName}
        </div>
      </div>

      {/* Scheme Cards with Horizontal Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {schemes.map((scheme, index) => (
          <div key={index} style={{
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            {/* Scheme Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <div style={{ fontSize: '20px', marginRight: '12px' }}>
                {scheme.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: '700',
                  fontSize: '14px',
                  color: '#1e293b',
                  marginBottom: '2px'
                }}>
                  {scheme.name}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#64748b',
                  fontWeight: '500'
                }}>
                  {scheme.fullName}
                </div>
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: '700',
                color: getColorForPercentage(scheme.percentage),
                minWidth: '50px',
                textAlign: 'right'
              }}>
                {scheme.percentage}%
              </div>
            </div>

            {/* Horizontal Bar */}
            <HorizontalBar
              percentage={scheme.percentage}
              color={getColorForPercentage(scheme.percentage)}
            />
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#f0f9ff',
        borderRadius: '8px',
        border: '1px solid #0ea5e9',
        fontSize: '12px',
        color: '#0c4a6e',
        fontWeight: '500'
      }}>
        💡 <strong>District Summary:</strong> {districtName} shows highest coverage in{' '}
        {schemes
          .filter(s => s.percentage >= 70)
          .map(s => s.name)
          .join(', ') || 'moderate to high coverage across all schemes'
        }.
      </div>
    </div>
  );
};



// NEW: Annual Rainfall Chart Component
const AnnualRainfallChart: React.FC<{ selectedDistrict?: any }> = ({ selectedDistrict }) => {
  const rainfallData = [
    { year: 2008, annual: 1523.6, juneSept: 1223.3 },
    { year: 2009, annual: 1356.6, juneSept: 1068.9 },
    { year: 2010, annual: 1299.0, juneSept: 952.1 },
    { year: 2011, annual: 1318.1, juneSept: 1061.8 },
    { year: 2012, annual: 1384.1, juneSept: 1067.2 },
    { year: 2013, annual: 1687.1, juneSept: 1307.0 },
    { year: 2014, annual: 1600.7, juneSept: 1256.8 },
    { year: 2015, annual: 1294.1, juneSept: 967.8 },
    { year: 2016, annual: 1218.1, juneSept: 940.3 },
    { year: 2017, annual: 1336.4, juneSept: 1029.1 },
    { year: 2018, annual: 1641.8, juneSept: 1327.9 }
  ];

  const normalRainfall = 1451.20;
  const maxRainfall = Math.max(...rainfallData.map(d => d.annual));

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '25px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      border: '1px solid #e2e8f0',
      marginBottom: '16px',
      width: '30vw',
      maxWidth: '30vw',
      minWidth: '30vw'
    }}>
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>🌧️</span>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
          Rainfall Trends
        </h3>
      </div>
      <div style={{ height: '220px', position: 'relative', display: 'flex', alignItems: 'flex-end', gap: '4px', overflowX: 'auto', paddingBottom: '16px' }}>
        {/* Reference line */}
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${((maxRainfall - normalRainfall) / maxRainfall) * 160}px`,
          height: '2px',
          background: '#ef4444',
          zIndex: 10
        }}>
          <span style={{
            position: 'absolute',
            right: '8px',
            top: '-18px',
            fontSize: '9px',
            color: '#ef4444',
            fontWeight: '600'
          }}>
            {normalRainfall} MM
          </span>
        </div>
        {rainfallData.map((item, idx) => (
          <div key={item.year} style={{ flex: '0 0 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <div style={{
              width: '16px',
              height: `${(item.annual / maxRainfall) * 160}px`,
              background: '#2196F3',
              borderRadius: '6px 6px 0 0',
              marginBottom: '2px',
              position: 'relative'
            }}>
              {/* June-Sept overlay */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: `${(item.juneSept / item.annual) * 100}%`,
                background: '#607D8B',
                
                borderRadius: '6px 6px 0 0'
              }} />
              <span style={{
                position: 'absolute',
                top: '-18px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '9px',
                color: '#374151',
                
                fontWeight: '600'
              }}>{item.annual}</span>
            </div>
            <div style={{
              fontSize: '8px',
              color: '#64748b',
              writingMode: 'vertical-rl',
              textAlign: 'center',
              marginRight: '12px',
              marginTop: '2px'
            }}>{item.year}</div>
          </div>
        ))}
      </div>
    </div>
  );
};


// NEW: District Irrigation Area Chart Component (Total Only)
const DistrictIrrigationAreaChart: React.FC<{ selectedDistrict?: any }> = ({ selectedDistrict }) => {
  const irrigationData = [
    { district: "GANJAM", total: 269.567 },
    { district: "BARGARH", total: 243.467 },
    { district: "KEONJHAR", total: 209.951 },
    { district: "BHADRAK", total: 208.588 },
    { district: "KHORDHA", total: 157.370 },
    { district: "CUTTACK", total: 154.613 },
    { district: "ANGUL", total: 142.828 },
    { district: "MALKANGIRI", total: 138.204 },
    { district: "KALAHANDI", total: 124.427 },
    { district: "JAGATSINGHPUR", total: 121.433 },
    { district: "KORAPUT", total: 120.871 },
    { district: "PURI", total: 117.249 },
    { district: "MAYURBHANJ", total: 109.132 },
    { district: "SUBARNAPUR", total: 98.726 },
    { district: "NUAPADA", total: 98.285 }
  ];

  const maxValue = Math.max(...irrigationData.map(d => d.total));

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '25px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      border: '1px solid #e2e8f0',
      marginBottom: '16px',
      width: '30vw',
      maxWidth: '30vw',
      minWidth: '30vw'
    }}>
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>💧</span>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
          Irrigation Area
        </h3>
      </div>
      <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', gap: '4px', overflowX: 'auto', paddingBottom: '16px' }}>
        {irrigationData.map((item, idx) => (
          <div key={item.district} style={{ flex: '0 0 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <div style={{
              width: '16px',
              height: `${(item.total / maxValue) * 160}px`,
              background: 'linear-gradient(180deg, #3b82f6 60%, #1d4ed8 100%)',
              borderRadius: '6px 6px 0 0',
              marginBottom: '2px',
              position: 'relative',
              display: 'flex',
              marginRight: '4px',
              alignItems: 'flex-end',
              justifyContent: 'center'
            }}>
              {/* Value */}
              <span style={{
                position: 'absolute',
                top: '-18px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '9px',
                color: '#374151',
                fontWeight: '600'
              }}>{item.total.toFixed(0)}</span>
              {/* District name inside bar */}
              <span style={{
                writingMode: 'vertical-rl',
                textAlign: 'center',
                fontSize: '8px',
                color: '#fff',
                fontWeight: '300',
                letterSpacing: '0.2px',
                position: 'absolute',
                bottom: '4px',
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap'
              }}>
                {item.district}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// NEW: Cropping Intensity Chart Component
const CroppingIntensityChart: React.FC<{ selectedDistrict?: any }> = ({ selectedDistrict }) => {
  const croppingData = [
    { district: "PURI", intensity: 217, category: "Very High" },
    { district: "JAGATSINGHPUR", intensity: 211, category: "Very High" },
    { district: "GAJAPATI", intensity: 189, category: "High" },
    { district: "NAYAGARH", intensity: 187, category: "High" },
    { district: "KALAHANDI", intensity: 183, category: "High" },
    { district: "SUBARNAPUR", intensity: 182, category: "High" },
    { district: "DHENKANAL", intensity: 180, category: "High" },
    { district: "DEOGARH", intensity: 179, category: "Medium High" },
    { district: "KENDRAPARA", intensity: 178, category: "Medium High" },
    { district: "JAJPUR", intensity: 175, category: "Medium High" },
    { district: "KHORDHA", intensity: 175, category: "Medium High" },
    { district: "ANGUL", intensity: 169, category: "Medium High" },
    { district: "BALASORE", intensity: 161, category: "Medium High" },
    { district: "NABARANGPUR", intensity: 161, category: "Medium High" },
    { district: "GANJAM", intensity: 159, category: "Medium" }
  ]; // Top 15 only for better display

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 200) return "#15803d"; // Very High - Dark Green
    if (intensity >= 180) return "#16a34a"; // High - Green  
    if (intensity >= 160) return "#22c55e"; // Medium High - Light Green
    if (intensity >= 140) return "#84cc16"; // Medium - Lime
    return "#eab308"; // Low - Yellow
  };

  const maxIntensity = Math.max(...croppingData.map(d => d.intensity));

  return (
  <div style={{
    background: 'white',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0',
    marginBottom: '16px',
    width: '100%',
    maxWidth: '420px',
    minWidth: '320px'
  }}>
    <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '20px' }}>📈</span>
      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
        Cropping Intensity
      </h3>
    </div>
    <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', gap: '4px', overflowX: 'auto', paddingBottom: '16px' }}>
      {croppingData.map((item, idx) => (
        <div key={item.district} style={{ flex: '0 0 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <div style={{
            width: '16px',
            height: `${(item.intensity / maxIntensity) * 160}px`,
            background: getIntensityColor(item.intensity),
            borderRadius: '6px 6px 0 0',
            marginBottom: '2px',
            position: 'relative',
            display: 'flex',
            marginRight: '5px',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}>
            {/* Intensity value */}
            <span style={{
              position: 'absolute',
              top: '-18px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '9px',
              color: '#374151',
              fontWeight: '600'
            }}>{item.intensity}</span>
            {/* District name inside bar */}
            <span style={{
              writingMode: 'vertical-rl',
              textAlign: 'center',
              fontSize: '8px',
              color: '#fff',
              fontWeight: '600',
              letterSpacing: '0.5px',
              position: 'absolute',
              bottom: '4px',
              left: '50%',
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap'
            }}>
              {item.district}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);
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
  "Very High Potential": "#22c55e",
  "High Potential": "#16a34a",
  "Moderate Potential": "#f59e0b",
  "Low Potential": "#ef4444",
  "Very Low Potential": "#64748b",
}[category] || "#94a3b8");

// IMPROVED District Search Component
const DistrictSearchBar: React.FC<{ onDistrictSelect: (district: any) => void }> = ({ onDistrictSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDistricts, setFilteredDistricts] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDistricts([]);
      setIsDropdownOpen(false);
    } else {
      const filtered = odishaDistrictCenters.filter(district =>
        district.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        district.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDistricts(filtered);
      setIsDropdownOpen(true);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDistrictSelect = (district: any) => {
    setSearchTerm(district.name);
    setIsDropdownOpen(false);
    onDistrictSelect(district);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredDistricts([]);
    setIsDropdownOpen(false);
  };

  return (
    <div ref={searchRef} style={{ position: 'relative' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        padding: '12px 16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Search Icon */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        {/* Search Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search districts..."
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            color: '#1e293b',
            fontWeight: '500',
            marginLeft: '12px',
            background: 'transparent'
          }}
        />

        {searchTerm && (
          <button
            onClick={clearSearch}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '0 4px'
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isDropdownOpen && filteredDistricts.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          maxHeight: '300px',
          overflowY: 'auto',
          marginTop: '4px'
        }}>
          {filteredDistricts.map((district, index) => (
            <div
              key={index}
              onClick={() => handleDistrictSelect(district)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                borderBottom: index < filteredDistricts.length - 1 ? '1px solid #f1f5f9' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <div style={{ fontWeight: '500', color: '#1e293b' }}>
                {district.name}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                {district.category.split(' ')[0]}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {isDropdownOpen && searchTerm && filteredDistricts.length === 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          padding: '16px',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '14px',
          marginTop: '4px'
        }}>
          No districts found for "{searchTerm}"
        </div>
      )}
    </div>
  );
};

// IMPROVED Legends Panel Component
const LegendsPanel: React.FC<{ onDistrictSelect: (district: any) => void; selectedDistrict: any }> = ({ onDistrictSelect, selectedDistrict }) => {
  return (
    <div style={{
      width: '27vw',
      height: '82vh',
      backgroundColor: '#f8fafc',
      borderRight: '2px solid #e2e8f0',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Search Bar */}
      <div style={{ padding: '20px', paddingBottom: '16px' }}>
        <DistrictSearchBar onDistrictSelect={onDistrictSelect} />
      </div>

      {/* Dynamic Charts */}
      <div style={{ padding: '0 20px', flexGrow: 1 }}>
        {/* Forest Coverage Chart */}
        <ForestCoverageChart selectedDistrict={selectedDistrict} />

        {/* NEW: Potential Chart */}
        <PotentialChart selectedDistrict={selectedDistrict} />
      </div>

      {/* Selection Indicator */}
      <div style={{ padding: '16px 20px' }}>
        {selectedDistrict && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px',
            backgroundColor: '#dcfce7',
            borderRadius: '8px',
            border: '1px solid #22c55e'
          }}>
            <div>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#15803d' }}>
                📍 {selectedDistrict.name}
              </div>
              <div style={{ fontSize: '12px', color: '#166534', fontWeight: '500' }}>
                {selectedDistrict.category}
              </div>
            </div>
            <button
              onClick={() => onDistrictSelect(null)}
              style={{
                background: 'white',
                border: '1px solid #22c55e',
                borderRadius: '8px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                color: '#15803d'
              }}
            >
              Clear
            </button>
          </div>
        )}

        {/* FRA Categories - Compact */}
        <div style={{ marginTop: '16px' }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '8px' }}>🌲</span>
            FRA Categories
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(fraData).map(([category, data]) => (
              <div key={category} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'white',
                border: '1px solid #e2e8f0'
              }}>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: data.color,
                    marginRight: '12px',
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>
                    {category}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '500' }}>
                    {data.districts.length} districts
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// IMPROVED District Statistics Component
const DistrictStatistics: React.FC<{ district: any; onClose: () => void }> = ({ district, onClose }) => {
  if (!district) {
    return (
      <div style={{
        width: '28vw',
        height: '82vh',
        // backgroundColor: '#f8fafc',
        // borderRight: '2px solid #e2e8f0',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 24px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '32px 20px',
          textAlign: 'center',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '24px'
          }}>
            📊
          </div>
          <h3 style={{
            margin: '0 0 8px 0',
            fontSize: '18px',
            fontWeight: '700',
            color: '#1e293b'
          }}>
            District Analytics
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            lineHeight: '1.5',
            margin: '0'
          }}>
            Click on any district or use search to view detailed statistics and insights
          </p>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => fraColorFor(category);
  const fraEfficiency = Math.round(
    (district.factSheet.fraPotentialVillages / district.factSheet.totalVillages) * 100
  );

  return (
    <div style={{
      width: '28vw',
      maxHeight: '82vh',
      overflowY: 'auto',
      zIndex: 1000
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px 16px',
        borderBottom: '2px solid #f1f5f9'
      }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
            {district.name}
          </div>
          <div style={{
            fontSize: '12px',
            fontWeight: '600',
            color: 'white',
            backgroundColor: getCategoryColor(district.category),
            padding: '2px 8px',
            borderRadius: '12px',
            marginTop: '4px',
            display: 'inline-block'
          }}>
            {district.category}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            color: '#64748b',
            cursor: 'pointer',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        padding: '16px 24px'
      }}>
        <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f766e' }}>
            {district.factSheet.totalVillages.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
            Total Villages
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#15803d' }}>
            {fraEfficiency}%
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>

            FRA Potential
          </div>
        </div>
      </div>

      {/* Detailed Sections */}
      <div style={{ padding: '0 24px 24px' }}>
        {/* Administrative */}
        <div style={{
          marginBottom: '20px',
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '8px' }}>🏛️</span> Administrative
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Blocks:</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>
              {district.factSheet.blocks}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>GPs:</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>
              {district.factSheet.gPs}
            </span>
          </div>
        </div>

        {/* Villages */}
        <div style={{
          marginBottom: '20px',
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '8px' }}>🏘️</span> Village Statistics
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Inhabited:</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>
              {district.factSheet.inhabitedVillages.toLocaleString()}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Uninhabited:</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>
              {district.factSheet.uninhabitedVillages.toLocaleString()}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Forest Fringe:</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>
              {district.factSheet.forestFringeVillages.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Forest Coverage */}
        <div style={{
          marginBottom: '20px',
          padding: '16px',
          backgroundColor: '#f0fdf4',
          borderRadius: '12px',
          border: '1px solid #dcfce7'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '8px' }}>🌲</span> Forest Coverage
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Total Area:</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#15803d' }}>
              {district.factSheet.totalForestArea.toFixed(1)} km²
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>CFR:</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#15803d' }}>
              {district.factSheet.potentialCFRArea.toFixed(1)} km²
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>IFR:</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#15803d' }}>
              {district.factSheet.potentialIFRArea.toFixed(1)} km²
            </span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div style={{
          padding: '16px',
          backgroundColor: '#eff6ff',
          borderRadius: '12px',
          border: '1px solid #dbeafe'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e40af' }}>
              FRA Implementation
            </span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e40af' }}>
              {fraEfficiency}%
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#dbeafe',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${fraEfficiency}%`,
              height: '100%',
              backgroundColor: '#3b82f6',
              borderRadius: '4px'
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ODISHA_GEOJSON_URL = "/data/geojson/states/odisha.geojson";

const getDistrictCFRColor = (districtName: string) => {
  const found = odishaDistrictCenters.find(
    d => d.name.toLowerCase() === districtName.toLowerCase()
  );
  return found ? fraColorFor(found.category) : "#94a3b8";
};

const FRAAppLayout: React.FC = () => {
  const mapRef = useRef<LeafletMap | null>(null);
  const geoJsonLayerRef = useRef<LeafletGeoJSON | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("map").setView([20.95, 84.8], 7);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);
      mapRef.current = map;
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
      geoJsonLayerRef.current = null;
    }

    fetch(ODISHA_GEOJSON_URL)
      .then(res => res.json())
      .then((geojson) => {
        const layer = L.geoJSON(geojson, {
          style: (feature) => {
            const districtName = feature?.properties?.district || feature?.properties?.DISTRICT;
            const fillColor = getDistrictCFRColor(districtName);
            return {
              color: "#1e293b",
              weight: 2,
              fillColor,
              fillOpacity: 0.7,
            };
          },
          onEachFeature: (feature, layer) => {
            const districtName = feature?.properties?.district || feature?.properties?.DISTRICT;
            layer.bindTooltip(districtName, {
              sticky: true,
              className: 'custom-tooltip'
            });

            layer.on('click', () => {
              const dist = odishaDistrictCenters.find(
                d => d.name.toLowerCase() === districtName?.toLowerCase()
              );
              if (dist) setSelectedDistrict(dist);
            });

            layer.on('mouseover', function (e) {
              (e.target as L.Path).setStyle({
                weight: 4,
                color: "#0f172a",
                fillOpacity: 0.9,
              });
            });

            layer.on('mouseout', function (e) {
              (e.target as L.Path).setStyle({
                weight: 2,
                color: "#1e293b",
                fillColor: getDistrictCFRColor(districtName),
                fillOpacity: 0.7,
              });
            });
          }
        });

        layer.addTo(map);
        geoJsonLayerRef.current = layer;
        map.fitBounds(layer.getBounds());
      });
  }, []);

  const handleDistrictSelect = (district: any) => {
    setSelectedDistrict(district);
    if (district && mapRef.current) {
      mapRef.current.setView([district.lat, district.lng], 9);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'flex', height: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <LegendsPanel
          onDistrictSelect={handleDistrictSelect}
          selectedDistrict={selectedDistrict}
        />
        <div id="map" style={{ height: '82vh', width: '40vw' }} />
        <DistrictStatistics
          district={selectedDistrict}
          onClose={() => setSelectedDistrict(null)}
        />
      </div>
      <div className="mt-12" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <CroppingIntensityChart />
        <DistrictIrrigationAreaChart />
        <AnnualRainfallChart />
      </div>
    </div>
  );
};


export default FRAAppLayout;