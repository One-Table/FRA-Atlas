// components/fra-mpr/FRAMPRPage.tsx
// FRA Monthly Progress Report Dashboard

"use client";

import {
    FileText,
    MapPin,
    RefreshCw,
    Users
} from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useMemo, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import StateMap from './StateMap';
import {
    ALL_INDIA_TOTALS,
    FRA_MPR_DATA,
    getStateData,
    getTopStatesCommunity,
    getTopStatesIndividual
} from './data/fra-mpr-data';

const FRAMPRPage: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ifr' | 'cfr' | 'analysis'>('ifr');

  const handleStateSelect = useCallback((stateName: string | null) => {
    console.log('State selected:', stateName);
    setSelectedState(stateName);
  }, []);

  // Get current data
  const currentData = useMemo(() => {
    return selectedState ? getStateData(selectedState) : null;
  }, [selectedState]);

  const displayData = useMemo(() => {
    return currentData || {
      individualRights: ALL_INDIA_TOTALS.individualRights,
      communityRights: ALL_INDIA_TOTALS.communityRights
    };
  }, [currentData]);

  // Chart data
  const ifrChartData = useMemo(() => {
    if (selectedState) {
      const stateData = getStateData(selectedState);
      const allIndiaData = ALL_INDIA_TOTALS.individualRights;
      
      if (!stateData) return [];
      
      return [
        {
          category: 'Received',
          [selectedState]: stateData.individualRights.received,
          'All India': allIndiaData.received
        },
        {
          category: 'Accepted',
          [selectedState]: stateData.individualRights.accepted,
          'All India': allIndiaData.accepted
        },
        {
          category: 'Rejected',
          [selectedState]: stateData.individualRights.rejected,
          'All India': allIndiaData.rejected
        },
        {
          category: 'Pending',
          [selectedState]: stateData.individualRights.pending,
          'All India': allIndiaData.pending
        }
      ];
    }
    
    const topStates = getTopStatesIndividual(8);
    return topStates.map(state => ({
      state: state.state.length > 12 ? state.state.substring(0, 12) + '...' : state.state,
      fullState: state.state,
      received: state.individualRights.received,
      accepted: state.individualRights.accepted,
      rejected: state.individualRights.rejected,
      pending: state.individualRights.pending
    }));
  }, [selectedState]);

  const cfrChartData = useMemo(() => {
    if (selectedState) {
      const stateData = getStateData(selectedState);
      const allIndiaData = ALL_INDIA_TOTALS.communityRights;
      
      if (!stateData) return [];
      
      return [
        {
          category: 'Received',
          [selectedState]: stateData.communityRights.received,
          'All India': allIndiaData.received
        },
        {
          category: 'Accepted',
          [selectedState]: stateData.communityRights.accepted,
          'All India': allIndiaData.accepted
        },
        {
          category: 'Rejected',
          [selectedState]: stateData.communityRights.rejected,
          'All India': allIndiaData.rejected
        },
        {
          category: 'Pending',
          [selectedState]: stateData.communityRights.pending,
          'All India': allIndiaData.pending
        }
      ];
    }
    
    const topStates = getTopStatesCommunity(8);
    return topStates.map(state => ({
      state: state.state.length > 12 ? state.state.substring(0, 12) + '...' : state.state,
      fullState: state.state,
      received: state.communityRights.received,
      accepted: state.communityRights.accepted,
      rejected: state.communityRights.rejected,
      pending: state.communityRights.pending
    }));
  }, [selectedState]);

  // Pie chart data
  const ifrStatusData = useMemo(() => [
    { name: 'Accepted', value: displayData.individualRights.accepted, color: '#22c55e' },
    { name: 'Rejected', value: displayData.individualRights.rejected, color: '#ef4444' },
    { name: 'Pending', value: displayData.individualRights.pending, color: '#f59e0b' }
  ], [displayData]);

  const cfrStatusData = useMemo(() => [
    { name: 'Accepted', value: displayData.communityRights.accepted, color: '#22c55e' },
    { name: 'Rejected', value: displayData.communityRights.rejected, color: '#ef4444' },
    { name: 'Pending', value: displayData.communityRights.pending, color: '#f59e0b' }
  ], [displayData]);

  // Format numbers
  const formatNumber = (num: number): string => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatLargeNumber = (num: number): string => {
    return num.toLocaleString('en-IN');
  };

  const calculatePercentage = (value: number, total: number): string => {
    if (total === 0) return '0%';
    return `${((value / total) * 100).toFixed(1)}%`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${formatLargeNumber(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-orange-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Ministry_of_Tribal_Affairs.svg"
                alt="Ministry of Tribal Affairs"
                width={200}
                height={80}
                className="h-16 w-auto"
              />
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">FRA</h1>
              <p className="text-sm text-gray-600 mt-1">Monthly Progress Report</p>
              <p className="text-xs text-gray-500">Data as on: 31.07.2025</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select
                  value={selectedState || 'all'}
                  onChange={(e) => handleStateSelect(e.target.value === 'all' ? null : e.target.value)}
                  className="bg-white border border-gray-300 rounded px-3 py-2 min-w-32 outline-none text-sm"
                >
                  <option value="all">All States</option>
                  {FRA_MPR_DATA.map(state => (
                    <option key={state.state} value={state.state}>
                      {state.state}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={() => window.location.reload()}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Individual Forest Rights */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-800">
                Individual Forest Rights
                {selectedState && <span className="text-sm font-normal"> - {selectedState}</span>}
              </h3>
              <FileText className="text-blue-600" size={24} />
            </div>
            
            <div className="grid grid-cols-4 gap-3 text-sm">
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="font-semibold text-blue-800">
                  {formatLargeNumber(displayData.individualRights.received)}
                </div>
                <div className="text-blue-600 text-xs">Received</div>
              </div>
              <div className="bg-green-100 rounded-lg p-3 text-center">
                <div className="font-semibold text-green-800">
                  {formatLargeNumber(displayData.individualRights.accepted)}
                </div>
                <div className="text-green-600 text-xs">Accepted</div>
                <div className="text-green-500 text-xs">
                  {calculatePercentage(displayData.individualRights.accepted, displayData.individualRights.received)}
                </div>
              </div>
              <div className="bg-red-100 rounded-lg p-3 text-center">
                <div className="font-semibold text-red-800">
                  {formatLargeNumber(displayData.individualRights.rejected)}
                </div>
                <div className="text-red-600 text-xs">Rejected</div>
                <div className="text-red-500 text-xs">
                  {calculatePercentage(displayData.individualRights.rejected, displayData.individualRights.received)}
                </div>
              </div>
              <div className="bg-yellow-100 rounded-lg p-3 text-center">
                <div className="font-semibold text-yellow-800">
                  {formatLargeNumber(displayData.individualRights.pending)}
                </div>
                <div className="text-yellow-600 text-xs">Pending</div>
                <div className="text-yellow-500 text-xs">
                  {calculatePercentage(displayData.individualRights.pending, displayData.individualRights.received)}
                </div>
              </div>
            </div>
          </div>

          {/* Community Forest Rights */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-800">
                Community Forest Rights
                {selectedState && <span className="text-sm font-normal"> - {selectedState}</span>}
              </h3>
              <Users className="text-green-600" size={24} />
            </div>
            
            <div className="grid grid-cols-4 gap-3 text-sm">
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="font-semibold text-green-800">
                  {formatLargeNumber(displayData.communityRights.received)}
                </div>
                <div className="text-green-600 text-xs">Received</div>
              </div>
              <div className="bg-green-100 rounded-lg p-3 text-center">
                <div className="font-semibold text-green-800">
                  {formatLargeNumber(displayData.communityRights.accepted)}
                </div>
                <div className="text-green-600 text-xs">Accepted</div>
                <div className="text-green-500 text-xs">
                  {calculatePercentage(displayData.communityRights.accepted, displayData.communityRights.received)}
                </div>
              </div>
              <div className="bg-red-100 rounded-lg p-3 text-center">
                <div className="font-semibold text-red-800">
                  {formatLargeNumber(displayData.communityRights.rejected)}
                </div>
                <div className="text-red-600 text-xs">Rejected</div>
                <div className="text-red-500 text-xs">
                  {calculatePercentage(displayData.communityRights.rejected, displayData.communityRights.received)}
                </div>
              </div>
              <div className="bg-yellow-100 rounded-lg p-3 text-center">
                <div className="font-semibold text-yellow-800">
                  {formatLargeNumber(displayData.communityRights.pending)}
                </div>
                <div className="text-yellow-600 text-xs">Pending</div>
                <div className="text-yellow-500 text-xs">
                  {calculatePercentage(displayData.communityRights.pending, displayData.communityRights.received)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="text-blue-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">State-wise FRA Claims</h3>
              </div>
              
              <StateMap
                onStateSelect={handleStateSelect}
                selectedState={selectedState}
                height="400px"
                className="rounded-lg"
              />
              
              <div className="mt-4 text-center">
                {selectedState ? (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-900">{selectedState} Selected</div>
                    <button
                      onClick={() => handleStateSelect(null)}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      ← Back to All States
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Click on a state to view details</p>
                )}
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setActiveTab('ifr')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'ifr'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Individual Forest Rights
                </button>
                <button
                  onClick={() => setActiveTab('cfr')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'cfr'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Community Forest Rights
                </button>
                <button
                  onClick={() => setActiveTab('analysis')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'analysis'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Status Analysis
                </button>
              </div>

              <div className="h-96">
                {activeTab === 'ifr' && (
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-gray-900">
                      Individual Forest Rights Status
                      {selectedState && <span className="text-sm font-normal text-gray-600"> - {selectedState} vs All India</span>}
                    </h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ifrChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey={selectedState ? "category" : "state"}
                          angle={selectedState ? 0 : -45}
                          textAnchor={selectedState ? "middle" : "end"}
                          height={selectedState ? 60 : 100}
                          fontSize={12}
                        />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        {selectedState ? (
                          <>
                            <Bar dataKey={selectedState} fill="#3b82f6" name={selectedState} />
                            <Bar dataKey="All India" fill="#94a3b8" name="All India" />
                          </>
                        ) : (
                          <>
                            <Bar dataKey="received" fill="#64748b" name="Received" />
                            <Bar dataKey="accepted" fill="#22c55e" name="Accepted" />
                            <Bar dataKey="rejected" fill="#ef4444" name="Rejected" />
                            <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                          </>
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {activeTab === 'cfr' && (
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-gray-900">
                      Community Forest Rights Status
                      {selectedState && <span className="text-sm font-normal text-gray-600"> - {selectedState} vs All India</span>}
                    </h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={cfrChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey={selectedState ? "category" : "state"}
                          angle={selectedState ? 0 : -45}
                          textAnchor={selectedState ? "middle" : "end"}
                          height={selectedState ? 60 : 100}
                          fontSize={12}
                        />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        {selectedState ? (
                          <>
                            <Bar dataKey={selectedState} fill="#059669" name={selectedState} />
                            <Bar dataKey="All India" fill="#94a3b8" name="All India" />
                          </>
                        ) : (
                          <>
                            <Bar dataKey="received" fill="#64748b" name="Received" />
                            <Bar dataKey="accepted" fill="#22c55e" name="Accepted" />
                            <Bar dataKey="rejected" fill="#ef4444" name="Rejected" />
                            <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                          </>
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {activeTab === 'analysis' && (
                  <div className="grid grid-cols-2 gap-6 h-full">
                    <div>
                      <h5 className="text-md font-semibold mb-2 text-gray-900">
                        Individual Forest Rights
                        {selectedState && <span className="text-sm font-normal"> - {selectedState}</span>}
                      </h5>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={ifrStatusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {ifrStatusData.map((entry, index) => (
                              <Cell key={`ifr-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatLargeNumber(Number(value))} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div>
                      <h5 className="text-md font-semibold mb-2 text-gray-900">
                        Community Forest Rights
                        {selectedState && <span className="text-sm font-normal"> - {selectedState}</span>}
                      </h5>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={cfrStatusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {cfrStatusData.map((entry, index) => (
                              <Cell key={`cfr-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatLargeNumber(Number(value))} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold mb-4 text-gray-900">
                Performance Statistics
                {selectedState && <span className="text-sm font-normal text-gray-600"> - {selectedState}</span>}
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {calculatePercentage(displayData.individualRights.accepted, displayData.individualRights.received)}
                  </div>
                  <div className="text-sm text-green-800">IFR Acceptance Rate</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {calculatePercentage(displayData.communityRights.accepted, displayData.communityRights.received)}
                  </div>
                  <div className="text-sm text-green-800">CFR Acceptance Rate</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {calculatePercentage(displayData.individualRights.rejected, displayData.individualRights.received)}
                  </div>
                  <div className="text-sm text-red-800">IFR Rejection Rate</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {calculatePercentage(
                      displayData.individualRights.pending + displayData.communityRights.pending,
                      displayData.individualRights.received + displayData.communityRights.received
                    )}
                  </div>
                  <div className="text-sm text-yellow-800">Overall Pending</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FRAMPRPage;