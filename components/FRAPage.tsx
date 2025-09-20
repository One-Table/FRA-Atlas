import React, { useState } from 'react';

const Header: React.FC = () => (
  <header className="header" id="header-component">
    <div className="header-left">
      <div className="logo">
        <div className="logo-emblem" aria-label="Government Emblem">🏛️</div>
        <div className="logo-text">
          <h1>FRA Atlas & DSS</h1>
          <p>Ministry of Tribal Affairs, Government of India</p>
        </div>
      </div>
    </div>
    <nav className="header-nav" id="main-navigation">
      {/* Navigation items will be rendered here */}
    </nav>
    <div className="header-right">
      <div className="language-selector">
        <select className="form-control" id="language-selector" defaultValue="en">
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
        </select>
      </div>
      <div className="notification-icon" aria-label="Notifications">🔔</div>
      <div className="user-profile">
        <div className="user-avatar" aria-label="User Avatar">👤</div>
        <div className="user-info">
          <span className="user-name">Dr. Rajesh Kumar</span>
          <span className="user-role">MoTA Official</span>
        </div>
      </div>
    </div>
  </header>
);

const Sidebar: React.FC = () => (
  <aside className="sidebar" id="sidebar-component">
    {/* Sidebar content will be rendered here */}
  </aside>
);

const MainContent: React.FC = () => (
  <main className="main-content" id="main-content">
    {/* Content sections will be rendered here */}
  </main>
);

const RightPanel: React.FC = () => (
  <aside className="right-panel" id="right-panel-component">
    {/* Right panel content will be rendered here */}
  </aside>
);

const StatusBar: React.FC = () => (
  <footer className="status-bar" id="status-bar-component">
    {/* Status bar content will be rendered here */}
  </footer>
);

const ModalContainer: React.FC = () => (
  <div id="modal-container"></div>
);

const NotificationContainer: React.FC = () => (
  <div id="notification-container"></div>
);

const LoadingOverlay: React.FC<{ loading?: boolean }> = ({ loading = false }) => (
  <div className={`loading-overlay${loading ? '' : ' hidden'}`} id="loading-overlay">
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  </div>
);

const AppRoot: React.FC = () => {
  const [loading] = useState(false);

  return (
    <div id="app-root">
      <Header />
      <div className="main-layout">
        <Sidebar />
        <MainContent />
        <RightPanel />
      </div>
      <StatusBar />
      <ModalContainer />
      <NotificationContainer />
      <LoadingOverlay loading={loading} />
    </div>
  );
};

export default AppRoot;
