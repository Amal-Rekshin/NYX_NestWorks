import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Building2, LayoutTemplate, Home, Users, LogOut, MessageSquare, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const DashboardLayout = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullScreen={true} />;

  if (!user || user.role !== 'admin') {
    return <Navigate to="/auth" />;
  }

  const navItems = [
    { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Construction', path: '/admin/construction', icon: <Building2 size={20} /> },
    { name: 'Plans', path: '/admin/plans', icon: <LayoutTemplate size={20} /> },
    { name: 'Sales', path: '/admin/sales', icon: <Home size={20} /> },
    { name: 'Sold Properties', path: '/admin/sold', icon: <CheckCircle size={20} /> },
    { name: 'Leads Inbox', path: '/admin/leads', icon: <MessageSquare size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
  ];

  return (
    <div className="h-screen bg-dark-bg flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-dark-surface/80 backdrop-blur-xl border-r border-dark-border hidden md:flex flex-col relative overflow-hidden">
        {/* Decorative ambient light */}
        <div className="absolute top-0 left-0 w-full h-64 bg-brand-blue/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="h-24 flex items-center px-8 border-b border-dark-border/50 relative z-10">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            <span className="text-brand-blue drop-shadow-[0_0_12px_rgba(0,85,255,0.8)]">Nyx</span>
            <span className="text-white ml-1 font-light">Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto relative z-10">
          <div className="px-4 mb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Menu
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden
                  ${isActive 
                    ? 'bg-gradient-to-r from-brand-blue/20 to-transparent text-white font-medium shadow-[inset_2px_0_0_0_#0055ff]' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 w-1 h-full bg-brand-blue shadow-[0_0_10px_#0055ff]" />
                )}
                <span className={`mr-4 transition-transform duration-300 ${isActive ? 'text-brand-blue' : 'text-gray-500 group-hover:text-brand-blue/70 group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="tracking-wide text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-6 border-t border-dark-border/50 bg-gradient-to-t from-black/20 to-transparent relative z-10">
          <div className="flex items-center mb-6 bg-dark-bg/50 p-3 rounded-xl border border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-brand-blue-light flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(0,85,255,0.4)]">
              {user.name.charAt(0)}
            </div>
            <div className="ml-3 flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-white truncate tracking-wide">{user.name}</p>
              <p className="text-xs text-brand-blue-light truncate">Administrator</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="group flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-red-400/90 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 rounded-xl transition-all duration-300 border border-red-500/10 hover:border-red-500/30"
          >
            <LogOut size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Logout Account
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* subtle background glow */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none" />
        
        <header className="h-20 bg-dark-surface/90 backdrop-blur-md border-b border-dark-border flex items-center justify-between px-6 md:hidden sticky top-0 z-50">
          <Link to="/" className="text-xl font-bold">
            <span className="text-brand-blue drop-shadow-[0_0_8px_rgba(0,85,255,0.5)]">Nyx</span> Admin
          </Link>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-transparent relative z-10 custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
