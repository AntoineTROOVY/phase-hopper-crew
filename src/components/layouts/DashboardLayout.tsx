
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [searchParams] = useSearchParams();
  const slackId = searchParams.get('slack-id');
  const backLink = `/${slackId ? `?slack-id=${slackId}` : ''}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FB]">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={backLink} className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-900">Project Manager</span>
            </Link>
            
            {/* Middle Search Bar */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            {/* User Area */}
            <div className="hidden md:flex items-center space-x-4">
              <button type="button" className="text-gray-500 hover:text-gray-700">
                <Bell className="h-5 w-5" />
              </button>
              
              <div className="flex items-center space-x-2 border-l pl-4 ml-4 border-gray-200">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">Admin User</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
      
      {/* Footer (Optional) */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            Project Manager © {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
