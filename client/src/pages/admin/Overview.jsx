const Overview = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-sm">
          <p className="text-gray-400 text-sm font-medium mb-1">Total Properties</p>
          <div className="text-3xl font-bold text-white">24</div>
        </div>
        <div className="bg-dark-surface border border-brand-blue/30 rounded-xl p-6 shadow-[0_0_15px_rgba(0,85,255,0.1)]">
          <p className="text-brand-blue text-sm font-medium mb-1">Active Leads</p>
          <div className="text-3xl font-bold text-white">12</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-sm">
          <p className="text-gray-400 text-sm font-medium mb-1">Houses Sold</p>
          <div className="text-3xl font-bold text-white">8</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-sm">
          <p className="text-gray-400 text-sm font-medium mb-1">Ongoing Construction</p>
          <div className="text-3xl font-bold text-white">5</div>
        </div>
      </div>
      
      {/* Activity Section placeholder */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6 h-96 flex flex-col items-center justify-center text-center">
        <p className="text-gray-400 mb-2">Charts and recent activity will go here.</p>
        <p className="text-sm text-gray-500">(Can implement Recharts later)</p>
      </div>
    </div>
  );
};

export default Overview;
