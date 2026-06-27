import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, User, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tight">
              <span className="text-brand-blue drop-shadow-[0_0_8px_rgba(0,85,255,0.5)]">Nyx</span>
              <span className="text-white"> </span>
              <span className="text-brand-green drop-shadow-[0_0_8px_rgba(255,183,0,0.5)]">NestWorks</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/construction" className="text-gray-300 hover:text-brand-blue transition-colors px-3 py-2 rounded-md font-medium">Construction</Link>
              <Link to="/plans" className="text-gray-300 hover:text-brand-blue transition-colors px-3 py-2 rounded-md font-medium">Plans & Designs</Link>
              <Link to="/sales" className="text-gray-300 hover:text-brand-green transition-colors px-3 py-2 rounded-md font-medium">Houses for Sale</Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center text-gray-300 hover:text-brand-blue transition-colors">
                    <LayoutDashboard size={18} className="mr-1" />
                    <span className="text-sm font-medium">Dashboard</span>
                  </Link>
                )}
                <div className="flex items-center text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center mr-2 text-sm font-bold text-brand-blue">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <button onClick={logout} className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="flex items-center text-gray-300 hover:text-white transition-colors">
                <User size={20} className="mr-2" />
                <span>Login</span>
              </Link>
            )}
            <button className="bg-brand-blue hover:bg-brand-blue-light text-white px-4 py-2 rounded-md font-medium shadow-[0_0_15px_rgba(0,85,255,0.3)] transition-all cursor-pointer">
              Contact Us
            </button>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-400 hover:text-white focus:outline-none cursor-pointer p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-dark-surface border-b border-dark-border absolute w-full left-0 z-40">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/construction" className="text-gray-300 hover:text-brand-blue block px-3 py-2 rounded-md font-medium">Construction</Link>
            <Link to="/plans" className="text-gray-300 hover:text-brand-blue block px-3 py-2 rounded-md font-medium">Plans & Designs</Link>
            <Link to="/sales" className="text-gray-300 hover:text-brand-green block px-3 py-2 rounded-md font-medium">Houses for Sale</Link>
          </div>
          <div className="pt-4 pb-3 border-t border-dark-border">
            {user ? (
              <div className="px-5 space-y-3">
                <div className="flex items-center px-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">{user.name}</div>
                    <div className="text-sm font-medium leading-none text-gray-400 mt-1">{user.email}</div>
                  </div>
                </div>
                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center text-gray-300 hover:text-brand-blue block px-3 py-2 rounded-md font-medium">
                    <LayoutDashboard size={18} className="mr-2 inline" /> Dashboard
                  </Link>
                )}
                <button onClick={logout} className="flex items-center w-full text-left text-red-400 hover:bg-red-400/10 block px-3 py-2 rounded-md font-medium cursor-pointer">
                  <LogOut size={18} className="mr-2 inline" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="px-5">
                <Link to="/auth" className="flex items-center text-gray-300 hover:text-white block px-3 py-2 rounded-md font-medium">
                  <User size={20} className="mr-2 inline" /> Login
                </Link>
              </div>
            )}
            <div className="mt-4 px-5 pb-2">
              <button className="w-full bg-brand-blue hover:bg-brand-blue-light text-white px-4 py-2 rounded-md font-medium shadow-[0_0_15px_rgba(0,85,255,0.3)] transition-all cursor-pointer">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
