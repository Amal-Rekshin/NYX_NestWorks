import { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, CheckCircle2 } from 'lucide-react';
import API from '../../api';

const LeadManagement = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data } = await API.get('/leads');
      setLeads(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/leads/${id}/status`, { status });
      fetchLeads(); // Refresh list
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="text-white">Loading leads...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Leads Inbox</h1>
        <p className="text-gray-400 mt-2">Manage customer inquiries and requests.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {leads.length === 0 ? (
          <div className="bg-dark-surface border border-dark-border rounded-xl p-12 text-center text-gray-500">
            No leads received yet.
          </div>
        ) : (
          leads.map((lead) => (
            <div key={lead._id} className="bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-brand-blue/50 transition-colors relative">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{lead.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize
                      ${lead.status === 'new' ? 'border-brand-blue/50 text-brand-blue bg-brand-blue/10' : 
                        lead.status === 'contacted' ? 'border-brand-gold/50 text-brand-gold bg-brand-gold/10' : 
                        'border-green-500/50 text-green-500 bg-green-500/10'}`}
                    >
                      {lead.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center"><Mail size={14} className="mr-1.5 text-brand-blue" /> {lead.email}</div>
                    <div className="flex items-center"><Phone size={14} className="mr-1.5 text-brand-blue" /> {lead.phone}</div>
                    <div className="flex items-center"><Calendar size={14} className="mr-1.5 text-brand-blue" /> {new Date(lead.createdAt).toLocaleDateString()}</div>
                  </div>
                  
                  <div className="bg-dark-bg p-4 rounded-lg border border-dark-border text-gray-300 text-sm">
                    {lead.message || 'No specific message provided.'}
                  </div>
                  
                  {lead.propertyId && (
                    <div className="mt-4 text-sm font-medium text-brand-gold">
                      Interested in: {lead.propertyId.title} ({lead.propertyId.category})
                    </div>
                  )}
                </div>
                
                <div className="flex flex-row md:flex-col gap-2 shrink-0">
                  {lead.status !== 'contacted' && lead.status !== 'closed' && (
                    <button 
                      onClick={() => updateStatus(lead._id, 'contacted')}
                      className="px-4 py-2 bg-dark-bg border border-brand-gold text-brand-gold hover:bg-brand-gold/10 rounded-md text-sm font-medium transition-colors cursor-pointer"
                    >
                      Mark Contacted
                    </button>
                  )}
                  {lead.status !== 'closed' && (
                    <button 
                      onClick={() => updateStatus(lead._id, 'closed')}
                      className="flex items-center px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-light transition-colors text-sm font-medium cursor-pointer"
                    >
                      <CheckCircle2 size={16} className="mr-2" /> Close Lead
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
