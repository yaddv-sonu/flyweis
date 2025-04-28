'use client';
import { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { MdModeEdit } from 'react-icons/md';
import { BsTrash } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';

export default function CareerOpeningCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [allCategories, setAllCategories] = useState([]); // Store all categories
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [newCategory, setNewCategory] = useState({
    title: '',
    type: 'Full Time',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  // Effect to handle pagination
  useEffect(() => {
    updateDisplayedCategories();
  }, [page, allCategories]);

  const updateDisplayedCategories = () => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    setCategories(allCategories.slice(startIndex, endIndex));
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/CareerOpeningCategory/allCareerOpeningCategory`
      );
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch career categories');
      }
      const responseData = await response.json();
      
      if (Array.isArray(responseData?.data)) {
        setAllCategories(responseData.data);
        setTotalCount(responseData.data.length);
      } else {
        setAllCategories([]);
        setTotalCount(0);
      }
    } catch (err) {
      setError(err.message);
      setAllCategories([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const response = await fetch(
        `https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/CareerOpeningCategory/deleteCareerOpeningCategory/${id}`,
        {
          method: 'DELETE',
        }
      );

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete category');
      }
      await fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await fetch(
        `https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/CareerOpeningCategory/getCareerOpeningCategory/${id}`
      );

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch category');
      }
      const data = await response.json();
      setNewCategory({
        title: data?.data?.title || '',
        type: data?.data?.type || 'Full Time',
      });
      setEditCategoryId(id);
      setIsEditMode(true);
      setIsModalOpen(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = 'https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/CareerOpeningCategory/addCareerOpeningCategory';
      let method = 'POST';
      if (isEditMode && editCategoryId) {
        url = `https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/CareerOpeningCategory/updateCareerOpeningCategory/${editCategoryId}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || (isEditMode ? 'Failed to update category' : 'Failed to create category'));
      }

      await fetchCategories();
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditCategoryId(null);
      setNewCategory({ title: '', type: 'Full Time' });
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
        <div className="text-gray-600">Loading career categories...</div>
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
      <div className="rounded-t-xl p-4 flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-black">Career opening category</h1>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setIsModalOpen(true);
              setIsEditMode(false);
              setEditCategoryId(null);
              setNewCategory({ title: '', type: 'Full Time' });
            }}
            className="bg-[#23A8B0] hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <span>Add new Career</span>
            <span className="text-xl">+</span>
          </button>
          <button className="bg-white shadow-md hover:bg-red-100 text-red-500 px-4 py-2 rounded-lg flex items-center gap-2">
            <BsTrash className="text-lg" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[500px] p-6 relative shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{isEditMode ? 'Edit Category' : 'Add Category'}</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditMode(false);
                  setEditCategoryId(null);
                  setNewCategory({ title: '', type: 'Full Time' });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoMdClose size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCategory.title}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter category title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23A8B0] text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type<span className="text-red-500">*</span>
                </label>
                <select
                  value={newCategory.type}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23A8B0] text-black"
                  required
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
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
              <th className="p-4 text-sm font-medium text-gray-600 text-left">Title</th>
              <th className="p-4 text-sm font-medium text-gray-600 text-left">Type</th>
              <th className="p-4 text-sm font-medium text-gray-600 text-left">Operations</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="border-b last:border-b-0">
                <td className="p-4">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="p-4 text-sm text-gray-800">{category.title}</td>
                <td className="p-4 text-sm text-gray-800">{category.type}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 text-sm bg-teal-100 text-teal-600 rounded-md hover:bg-teal-200 flex items-center gap-1"
                      onClick={() => handleEdit(category._id)}
                    >
                      <MdModeEdit />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
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
            Showing {categories.length > 0 ? startIndex : 0}-{endIndex} of {totalCount}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              &lt;
            </button>
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