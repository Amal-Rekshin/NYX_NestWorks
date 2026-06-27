import { useState, useEffect } from 'react';
import API from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Overview = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeLeads: 0,
    soldProperties: 0,
    ongoingConstruction: 0,
    recentLeads: [],
    categoryStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/dashboard');
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get max count for the bar chart
  const maxCategoryCount = Math.max(...stats.categoryStats.map(c => c.count), 1); // fallback to 1 to avoid division by zero

  const categoryColors = {
    'construction': 'bg-brand-blue',
    'plans': 'bg-purple-500',
    'sales': 'bg-green-500'
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-sm flex flex-col justify-center">
          <p className="text-gray-400 text-sm font-medium mb-1">Total Properties</p>
          <div className="text-4xl font-bold text-white">{stats.totalProperties}</div>
        </div>
        <div className="bg-dark-surface border border-brand-blue/30 rounded-xl p-6 shadow-[0_0_15px_rgba(0,85,255,0.1)] flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-brand-blue/5 group-hover:bg-brand-blue/10 transition-colors"></div>
          <p className="text-brand-blue text-sm font-medium mb-1 relative z-10">Active Leads</p>
          <div className="text-4xl font-bold text-white relative z-10">{stats.activeLeads}</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-sm flex flex-col justify-center">
          <p className="text-gray-400 text-sm font-medium mb-1">Houses Sold</p>
          <div className="text-4xl font-bold text-white">{stats.soldProperties}</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-sm flex flex-col justify-center">
          <p className="text-gray-400 text-sm font-medium mb-1">Ongoing Construction</p>
          <div className="text-4xl font-bold text-white">{stats.ongoingConstruction}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Custom Bar Chart (Properties by Category) */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 lg:col-span-1 shadow-sm">
          <h2 className="text-xl font-bold text-white mb-6">Properties by Category</h2>
          
          <div className="space-y-6">
            {stats.categoryStats.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No property data available.</p>
            ) : (
              stats.categoryStats.map((cat, idx) => {
                const percentage = Math.round((cat.count / maxCategoryCount) * 100);
                return (
                  <div key={idx} className="w-full">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-300 capitalize">{cat._id}</span>
                      <span className="text-sm font-bold text-white">{cat.count}</span>
                    </div>
                    <div className="w-full bg-dark-bg h-3 rounded-full overflow-hidden border border-dark-border">
                      <div 
                        className={`h-full rounded-full ${categoryColors[cat._id] || 'bg-brand-green'} transition-all duration-1000 ease-out`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 lg:col-span-2 shadow-sm">
          <h2 className="text-xl font-bold text-white mb-6">Recent Leads Activity</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-dark-bg/50 text-xs uppercase text-gray-500 border-b border-dark-border">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentLeads.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                      No recent leads found.
                    </td>
                  </tr>
                ) : (
                  stats.recentLeads.map((lead) => (
                    <tr key={lead._id} className="border-b border-dark-border hover:bg-dark-bg/30 transition-colors">
                      <td className="px-4 py-4 font-medium text-white">{lead.name}</td>
                      <td className="px-4 py-4 truncate max-w-[200px]">
                        {lead.propertyId ? lead.propertyId.title : 'General Inquiry'}
                      </td>
                      <td className="px-4 py-4">{new Date(lead.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize border 
                          ${lead.status === 'new' ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/30' : 
                            lead.status === 'contacted' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' : 
                            'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Overview;
