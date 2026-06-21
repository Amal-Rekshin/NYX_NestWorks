import { Link } from 'react-router-dom';
import { Home, Bath, BedDouble, MapPin } from 'lucide-react';

const PropertyCard = ({ property }) => {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden hover:border-brand-blue transition-colors group">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={property.images && property.images[0] ? property.images[0] : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
          alt={property.title || 'Property'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-dark-bg/90 backdrop-blur text-brand-gold px-3 py-1 rounded-full text-sm font-medium border border-brand-gold/30">
          {property.status ? property.status.charAt(0).toUpperCase() + property.status.slice(1) : 'Available'}
        </div>
      </div>
      
      <div className="p-6">
        <div className="text-brand-blue text-sm font-semibold mb-2 uppercase tracking-wider">
          {property.category || 'Category'}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{property.title || 'Beautiful Property'}</h3>
        
        <div className="flex items-center text-gray-400 mb-4">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">{property.location || 'Location not specified'}</span>
        </div>
        
        <div className="flex justify-between items-center py-4 border-y border-dark-border mb-4">
          <div className="flex items-center text-gray-300">
            <BedDouble size={18} className="mr-2 text-brand-blue" />
            <span>{property.bedrooms || 0} Beds</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Bath size={18} className="mr-2 text-brand-blue" />
            <span>{property.bathrooms || 0} Baths</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Home size={18} className="mr-2 text-brand-blue" />
            <span>{property.areaSqft || 0} sqft</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-white">
            ${property.price ? property.price.toLocaleString() : 'Contact Us'}
          </div>
          <Link to={`/property/${property._id || '1'}`} className="text-brand-gold hover:text-brand-gold-light font-medium flex items-center transition-colors">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
