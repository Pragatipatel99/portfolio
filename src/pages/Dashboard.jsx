import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const handleDownloadPortfolio = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/download/portfolio/${user.id}/json`);
      
      if (!response.ok) throw new Error('Failed to download portfolio');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${user.username}_portfolio.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download portfolio. Please make sure you have created a portfolio first.');
    }
  };

  const handleDownloadHTML = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/download/portfolio/${user.id}`);
      
      if (!response.ok) throw new Error('Failed to download portfolio');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${user.username}_portfolio.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download portfolio. Please make sure you have created a portfolio first.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 card text-center">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.username}!</h1>
      <p className="mb-8 text-gray-600">This is your dashboard. You can edit your portfolio, view your public profile, or download your portfolio data.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link 
          to="/profile" 
          className="flex flex-col items-center p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
        >
          <svg className="w-8 h-8 text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="font-semibold text-blue-900">Edit Portfolio</span>
          <span className="text-sm text-blue-700 mt-1">Update your information</span>
        </Link>
        
        <Link 
          to={`/user/${user?.id}`} 
          className="flex flex-col items-center p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
        >
          <svg className="w-8 h-8 text-green-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="font-semibold text-green-900">View Public Profile</span>
          <span className="text-sm text-green-700 mt-1">See how others see you</span>
        </Link>
        
        <button 
          onClick={handleDownloadPortfolio}
          className="flex flex-col items-center p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200"
        >
          <svg className="w-8 h-8 text-purple-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="font-semibold text-purple-900">Download JSON</span>
          <span className="text-sm text-purple-700 mt-1">Portfolio data</span>
        </button>
        
        <button 
          onClick={handleDownloadHTML}
          className="flex flex-col items-center p-6 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200"
        >
          <svg className="w-8 h-8 text-orange-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span className="font-semibold text-orange-900">Download HTML</span>
          <span className="text-sm text-orange-700 mt-1">Printable version</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard; 