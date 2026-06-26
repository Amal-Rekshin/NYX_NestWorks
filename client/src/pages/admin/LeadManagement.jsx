import { useState, useEffect, useMemo } from 'react';
import { Mail, Phone, Calendar, CheckCircle2, Search, Filter, MessageSquare, ArrowRight, Home, Building2, LayoutTemplate } from 'lucide-react';
import API from '../../api';
import toast from 'react-hot-toast';

const LeadManagement = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data } = await API.get('/leads');
      setLeads(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      // Optimistic UI update
      setLeads(prevLeads => prevLeads.map(lead => lead._id === id ? { ...lead, status } : lead));
      
      await API.put(`/leads/${id}/status`, { status });
      toast.success(`Lead marked as ${status}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update lead status');
      fetchLeads(); // Revert on failure
    }
  };

  // Filter and search logic
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesFilter = activeFilter === 'all' || lead.status === activeFilter;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower) ||
        (lead.phone && lead.phone.includes(searchLower));
        
      return matchesFilter && matchesSearch;
    });
  }, [leads, activeFilter, searchQuery]);

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    closed: leads.filter(l => l.status === 'closed').length
  };

  if (loading) return (
    <div className="flex h-full items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-dark-border border-t-brand-blue animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2 flex items-center">
            <MessageSquare className="mr-3 text-brand-blue" size={32} />
            Leads Inbox
          </h1>
          <p className="text-gray-400 text-lg">Manage and track your customer inquiries efficiently.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative group w-full lg:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-500 group-focus-within:text-brand-blue transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Filter Tabs & Stats */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-dark-surface/50 border border-dark-border p-2 rounded-2xl">
        <div className="flex flex-wrap gap-2 p-1 bg-dark-bg rounded-xl">
          {[
            { id: 'all', label: 'All Leads', count: stats.total },
            { id: 'new', label: 'New', count: stats.new, color: 'text-brand-blue' },
            { id: 'contacted', label: 'Contacted', count: stats.contacted, color: 'text-brand-gold' },
            { id: 'closed', label: 'Closed', count: stats.closed, color: 'text-green-500' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex items-center px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeFilter === tab.id 
                  ? 'bg-dark-surface text-white shadow-sm border border-white/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-md text-xs bg-dark-bg border border-dark-border ${tab.color || 'text-gray-300'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        
        <div className="px-4 text-sm text-gray-400 flex items-center">
          <Filter size={16} className="mr-2" />
          Showing {filteredLeads.length} result{filteredLeads.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.length === 0 ? (
          <div className="bg-dark-surface/50 border border-dark-border border-dashed rounded-2xl p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-dark-bg rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={32} className="text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No leads found</h3>
            <p className="text-gray-500 max-w-sm">
              {searchQuery ? `We couldn't find any leads matching "${searchQuery}".` : "You don't have any leads in this category yet."}
            </p>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div 
              key={lead._id} 
              className={`group relative bg-dark-surface border rounded-2xl p-6 transition-all duration-300 overflow-hidden
                ${lead.status === 'new' ? 'border-brand-blue/30 shadow-[0_0_15px_rgba(0,85,255,0.05)]' : 'border-dark-border hover:border-white/20'}`}
            >
              {/* Status Indicator Glow for new leads */}
              {lead.status === 'new' && (
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-blue shadow-[0_0_15px_#0055ff]" />
              )}
              
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                
                {/* Left Side: Contact Info & Message */}
                <div className="flex-1 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center text-xl font-bold text-white shadow-inner">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center">
                          {lead.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-0.5 gap-3">
                          <span className="flex items-center"><Mail size={12} className="mr-1 text-gray-400" /> {lead.email}</span>
                          <span className="text-gray-700">•</span>
                          <span className="flex items-center"><Phone size={12} className="mr-1 text-gray-400" /> {lead.phone || 'No phone'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <span className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider
                      ${lead.status === 'new' ? 'border-brand-blue/40 text-brand-blue bg-brand-blue/10 shadow-[0_0_10px_rgba(0,85,255,0.2)]' : 
                        lead.status === 'contacted' ? 'border-brand-gold/40 text-brand-gold bg-brand-gold/10' : 
                        'border-green-500/40 text-green-500 bg-green-500/10'}`}
                    >
                      {lead.status === 'new' && <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mr-2 animate-pulse" />}
                      {lead.status}
                    </span>
                  </div>
                  
                  <div className="bg-dark-bg/80 p-4 rounded-xl border border-dark-border/50 text-gray-300 text-sm leading-relaxed relative">
                    <div className="absolute top-4 left-0 w-0.5 h-[calc(100%-32px)] bg-gray-700 rounded-r-full" />
                    <span className="pl-3 block italic">"{lead.message || 'No additional message provided by the user.'}"</span>
                  </div>
                  
                  {lead.propertyId && (
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 mr-2 flex items-center">
                        <Calendar size={14} className="mr-1" /> {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-gray-700 mx-2">•</span>
                      <div className="flex items-center text-brand-gold">
                        {lead.propertyId.category === 'construction' && <Building2 size={14} className="mr-1.5" />}
                        {lead.propertyId.category === 'sales' && <Home size={14} className="mr-1.5" />}
                        {lead.propertyId.category === 'plans' && <LayoutTemplate size={14} className="mr-1.5" />}
                        Interested in: <span className="font-semibold ml-1">{lead.propertyId.title}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Right Side: Actions */}
                <div className="flex flex-row xl:flex-col gap-3 shrink-0 pt-4 xl:pt-0 border-t border-dark-border xl:border-t-0 xl:border-l xl:pl-8">
                  {lead.status !== 'contacted' && lead.status !== 'closed' && (
                    <button 
                      onClick={() => updateStatus(lead._id, 'contacted')}
                      className="group flex items-center justify-center w-full px-5 py-3 bg-transparent border-2 border-brand-gold/80 text-brand-gold rounded-xl text-sm font-bold transition-all hover:bg-brand-gold hover:text-black hover:shadow-[0_0_15px_rgba(255,183,0,0.4)]"
                    >
                      Mark Contacted
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                  {lead.status !== 'closed' && (
                    <button 
                      onClick={() => updateStatus(lead._id, 'closed')}
                      className="group flex items-center justify-center w-full px-5 py-3 bg-brand-blue/10 border-2 border-brand-blue/50 text-brand-blue rounded-xl hover:bg-brand-blue hover:text-white hover:shadow-[0_0_15px_rgba(0,85,255,0.5)] transition-all text-sm font-bold"
                    >
                      <CheckCircle2 size={16} className="mr-2 group-hover:scale-110 transition-transform" /> 
                      Close Lead
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeadManagement;
