import { useState, useEffect } from 'react';
import { Home as HomeIcon, Building, ShieldCheck, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import API from '../../api';
import PropertyCard from '../../components/PropertyCard';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await API.get('/properties');
        const featured = data.filter(p => p.isFeatured);
        setFeaturedProperties(featured);
      } catch (error) {
        console.error("Error fetching featured properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-blue/10 via-dark-bg to-dark-bg z-0"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Build Your Dream With <br/>
            <span className="text-brand-blue drop-shadow-[0_0_15px_rgba(0,85,255,0.5)]">Nyx</span>
            <span className="text-white"> </span>
            <span className="text-brand-gold drop-shadow-[0_0_15px_rgba(255,183,0,0.5)]">NestWorks</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Premium construction, innovative designs, and exclusive homes for sale. We turn blueprints into breathtaking reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/construction" className="px-8 py-4 bg-brand-blue text-white font-semibold rounded-md hover:bg-brand-blue-light transition-colors shadow-[0_0_20px_rgba(0,85,255,0.4)] text-lg cursor-pointer">
              Explore Our Work
            </Link>
            <Link to="/sales" className="px-8 py-4 border border-brand-gold text-brand-gold font-semibold rounded-md hover:bg-brand-gold hover:text-dark-bg transition-colors shadow-[0_0_15px_rgba(255,183,0,0.2)] text-lg cursor-pointer">
              View Houses For Sale
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-white">Featured Properties</h2>
          <div className="w-24 h-1 bg-brand-gold mx-auto rounded-full shadow-[0_0_10px_rgba(255,183,0,0.5)]"></div>
        </div>
        
        {loading ? (
          <LoadingSpinner message="Loading featured properties..." />
        ) : featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            No featured properties at the moment.
          </div>
        )}
      </section>

      {/* Categories Overview */}
      <section className="py-20 bg-dark-surface border-y border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <div className="w-24 h-1 bg-brand-blue mx-auto rounded-full shadow-[0_0_10px_rgba(0,85,255,0.5)]"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Construction */}
            <Link to="/construction" className="bg-dark-bg border border-dark-border rounded-xl p-8 hover:border-brand-blue transition-colors group cursor-pointer block">
              <div className="w-14 h-14 bg-brand-blue/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-blue/20 transition-colors">
                <span className="text-3xl">🏗️</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Construction</h3>
              <p className="text-gray-400">End-to-end building services with uncompromising quality and modern engineering.</p>
            </Link>
            
            {/* Plans */}
            <Link to="/plans" className="bg-dark-bg border border-dark-border rounded-xl p-8 hover:border-brand-blue transition-colors group cursor-pointer block">
              <div className="w-14 h-14 bg-brand-blue/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-blue/20 transition-colors">
                <span className="text-3xl">📐</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Plans & Designs</h3>
              <p className="text-gray-400">Custom architectural blueprints and 3D elevations tailored to your vision.</p>
            </Link>
            
            {/* Sales */}
            <Link to="/sales" className="bg-dark-bg border border-dark-border rounded-xl p-8 hover:border-brand-gold transition-colors group cursor-pointer block">
              <div className="w-14 h-14 bg-brand-gold/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-gold/20 transition-colors">
                <span className="text-3xl">🔑</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Houses For Sale</h3>
              <p className="text-gray-400">Ready-to-move premium properties. Create an account to unlock full galleries.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
