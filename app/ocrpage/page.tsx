'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamic imports with SSR disabled to fix the window error
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Navigation Bar Component
const NavigationBar: React.FC = () => {
  return (
    <nav style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e0e0e0',
      padding: '0 20px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {/* Left - Brand */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        fontSize: '18px',
        fontWeight: 700,
        color: '#2c3e50'
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#27ae60" style={{ marginRight: '8px' }}>
          <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z"/>
        </svg>
        ONE TABLE FRA
      </div>

      {/* Center - Page Title */}
      <div style={{
        fontSize: '20px',
        fontWeight: 600,
        color: '#2c3e50',
        display: 'flex',
        alignItems: 'center'
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#27ae60" style={{ marginRight: '8px' }}>
          <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2Z"/>
        </svg>
        FRA CLAIM OCR
      </div>

      {/* Right - Home Button */}
      <Link href="/" style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        backgroundColor: '#27ae60',
        color: 'white',
        borderRadius: '6px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: 500,
        transition: 'background-color 0.2s'
      }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#219a52'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#27ae60'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white" style={{ marginRight: '6px' }}>
          <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
        </svg>
        Home
      </Link>
    </nav>
  );
};

// OCR Processing Hook
const useOCRProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  
  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    
    // Simulate OCR processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock extracted data based on FRA claim format
    const mockExtractedData = {
      claimantName: "Ravi Kumar Majhi",
      spouseName: "Sita Devi Majhi",
      fatherName: "Bhola Majhi",
      address: "Village Balipada, Post Khajuripada",
      village: "Balipada",
      gramPanchayat: "Khajuripada",
      tehsil: "Baliguda",
      district: "Kandhamal",
      scheduledTribe: "Yes",
      familyMembers: [
        { name: "Sita Devi Majhi", age: 42, relation: "Spouse" },
        { name: "Prakash Majhi", age: 18, relation: "Son" },
        { name: "Kumari Majhi", age: 15, relation: "Daughter" }
      ],
      landClaims: {
        habitationLand: "2.5 acres",
        cultivationLand: "3.0 acres",
        totalArea: "5.5 acres"
      },
      coordinates: {
        lat: 20.2792,
        lng: 84.0953,
        accuracy: 0.85
      },
      boundaries: {
        north: "Village Road",
        south: "Nala (Stream)",
        east: "Community Forest",
        west: "Agricultural Field of Dola Majhi"
      },
      khasraNumber: "Plot No. 45/2, 46/1",
      compartmentNo: "Compartment 23-A",
      evidenceSupport: [
        "Revenue records from 1980",
        "Witness statements from village elders",
        "Satellite imagery analysis"
      ]
    };
    
    setExtractedData(mockExtractedData);
    setIsProcessing(false);
    
    return mockExtractedData;
  }, []);
  
  return { processFile, isProcessing, extractedData };
};

// File Upload Component
const FileUploadZone: React.FC<{
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
}> = ({ onFileUpload, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].size <= 20 * 1024 * 1024) {
      onFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0 && files[0].size <= 20 * 1024 * 1024) {
      onFileUpload(files[0]);
    }
  };

  return (
    <div
      className={`upload-zone ${isDragOver ? 'drag-over' : ''} ${isProcessing ? 'processing' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      style={{
        border: `2px dashed ${isDragOver ? '#27ae60' : '#d0d0d0'}`,
        borderRadius: '12px',
        padding: '40px 20px',
        textAlign: 'center',
        cursor: isProcessing ? 'not-allowed' : 'pointer',
        backgroundColor: isDragOver ? '#f0f8f0' : '#ffffff',
        transition: 'all 0.3s ease',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.tiff,.bmp"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        disabled={isProcessing}
      />
      
      {isProcessing ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <div className="spinner" style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #27ae60',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ margin: 0, color: '#2c3e50', fontSize: '16px', fontWeight: 600 }}>
            Processing document with OCR...
          </p>
          <p style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>
            Extracting FRA claim data
          </p>
        </div>
      ) : (
        <>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '15px' }}>
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="#27ae60"/>
          </svg>
          <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '18px', fontWeight: 600 }}>
            Upload FRA Claim Document
          </h3>
          <p style={{ margin: '0 0 15px 0', color: '#5a6c7d', fontSize: '14px', lineHeight: 1.5 }}>
            Drag & drop your FRA patta/claim documents here or click to browse
          </p>
          <p style={{ margin: 0, color: '#7f8c8d', fontSize: '12px' }}>
            Supports PDF, JPG, PNG, TIFF formats • Max size: 20MB
          </p>
          <div style={{
            marginTop: '15px',
            padding: '8px 16px',
            backgroundColor: '#e8f5e8',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#27ae60',
            fontWeight: 500
          }}>
            🔍 OCR will extract: Names, Addresses, Land Details, Coordinates
          </div>
        </>
      )}
    </div>
  );
};

// Extracted Data Display Component
const ExtractedDataDisplay: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return null;

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '24px',
      marginTop: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#27ae60" style={{ marginRight: '8px' }}>
          <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
        </svg>
        <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '18px', fontWeight: 600 }}>
          Extracted FRA Claim Data
        </h3>
        <div style={{
          marginLeft: 'auto',
          padding: '4px 12px',
          backgroundColor: '#e8f5e8',
          borderRadius: '12px',
          fontSize: '12px',
          color: '#27ae60',
          fontWeight: 500
        }}>
          Confidence: {Math.round(data.coordinates.accuracy * 100)}%
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {/* Personal Information */}
        <div style={{
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Personal Information
          </h4>
          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ color: '#2c3e50', fontSize: '14px' }}>
              <strong style={{ color: '#34495e' }}>Claimant:</strong> {data.claimantName}
            </div>
            <div style={{ color: '#2c3e50', fontSize: '14px' }}>
              <strong style={{ color: '#34495e' }}>Spouse:</strong> {data.spouseName}
            </div>
            <div style={{ color: '#2c3e50', fontSize: '14px' }}>
              <strong style={{ color: '#34495e' }}>Father:</strong> {data.fatherName}
            </div>
            <div style={{ color: '#2c3e50', fontSize: '14px' }}>
              <strong style={{ color: '#34495e' }}>Scheduled Tribe:</strong> 
              <span style={{ 
                color: data.scheduledTribe === 'Yes' ? '#27ae60' : '#e74c3c',
                fontWeight: 600,
                marginLeft: '8px'
              }}>
                {data.scheduledTribe}
              </span>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div style={{
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Location Details
          </h4>
          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ color: '#2c3e50', fontSize: '14px' }}>
              <strong style={{ color: '#34495e' }}>Village:</strong> {data.village}
            </div>
            <div style={{ color: '#2c3e50', fontSize: '14px' }}>
              <strong style={{ color: '#34495e' }}>Gram Panchayat:</strong> {data.gramPanchayat}
            </div>
            <div style={{ color: '#2c3e50', fontSize: '14px' }}>
              <strong style={{ color: '#34495e' }}>Tehsil:</strong> {data.tehsil}
            </div>
            <div style={{ color: '#2c3e50', fontSize: '14px' }}>
              <strong style={{ color: '#34495e' }}>District:</strong> {data.district}
            </div>
            <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#e8f4fd', borderRadius: '4px', fontSize: '12px', color: '#2c3e50' }}>
              📍 <strong style={{ color: '#34495e' }}>Coordinates:</strong> {data.coordinates.lat.toFixed(4)}°N, {data.coordinates.lng.toFixed(4)}°E
            </div>
          </div>
        </div>

        {/* Land Claims */}
        <div style={{
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Land Claims
          </h4>
          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ color: '#2c3e50', fontSize: '14px' }}>
              <strong style={{ color: '#34495e' }}>Habitation:</strong> {data.landClaims.habitationLand}
            </div>
            <div style={{ color: '#2c3e50', fontSize: '14px' }}>
              <strong style={{ color: '#34495e' }}>Cultivation:</strong> {data.landClaims.cultivationLand}
            </div>
            <div style={{ color: '#2c3e50', fontSize: '14px' }}>
              <strong style={{ color: '#34495e' }}>Total Area:</strong> 
              <span style={{ 
                color: '#27ae60',
                fontWeight: 600,
                marginLeft: '8px'
              }}>
                {data.landClaims.totalArea}
              </span>
            </div>
            <div style={{ marginTop: '8px', color: '#2c3e50', fontSize: '14px' }}>
              <strong style={{ color: '#34495e' }}>Khasra No:</strong> {data.khasraNumber}
            </div>
            <div style={{ color: '#2c3e50', fontSize: '14px' }}>
              <strong style={{ color: '#34495e' }}>Compartment:</strong> {data.compartmentNo}
            </div>
          </div>
        </div>

        {/* Family Members */}
        <div style={{
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Family Members
          </h4>
          <div style={{ display: 'grid', gap: '6px' }}>
            {data.familyMembers.map((member: any, index: number) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 8px',
                backgroundColor: '#ffffff',
                borderRadius: '4px',
                fontSize: '13px',
                border: '1px solid #e9ecef'
              }}>
                <span style={{ color: '#2c3e50' }}>
                  <strong style={{ color: '#34495e' }}>{member.name}</strong> ({member.relation})
                </span>
                <span style={{ color: '#7f8c8d' }}>Age {member.age}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Boundaries */}
        <div style={{
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Boundaries
          </h4>
          <div style={{ display: 'grid', gap: '6px', fontSize: '13px' }}>
            <div style={{ color: '#2c3e50' }}>
              <strong style={{ color: '#34495e' }}>North:</strong> {data.boundaries.north}
            </div>
            <div style={{ color: '#2c3e50' }}>
              <strong style={{ color: '#34495e' }}>South:</strong> {data.boundaries.south}
            </div>
            <div style={{ color: '#2c3e50' }}>
              <strong style={{ color: '#34495e' }}>East:</strong> {data.boundaries.east}
            </div>
            <div style={{ color: '#2c3e50' }}>
              <strong style={{ color: '#34495e' }}>West:</strong> {data.boundaries.west}
            </div>
          </div>
        </div>

        {/* Evidence Support */}
        <div style={{
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Evidence Support
          </h4>
          <ul style={{ margin: 0, paddingLeft: '16px' }}>
            {data.evidenceSupport.map((evidence: string, index: number) => (
              <li key={index} style={{ marginBottom: '4px', fontSize: '13px', color: '#2c3e50' }}>
                {evidence}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Map Component with extracted coordinates
const LocationMap: React.FC<{ coordinates?: { lat: number; lng: number } }> = ({ coordinates }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!coordinates || !isClient) return null;

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#27ae60" style={{ marginRight: '8px' }}>
          <path d="M12,2C8.13,2 5,5.13 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9C19,5.13 15.87,2 12,2M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5Z"/>
        </svg>
        <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '16px', fontWeight: 600 }}>
          Claim Location - FRA Atlas
        </h3>
        <div style={{
          marginLeft: 'auto',
          padding: '4px 8px',
          backgroundColor: '#fff3cd',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#856404',
          border: '1px solid #ffeaa7'
        }}>
          Kandhamal District
        </div>
      </div>

      <div style={{ 
        height: '400px', 
        borderRadius: '8px', 
        overflow: 'hidden',
        border: '1px solid #e0e0e0'
      }}>
        <MapContainer
          center={[coordinates.lat, coordinates.lng]}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[coordinates.lat, coordinates.lng]}>
            <Popup>
              <div style={{ textAlign: 'center', padding: '8px' }}>
                <strong>FRA Claim Location</strong><br />
                Village: Balipada<br />
                <small>{coordinates.lat.toFixed(6)}°N, {coordinates.lng.toFixed(6)}°E</small>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <div style={{
        marginTop: '12px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        fontSize: '12px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '8px 12px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '6px' 
        }}>
          <span style={{ color: '#27ae60', marginRight: '8px' }}>🏘️</span>
          <span style={{ color: '#2c3e50' }}>
            <strong style={{ color: '#34495e' }}>Forest Village:</strong> Balipada
          </span>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '8px 12px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '6px' 
        }}>
          <span style={{ color: '#f39c12', marginRight: '8px' }}>🌲</span>
          <span style={{ color: '#2c3e50' }}>
            <strong style={{ color: '#34495e' }}>Forest Type:</strong> Mixed Deciduous
          </span>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '8px 12px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '6px' 
        }}>
          <span style={{ color: '#e74c3c', marginRight: '8px' }}>📊</span>
          <span style={{ color: '#2c3e50' }}>
            <strong style={{ color: '#34495e' }}>FRA Status:</strong> High Potential
          </span>
        </div>
      </div>
    </div>
  );
};

// Main OCR Page Component
const FRAOCRPage: React.FC = () => {
  const { processFile, isProcessing, extractedData } = useOCRProcessor();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    await processFile(file);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Navigation Bar */}
      <NavigationBar />

      {/* Main Content */}
      <div style={{ padding: '20px' }}>
        {/* Header */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          marginBottom: '30px'
        }}>
          <div style={{ 
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#27ae60" style={{ marginRight: '12px' }}>
                <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M6,20H15L18,20V8.83L14.17,5H15L6,5V20Z"/>
              </svg>
              <h1 style={{ 
                margin: 0, 
                color: '#2c3e50', 
                fontSize: '28px', 
                fontWeight: 700,
                letterSpacing: '-0.5px'
              }}>
                FRA Document OCR & Atlas
              </h1>
            </div>
            <p style={{ 
              margin: 0, 
              color: '#5a6c7d', 
              fontSize: '16px', 
              lineHeight: 1.5,
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              Upload your Forest Rights Act (FRA) claim documents for automated data extraction and geospatial mapping. 
              Our OCR system extracts key information and displays it on an interactive atlas.
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: uploadedFile ? '1fr 1fr' : '1fr',
            gap: '30px',
            alignItems: 'start'
          }}>
            {/* Upload Section */}
            <div>
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{ 
                    margin: '0 0 8px 0', 
                    color: '#2c3e50', 
                    fontSize: '20px', 
                    fontWeight: 600 
                  }}>
                    Document Upload
                  </h2>
                  <p style={{ 
                    margin: 0, 
                    color: '#5a6c7d', 
                    fontSize: '14px' 
                  }}>
                    Upload FRA claim forms, patta documents, or related certificates
                  </p>
                </div>

                <FileUploadZone 
                  onFileUpload={handleFileUpload}
                  isProcessing={isProcessing}
                />

                {uploadedFile && (
                  <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: '#e8f5e8',
                    borderRadius: '8px',
                    border: '1px solid #c8e6c9'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <strong style={{ color: '#2e7d32' }}>📄 {uploadedFile.name}</strong>
                        <div style={{ fontSize: '12px', color: '#388e3c' }}>
                          {(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB
                        </div>
                      </div>
                      <div style={{
                        padding: '4px 8px',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 500
                      }}>
                        ✓ Processed
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Atlas Preview */}
            {uploadedFile && (
              <div>
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #e0e0e0',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <h2 style={{ 
                    margin: '0 0 16px 0', 
                    color: '#2c3e50', 
                    fontSize: '20px', 
                    fontWeight: 600 
                  }}>
                    Digital FRA Atlas Preview
                  </h2>
                  <div style={{
                    width: '100%',
                    height: '300px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 500,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      left: '20px',
                      right: '20px',
                      bottom: '20px',
                      border: '2px dashed rgba(255,255,255,0.3)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column'
                    }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="white" style={{ marginBottom: '16px' }}>
                        <path d="M12,2C8.13,2 5,5.13 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9C19,5.13 15.87,2 12,2M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5Z"/>
                      </svg>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                          Kandhamal District Atlas
                        </div>
                        <div style={{ fontSize: '14px', opacity: 0.9 }}>
                          Community Forest Resources Map
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '8px' }}>
                          Based on reference map style provided
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    marginTop: '16px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px',
                    fontSize: '12px'
                  }}>
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#e3f2fd',
                      borderRadius: '6px',
                      color: '#1976d2'
                    }}>
                      🗺️ <strong>Interactive Maps</strong>
                    </div>
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#fff3e0',
                      borderRadius: '6px',
                      color: '#f57c00'
                    }}>
                      📊 <strong>Data Visualization</strong>
                    </div>
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#e8f5e8',
                      borderRadius: '6px',
                      color: '#388e3c'
                    }}>
                      📍 <strong>GPS Coordinates</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          {extractedData && (
            <>
              <ExtractedDataDisplay data={extractedData} />
              <LocationMap coordinates={extractedData.coordinates} />
            </>
          )}
        </div>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .upload-zone:hover {
          border-color: #27ae60 !important;
          background-color: #f0f8f0 !important;
        }
        
        .processing {
          pointer-events: none;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

export default FRAOCRPage;