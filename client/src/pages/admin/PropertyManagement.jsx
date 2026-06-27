import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import API, { BASE_URL } from '../../api';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop();
  
  // Filter logic
  const isSoldFilter = currentPath === 'sold';
  const isCategoryFilter = ['construction', 'plans', 'sales'].includes(currentPath);
  const defaultCategory = isCategoryFilter ? currentPath : 'construction';

  useEffect(() => {
    fetchProperties();
  }, [currentPath]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/properties');
      setProperties(data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await API.delete(`/properties/${id}`);
        toast.success('Property deleted successfully');
        fetchProperties();
      } catch (error) {
        console.error('Error deleting property:', error);
        toast.error('Failed to delete property.');
      }
    }
  };

  const openAddModal = () => {
    navigate('/admin/properties/new');
  };

  const openEditModal = (prop) => {
    navigate(`/admin/properties/edit/${prop._id}`);
  };

  // Filter properties based on the current active tab
  const displayedProperties = isSoldFilter
    ? properties.filter(p => p.status === 'sold')
    : isCategoryFilter 
      ? properties.filter(p => p.category === currentPath)
      : properties;

  // Title for the page based on the route
  const pageTitle = isSoldFilter
    ? 'Sold Properties'
    : isCategoryFilter 
      ? currentPath.charAt(0).toUpperCase() + currentPath.slice(1) + ' Management'
      : 'All Properties';

  if (loading) return <LoadingSpinner message="Loading properties..." />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">{pageTitle}</h1>
        {!isSoldFilter && (
          <button 
            onClick={openAddModal}
            className="flex items-center px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-light transition-colors cursor-pointer shadow-[0_0_10px_rgba(0,85,255,0.3)]">
            <Plus size={18} className="mr-2" /> Add {isCategoryFilter ? currentPath.charAt(0).toUpperCase() + currentPath.slice(1) : 'Property'}
          </button>
        )}
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-dark-bg/50 text-xs uppercase text-gray-500 border-b border-dark-border">
              <tr>
                <th className="px-6 py-4">Title</th>
                {!isCategoryFilter && <th className="px-6 py-4">Category</th>}
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedProperties.length === 0 ? (
                <tr>
                  <td colSpan={isCategoryFilter ? "4" : "5"} className="px-6 py-8 text-center text-gray-500">
                    No properties found in this category. Click 'Add' to create one.
                  </td>
                </tr>
              ) : (
                displayedProperties.map((prop) => (
                  <tr 
                    key={prop._id} 
                    onClick={() => openEditModal(prop)}
                    className="border-b border-dark-border hover:bg-dark-bg/30 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-dark-bg flex items-center justify-center overflow-hidden border border-dark-border">
                        {(prop.thumbnail || (prop.images && prop.images.length > 0)) ? (
                          <img src={(prop.thumbnail || prop.images[0]).startsWith('http') ? (prop.thumbnail || prop.images[0]) : `${BASE_URL}${prop.thumbnail || prop.images[0]}`} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <ImageIcon size={16} className="text-gray-500" />
                        )}
                      </div>
                      {prop.title}
                      {prop.isFeatured && <span className="text-brand-green ml-2 text-lg">★</span>}
                    </td>
                    {!isCategoryFilter && <td className="px-6 py-4 capitalize">{prop.category}</td>}
                    <td className="px-6 py-4">${prop.price?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium border border-brand-green/30 text-brand-green bg-brand-green/10 capitalize">
                        {prop.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => openEditModal(prop)} className="text-gray-400 hover:text-white mr-3 transition-colors cursor-pointer">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => deleteProperty(prop._id)} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PropertyManagement;
