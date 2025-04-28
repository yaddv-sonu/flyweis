'use client';
import { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { MdModeEdit } from 'react-icons/md';
import { BsTrash } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';

export default function CareerOpenings() {
  const [openings, setOpenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editOpeningId, setEditOpeningId] = useState(null);
  const [newOpening, setNewOpening] = useState({
    title: '',
    description: '',
    location: '',
  });

  useEffect(() => {
    fetchOpenings();
  }, [page, limit]);

  const fetchOpenings = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/allCareerOpening`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch career openings');
      }
      const responseData = await response.json();
      
      // Handle the paginated response
      if (responseData?.data?.docs) {
        setOpenings(responseData.data.docs);
        setTotalCount(responseData.data.totalDocs);
        // Update page if it exceeds total pages
        if (page > responseData.data.totalPages) {
          setPage(1);
        }
      } else {
        setOpenings([]);
        setTotalCount(0);
      }
    } catch (err) {
      setError(err.message);
      setOpenings([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this opening?')) return;
    try {
      const response = await fetch(
        `https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/deleteCareerOpening/${id}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) throw new Error('Failed to delete opening');
      fetchOpenings();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await fetch(
        `https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/getCareerOpening/${id}`
      );
      if (!response.ok) throw new Error('Failed to fetch opening');
      const data = await response.json();
      setNewOpening({
        title: data?.data?.title || '',
        description: data?.data?.description || '',
        location: data?.data?.location || '',
      });
      setEditOpeningId(id);
      setIsEditMode(true);
      setIsModalOpen(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = 'https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/addCareerOpening';
      let method = 'POST';
      if (isEditMode && editOpeningId) {
        url = `https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/updateCareerOpening/${editOpeningId}`;
        method = 'PUT';
      }
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOpening),
      });
      if (!response.ok) throw new Error(isEditMode ? 'Failed to update opening' : 'Failed to create opening');
      fetchOpenings();
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditOpeningId(null);
      setNewOpening({ title: '', description: '', location: '' });
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-gray-600">Loading career openings...</div>
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
      {/* Header */}
      <div className="rounded-t-xl p-4 flex justify-between items-center mb-4 ">
        <h1 className="text-2xl font-semibold text-black">Career Opening</h1>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setIsModalOpen(true);
              setIsEditMode(false);
              setEditOpeningId(null);
              setNewOpening({ title: '', description: '', location: '' });
            }}
            className="bg-[#23A8B0] hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <span>Add new Career</span>
            <span className="text-xl">+</span>
          </button>
          <button className="bg-white  shadow-md hover:bg-red-100 text-red-500 px-4 py-2 rounded-lg flex items-center gap-2">
            <BsTrash className="text-lg" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg w-[500px] p-6 relative shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{isEditMode ? 'Edit Opening' : 'Add Opening'}</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditMode(false);
                  setEditOpeningId(null);
                  setNewOpening({ title: '', description: '', location: '' });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoMdClose size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newOpening.title}
                  onChange={(e) => setNewOpening(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter opening title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23A8B0] text-black"
                  required
                />
              </div>
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newOpening.location}
                  onChange={(e) => setNewOpening(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter location"
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
                  value={newOpening.description}
                  onChange={(e) => setNewOpening(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter opening description"
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
              <th className="p-4 text-sm font-medium text-gray-600 text-left">Id</th>
              <th className="p-4 text-sm font-medium text-gray-600 text-left">Location</th>
              <th className="p-4 text-sm font-medium text-gray-600 text-left">Title</th>
              <th className="p-4 text-sm font-medium text-gray-600 text-left">Description</th>
              <th className="p-4 text-sm font-medium text-gray-600 text-left">Operations</th>
            </tr>
          </thead>
          <tbody>
            {openings.map((opening, idx) => (
              <tr key={opening._id || idx} className="border-b last:border-b-0">
                <td className="p-4">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="p-4 text-sm text-gray-800">{opening._id?.slice(-5) || '-'}</td>
                <td className="p-4 text-sm text-gray-800">{opening.location || '-'}</td>
                <td className="p-4 text-sm text-gray-800">{opening.title || '-'}</td>
                <td className="p-4 text-sm text-gray-600">{opening.description || '-'}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 text-sm bg-teal-100 text-teal-600 rounded-md hover:bg-teal-200 flex items-center gap-1"
                      onClick={() => handleEdit(opening._id)}
                    >
                      <MdModeEdit />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(opening._id)}
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
        {/* Pagination */}
        <div className="p-4 border-t flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing {openings.length > 0 ? (page - 1) * limit + 1 : 0}-{(page - 1) * limit + openings.length} of {totalCount}
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
              {[...Array(Math.ceil(totalCount / limit))].map((_, idx) => (
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
              onClick={() => setPage(prev => Math.min(Math.ceil(totalCount / limit), prev + 1))}
              disabled={page >= Math.ceil(totalCount / limit)}
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