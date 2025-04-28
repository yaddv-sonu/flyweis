"use client"
import { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { MdModeEdit } from 'react-icons/md';
import { BsTrash } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';

export default function CareerPage() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCareerId, setEditCareerId] = useState(null);
  const [newCareer, setNewCareer] = useState({
    title: '',
    description: '',
    image: null,
    imageUrl: '',
  });

  useEffect(() => {
    fetchCareers();
  }, [page, limit]);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/Career/allCareer`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch careers');
      }
      const responseData = await response.json();
      
      // Handle the array response and implement pagination
      let allCareers = [];
      if (Array.isArray(responseData?.data)) {
        allCareers = responseData.data;
      }
      
      // Calculate pagination
      const total = allCareers.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCareers = allCareers.slice(startIndex, endIndex);
      
      setCareers(paginatedCareers);
      setTotalCount(total);
    } catch (err) {
      setError(err.message);
      setCareers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this career?')) return;
    try {
      // Replace with your real API endpoint
      const response = await fetch(`https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/Career/deleteCareer/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete career');
        fetchCareers();
        window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = async (id) => {
    try {
      // Replace with your real API endpoint
      const response = await fetch(`https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/getCareer/{{id}}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch career');
      const data = await response.json();
      setNewCareer({
        title: data?.data?.title || '',
        description: data?.data?.description || '',
        image: null,
        imageUrl: data?.data?.image || '',
      });
      setEditCareerId(id);
      setIsEditMode(true);
      setIsModalOpen(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCareer(prev => ({ ...prev, image: file, imageUrl: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newCareer.title);
    formData.append('description', newCareer.description);
    if (newCareer.image) {
      formData.append('image', newCareer.image);
    }
    try {
      let url = 'https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/Career/addCareer';
      let method = 'POST';
      if (isEditMode && editCareerId) {
        url = `/api/careers/${editCareerId}`;
        method = 'PUT';
      }
      const response = await fetch(url, {
        method,
        body: formData,
      });
      if (!response.ok) throw new Error(isEditMode ? 'Failed to update career' : 'Failed to create career');
      fetchCareers();
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditCareerId(null);
      setNewCareer({ title: '', description: '', image: null, imageUrl: '' });
    } catch (err) {
      alert(err.message);
    }
  };

  // Calculate pagination info
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalCount);
  const totalPages = Math.ceil(totalCount / limit);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-gray-600">Loading careers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Orange Header */}
      <div className="rounded-t-xl p-4 flex justify-between items-center mb-4 to-pink-400">
        <h1 className="text-2xl font-semibold text-black">Career</h1>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setIsModalOpen(true);
              setIsEditMode(false);
              setEditCareerId(null);
              setNewCareer({ title: '', description: '', image: null, imageUrl: '' });
            }}
            className="bg-[#23A8B0] hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <span>Add new Career</span>
            <span className="text-xl">+</span>
          </button>
          <button
            className="bg-white shadow-md hover:bg-red-100 text-red-500 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <BsTrash className="text-lg" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg w-[500px] p-6 relative shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{isEditMode ? 'Edit Career' : 'Add Career'}</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditMode(false);
                  setEditCareerId(null);
                  setNewCareer({ title: '', description: '', image: null, imageUrl: '' });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoMdClose size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div className="flex justify-center">
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:border-[#23A8B0] relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {newCareer.imageUrl ? (
                    <img
                      src={newCareer.imageUrl}
                      alt="Preview"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-4xl text-gray-400 mb-2">📷</span>
                      <div className="text-blue-600 text-sm">Upload Image</div>
                    </div>
                  )}
                </div>
              </div>
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCareer.title}
                  onChange={(e) => setNewCareer(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter career title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23A8B0] text-black"
                  required
                />
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description<span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newCareer.description}
                  onChange={(e) => setNewCareer(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter career description"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23A8B0] resize-none text-black"
                  required
                />
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#23A8B0] hover:bg-teal-600 text-white py-2 rounded-lg transition-colors"
              >
                {isEditMode ? 'Update' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="w-12 p-4 text-left">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="p-4 text-sm font-medium text-gray-600 text-left">Image</th>
              <th className="p-4 text-sm font-medium text-gray-600 text-left">Title</th>
              <th className="p-4 text-sm font-medium text-gray-600 text-left">Description</th>
              <th className="p-4 text-sm font-medium text-gray-600 text-left">Operations</th>
            </tr>
          </thead>
          <tbody>
            {careers.map((career, idx) => (
              <tr key={career._id || idx} className="border-b last:border-b-0">
                <td className="p-4">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="p-4">
                  <img
                    src={career.image || '/couple.jpg'}
                    alt={career.title}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </td>
                <td className="p-4 text-sm text-gray-800">{career.title || '-'}</td>
                <td className="p-4 text-sm text-gray-600">{career.description || '-'}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 text-sm bg-teal-100 text-teal-600 rounded-md hover:bg-teal-200 flex items-center gap-1"
                      onClick={() => handleEdit(career._id)}
                    >
                      <MdModeEdit />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(career._id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200 flex items-center gap-1"
                    >
                      <FiTrash2 />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Updated Pagination UI */}
        <div className="p-4 border-t flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing {careers.length > 0 ? startIndex : 0}-{endIndex} of {totalCount}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              &lt;
            </button>
            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setPage(idx + 1)}
                  className={`w-8 h-8 rounded-lg ${
                    page === idx + 1
                      ? 'bg-[#23A8B0] text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 