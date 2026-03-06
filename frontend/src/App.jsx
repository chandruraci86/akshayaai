import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import BucketManagement from './pages/BucketManagement';
import ReorderDashboard from './pages/ReorderDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
        <Sidebar />
        <div className="flex-1 overflow-auto flex flex-col relative">
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
