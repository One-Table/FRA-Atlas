// React-style FRA Atlas & Decision Support System Application

// Application State (React useState equivalent)
const AppState = {
  currentSection: 'dashboard',
  selectedState: '',
  selectedDistrict: '',
  activeLayers: ['fra-boundaries', 'satellite-imagery'],
  fraData: [],
  loading: false,
  filters: {
    state: '',
    fraType: '',
    status: ''
  },
  searchTerm: ''
};

// Application Data (props equivalent)
const AppData = {
  states: [
    {id: "mp", name: "Madhya Pradesh", totalClaims: 1245, approvedPattas: 892, pendingClaims: 353, villages: 156},
    {id: "tr", name: "Tripura", totalClaims: 678, approvedPattas: 456, pendingClaims: 222, villages: 89},
    {id: "od", name: "Odisha", totalClaims: 1567, approvedPattas: 1123, pendingClaims: 444, villages: 203},
    {id: "tg", name: "Telangana", totalClaims: 934, approvedPattas: 678, pendingClaims: 256, villages: 134}
  ],
  fraData: [
    {id: "FRA001", village: "Bhopal District Village 1", state: "Madhya Pradesh", district: "Bhopal", claimType: "IFR", status: "Approved", area: "2.5 hectares", pattaHolder: "Ramesh Kumar", approvalDate: "2024-03-15", coordinates: [23.2599, 77.4126]},
    {id: "FRA002", village: "Agartala District Village 2", state: "Tripura", district: "West Tripura", claimType: "CFR", status: "Pending", area: "15.8 hectares", pattaHolder: "Community Group A", approvalDate: null, coordinates: [23.8315, 91.2868]},
    {id: "FRA003", village: "Bhubaneswar District Village 3", state: "Odisha", district: "Khordha", claimType: "CR", status: "Under Review", area: "8.2 hectares", pattaHolder: "Tribal Council", approvalDate: null, coordinates: [20.2961, 85.8245]},
    {id: "FRA004", village: "Hyderabad District Village 4", state: "Telangana", district: "Medchal", claimType: "IFR", status: "Approved", area: "3.7 hectares", pattaHolder: "Sita Devi", approvalDate: "2024-01-22", coordinates: [17.3850, 78.4867]}
  ],
  schemes: [
    {name: "PM-KISAN", eligibleHolders: 2847, totalBenefit: "Rs 6000/year", description: "Direct income support to farmers"},
    {name: "Jal Jeevan Mission", eligibleHolders: 1923, totalBenefit: "Piped water connection", description: "Household water connectivity"},
    {name: "MGNREGA", eligibleHolders: 3456, totalBenefit: "100 days employment", description: "Rural employment guarantee"},
    {name: "DAJGUA", eligibleHolders: 1567, totalBenefit: "Multiple benefits", description: "Integrated development schemes"}
  ],
  assetTypes: [
    {type: "Agricultural Land", area: "45,678 hectares", villages: 234, condition: "Good"},
    {type: "Forest Cover", area: "78,945 hectares", villages: 456, condition: "Dense"},
    {type: "Water Bodies", area: "12,345 hectares", villages: 178, condition: "Seasonal"},
    {type: "Infrastructure", coverage: "67%", villages: 289, condition: "Developing"}
  ],
  monthlyProgress: [
    {month: "Jan 2024", approved: 156, pending: 89, rejected: 23},
    {month: "Feb 2024", approved: 178, pending: 67, rejected: 34},
    {month: "Mar 2024", approved: 234, pending: 45, rejected: 12},
    {month: "Apr 2024", approved: 198, pending: 78, rejected: 28},
    {month: "May 2024", approved: 267, pending: 92, rejected: 15},
    {month: "Jun 2024", approved: 289, pending: 56, rejected: 31}
  ]
};

// Chart instances
let progressChart = null;
let assetChart = null;
let monthlyChart = null;

// Main Application Class
class FRAApp {
  constructor() {
    this.currentSection = 'dashboard';
    this.setupNavigation();
    this.renderSidebar();
    this.renderRightPanel();
    this.renderStatusBar();
    this.renderCurrentSection();
    this.setupEventListeners();
    this.startRealTimeUpdates();
  }

  setupNavigation() {
    const navContainer = document.getElementById('main-navigation');
    if (!navContainer) return;

    const navigationItems = [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'map', label: 'WebGIS Map', icon: '🗺️' },
      { id: 'data', label: 'FRA Data', icon: '📋' },
      { id: 'dss', label: 'Decision Support', icon: '🎯' },
      { id: 'assets', label: 'Asset Mapping', icon: '🛰️' },
      { id: 'reports', label: 'Reports', icon: '📄' }
    ];

    navContainer.innerHTML = navigationItems.map(item => `
      <div class="nav-item ${this.currentSection === item.id ? 'active' : ''}" 
           data-section="${item.id}">
        <span>${item.icon}</span>
        ${item.label}
      </div>
    `).join('');

    // Add navigation event listeners
    navContainer.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = item.getAttribute('data-section');
        this.navigateToSection(sectionId);
      });
    });
  }

  navigateToSection(sectionId) {
    this.currentSection = sectionId;
    AppState.currentSection = sectionId;
    
    // Update navigation active state
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-section') === sectionId) {
        item.classList.add('active');
      }
    });
    
    // Render the selected section
    this.renderCurrentSection();
  }

  renderCurrentSection() {
    switch(this.currentSection) {
      case 'dashboard':
        this.renderDashboard();
        break;
      case 'map':
        this.renderMapSection();
        break;
      case 'data':
        this.renderDataSection();
        break;
      case 'dss':
        this.renderDSSSection();
        break;
      case 'assets':
        this.renderAssetSection();
        break;
      case 'reports':
        this.renderReportsSection();
        break;
      default:
        this.renderDashboard();
    }
  }

  renderDashboard() {
    const container = document.getElementById('main-content');
    if (!container) return;

    const totalClaims = AppData.states.reduce((sum, state) => sum + state.totalClaims, 0);
    const approvedPattas = AppData.states.reduce((sum, state) => sum + state.approvedPattas, 0);
    const pendingClaims = AppData.states.reduce((sum, state) => sum + state.pendingClaims, 0);
    const totalVillages = AppData.states.reduce((sum, state) => sum + state.villages, 0);

    container.innerHTML = `
      <div class="content-section active">
        <div class="dashboard-header">
          <h1 class="dashboard-title">FRA Implementation Dashboard</h1>
          <p class="dashboard-subtitle">Comprehensive monitoring and analysis of Forest Rights Act implementation</p>
        </div>

        <!-- KPI Cards -->
        <div class="kpi-grid">
          <div class="kpi-card" data-kpi="claims">
            <div class="kpi-icon">📄</div>
            <div class="kpi-content">
              <h3>Total Claims</h3>
              <div class="kpi-value">${totalClaims.toLocaleString()}</div>
              <div class="kpi-change positive">+2.3%</div>
            </div>
          </div>
          <div class="kpi-card" data-kpi="approved">
            <div class="kpi-icon">✅</div>
            <div class="kpi-content">
              <h3>Approved Pattas</h3>
              <div class="kpi-value">${approvedPattas.toLocaleString()}</div>
              <div class="kpi-change positive">+5.1%</div>
            </div>
          </div>
          <div class="kpi-card" data-kpi="pending">
            <div class="kpi-icon">⏳</div>
            <div class="kpi-content">
              <h3>Pending Claims</h3>
              <div class="kpi-value">${pendingClaims.toLocaleString()}</div>
              <div class="kpi-change negative">-1.8%</div>
            </div>
          </div>
          <div class="kpi-card" data-kpi="villages">
            <div class="kpi-icon">🏘️</div>
            <div class="kpi-content">
              <h3>Villages Covered</h3>
              <div class="kpi-value">${totalVillages.toLocaleString()}</div>
              <div class="kpi-change positive">+3.2%</div>
            </div>
          </div>
        </div>

        <!-- Content Grid -->
        <div class="content-grid">
          <!-- WebGIS Map -->
          <div class="webgis-container">
            <div class="map-header">
              <h3>Interactive WebGIS Map</h3>
              <div class="map-controls">
                <button class="map-tool" data-tool="search">🔍 Search</button>
                <button class="map-tool" data-tool="measure">📐 Measure</button>
                <button class="map-tool" data-tool="draw">✏️ Draw</button>
                <button class="map-tool" data-tool="identify">ℹ️ Identify</button>
              </div>
            </div>
            <div class="leaflet-map">
              <div class="map-placeholder">
                <h4>WebGIS Interface</h4>
                <p>Interactive mapping with Leaflet integration</p>
                <div class="map-features">
                  <div class="feature-badge">🛰️ Satellite Imagery</div>
                  <div class="feature-badge">🏞️ FRA Boundaries</div>
                  <div class="feature-badge">🌲 Forest Cover</div>
                  <div class="feature-badge">💧 Water Bodies</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts Panel -->
          <div style="display: flex; flex-direction: column; gap: var(--space-24);">
            <div class="chart-container" style="position: relative; height: 250px;">
              <h4>State-wise Progress</h4>
              <canvas id="stateProgressChart"></canvas>
            </div>
            <div class="chart-container" style="position: relative; height: 250px;">
              <h4>Monthly Trends</h4>
              <canvas id="monthlyTrendsChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;

    // Initialize charts after DOM is ready
    setTimeout(() => {
      this.initializeCharts();
      this.attachDashboardEventListeners();
    }, 100);
  }

  renderMapSection() {
    const container = document.getElementById('main-content');
    if (!container) return;

    container.innerHTML = `
      <div class="content-section active">
        <div class="dashboard-header">
          <h1 class="dashboard-title">WebGIS Mapping Interface</h1>
          <p class="dashboard-subtitle">Interactive mapping with React Leaflet integration</p>
        </div>

        <div class="webgis-container" style="height: 70vh;">
          <div class="map-header">
            <h3>Interactive WebGIS Map</h3>
            <div class="map-controls">
              <button class="map-tool" data-tool="search">🔍 Search Location</button>
              <button class="map-tool" data-tool="measure">📐 Measure Tool</button>
              <button class="map-tool" data-tool="draw">✏️ Draw Polygon</button>
              <button class="map-tool" data-tool="identify">ℹ️ Feature Info</button>
              <button class="map-tool" data-tool="filter">🎯 Filter Data</button>
            </div>
          </div>
          <div class="leaflet-map" style="height: calc(100% - 60px);">
            <div class="map-placeholder">
              <h4>React Leaflet WebGIS Interface</h4>
              <p>Advanced mapping capabilities with state management</p>
              <div class="map-features">
                <div class="feature-badge">🛰️ Multi-layer Support</div>
                <div class="feature-badge">🎯 Feature Selection</div>
                <div class="feature-badge">📍 Popup Information</div>
                <div class="feature-badge">🔍 Advanced Search</div>
                <div class="feature-badge">📐 Measurement Tools</div>
                <div class="feature-badge">✏️ Drawing Tools</div>
              </div>
              <div style="margin-top: var(--space-24);">
                <button class="btn btn--primary" onclick="app.initializeLeafletMap()">Initialize Interactive Map</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add map tool event listeners
    this.attachMapEventListeners();
  }

  renderDataSection() {
    const container = document.getElementById('main-content');
    if (!container) return;

    const filteredData = this.getFilteredData();

    container.innerHTML = `
      <div class="content-section active">
        <div class="dashboard-header">
          <h1 class="dashboard-title">FRA Data Management</h1>
          <p class="dashboard-subtitle">Comprehensive database of Forest Rights Act claims and titles</p>
        </div>

        <div class="data-table-container">
          <div class="table-header">
            <h3>FRA Claims Database</h3>
            <div class="table-controls">
              <input type="text" class="search-input" placeholder="Search claims..." id="searchInput" value="${AppState.searchTerm}">
              <button class="btn btn--primary btn--sm" id="addClaimBtn">Add New Claim</button>
              <button class="btn btn--secondary btn--sm" id="bulkUploadBtn">Bulk Upload</button>
            </div>
          </div>
          
          <div style="overflow-x: auto;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Village</th>
                  <th>State</th>
                  <th>District</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Area</th>
                  <th>Patta Holder</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${filteredData.map(claim => `
                  <tr data-claim-id="${claim.id}">
                    <td><strong>${claim.id}</strong></td>
                    <td>${claim.village}</td>
                    <td>${claim.state}</td>
                    <td>${claim.district}</td>
                    <td><span class="status-badge ${claim.claimType.toLowerCase()}">${claim.claimType}</span></td>
                    <td><span class="status-badge ${claim.status.toLowerCase().replace(' ', '-')}">${claim.status}</span></td>
                    <td>${claim.area}</td>
                    <td>${claim.pattaHolder}</td>
                    <td>
                      <button class="btn btn--sm btn--outline" onclick="app.viewClaimDetails('${claim.id}')">View</button>
                      <button class="btn btn--sm btn--secondary" onclick="app.editClaim('${claim.id}')">Edit</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    this.attachDataEventListeners();
  }

  renderDSSSection() {
    const container = document.getElementById('main-content');
    if (!container) return;

    container.innerHTML = `
      <div class="content-section active">
        <div class="dss-header">
          <h1 class="dashboard-title">Decision Support System</h1>
          <p class="dashboard-subtitle">AI-powered recommendations for scheme convergence and policy interventions</p>
          <button class="btn btn--primary" id="generateRecommendationsBtn">Generate AI Recommendations</button>
        </div>

        <div class="scheme-matrix">
          ${AppData.schemes.map(scheme => `
            <div class="scheme-card">
              <h4>${scheme.name}</h4>
              <div class="scheme-stats">
                <div class="stat-item">
                  <span class="stat-value">${scheme.eligibleHolders.toLocaleString()}</span>
                  <span class="stat-label">Eligible Holders</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">${Math.round(scheme.eligibleHolders * 0.75).toLocaleString()}</span>
                  <span class="stat-label">Enrolled</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">${Math.round((scheme.eligibleHolders * 0.75 / scheme.eligibleHolders) * 100)}%</span>
                  <span class="stat-label">Coverage</span>
                </div>
              </div>
              <div class="recommendation-box">
                <strong>AI Recommendation:</strong> ${this.generateRecommendation(scheme.name)}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="chart-container" style="position: relative; height: 400px;">
          <h4>Scheme Eligibility Matrix</h4>
          <canvas id="eligibilityChart"></canvas>
        </div>
      </div>
    `;

    setTimeout(() => {
      this.initializeEligibilityChart();
      this.attachDSSEventListeners();
    }, 100);
  }

  renderAssetSection() {
    const container = document.getElementById('main-content');
    if (!container) return;

    container.innerHTML = `
      <div class="content-section active">
        <div class="dashboard-header">
          <h1 class="dashboard-title">AI-Powered Asset Mapping</h1>
          <p class="dashboard-subtitle">Automated identification and classification of land assets using satellite imagery</p>
          <div class="status status--success">AI Processing: Active • 94.2% Accuracy</div>
        </div>

        <div class="asset-grid">
          ${AppData.assetTypes.map((asset, index) => `
            <div class="asset-card">
              <div class="asset-icon">${this.getAssetIcon(asset.type)}</div>
              <h3>${asset.type}</h3>
              <div class="asset-value">${asset.area || asset.coverage}</div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${this.getProgressWidth(index)}%"></div>
              </div>
              <p style="font-size: var(--font-size-sm); margin: var(--space-8) 0 0 0;">
                ${asset.villages} villages • ${asset.condition} condition
              </p>
            </div>
          `).join('')}
        </div>

        <div class="webgis-container">
          <div class="map-header">
            <h3>Asset Distribution Map</h3>
            <div class="map-controls">
              <button class="map-tool" data-tool="agricultural">🌾 Agricultural</button>
              <button class="map-tool" data-tool="forest">🌲 Forest</button>
              <button class="map-tool" data-tool="water">💧 Water</button>
              <button class="map-tool" data-tool="infrastructure">🏗️ Infrastructure</button>
            </div>
          </div>
          <div class="leaflet-map">
            <div class="map-placeholder">
              <h4>AI Asset Classification Map</h4>
              <p>Real-time asset identification using machine learning</p>
              <div class="map-features">
                <div class="feature-badge">🤖 AI Classification</div>
                <div class="feature-badge">📊 Real-time Analysis</div>
                <div class="feature-badge">🎯 95% Accuracy</div>
                <div class="feature-badge">⚡ Auto Updates</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachAssetEventListeners();
  }

  renderReportsSection() {
    const container = document.getElementById('main-content');
    if (!container) return;

    const reportTemplates = [
      {
        icon: '📊',
        title: 'FRA Implementation Progress',
        description: 'State-wise comprehensive analysis of implementation status',
        type: 'progress'
      },
      {
        icon: '🗺️',
        title: 'Asset Mapping Summary',
        description: 'AI-generated asset distribution and classification report',
        type: 'assets'
      },
      {
        icon: '🎯',
        title: 'Scheme Convergence Analysis',
        description: 'DSS recommendations and scheme integration opportunities',
        type: 'convergence'
      },
      {
        icon: '📈',
        title: 'Performance Analytics',
        description: 'Detailed performance metrics and trend analysis',
        type: 'analytics'
      }
    ];

    container.innerHTML = `
      <div class="content-section active">
        <div class="dashboard-header">
          <h1 class="dashboard-title">Reports & Analytics</h1>
          <p class="dashboard-subtitle">Comprehensive reporting and data visualization for stakeholders</p>
          <div style="display: flex; gap: var(--space-12);">
            <button class="btn btn--primary" id="scheduleReportBtn">Schedule Report</button>
            <button class="btn btn--secondary" id="exportAllBtn">Export All Data</button>
          </div>
        </div>

        <div class="asset-grid">
          ${reportTemplates.map(template => `
            <div class="asset-card" style="cursor: pointer;" data-report-type="${template.type}">
              <div class="asset-icon">${template.icon}</div>
              <h3>${template.title}</h3>
              <p style="margin: var(--space-12) 0; font-size: var(--font-size-sm); color: var(--color-text-secondary);">
                ${template.description}
              </p>
              <button class="btn btn--primary btn--sm" onclick="app.generateReport('${template.type}')">
                Generate Report
              </button>
            </div>
          `).join('')}
        </div>

        <div class="data-table-container" style="margin-top: var(--space-32);">
          <div class="table-header">
            <h3>Recent Reports</h3>
            <button class="btn btn--outline btn--sm">View All</button>
          </div>
          <div style="overflow-x: auto;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Report Name</th>
                  <th>Type</th>
                  <th>Generated On</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monthly FRA Progress - July 2024</td>
                  <td>Progress Report</td>
                  <td>2024-07-31</td>
                  <td><span class="status-badge approved">Ready</span></td>
                  <td>
                    <button class="btn btn--sm btn--outline">Download</button>
                    <button class="btn btn--sm btn--secondary">View</button>
                  </td>
                </tr>
                <tr>
                  <td>Asset Mapping Analysis - Q2 2024</td>
                  <td>Asset Report</td>
                  <td>2024-06-30</td>
                  <td><span class="status-badge approved">Ready</span></td>
                  <td>
                    <button class="btn btn--sm btn--outline">Download</button>
                    <button class="btn btn--sm btn--secondary">View</button>
                  </td>
                </tr>
                <tr>
                  <td>Scheme Convergence Study</td>
                  <td>DSS Report</td>
                  <td>2024-06-15</td>
                  <td><span class="status-badge pending">Processing</span></td>
                  <td>
                    <button class="btn btn--sm btn--outline" disabled>Download</button>
                    <button class="btn btn--sm btn--secondary" disabled>View</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    this.attachReportsEventListeners();
  }

  renderSidebar() {
    const sidebar = document.getElementById('sidebar-component');
    if (!sidebar) return;

    sidebar.innerHTML = `
      <div class="sidebar-section">
        <h3>Filters & Controls</h3>
        <div class="filter-group">
          <label class="form-label">State</label>
          <select id="stateFilter" class="form-control">
            <option value="">All States</option>
            ${AppData.states.map(state => `
              <option value="${state.id}" ${AppState.filters.state === state.id ? 'selected' : ''}>
                ${state.name}
              </option>
            `).join('')}
          </select>
        </div>
        <div class="filter-group">
          <label class="form-label">FRA Type</label>
          <select id="fraTypeFilter" class="form-control">
            <option value="">All Types</option>
            <option value="ifr" ${AppState.filters.fraType === 'ifr' ? 'selected' : ''}>Individual Forest Rights (IFR)</option>
            <option value="cr" ${AppState.filters.fraType === 'cr' ? 'selected' : ''}>Community Rights (CR)</option>
            <option value="cfr" ${AppState.filters.fraType === 'cfr' ? 'selected' : ''}>Community Forest Resource Rights (CFR)</option>
          </select>
        </div>
        <div class="filter-group">
          <label class="form-label">Status</label>
          <select id="statusFilter" class="form-control">
            <option value="">All Status</option>
            <option value="approved" ${AppState.filters.status === 'approved' ? 'selected' : ''}>Approved</option>
            <option value="pending" ${AppState.filters.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="under-review" ${AppState.filters.status === 'under-review' ? 'selected' : ''}>Under Review</option>
            <option value="rejected" ${AppState.filters.status === 'rejected' ? 'selected' : ''}>Rejected</option>
          </select>
        </div>
      </div>

      <div class="sidebar-section">
        <h3>WebGIS Layers</h3>
        <div class="layer-controls">
          <label class="layer-item">
            <input type="checkbox" data-layer="fra-boundaries" checked> FRA Boundaries
          </label>
          <label class="layer-item">
            <input type="checkbox" data-layer="satellite-imagery" checked> Satellite Imagery
          </label>
          <label class="layer-item">
            <input type="checkbox" data-layer="forest-cover"> Forest Cover
          </label>
          <label class="layer-item">
            <input type="checkbox" data-layer="water-bodies"> Water Bodies
          </label>
          <label class="layer-item">
            <input type="checkbox" data-layer="agricultural-land"> Agricultural Land
          </label>
          <label class="layer-item">
            <input type="checkbox" data-layer="village-boundaries"> Village Boundaries
          </label>
        </div>
      </div>

      <div class="sidebar-section">
        <h3>Quick Actions</h3>
        <button class="btn btn--primary btn--full-width" id="uploadBtn">Upload FRA Documents</button>
        <button class="btn btn--secondary btn--full-width" id="generateReportBtn">Generate Report</button>
        <button class="btn btn--outline btn--full-width" id="exportBtn">Export Data</button>
      </div>
    `;

    this.attachSidebarEventListeners();
  }

  renderRightPanel() {
    const panel = document.getElementById('right-panel-component');
    if (!panel) return;

    const selectedStateData = AppState.filters.state 
      ? AppData.states.find(s => s.id === AppState.filters.state)
      : null;

    panel.innerHTML = `
      <div class="panel-section">
        <h3>State Overview</h3>
        ${selectedStateData ? `
          <div class="card">
            <div class="card__body">
              <h4>${selectedStateData.name}</h4>
              <div style="display: flex; flex-direction: column; gap: var(--space-8); margin-top: var(--space-12);">
                <div style="display: flex; justify-content: space-between;">
                  <span>Total Claims:</span>
                  <strong>${selectedStateData.totalClaims.toLocaleString()}</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>Approved:</span>
                  <strong style="color: var(--color-success);">${selectedStateData.approvedPattas.toLocaleString()}</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>Pending:</span>
                  <strong style="color: var(--color-warning);">${selectedStateData.pendingClaims.toLocaleString()}</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>Villages:</span>
                  <strong>${selectedStateData.villages.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          </div>
        ` : `
          <div class="card">
            <div class="card__body">
              <h4>All States Combined</h4>
              <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">
                Select a state from the filter to view detailed information
              </p>
            </div>
          </div>
        `}
      </div>

      <div class="panel-section">
        <h3>Recent Activities</h3>
        <div class="activity-feed">
          <div class="activity-item">
            <div class="activity-icon">✅</div>
            <div class="activity-content">
              <p>1,250 new FRA titles approved in Odisha</p>
              <span class="activity-time">2 hours ago</span>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon">🤖</div>
            <div class="activity-content">
              <p>AI processing completed for 500 documents</p>
              <span class="activity-time">4 hours ago</span>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon">📄</div>
            <div class="activity-content">
              <p>New batch upload: 2,100 FRA applications</p>
              <span class="activity-time">6 hours ago</span>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon">🎯</div>
            <div class="activity-content">
              <p>DSS recommendations generated for 15 districts</p>
              <span class="activity-time">8 hours ago</span>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-section">
        <h3>System Status</h3>
        <div class="card">
          <div class="card__body">
            <div style="display: flex; flex-direction: column; gap: var(--space-8);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>AI Processing:</span>
                <span class="status status--success">Active</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Queue:</span>
                <strong id="processingQueue">1,840 documents</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Active Users:</span>
                <strong id="activeUsers">47</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Last Update:</span>
                <span style="font-size: var(--font-size-xs);">31 Aug 2025, 3:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderStatusBar() {
    const statusBar = document.getElementById('status-bar-component');
    if (!statusBar) return;

    statusBar.innerHTML = `
      <div class="status-left">
        <span class="status-item">
          System Status: <span class="status-indicator online">Online</span>
        </span>
        <span class="status-item">Last Updated: 31 Aug 2025, 3:00 PM IST</span>
      </div>
      <div class="status-right">
        <span class="status-item">Processing Queue: <span id="queueCount">1,840</span> documents</span>
        <span class="status-item">Active Users: <span id="userCount">47</span></span>
      </div>
    `;
  }

  // Event listeners for each section
  attachSidebarEventListeners() {
    // Filter listeners
    document.getElementById('stateFilter')?.addEventListener('change', (e) => {
      AppState.filters.state = e.target.value;
      this.renderRightPanel();
      if (this.currentSection === 'data') {
        this.renderDataSection();
      }
    });

    document.getElementById('fraTypeFilter')?.addEventListener('change', (e) => {
      AppState.filters.fraType = e.target.value;
      if (this.currentSection === 'data') {
        this.renderDataSection();
      }
    });

    document.getElementById('statusFilter')?.addEventListener('change', (e) => {
      AppState.filters.status = e.target.value;
      if (this.currentSection === 'data') {
        this.renderDataSection();
      }
    });

    // Layer toggles
    document.querySelectorAll('[data-layer]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const layerId = e.target.getAttribute('data-layer');
        const layerName = layerId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        this.showNotification(`Map layer "${layerName}" ${e.target.checked ? 'enabled' : 'disabled'}`, 'info');
      });
    });

    // Action buttons
    document.getElementById('uploadBtn')?.addEventListener('click', () => {
      this.handleUploadDocuments();
    });

    document.getElementById('generateReportBtn')?.addEventListener('click', () => {
      this.handleGenerateReport();
    });

    document.getElementById('exportBtn')?.addEventListener('click', () => {
      this.handleExportData();
    });
  }

  attachDashboardEventListeners() {
    // Map tool buttons
    document.querySelectorAll('.map-tool').forEach(tool => {
      tool.addEventListener('click', (e) => {
        document.querySelectorAll('.map-tool').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        
        const toolType = e.target.getAttribute('data-tool');
        this.showNotification(`${toolType.charAt(0).toUpperCase() + toolType.slice(1)} tool activated`, 'info');
      });
    });

    // KPI card clicks - remove blue overlay issue
    document.querySelectorAll('.kpi-card').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const kpiType = card.getAttribute('data-kpi');
        this.showNotification(`Viewing detailed ${kpiType} analytics`, 'info');
      });
    });
  }

  attachMapEventListeners() {
    document.querySelectorAll('.map-tool').forEach(tool => {
      tool.addEventListener('click', (e) => {
        document.querySelectorAll('.map-tool').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        
        const toolType = e.target.getAttribute('data-tool');
        this.showNotification(`${toolType.charAt(0).toUpperCase() + toolType.slice(1)} tool activated`, 'info');
      });
    });
  }

  attachDataEventListeners() {
    // Search functionality
    document.getElementById('searchInput')?.addEventListener('input', (e) => {
      AppState.searchTerm = e.target.value;
      this.renderDataSection();
    });

    // Action buttons
    document.getElementById('addClaimBtn')?.addEventListener('click', () => {
      this.handleAddClaim();
    });

    document.getElementById('bulkUploadBtn')?.addEventListener('click', () => {
      this.showNotification('Bulk upload feature will be available in the next release', 'info');
    });
  }

  attachDSSEventListeners() {
    document.getElementById('generateRecommendationsBtn')?.addEventListener('click', () => {
      this.handleGenerateRecommendations();
    });
  }

  attachAssetEventListeners() {
    document.querySelectorAll('.map-tool').forEach(tool => {
      tool.addEventListener('click', (e) => {
        document.querySelectorAll('.map-tool').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        
        const assetType = e.target.getAttribute('data-tool');
        this.showNotification(`Filtering assets by: ${assetType}`, 'info');
      });
    });
  }

  attachReportsEventListeners() {
    document.getElementById('scheduleReportBtn')?.addEventListener('click', () => {
      this.showNotification('Report scheduling feature coming soon', 'info');
    });

    document.getElementById('exportAllBtn')?.addEventListener('click', () => {
      this.showNotification('Exporting all data... This may take a few minutes.', 'info');
    });
  }

  // Chart initialization methods
  initializeCharts() {
    this.initializeStateProgressChart();
    this.initializeMonthlyTrendsChart();
  }

  initializeStateProgressChart() {
    const ctx = document.getElementById('stateProgressChart');
    if (!ctx) return;

    if (progressChart) {
      progressChart.destroy();
    }

    progressChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: AppData.states.map(state => state.name),
        datasets: [{
          label: 'Approved Pattas',
          data: AppData.states.map(state => state.approvedPattas),
          backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  initializeMonthlyTrendsChart() {
    const ctx = document.getElementById('monthlyTrendsChart');
    if (!ctx) return;

    if (monthlyChart) {
      monthlyChart.destroy();
    }

    monthlyChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: AppData.monthlyProgress.map(item => item.month),
        datasets: [
          {
            label: 'Approved',
            data: AppData.monthlyProgress.map(item => item.approved),
            borderColor: '#1FB8CD',
            backgroundColor: 'rgba(31, 184, 205, 0.1)',
            fill: true
          },
          {
            label: 'Pending',
            data: AppData.monthlyProgress.map(item => item.pending),
            borderColor: '#FFC185',
            backgroundColor: 'rgba(255, 193, 133, 0.1)',
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  initializeEligibilityChart() {
    const ctx = document.getElementById('eligibilityChart');
    if (!ctx) return;

    if (assetChart) {
      assetChart.destroy();
    }

    assetChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: AppData.schemes.map(scheme => scheme.name),
        datasets: [{
          data: AppData.schemes.map(scheme => scheme.eligibleHolders),
          backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  // Helper methods
  getFilteredData() {
    let filtered = [...AppData.fraData];

    if (AppState.filters.state) {
      const stateName = AppData.states.find(s => s.id === AppState.filters.state)?.name;
      if (stateName) {
        filtered = filtered.filter(item => item.state === stateName);
      }
    }

    if (AppState.filters.status) {
      filtered = filtered.filter(item => 
        item.status.toLowerCase().replace(' ', '-') === AppState.filters.status
      );
    }

    if (AppState.searchTerm) {
      const term = AppState.searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.id.toLowerCase().includes(term) ||
        item.village.toLowerCase().includes(term) ||
        item.pattaHolder.toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  generateRecommendation(schemeName) {
    const recommendations = {
      'PM-KISAN': 'Target 712 unenrolled FRA holders in remote areas through mobile enrollment drives',
      'Jal Jeevan Mission': 'Prioritize 89 villages with low water access index for immediate intervention',
      'MGNREGA': 'Establish skill development centers in 23 high-density FRA areas',
      'DAJGUA': 'Integrate multiple benefits for 392 eligible households through convergence model'
    };
    return recommendations[schemeName] || 'Analyze coverage gaps and optimize resource allocation';
  }

  getAssetIcon(type) {
    const icons = {
      'Agricultural Land': '🌾',
      'Forest Cover': '🌲',
      'Water Bodies': '💧',
      'Infrastructure': '🏗️'
    };
    return icons[type] || '📍';
  }

  getProgressWidth(index) {
    const widths = [92, 85, 78, 67];
    return widths[index] || 80;
  }

  // Event handlers
  handleUploadDocuments() {
    this.showModal('Upload FRA Documents', `
      <div style="text-align: center; padding: var(--space-20);">
        <div style="border: 2px dashed var(--color-border); padding: var(--space-32); border-radius: var(--radius-base); margin-bottom: var(--space-20);">
          <div style="font-size: var(--font-size-3xl); margin-bottom: var(--space-16);">📁</div>
          <p>Drag & drop FRA documents here or click to browse</p>
          <button class="btn btn--primary">Browse Files</button>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-16); text-align: left;">
          <div>
            <h4>Supported Formats</h4>
            <ul style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">
              <li>PDF documents</li>
              <li>Image files (JPG, PNG)</li>
              <li>GeoTIFF files</li>
              <li>Shapefile archives</li>
            </ul>
          </div>
          <div>
            <h4>Processing Features</h4>
            <ul style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">
              <li>AI document analysis</li>
              <li>Automatic data extraction</li>
              <li>Validation and verification</li>
              <li>Batch processing</li>
            </ul>
          </div>
        </div>
      </div>
    `);
  }

  handleGenerateReport() {
    this.showLoadingOverlay();
    setTimeout(() => {
      this.hideLoadingOverlay();
      this.showNotification('Report generated successfully! Check the Reports section for download.', 'success');
    }, 2000);
  }

  handleExportData() {
    this.showModal('Export Data', `
      <div style="padding: var(--space-16);">
        <h4>Select Export Format</h4>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-16); margin: var(--space-20) 0;">
          <button class="btn btn--outline">📊 CSV Format</button>
          <button class="btn btn--outline">🗺️ GeoJSON</button>
          <button class="btn btn--outline">📄 PDF Report</button>
          <button class="btn btn--outline">📈 Excel Workbook</button>
        </div>
        <div style="margin-top: var(--space-20);">
          <label class="form-label">Date Range</label>
          <div style="display: flex; gap: var(--space-8);">
            <input type="date" class="form-control" style="flex: 1;">
            <input type="date" class="form-control" style="flex: 1;">
          </div>
        </div>
        <div style="margin-top: var(--space-16);">
          <button class="btn btn--primary btn--full-width">Start Export</button>
        </div>
      </div>
    `);
  }

  handleAddClaim() {
    this.showModal('Add New FRA Claim', `
      <form style="display: grid; gap: var(--space-16);">
        <div class="form-group">
          <label class="form-label">Claim ID</label>
          <input type="text" class="form-control" placeholder="FRA001">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-12);">
          <div class="form-group">
            <label class="form-label">State</label>
            <select class="form-control">
              <option>Select State</option>
              ${AppData.states.map(state => `<option value="${state.id}">${state.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">District</label>
            <input type="text" class="form-control" placeholder="District Name">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Village</label>
          <input type="text" class="form-control" placeholder="Village Name">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-12);">
          <div class="form-group">
            <label class="form-label">Claim Type</label>
            <select class="form-control">
              <option>IFR</option>
              <option>CFR</option>
              <option>CR</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Area (hectares)</label>
            <input type="number" class="form-control" placeholder="0.00">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Patta Holder Name</label>
          <input type="text" class="form-control" placeholder="Full Name">
        </div>
        <div style="display: flex; gap: var(--space-12); margin-top: var(--space-16);">
          <button type="button" class="btn btn--outline" onclick="app.closeModal()">Cancel</button>
          <button type="submit" class="btn btn--primary">Add Claim</button>
        </div>
      </form>
    `);
  }

  handleGenerateRecommendations() {
    this.showLoadingOverlay();
    setTimeout(() => {
      this.hideLoadingOverlay();
      this.renderDSSSection();
      this.showNotification('AI recommendations generated successfully!', 'success');
    }, 3000);
  }

  // Global methods accessible from onclick handlers
  viewClaimDetails(claimId) {
    const claim = AppData.fraData.find(c => c.id === claimId);
    if (claim) {
      this.showModal(`Claim Details - ${claimId}`, `
        <div style="display: grid; gap: var(--space-16);">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-16);">
            <div><strong>Claim ID:</strong> ${claim.id}</div>
            <div><strong>Status:</strong> <span class="status-badge ${claim.status.toLowerCase().replace(' ', '-')}">${claim.status}</span></div>
            <div><strong>Village:</strong> ${claim.village}</div>
            <div><strong>State:</strong> ${claim.state}</div>
            <div><strong>District:</strong> ${claim.district}</div>
            <div><strong>Type:</strong> ${claim.claimType}</div>
            <div><strong>Area:</strong> ${claim.area}</div>
            <div><strong>Patta Holder:</strong> ${claim.pattaHolder}</div>
          </div>
          ${claim.approvalDate ? `<div><strong>Approval Date:</strong> ${claim.approvalDate}</div>` : ''}
          <div style="margin-top: var(--space-20);">
            <button class="btn btn--primary" onclick="app.showLocationOnMap([${claim.coordinates.join(', ')}])">Show on Map</button>
            <button class="btn btn--secondary" onclick="app.editClaim('${claim.id}')">Edit Claim</button>
          </div>
        </div>
      `);
    }
  }

  editClaim(claimId) {
    this.showNotification(`Edit mode for claim ${claimId} activated`, 'info');
    this.closeModal();
  }

  generateReport(reportType) {
    this.showLoadingOverlay();
    setTimeout(() => {
      this.hideLoadingOverlay();
      this.showNotification(`${reportType} report generated successfully!`, 'success');
    }, 2000);
  }

  showLocationOnMap(coordinates) {
    this.showNotification(`Showing location at coordinates: ${coordinates.join(', ')}`, 'info');
    this.navigateToSection('map');
    this.closeModal();
  }

  initializeLeafletMap() {
    this.showNotification('Interactive Leaflet map would initialize here with React Leaflet components', 'info');
  }

  // Utility methods
  setupEventListeners() {
    // Language selector
    document.getElementById('language-selector')?.addEventListener('change', (e) => {
      this.showNotification(`Language changed to: ${e.target.value === 'en' ? 'English' : 'Hindi'}`, 'info');
    });

    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  startRealTimeUpdates() {
    setInterval(() => {
      const queueCount = document.getElementById('queueCount');
      const userCount = document.getElementById('userCount');
      const processingQueue = document.getElementById('processingQueue');
      const activeUsers = document.getElementById('activeUsers');
      
      if (queueCount) {
        const current = parseInt(queueCount.textContent);
        const change = Math.floor(Math.random() * 10) - 5;
        const newValue = Math.max(0, current + change);
        queueCount.textContent = newValue;
        if (processingQueue) processingQueue.textContent = `${newValue} documents`;
      }
      
      if (userCount) {
        const current = parseInt(userCount.textContent);
        const change = Math.floor(Math.random() * 6) - 3;
        const newValue = Math.max(1, current + change);
        userCount.textContent = newValue;
        if (activeUsers) activeUsers.textContent = newValue;
      }
    }, 30000);
  }

  showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">${icons[type]}</div>
        <div>${message}</div>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  showModal(title, content) {
    const container = document.getElementById('modal-container');
    if (!container) return;

    container.innerHTML = `
      <div class="modal active">
        <div class="modal-content">
          <div class="modal-header">
            <h3>${title}</h3>
            <button class="modal-close" onclick="app.closeModal()">×</button>
          </div>
          <div class="modal-body">
            ${content}
          </div>
        </div>
      </div>
    `;
  }

  closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        const container = document.getElementById('modal-container');
        if (container) container.innerHTML = '';
      }, 300);
    }
  }

  showLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.classList.remove('hidden');
    }
  }

  hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Create global app instance
  window.app = new FRAApp();
  
  console.log('🚀 FRA Atlas & DSS Application Initialized');
  console.log('📊 React-style components loaded');
  console.log('🗺️ WebGIS interface ready');
  console.log('🤖 AI-powered features active');
  console.log('📱 Responsive design enabled');
});