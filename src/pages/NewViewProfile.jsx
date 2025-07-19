import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ModernTheme from '../components/themes/ModernTheme';
import ClassicTheme from '../components/themes/ClassicTheme';
import CreativeTheme from '../components/themes/CreativeTheme';

const ViewProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/profile/user/${userId}`);
        if (!response.ok) throw new Error('Profile not found');
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError('Profile not found');
      }
      setLoading(false);
    };
    fetchProfile();
  }, [userId]);

  const handleDownloadJSON = async () => {
    try {
      setDownloading(true);
      const response = await fetch(`http://localhost:5000/api/download/portfolio/${userId}/json`);
      
      if (!response.ok) throw new Error('Failed to download portfolio');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${profile.name.replace(/\s+/g, '_')}_portfolio.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download portfolio');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadHTML = async () => {
    try {
      setDownloading(true);
      const response = await fetch(`http://localhost:5000/api/download/portfolio/${userId}`);
      
      if (!response.ok) throw new Error('Failed to download portfolio');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${profile.name.replace(/\s+/g, '_')}_portfolio.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download portfolio');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  // Render based on theme
  const renderTheme = () => {
    const ThemeComponent = (() => {
      switch (profile.theme) {
        case 'classic':
          return ClassicTheme;
        case 'creative':
          return CreativeTheme;
        case 'modern':
        default:
          return ModernTheme;
      }
    })();

    return (
      <div className="relative">
        {/* Download/Print buttons */}
        <div className="fixed bottom-8 right-4 z-40 flex flex-col gap-3 print:hidden">
          {/* Mobile: Stack buttons vertically, Desktop: Side by side */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleDownloadJSON}
              disabled={downloading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-lg text-sm font-medium transition-all duration-200 min-w-[100px] backdrop-blur-sm"
            >
              {downloading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  JSON
                </>
              )}
            </button>
            <button
              onClick={handleDownloadHTML}
              disabled={downloading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 shadow-lg text-sm font-medium transition-all duration-200 min-w-[100px] backdrop-blur-sm"
            >
              {downloading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  HTML
                </>
              )}
            </button>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg text-sm font-medium transition-all duration-200 min-w-[100px] backdrop-blur-sm"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
        </div>
        
        <ThemeComponent profile={profile} />
      </div>
    );
  };

  return renderTheme();
};

export default ViewProfile;








