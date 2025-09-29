'use client';

import StateMap from "@/components/tribal-repository/StateMap";
import { 
  AlertCircle, 
  ChevronDown, 
  Home, 
  RefreshCw, 
  Building2, 
  FileText, 
  Layers3, 
  University, 
  LayoutGrid 
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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

    if (url.includes('state=Odisha')) {
      return {
        summary: { tris: 2, documents: 394, documentTypes: 6, universitiesInstitutes: 2, sectors: 10 },
        yearWiseDocuments: [
          { year: '2000', count: 2 },
          { year: '2010', count: 12 },
          { year: '2020', count: 85 },
          { year: '2024', count: 16 }
        ],
        documentsByTRI: [
          { name: 'SCSTRTI', count: 340, fullName: 'Scheduled Castes & Scheduled Tribes Research and Training Institute' },
          { name: 'SCSTRTI Academy', count: 54, fullName: 'SCSTRTI & Academy of Tribal Languages and Culture' }
        ],
        universities: [
          { id: 'scstrti-bbsr', name: 'SCSTRTI, Bhubaneswar', documents: 340, state: 'Odisha', established: '1983' },
          { id: 'scstrti-academy', name: 'SCSTRTI & Academy', documents: 54, state: 'Odisha', established: '1990' }
        ],
        documentTypes: [
          { type: 'Book', count: 150, percentage: 38.1 },
          { type: 'Report', count: 90, percentage: 22.8 },
          { type: 'Journal', count: 70, percentage: 17.8 },
          { type: 'Hand Book', count: 44, percentage: 11.1 },
          { type: 'Dissertation', count: 25, percentage: 6.3 },
          { type: 'Photo', count: 15, percentage: 3.8 }
        ],
        sectors: [
          { sector: 'Monitoring & Evaluation', count: 90, percentage: 22, description: 'Program monitoring in Odisha' },
          { sector: 'Education', count: 80, percentage: 20, description: 'Education sector in Odisha' },
          { sector: 'Tribal Life', count: 50, percentage: 12.7, description: 'Cultural practices in Odisha' },
          { sector: 'Art & Culture', count: 40, percentage: 10.1, description: 'Arts & culture Odisha' },
          { sector: 'Ethnography', count: 35, percentage: 8.8, description: 'Anthropology studies Odisha' },
          { sector: 'Socio-economic', count: 30, percentage: 7.6, description: 'Socio-economic development' },
          { sector: 'Livelihood', count: 25, percentage: 6.3, description: 'Livelihood support' },
          { sector: 'Health', count: 20, percentage: 5.1, description: 'Healthcare' },
          { sector: 'Women Empowerment', count: 15, percentage: 3.8, description: 'Women empowerment initiatives' },
          { sector: 'Forest Rights', count: 9, percentage: 2.3, description: 'Forest rights in Odisha' },
        ],
        filterOptions: {
          states: ['All', 'Odisha', 'Tripura', 'Andhra Pradesh', 'Assam', 'Chhattisgarh', 'Kerala', 'Gujarat'],
          years: ['All', '2024', '2023', '2022', '2021', '2020', '2019', '2018']
        },
        lastUpdated: '2024-09-29T00:00:00Z',
        visitorCount: 7
      };
    }

    if (url.includes('state=Tripura')) {
      return {
        summary: { tris: 3, documents: 202, documentTypes: 5, universitiesInstitutes: 1, sectors: 7 },
        yearWiseDocuments: [
          { year: '2000', count: 1 },
          { year: '2010', count: 15 },
          { year: '2020', count: 100 },
          { year: '2024', count: 20 },
        ],
        documentsByTRI: [
          { name: 'Tribal Res. Tripura', count: 202, fullName: 'Tribal Research & Cultural Institute, Tripura' }
        ],
        universities: [
          { id: 'tribal-tripura', name: 'Tribal Research & Cultural Institute, Tripura', documents: 202, state: 'Tripura', established: '1988' }
        ],
        documentTypes: [
          { type: 'Book', count: 80, percentage: 39.6 },
          { type: 'Report', count: 60, percentage: 29.7 },
          { type: 'Journal', count: 30, percentage: 14.8 },
          { type: 'Dissertation', count: 20, percentage: 9.9 },
          { type: 'Photo', count: 12, percentage: 5.9 }
        ],
        sectors: [
          { sector: 'Tribal Life', count: 60, percentage: 29.7, description: 'Cultural practices in Tripura' },
          { sector: 'Education', count: 50, percentage: 24.8, description: 'Education in Tripura' },
          { sector: 'Health', count: 30, percentage: 14.8, description: 'Healthcare' },
          { sector: 'Monitoring & Evaluation', count: 20, percentage: 9.9, description: 'Monitoring and evaluation' },
          { sector: 'Women Empowerment', count: 15, percentage: 7.4, description: 'Women empowerment programs' },
          { sector: 'Livelihood', count: 17, percentage: 8.4, description: 'Livelihoods' },
          { sector: 'Art & Culture', count: 10, percentage: 4.9, description: 'Art and cultural heritage' },
        ],
        filterOptions: {
          states: ['All', 'Odisha', 'Tripura', 'Andhra Pradesh', 'Assam', 'Chhattisgarh', 'Kerala', 'Gujarat'],
          years: ['All', '2024', '2023', '2022', '2021', '2020', '2019', '2018']
        },
        lastUpdated: '2024-09-29T00:00:00Z',
        visitorCount: 5
      };
    }

    // Default mock data for other or 'All'
    return {
      summary: { tris: 16, documents: 1553, documentTypes: 8, universitiesInstitutes: 146, sectors: 23 },
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
        { id: 'tribal-raipur', name: 'Tribal Research & Training Institute, Raipur, Chhattisgarh', documents: 21, state: 'Chhattisgarh', established: '1998' },
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
      filterOptions: { states: ['All', 'Odisha', 'Tripura', 'Andhra Pradesh', 'Assam', 'Chhattisgarh', 'Kerala', 'Gujarat'], years: ['All', '2024', '2023', '2022', '2021', '2020', '2019', '2018'] },
      lastUpdated: '2024-04-01T00:00:00Z',
      visitorCount: 3
    };
  }
}

// Custom hook for dashboard data management
const useDashboardData = (state: string, year: string) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await TribalRepositoryAPI.fetchDashboardData({ state, year });
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [state, year]);

  return { data, loading, error, refetch: fetchData };
};

// Main component
export default function TribalRepositoryDashboard() {
  const [repositorySelectedState, setRepositorySelectedState] = useState('All');
  const [repositorySelectedYear, setRepositorySelectedYear] = useState('All');

  const { data, loading, error, refetch } = useDashboardData(repositorySelectedState, repositorySelectedYear);

  const mapRef = useRef<any>(null);
  const geoJsonLayerRef = useRef<any>(null);

  useEffect(() => {
    if (geoJsonLayerRef.current && mapRef.current && repositorySelectedState !== 'All') {
      geoJsonLayerRef.current.eachLayer((layer: any) => {
        if (layer.feature?.properties) {
          const stateName = layer.feature.properties.name;
          if (stateName === repositorySelectedState) {
            layer.setStyle({ fillColor: "#1d4ed8", fillOpacity: 0.35, color: "#1e40af", weight: 2 });
            const bounds = layer.getBounds();
            if (bounds.isValid()) mapRef.current.fitBounds(bounds, { maxZoom: 7 });
          } else {
            layer.setStyle({ fillColor: "#60a5fa", fillOpacity: 0.15, color: "#2563eb", weight: 1.2 });
          }
        }
      });
    }
    if (repositorySelectedState === 'All' && mapRef.current && geoJsonLayerRef.current) {
      const allBounds = geoJsonLayerRef.current.getBounds();
      if (allBounds.isValid()) mapRef.current.fitBounds(allBounds, { maxZoom: 5 });
    }
  }, [repositorySelectedState]);

  const StateMapWithRefs = (props: any) => <StateMap {...props} mapRef={mapRef} geoJsonLayerRef={geoJsonLayerRef} />;

  const filteredUniversities = useMemo(() => {
    if (!data) return [];
    if (repositorySelectedState === 'All') return data.universities;
    return data.universities.filter(uni => uni.state === repositorySelectedState);
  }, [data, repositorySelectedState]);

  const summaryItems = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'TRIs', value: data.summary.tris, Icon: Building2, color: 'border-green-500' },
      { label: 'Documents', value: data.summary.documents, Icon: FileText, color: 'border-indigo-500' },
      { label: 'Document Types', value: data.summary.documentTypes, Icon: Layers3, color: 'border-amber-500' },
      { label: 'Universities/Institutes', value: data.summary.universitiesInstitutes, Icon: University, color: 'border-rose-500' },
      { label: 'Sectors', value: data.summary.sectors, Icon: LayoutGrid, color: 'border-cyan-500' }
    ];
  }, [data]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={refetch} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      <header className="bg-white/70 backdrop-blur-sm shadow-sm border-b border-blue-200/50 sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Ministry_of_Tribal_Affairs.svg" alt="Logo" className="h-24 w-48 " />
  
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                Tribal Digital Repository
              </h1>
              {loading && <p className="text-xs text-blue-500 mt-1">Loading data...</p>}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">State</label>
                  <div className="relative">
                    <select value={repositorySelectedState} onChange={(e) => setRepositorySelectedState(e.target.value)} className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-800" disabled={loading}>
                      {data?.filterOptions.states.map(state => <option key={state} value={state}>{state}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Year</label>
                  <div className="relative">
                    <select value={repositorySelectedYear} onChange={(e) => setRepositorySelectedYear(e.target.value)} className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-800" disabled={loading}>
                      {data?.filterOptions.years.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600">Data as on</div>
                <div className="text-sm font-semibold text-gray-800">
                  {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleDateString('en-GB') : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12">
            <div className="grid grid-cols-5 gap-6">
              {summaryItems.map((item, index) => (
                <div key={index} className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-t-4 ${item.color}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{item.label}</p>
                      <p className="text-3xl font-bold text-gray-800">{loading ? '...' : item.value}</p>
                    </div>
                    <item.Icon className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-8 space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">Repositories by State</h3>
              <StateMapWithRefs selectedState={repositorySelectedState} onStateSelect={setRepositorySelectedState} />
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">Year-wise No. of Documents</h3>
              <div className="h-72">
                {loading ? <div className="h-full flex items-center justify-center"><RefreshCw className="h-8 w-8 animate-spin text-blue-500" /></div> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data?.yearWiseDocuments}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#4B5563' }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#4B5563' }} />
                      <Tooltip wrapperClassName="!bg-white/80 !backdrop-blur-sm !rounded-xl !shadow-lg !border-none" />
                      <Area type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">University/Institute</h3>
              <div className="overflow-x-auto max-h-96">
                {loading ? <div className="flex justify-center py-8"><RefreshCw className="h-6 w-6 animate-spin text-blue-500" /></div> : (
                  <table className="w-full text-sm">
                    <tbody>
                      {filteredUniversities.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 even:bg-blue-50/50 hover:bg-blue-100/70 transition-colors">
                          <td className="py-3 px-2 text-left">
                            <div className="font-medium text-gray-800">{item.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{item.state} • Est. {item.established}</div>
                          </td>
                          <td className="py-3 px-2 text-right font-semibold text-blue-600">{item.documents}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">Document Type</h3>
              <div className="space-y-4">
                {loading ? <div className="flex justify-center py-8"><RefreshCw className="h-6 w-6 animate-spin text-blue-500" /></div> : data?.documentTypes.map((item) => (
                  <div key={item.type} className="group">
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-gray-700">{item.type}</span>
                      <span className="font-semibold text-blue-600">{item.count}</span>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-2.5 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500" style={{ width: `${item.percentage || 0}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">No. of Documents by Sector</h3>
              <div className="space-y-3 max-h-[30rem] overflow-y-auto">
                {loading ? <div className="flex justify-center py-8"><RefreshCw className="h-6 w-6 animate-spin text-blue-500" /></div> : data?.sectors.map((item) => (
                  <div key={item.sector} className="flex justify-between items-center py-1 group" title={item.description}>
                    <span className="text-xs text-gray-700 flex-1 pr-2">{item.sector}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-blue-100 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.percentage || 0}%` }} />
                      </div>
                      <span className="text-xs font-semibold w-8 text-right text-blue-600">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white/70 backdrop-blur-sm border-t border-blue-200/50 mt-8">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4 items-center">
              <button onClick={refetch} className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50" disabled={loading}><Home className="h-5 w-5" /></button>
              <span className="text-sm text-gray-600">Ministry of Tribal Affairs - Digital Repository</span>
              {data?.lastUpdated && <span className="text-xs text-gray-400">Last updated: {new Date(data.lastUpdated).toLocaleString()}</span>}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Visitor Count</div>
              <div className="text-lg font-bold bg-gray-800 text-white px-3 py-1 rounded-md font-mono tracking-wider">
                {loading ? '......' : data?.visitorCount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
