import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import BucketManagement from './pages/BucketManagement';
import ReorderDashboard from './pages/ReorderDashboard';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 overflow-auto flex flex-col relative min-w-0">
          {/* Mobile top bar with hamburger */}
          <header className="md:hidden h-14 flex items-center px-4 bg-white border-b border-gray-200 shadow-sm flex-shrink-0 z-10">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors mr-3"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <span className="text-base font-bold text-gray-900">Akshaya AI</span>
          </header>

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<BucketManagement />} />
              <Route path="/dashboard" element={<ReorderDashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
