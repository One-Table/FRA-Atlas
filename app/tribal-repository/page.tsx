'use client';

import StateMap from "@/components/tribal-repository/StateMap";
import { AlertCircle, ChevronDown, Home, RefreshCw } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// TypeScript interfaces for type safety
interface TribalSummaryData {
  tris: number;
  documents: number;
  documentTypes: number;
  universitiesInstitutes: number;
  sectors: number;
}

interface YearWiseDocument {
  year: string;
  count: number;
}

interface DocumentByTRI {
  name: string;
  count: number;
  fullName?: string;
}

interface UniversityData {
  id: string;
  name: string;
  documents: number;
  state?: string;
  established?: string;
}

interface DocumentType {
  type: string;
  count: number;
  percentage?: number;
}

interface SectorData {
  sector: string;
  count: number;
  percentage?: number;
  description?: string;
}

interface FilterOptions {
  states: string[];
  years: string[];
}

interface DashboardData {
  summary: TribalSummaryData;
  yearWiseDocuments: YearWiseDocument[];
  documentsByTRI: DocumentByTRI[];
  universities: UniversityData[];
  documentTypes: DocumentType[];
  sectors: SectorData[];
  filterOptions: FilterOptions;
  lastUpdated: string;
  visitorCount: number;
}

// API service for future database integration
class TribalRepositoryAPI {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api/tribal-repository';

  static async fetchDashboardData(filters?: {
    state?: string;
    year?: string;
    limit?: number;
  }): Promise<DashboardData> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.state && filters.state !== 'All') queryParams.set('state', filters.state);
      if (filters?.year && filters.year !== 'All') queryParams.set('year', filters.year);
      if (filters?.limit) queryParams.set('limit', filters.limit.toString());

      const url = `${this.baseUrl}?${queryParams.toString()}`;
      
      // For now, return mock data but structure it for future API calls
      const response = await this.mockApiCall(url);
      return response;
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      throw error;
    }
  }

  private static async mockApiCall(url: string): Promise<DashboardData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock data structured for database integration
    return {
      summary: {
        tris: 16,
        documents: 1553,
        documentTypes: 8,
        universitiesInstitutes: 146,
        sectors: 23
      },
      yearWiseDocuments: [
        { year: '1950', count: 1 },
        { year: '1960', count: 7 },
        { year: '1970', count: 10 },
        { year: '1980', count: 22 },
        { year: '1990', count: 30 },
        { year: '2000', count: 57 },
        { year: '2010', count: 64 },
        { year: '2020', count: 175 },
        { year: '2024', count: 18 }
      ],
      documentsByTRI: [
        { name: 'SCSTRTI', count: 507, fullName: 'Scheduled Castes & Scheduled Tribes Research and Training Institute' },
        { name: 'Tribal Res. Tripura', count: 221, fullName: 'Tribal Research & Cultural Institute, Tripura' },
        { name: 'Tribal Res. AP', count: 150, fullName: 'Department of Tribal Welfare Government of Andhra Pradesh' },
        { name: 'Assam Institute', count: 123, fullName: 'Assam Institute of Research for Tribals and Scheduled Castes' },
        { name: 'SCSTRTI Academy', count: 82, fullName: 'SCSTRTI & Academy of Tribal Languages and Culture' },
        { name: 'Tribal Res. CG', count: 11, fullName: 'Tribal Research & Training Institute, Chhattisgarh' },
        { name: 'KIRTADS', count: 9, fullName: 'Kerala Institute for Research, Training and Development Studies' },
        { name: 'Tribal Res. Gujarat', count: 7, fullName: 'Tribal Research And Training Institute, Gujarat' },
        { name: 'Tribal Res. Raipur', count: 5, fullName: 'Tribal Research & Training Institute, Raipur' },
        { name: 'Others', count: 1, fullName: 'Other Institutions' }
      ],
      universities: [
        { id: 'scstrti-bbsr', name: 'Scheduled Castes & Scheduled Tribes Research and Training Institute (SCSTRTI), Bhubaneswar', documents: 394, state: 'Odisha', established: '1983' },
        { id: 'tribal-tripura', name: 'Tribal Research & Cultural Institute, Tripura', documents: 202, state: 'Tripura', established: '1988' },
        { id: 'tribal-ap', name: 'Department of Tribal Welfare Government of Andhra Pradesh', documents: 112, state: 'Andhra Pradesh', established: '1975' },
        { id: 'assam-institute', name: 'Assam Institute of Research for Tribals and Scheduled Castes', documents: 108, state: 'Assam', established: '1992' },
        { id: 'scstrti-academy', name: 'SCSTRTI & Academy of Tribal Languages and Culture', documents: 46, state: 'Odisha', established: '1990' },
        { id: 'tribal-cg', name: 'Tribal Research & Training Institute, Chhattisgarh', documents: 36, state: 'Chhattisgarh', established: '2001' },
        { id: 'kirtads', name: 'KIRTADS', documents: 32, state: 'Kerala', established: '1994' },
        { id: 'tribal-gujarat', name: 'Tribal Research And Training Institute, Gujarat', documents: 30, state: 'Gujarat', established: '1987' },
        { id: 'tribal-raipur', name: 'Tribal Research & Training Institute, Raipur, Chhattisgarh', documents: 21, state: 'Chhattisgarh', established: '1998' }
      ],
      documentTypes: [
        { type: 'Book', count: 474, percentage: 30.5 },
        { type: 'Research Report', count: 432, percentage: 27.8 },
        { type: 'Report', count: 325, percentage: 20.9 },
        { type: 'Hand Book', count: 141, percentage: 9.1 },
        { type: 'Journal', count: 130, percentage: 8.4 },
        { type: 'Dissertation', count: 36, percentage: 2.3 },
        { type: 'Statistical Hand Book', count: 11, percentage: 0.7 },
        { type: 'Photo', count: 4, percentage: 0.3 }
      ],
      sectors: [
        { sector: 'Monitoring & Evaluation', count: 260, percentage: 16.7, description: 'Program monitoring and impact assessment' },
        { sector: 'Education', count: 238, percentage: 15.3, description: 'Educational initiatives and literacy programs' },
        { sector: 'Tribal Life', count: 188, percentage: 12.1, description: 'Cultural practices and lifestyle documentation' },
        { sector: 'Art & Culture', count: 166, percentage: 10.7, description: 'Traditional arts and cultural heritage' },
        { sector: 'Ethnography', count: 151, percentage: 9.7, description: 'Anthropological studies and documentation' },
        { sector: 'Socio-economic', count: 148, percentage: 9.5, description: 'Economic development and social welfare' },
        { sector: 'Livelihood', count: 77, percentage: 5.0, description: 'Income generation and employment' },
        { sector: 'Monograph', count: 58, percentage: 3.7, description: 'Detailed studies on specific topics' },
        { sector: 'Health', count: 49, percentage: 3.2, description: 'Healthcare and medical services' },
        { sector: 'Data Science', count: 33, percentage: 2.1, description: 'Statistical analysis and data management' },
        { sector: 'Forest Rights', count: 28, percentage: 1.8, description: 'Forest land rights and conservation' },
        { sector: 'Demography', count: 19, percentage: 1.2, description: 'Population studies and census data' },
        { sector: 'Traditional Knowledge', count: 19, percentage: 1.2, description: 'Indigenous knowledge systems' },
        { sector: 'Women Empowerment', count: 17, percentage: 1.1, description: 'Gender equality and women development' }
      ],
      filterOptions: {
        states: ['All', 'Odisha', 'Tripura', 'Andhra Pradesh', 'Assam', 'Chhattisgarh', 'Kerala', 'Gujarat'],
        years: ['All', '2024', '2023', '2022', '2021', '2020', '2019', '2018']
      },
      lastUpdated: '2024-04-01T00:00:00Z',
      visitorCount: 545315
    };
  }

  static async updateVisitorCount(): Promise<number> {
    // Future API endpoint for updating visitor count
    const response = await fetch(`${this.baseUrl}/visitor-count`, {
      method: 'POST',
    });
    const data = await response.json();
    return data.count;
  }
}

// Custom hook for dashboard data management
const useDashboardData = (state: string, year: string) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Only fetch if we haven't fetched recently or force refresh
      const now = new Date();
      const shouldFetch = !lastFetch || 
                         (now.getTime() - lastFetch.getTime()) > 5 * 60 * 1000 || // 5 minutes
                         forceRefresh;

      if (shouldFetch) {
        const dashboardData = await TribalRepositoryAPI.fetchDashboardData({ state, year });
        setData(dashboardData);
        setLastFetch(now);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [state, year]);

  return { data, loading, error, refetch: () => fetchData(true) };
};

// Main component
export default function TribalRepositoryDashboard() {
  const [repositorySelectedState, setRepositorySelectedState] = useState('All');
  const [repositorySelectedYear, setRepositorySelectedYear] = useState('All');

  const { data, loading, error, refetch } = useDashboardData(repositorySelectedState, repositorySelectedYear);

  // Add refs for map and geojson
  const mapRef = useRef<any>(null);
  const geoJsonLayerRef = useRef<any>(null);

  // Effect to zoom and color when state changes
  useEffect(() => {
    if (geoJsonLayerRef.current && mapRef.current && repositorySelectedState !== 'All') {
      geoJsonLayerRef.current.eachLayer((layer: any) => {
        if (layer.feature && layer.feature.properties) {
          const stateName = layer.feature.properties.name;
          if (stateName === repositorySelectedState) {
            layer.setStyle({ fillColor: "#1d4ed8", fillOpacity: 0.35, color: "#1e40af", weight: 2 });
            const bounds = layer.getBounds();
            if (bounds.isValid()) {
              mapRef.current.fitBounds(bounds, { maxZoom: 7 });
            }
          } else {
            layer.setStyle({ fillColor: "#60a5fa", fillOpacity: 0.15, color: "#2563eb", weight: 1.2 });
          }
        }
      });
    }
    // Optionally, reset zoom if "All" is selected
    if (repositorySelectedState === 'All' && mapRef.current && geoJsonLayerRef.current) {
      const allBounds = geoJsonLayerRef.current.getBounds();
      if (allBounds.isValid()) {
        mapRef.current.fitBounds(allBounds, { maxZoom: 5 });
      }
    }
  }, [repositorySelectedState]);

  // Pass refs to StateMap
  const StateMapWithRefs = (props: any) => (
    <StateMap
      {...props}
      mapRef={mapRef}
      geoJsonLayerRef={geoJsonLayerRef}
    />
  );

  // Calculate filtered data based on selections
  const filteredData = useMemo(() => {
    if (!data) return null;

    let filteredUniversities = data.universities;
    let filteredYearWise = data.yearWiseDocuments;

    // Filter by state
    if (repositorySelectedState !== 'All') {
      filteredUniversities = filteredUniversities.filter(
        uni => uni.state === repositorySelectedState
      );
    }

    // Filter by year
    if (repositorySelectedYear !== 'All') {
      filteredYearWise = filteredYearWise.filter(
        item => item.year === repositorySelectedYear
      );
    }

    return {
      ...data,
      universities: filteredUniversities,
      yearWiseDocuments: filteredYearWise
    };
  }, [data, repositorySelectedState, repositorySelectedYear]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Government Logo and Title */}
            <div className="flex items-center space-x-4">
              <img src="" alt="One table logo" className="h-12 w-12" />
              <div>
                <div className="text-sm text-gray-600">ONE TABLE</div>
                <div className="text-lg font-semibold text-gray-900">MINISTRY OF TRIBAL AFFAIRS</div>
              </div>
            </div>

            {/* Main Title */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-blue-700">Tribal Digital Repository</h1> {/* changed to blue */}
              {loading && <RefreshCw className="h-4 w-4 animate-spin text-blue-500 mx-auto mt-1" />}
            </div>

            {/* Filters and Date */}
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <div>
                  <label className="block text-sm text-black mb-1">State</label>
                  <div className="relative">
                    <select 
                      value={repositorySelectedState}
                      onChange={(e) => setRepositorySelectedState(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
                      disabled={loading}
                    >
                      {data?.filterOptions.states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-black mb-1">Year</label>
                  <div className="relative">
                    <select 
                      value={repositorySelectedYear}
                      onChange={(e) => setRepositorySelectedYear(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
                      disabled={loading}
                    >
                      {data?.filterOptions.years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Data as on</div>
                <div className="text-sm font-semibold">
                  {data?.lastUpdated 
                    ? new Date(data.lastUpdated).toLocaleDateString('en-GB')
                    : '01.04.2024'
                  }
                </div>
                <button 
                  onClick={refetch}
                  className="mt-1 p-1 hover:bg-gray-100 rounded transition-colors"
                  disabled={loading}
                >
                  <Home className={`h-5 w-5 text-gray-600 ${loading ? 'animate-pulse' : 'hover:text-blue-600'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Map and Charts */}
          <div className="col-span-8 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              {data && [
                { label: 'TRIs', value: data.summary.tris },
                { label: 'Documents', value: data.summary.documents },
                { label: 'Document Types', value: data.summary.documentTypes },
                { label: 'Universities/Institutes', value: data.summary.universitiesInstitutes },
                { label: 'Sectors', value: data.summary.sectors }
              ].map((item, index) => (
                <div key={index} className={`bg-white rounded-lg shadow-sm p-4 text-center transition-all ${loading ? 'animate-pulse' : 'hover:shadow-md'}`}>
                  <div className="text-2xl font-bold text-blue-600">
                    {loading ? '...' : item.value}
                  </div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">Repositories by State</h3>
              <StateMapWithRefs
                selectedState={repositorySelectedState}
                onStateSelect={state => setRepositorySelectedState(state)}
              />
              <div className="text-center text-gray-500 mt-2 text-xs">
                {repositorySelectedState !== 'All'
                  ? `Showing data for ${repositorySelectedState}`
                  : 'Click a state to filter repository data'}
              </div>
            </div>

            {/* Year-wise Documents Chart */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">Year-wise No. of Documents</h3>
              <div className="h-64">
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={
                        // Always show all years, even if count is 0
                        (data?.filterOptions.years || []).filter(y => y !== 'All').map(year => ({
                          year,
                          count:
                            filteredData?.yearWiseDocuments.find(item => item.year === year)?.count || 0
                        }))
                      }
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="year"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ fill: '#3B82F6' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Documents by TRI Chart */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">No. of Documents by TRI</h3> {/* blue */}
              <div className="h-64">
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.documentsByTRI || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Universities/Institutes Table */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-blue-700">University/Institute</h3> {/* blue */}
                {repositorySelectedState !== 'All' && (
                  <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    Filtered by {repositorySelectedState}
                  </span>
                )}
              </div>
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <tbody>
                      {filteredData?.universities.map((item, index) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 text-left pr-4">
                            <div>
                              <div>{item.name}</div>
                              {item.state && item.established && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {item.state} • Est. {item.established}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 text-right font-semibold text-blue-600">{item.documents}</td>
                        </tr>
                      ))}
                      <tr className="border-b-2 border-gray-300 font-semibold bg-gray-50">
                        <td className="py-3 text-left pr-4">Total</td>
                        <td className="py-3 text-right text-blue-600">
                          {filteredData?.universities.reduce((sum, uni) => sum + uni.documents, 0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Document Types and Sectors */}
          <div className="col-span-4 space-y-6">
            {/* Document Types */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">Document Type</h3> {/* blue */}
              <div className="space-y-3">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <>
                    {data?.documentTypes.map((item, index) => (
                      <div key={index} className="flex justify-between items-center group">
                        <span className="text-sm text-gray-700">{item.type}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full transition-all duration-500 group-hover:bg-blue-600"
                              style={{ width: `${item.percentage || 0}%` }}
                              title={`${item.percentage?.toFixed(1)}%`}
                            />
                          </div>
                          <span className="text-sm font-semibold w-10 text-right text-blue-600">{item.count}</span>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-3 flex justify-between items-center font-semibold bg-gray-50 -mx-4 px-4 py-2 rounded">
                      <span className="text-sm">Total</span>
                      <span className="text-sm text-blue-600">{data?.summary.documents}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sectors */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">No. of Documents by Sector</h3> {/* blue */}
              <div className="space-y-2">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <>
                    {data?.sectors.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-1 group" title={item.description}>
                        <span className="text-xs text-gray-700 flex-1 pr-2">{item.sector}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full transition-all duration-500 group-hover:bg-blue-600"
                              style={{ width: `${item.percentage || 0}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold w-8 text-right text-blue-600">{item.count}</span>
                        </div>
                      </div>
                    ))}
                    <div className="text-center mt-6 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>0</span>
                        <span>{Math.max(...(data?.sectors.map(s => s.count) || [0]))}</span>
                      </div>
                      <div className="text-xs text-gray-600">No. of Documents</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4 items-center">
              <button 
                onClick={refetch}
                className="text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                <Home className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-600">Ministry of Tribal Affairs - Digital Repository</span>
              {data?.lastUpdated && (
                <span className="text-xs text-gray-400">
                  Last updated: {new Date(data.lastUpdated).toLocaleString()}
                </span>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Visitor Count</div>
              <div className="text-lg font-bold bg-black text-white px-3 py-1 rounded font-mono">
                {loading ? '......' : data?.visitorCount.toLocaleString() || '0545315'}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}