import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import API from '../../api';
import { toast } from 'react-hot-toast';

const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop();
  
  // Filter logic
  const isCategoryFilter = ['construction', 'plans', 'sales'].includes(currentPath);
  const defaultCategory = isCategoryFilter ? currentPath : 'construction';

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', category: defaultCategory, description: '', price: '', 
    location: '', areaSqft: '', bedrooms: '', bathrooms: '', status: 'available'
  });
  const [images, setImages] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await API.delete(`/properties/${id}`);
        toast.success('Property deleted successfully');
        if (editingId === id) closeModal();
        fetchProperties();
      } catch (error) {
        console.error('Error deleting property:', error);
        toast.error('Failed to delete property.');
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: '', category: defaultCategory, description: '', price: '', location: '', areaSqft: '', bedrooms: '', bathrooms: '', status: 'available' });
    setImages(null);
    setIsModalOpen(true);
  };

  const openEditModal = (prop) => {
    setEditingId(prop._id);
    setFormData({
      title: prop.title || '',
      category: prop.category || defaultCategory,
      description: prop.description || '',
      price: prop.price || '',
      location: prop.location || '',
      areaSqft: prop.areaSqft || '',
      bedrooms: prop.bedrooms || '',
      bathrooms: prop.bathrooms || '',
      status: prop.status || 'available'
    });
    setImages(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    
    if (images) {
      for (let i = 0; i < images.length; i++) {
        data.append('images', images[i]);
      }
    }

    try {
      if (editingId) {
        await API.put(`/properties/${editingId}`, data);
        toast.success('Property updated successfully');
      } else {
        await API.post('/properties', data);
        toast.success('Property created successfully');
      }
      closeModal();
      fetchProperties();
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Failed to save property. Check console for details.');
    }
  };

  // Filter properties based on the current active tab
  const displayedProperties = isCategoryFilter 
    ? properties.filter(p => p.category === currentPath)
    : properties;

  // Title for the page based on the route
  const pageTitle = isCategoryFilter 
    ? currentPath.charAt(0).toUpperCase() + currentPath.slice(1) + ' Management'
    : 'All Properties';

  if (loading) return <div className="text-white p-8">Loading properties...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">{pageTitle}</h1>
        <button 
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-light transition-colors cursor-pointer shadow-[0_0_10px_rgba(0,85,255,0.3)]">
          <Plus size={18} className="mr-2" /> Add {isCategoryFilter ? currentPath.charAt(0).toUpperCase() + currentPath.slice(1) : 'Property'}
        </button>
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
                        {prop.images && prop.images.length > 0 ? (
                          <img src={`http://localhost:5001${prop.images[0]}`} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <ImageIcon size={16} className="text-gray-500" />
                        )}
                      </div>
                      {prop.title}
                    </td>
                    {!isCategoryFilter && <td className="px-6 py-4 capitalize">{prop.category}</td>}
                    <td className="px-6 py-4">${prop.price?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium border border-brand-gold/30 text-brand-gold bg-brand-gold/10 capitalize">
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

      {/* Add/Edit Property Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-dark-surface border border-dark-border rounded-2xl w-full max-w-3xl my-8 relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-dark-border sticky top-0 bg-dark-surface z-10">
              <h2 className="text-2xl font-bold text-white">{editingId ? 'Edit Property' : 'Add New Property'}</h2>
              <button type="button" onClick={closeModal} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Title *</label>
                  <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-blue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Category *</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-blue">
                    <option value="construction">Construction</option>
                    <option value="plans">Plans & Designs</option>
                    <option value="sales">Houses for Sale</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Price ($)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-blue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-blue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Area (Sqft)</label>
                  <input type="number" name="areaSqft" value={formData.areaSqft} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-blue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-blue">
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Bedrooms</label>
                  <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-blue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Bathrooms</label>
                  <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-blue" />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Description *</label>
                <textarea name="description" required value={formData.description} onChange={handleInputChange} rows="4" className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 text-white focus:outline-none focus:border-brand-blue"></textarea>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-400 mb-2">Images (Max 5)</label>
                <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-blue file:text-white hover:file:bg-brand-blue-light" />
                {editingId && <p className="text-xs text-brand-gold mt-2">Note: Uploading new images will replace existing ones.</p>}
              </div>

              <div className="flex justify-between items-center mt-8 pt-4 border-t border-dark-border">
                <div>
                  {editingId && (
                    <button type="button" onClick={() => deleteProperty(editingId)} className="flex items-center px-4 py-2 border border-red-500/50 text-red-400 rounded-md hover:bg-red-500/10 transition-colors cursor-pointer">
                      <Trash2 size={16} className="mr-2" /> Delete Property
                    </button>
                  )}
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={closeModal} className="px-6 py-2 border border-dark-border text-gray-300 rounded-md hover:bg-dark-bg transition-colors cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2 bg-brand-blue text-white font-medium rounded-md hover:bg-brand-blue-light transition-colors shadow-[0_0_10px_rgba(0,85,255,0.3)] cursor-pointer">
                    {editingId ? 'Update Property' : 'Save Property'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyManagement;
