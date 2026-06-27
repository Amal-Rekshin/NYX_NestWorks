import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, BedDouble, Bath, Home as HomeIcon, Lock, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API, { BASE_URL } from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';

const HouseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [leadStatus, setLeadStatus] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await API.get(`/properties/${id}`);
        setProperty(data);
      } catch (error) {
        console.error("Error fetching property", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProperty();
  }, [id]);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setLeadStatus('submitting');
    try {
      await API.post('/leads', { ...leadForm, propertyId: property._id });
      setLeadStatus('success');
      setTimeout(() => {
        setIsModalOpen(false);
        setLeadStatus('');
        setLeadForm({ name: '', email: '', phone: '', message: '' });
      }, 2000);
    } catch (error) {
      setLeadStatus('error');
      console.error(error);
    }
  };

  if (loading) return <LoadingSpinner message="Loading property details..." fullScreen={true} />;
  if (!property) return <div className="min-h-screen flex justify-center items-center text-white">Property not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Main Image & Header */}
      <div className="mb-8">
        <div className="text-brand-blue font-semibold uppercase tracking-wider mb-2">{property.category}</div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{property.title}</h1>
        <div className="flex items-center text-gray-400 mb-6">
          <MapPin size={20} className="mr-2" />
          <span className="text-lg">{property.location}</span>
        </div>
        
        <div className="rounded-2xl overflow-hidden h-[50vh] relative bg-dark-surface border border-dark-border">
          {(property.thumbnail || (property.images && property.images.length > 0)) ? (
            <img src={(property.thumbnail || property.images[0]).startsWith('http') ? (property.thumbnail || property.images[0]) : `${BASE_URL}${property.thumbnail || property.images[0]}`} alt={property.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">No Image Available</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {/* Stats Bar */}
          <div className="flex flex-wrap gap-6 py-6 border-y border-dark-border mb-8">
            <div className="flex items-center text-gray-300">
              <BedDouble size={24} className="mr-3 text-brand-blue" />
              <span className="text-lg">{property.bedrooms || 0} Bedrooms</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Bath size={24} className="mr-3 text-brand-blue" />
              <span className="text-lg">{property.bathrooms || 0} Bathrooms</span>
            </div>
            <div className="flex items-center text-gray-300">
              <HomeIcon size={24} className="mr-3 text-brand-blue" />
              <span className="text-lg">{property.areaSqft || 0} sqft</span>
            </div>
            {property.yearBuilt && (
              <div className="flex items-center text-gray-300">
                <span className="text-2xl mr-2 text-brand-blue">📅</span>
                <span className="text-lg">Built {property.yearBuilt}</span>
              </div>
            )}
            {property.garage && (
              <div className="flex items-center text-gray-300">
                <span className="text-2xl mr-2 text-brand-blue">🚗</span>
                <span className="text-lg">{property.garage} Car Garage</span>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">About this property</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 whitespace-pre-line">
            {property.description}
          </p>

          {property.amenities && (
            <div className="mb-12">
              <h3 className="text-xl font-bold text-white mb-4">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.split(',').map((amenity, index) => (
                  <span key={index} className="px-4 py-2 bg-dark-bg border border-dark-border rounded-full text-gray-300 text-sm">
                    {amenity.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Lock Logic */}
          <h2 className="text-2xl font-bold text-white mb-6">Full Gallery</h2>
          {user ? (
            <div className="grid grid-cols-2 gap-4">
              {property.images && property.images.length > 1 ? property.images.slice(1).map((img, i) => (
                <img key={i} src={img.startsWith('http') ? img : `${BASE_URL}${img}`} alt="Gallery" className="rounded-xl w-full h-64 object-cover" />
              )) : (
                <p className="text-gray-500 col-span-2">No additional images in gallery.</p>
              )}
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden bg-dark-surface border border-dark-border h-80 flex flex-col items-center justify-center text-center p-8">
              <div className="absolute inset-0 bg-brand-blue/5 opacity-10 bg-cover bg-center filter blur-sm"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-brand-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock size={32} className="text-brand-blue" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Gallery Locked</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Please sign in or create an account to view the full image gallery and 3D floor plans for this property.
                </p>
                <Link to="/auth" className="inline-block px-8 py-3 bg-brand-blue text-white font-medium rounded-md hover:bg-brand-blue-light transition-colors shadow-[0_0_15px_rgba(0,85,255,0.3)]">
                  Sign In to View
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar / Contact Box */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-dark-surface border border-dark-border rounded-2xl p-8 shadow-xl">
            <div className="text-3xl font-bold text-white mb-6">
              ${property.price?.toLocaleString()}
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 mb-4 bg-brand-green text-dark-bg font-bold rounded-md hover:bg-brand-green-light transition-colors shadow-[0_0_15px_rgba(255,183,0,0.3)] text-lg cursor-pointer">
              Express Interest
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 border border-brand-blue text-brand-blue font-bold rounded-md hover:bg-brand-blue hover:text-white transition-colors text-lg cursor-pointer">
              Request Call Back
            </button>
            
            <p className="text-gray-500 text-sm mt-6 text-center">
              Our team usually responds within 2 hours during business days.
            </p>
          </div>
        </div>
      </div>

      {/* Lead Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-dark-surface border border-dark-border rounded-2xl w-full max-w-md my-8 relative">
            <div className="flex justify-between items-center p-6 border-b border-dark-border">
              <h2 className="text-xl font-bold text-white">Contact Us</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <X size={24} />
              </button>
            </div>
            
            {leadStatus === 'success' ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✓</div>
                <h3 className="text-xl font-bold text-white mb-2">Request Sent!</h3>
                <p className="text-gray-400">We will be in touch with you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Full Name *</label>
                  <input type="text" required value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})} className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-blue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email Address *</label>
                  <input type="email" required value={leadForm.email} onChange={e => setLeadForm({...leadForm, email: e.target.value})} className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-blue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number *</label>
                  <input type="tel" required value={leadForm.phone} onChange={e => setLeadForm({...leadForm, phone: e.target.value})} className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-blue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Message (Optional)</label>
                  <textarea value={leadForm.message} onChange={e => setLeadForm({...leadForm, message: e.target.value})} rows="3" className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-blue" placeholder={`I'm interested in ${property.title}...`}></textarea>
                </div>
                
                {leadStatus === 'error' && <p className="text-red-500 text-sm">An error occurred. Please try again.</p>}
                
                <button 
                  type="submit" 
                  disabled={leadStatus === 'submitting'}
                  className="w-full py-3 mt-4 bg-brand-blue text-white font-medium rounded-md hover:bg-brand-blue-light transition-colors shadow-[0_0_15px_rgba(0,85,255,0.3)] disabled:opacity-50 cursor-pointer"
                >
                  {leadStatus === 'submitting' ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseDetail;
