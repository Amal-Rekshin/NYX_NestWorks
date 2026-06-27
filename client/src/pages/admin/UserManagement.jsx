import { useState, useEffect } from 'react';
import { Trash2, User as UserIcon } from 'lucide-react';
import API from '../../api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/admin/users');
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to remove this user from the system?')) {
      try {
        await API.delete(`/admin/users/${id}`);
        toast.success('User removed successfully');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  if (loading) return <LoadingSpinner message="Loading users..." />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">User Management</h1>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-dark-bg/50 text-xs uppercase text-gray-500 border-b border-dark-border">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="border-b border-dark-border hover:bg-dark-bg/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-dark-bg flex items-center justify-center border border-dark-border">
                        <UserIcon size={18} className="text-gray-500" />
                      </div>
                      {user.name}
                      {currentUser?._id === user._id && <span className="ml-2 text-[10px] uppercase font-bold tracking-wider bg-brand-blue/20 text-brand-blue px-2 py-0.5 rounded-full">You</span>}
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
                        user.isAdmin 
                          ? 'border-brand-green/30 text-brand-green bg-brand-green/10' 
                          : 'border-brand-blue/30 text-brand-blue bg-brand-blue/10'
                      }`}>
                        {user.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      {currentUser?._id !== user._id && user.email !== 'admin@nyxnestworks.com' && (
                        <button onClick={() => deleteUser(user._id)} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer" title="Delete User">
                          <Trash2 size={18} />
                        </button>
                      )}
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

export default UserManagement;
