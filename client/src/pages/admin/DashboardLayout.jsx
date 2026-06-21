import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Building2, LayoutTemplate, Home, Users, LogOut, MessageSquare } from 'lucide-react';

const DashboardLayout = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">Loading...</div>;

  if (!user || user.role !== 'admin') {
    return <Navigate to="/auth" />;
  }

  const navItems = [
    { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Construction', path: '/admin/construction', icon: <Building2 size={20} /> },
    { name: 'Plans', path: '/admin/plans', icon: <LayoutTemplate size={20} /> },
    { name: 'Sales', path: '/admin/sales', icon: <Home size={20} /> },
    { name: 'Leads Inbox', path: '/admin/leads', icon: <MessageSquare size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-dark-bg flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-surface border-r border-dark-border hidden md:flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-dark-border">
          <Link to="/" className="text-xl font-bold">
            <span className="text-brand-blue drop-shadow-[0_0_8px_rgba(0,85,255,0.5)]">Nyx</span>
            <span className="text-white"> Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-brand-blue/10 text-brand-blue font-medium' 
                    : 'text-gray-400 hover:bg-dark-border hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-dark-border">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="ml-3 truncate">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">Admin</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-dark-surface border-b border-dark-border flex items-center justify-between px-6 md:hidden">
          <Link to="/" className="text-xl font-bold">
            <span className="text-brand-blue">Nyx</span> Admin
          </Link>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-dark-bg">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
