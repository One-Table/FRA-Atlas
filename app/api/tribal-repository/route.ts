import { NextRequest, NextResponse } from 'next/server';

// Mock database service - replace with actual database queries
class TribalRepositoryDatabase {
  static async getDashboardData(filters: {
    state?: string;
    year?: string;
    limit?: number;
  }) {
    // Simulate database query delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Mock data - replace with actual database queries
    const baseData = {
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
      lastUpdated: new Date().toISOString(),
      visitorCount: 545315
    };

    // Apply filters
    let filteredData = { ...baseData };

    if (filters.state && filters.state !== 'All') {
      filteredData.universities = filteredData.universities.filter(
        uni => uni.state === filters.state
      );
    }

    if (filters.year && filters.year !== 'All') {
      filteredData.yearWiseDocuments = filteredData.yearWiseDocuments.filter(
        item => item.year === filters.year
      );
    }

    if (filters.limit) {
      filteredData.universities = filteredData.universities.slice(0, filters.limit);
    }

    return filteredData;
  }

  static async updateVisitorCount() {
    // Simulate database update
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // In a real implementation, this would update the database
    // UPDATE visitor_count SET count = count + 1 WHERE page = 'tribal-repository'
    
    return { count: Math.floor(Math.random() * 1000000) + 545315 };
  }
}

// GET /api/tribal-repository
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get('state');
    const year = searchParams.get('year');
    const limit = searchParams.get('limit');

    const filters = {
      state: state || undefined,
      year: year || undefined,
      limit: limit ? parseInt(limit) : undefined,
    };

    const data = await TribalRepositoryDatabase.getDashboardData(filters);

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
      filters: filters
    });

  } catch (error) {
    console.error('Tribal Repository API Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard data',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// POST /api/tribal-repository (for future data updates)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle different POST operations
    switch (body.action) {
      case 'update-visitor-count':
        const result = await TribalRepositoryDatabase.updateVisitorCount();
        return NextResponse.json({
          success: true,
          data: result,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action',
            timestamp: new Date().toISOString()
          },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Tribal Repository API POST Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}