import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../../api';
import PropertyCard from '../../components/PropertyCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const PublicProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  // Extract category from URL: "/construction" -> "construction"
  const category = location.pathname.replace('/', '');

  useEffect(() => {
    fetchProperties();
  }, [category]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/properties');
      
      // Filter by category
      const filtered = data.filter(p => p.category === category);
      
      // Filter out properties that are 'sold' if desired (optional)
      // We'll show all of them but PropertyCard will show the status badge.
      setProperties(filtered);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPageTitle = () => {
    switch (category) {
      case 'construction': return 'Construction Projects';
      case 'plans': return 'Plans & Designs';
      case 'sales': return 'Houses For Sale';
      default: return 'Properties';
    }
  };

  const getPageDescription = () => {
    switch (category) {
      case 'construction': return 'Explore our ongoing and completed world-class construction projects.';
      case 'plans': return 'Browse our catalogue of exclusive architectural blueprints and 3D elevations.';
      case 'sales': return 'Discover premium, ready-to-move luxury homes available for purchase.';
      default: return 'Explore our portfolio of properties.';
    }
  };

  return (
    <div className="flex-1 bg-dark-bg min-h-screen">
      {/* Header Section */}
      <section className="relative py-20 border-b border-dark-border bg-dark-surface overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-blue/5 via-dark-surface to-dark-surface z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(0,85,255,0.3)]">
            {getPageTitle()}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {getPageDescription()}
          </p>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <LoadingSpinner message="Loading properties..." />
        ) : properties.length === 0 ? (
          <div className="text-center py-20 border border-dark-border rounded-xl bg-dark-surface/50">
            <div className="text-4xl mb-4">🏗️</div>
            <h3 className="text-2xl font-bold text-white mb-2">Check Back Soon</h3>
            <p className="text-gray-400">We are currently updating our portfolio for {getPageTitle().toLowerCase()}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PublicProperties;
