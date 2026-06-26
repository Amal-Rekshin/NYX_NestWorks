import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, ArrowLeft } from 'lucide-react';
import API from '../../api';
import { toast } from 'react-hot-toast';

const PropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(isEditing);
  const [formData, setFormData] = useState({
    title: '', category: 'construction', description: '', price: '', 
    location: '', areaSqft: '', bedrooms: '', bathrooms: '', status: 'available', isFeatured: false,
    yearBuilt: '', garage: '', amenities: ''
  });
  const [images, setImages] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [existingThumbnail, setExistingThumbnail] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/properties/${id}`);
      setFormData({
        title: data.title || '',
        category: data.category || 'construction',
        description: data.description || '',
        price: data.price || '',
        location: data.location || '',
        areaSqft: data.areaSqft || '',
        bedrooms: data.bedrooms || '',
        bathrooms: data.bathrooms || '',
        status: data.status || 'available',
        isFeatured: data.isFeatured || false,
        yearBuilt: data.yearBuilt || '',
        garage: data.garage || '',
        amenities: data.amenities || ''
      });
      setExistingImages(data.images || []);
      setExistingThumbnail(data.thumbnail || '');
    } catch (error) {
      console.error(error);
      toast.error('Failed to load property');
      navigate('/admin/properties');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
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
    
    if (thumbnail) {
      data.append('thumbnail', thumbnail[0]);
    }

    if (isEditing) {
      data.append('existingImages', JSON.stringify(existingImages));
      data.append('existingThumbnail', existingThumbnail);
    }

    try {
      if (isEditing) {
        await API.put(`/properties/${id}`, data);
        toast.success('Property updated successfully');
      } else {
        await API.post('/properties', data);
        toast.success('Property created successfully');
      }
      navigate('/admin/properties');
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Failed to save property. Check console for details.');
    }
  };

  if (loading) return <div className="text-white p-8">Loading property details...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center mb-8">
        <button onClick={() => navigate(-1)} className="mr-4 p-2 bg-dark-surface border border-dark-border text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-white">{isEditing ? 'Edit Property' : 'Add New Property'}</h1>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-2xl p-8 shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Title *</label>
              <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-3 text-white focus:outline-none focus:border-brand-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Category *</label>
              <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-3 text-white focus:outline-none focus:border-brand-blue">
                <option value="construction">Construction</option>
                <option value="plans">Plans & Designs</option>
                <option value="sales">Houses for Sale</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Price ($)</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-3 text-white focus:outline-none focus:border-brand-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-3 text-white focus:outline-none focus:border-brand-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Area (Sqft)</label>
              <input type="number" name="areaSqft" value={formData.areaSqft} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-3 text-white focus:outline-none focus:border-brand-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-3 text-white focus:outline-none focus:border-brand-blue">
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Bedrooms</label>
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-3 text-white focus:outline-none focus:border-brand-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Bathrooms</label>
              <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-3 text-white focus:outline-none focus:border-brand-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Year Built</label>
              <input type="number" name="yearBuilt" value={formData.yearBuilt} onChange={handleInputChange} placeholder="e.g. 2024" className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-3 text-white focus:outline-none focus:border-brand-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Garage (Cars)</label>
              <input type="number" name="garage" value={formData.garage} onChange={handleInputChange} placeholder="e.g. 2" className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-3 text-white focus:outline-none focus:border-brand-blue" />
            </div>
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-400 mb-2">Amenities</label>
            <input type="text" name="amenities" value={formData.amenities} onChange={handleInputChange} placeholder="e.g. Pool, Gym, Central AC (comma separated)" className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-3 text-white focus:outline-none focus:border-brand-blue" />
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-400 mb-2">Description *</label>
            <textarea name="description" required value={formData.description} onChange={handleInputChange} rows="5" className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-3 text-white focus:outline-none focus:border-brand-blue"></textarea>
          </div>

          <div className="mb-8 flex items-center p-4 border border-brand-blue/30 bg-brand-blue/5 rounded-xl">
            <input 
              type="checkbox" 
              name="isFeatured" 
              id="isFeatured"
              checked={formData.isFeatured} 
              onChange={handleInputChange} 
              className="w-5 h-5 text-brand-blue bg-dark-bg border-dark-border rounded focus:ring-brand-blue focus:ring-2 cursor-pointer" 
            />
            <label htmlFor="isFeatured" className="ml-3 text-base font-medium text-white cursor-pointer">
              Featured Property
              <span className="block text-sm font-normal text-gray-400 mt-1">Checking this will prominently display the property on the main landing page.</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="p-6 border border-dark-border rounded-xl bg-dark-bg/50">
              <label className="block text-base font-medium text-brand-gold mb-4">Thumbnail Image (Cover)</label>
              {existingThumbnail && (
                <div className="relative w-40 h-40 mb-4 border border-dark-border rounded-lg overflow-hidden group">
                  <img src={existingThumbnail.startsWith('http') ? existingThumbnail : `http://localhost:5001${existingThumbnail}`} alt="Thumbnail" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setExistingThumbnail('')} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <X size={16} />
                  </button>
                </div>
              )}
              <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files)} className="w-full text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-gold file:text-dark-bg hover:file:bg-yellow-500 cursor-pointer" />
              {isEditing && <p className="text-xs text-gray-500 mt-3">Note: Uploading a new thumbnail completely replaces the existing one.</p>}
            </div>

            <div className="p-6 border border-dark-border rounded-xl bg-dark-bg/50">
              <label className="block text-base font-medium text-brand-blue mb-4">Gallery Images</label>
              {existingImages.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-4">
                  {existingImages.map((img, idx) => (
                    <div key={idx} className="relative w-24 h-24 border border-dark-border rounded-md overflow-hidden group">
                      <img src={img.startsWith('http') ? img : `http://localhost:5001${img}`} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setExistingImages(existingImages.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} className="w-full text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-blue file:text-white hover:file:bg-brand-blue-light cursor-pointer" />
              {isEditing && <p className="text-xs text-gray-500 mt-3">Note: Any new images you upload will be added to the gallery above.</p>}
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-dark-border gap-4">
            <button type="button" onClick={() => navigate(-1)} className="px-8 py-3 border border-dark-border text-gray-300 rounded-md hover:bg-dark-bg transition-colors cursor-pointer font-medium">
              Cancel
            </button>
            <button type="submit" className="px-8 py-3 bg-brand-blue text-white font-medium rounded-md hover:bg-brand-blue-light transition-colors shadow-[0_0_15px_rgba(0,85,255,0.3)] cursor-pointer">
              {isEditing ? 'Update Property' : 'Save Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;
