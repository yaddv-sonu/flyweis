'use client';
import { useState, useEffect } from 'react';
import { FiTrash2, FiCamera } from 'react-icons/fi';
import { MdModeEdit } from 'react-icons/md';
import { BsTrash } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';

export default function BlogCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [newCategory, setNewCategory] = useState({
    title: '',
    description: '',
    image: null,
    imageUrl: ''
  });

  useEffect(() => {
    fetchCategories();
  }, [page, limit]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/BlogCategory/allBlogCategory`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch blog categories');
      }
      const responseData = await response.json();
      const categoriesData = responseData?.data || [];
      setCategories(categoriesData);
      setTotalCount(categoriesData.length);
    } catch (err) {
      setError(err.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog category?')) return;
    try {
      const response = await fetch(`https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/BlogCategory/deleteBlogCategory/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete blog category');
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBulkDelete = async () => {
    // TODO: Implement bulk delete functionality
    console.log('Bulk delete selected blog categories');
  };

  const handleEdit = async (id) => {
    try {
      const response = await fetch(`https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/BlogCategory/getIdBlogCategory/${id}`);
      if (!response.ok) throw new Error('Failed to fetch blog category');
      const data = await response.json();
      setNewCategory({
        title: data?.data?.title || '',
        description: data?.data?.description || '',
        image: null,
        imageUrl: data?.data?.image || ''
      });
      setEditCategoryId(id);
      setIsEditMode(true);
      setIsModalOpen(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCategory(prev => ({ ...prev, image: file, imageUrl: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newCategory.title);
    formData.append('description', newCategory.description);
    if (newCategory.image) {
      formData.append('image', newCategory.image);
    }
    try {
      let url = 'https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/BlogCategory/addBlogCategory';
      let method = 'POST';
      if (isEditMode && editCategoryId) {
        url = `https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/BlogCategory/updateBlogCategory/${editCategoryId}`;
        method = 'PUT';
      }
      const response = await fetch(url, {
        method,
        body: formData,
      });
      if (!response.ok) throw new Error(isEditMode ? 'Failed to update blog category' : 'Failed to create blog category');
      fetchCategories();
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditCategoryId(null);
      setNewCategory({ title: '', description: '', image: null, imageUrl: '' });
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-gray-600">Loading blog categories...</div>
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
        <h1 className="text-2xl font-semibold text-black">Blog Category</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#23A8B0] hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <span>Add new Blog</span>
            <span className="text-xl">+</span>
          </button>
                  <button
                      onClick={handleBulkDelete}
            className="bg-white shadow-md hover:bg-red-100 text-red-500 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <BsTrash className="text-lg" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30  flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg w-[500px] p-6 relative shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Blog Category</h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditMode(false);
                  setEditCategoryId(null);
                  setNewCategory({ title: '', description: '', image: null, imageUrl: '' });
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
                  {newCategory.imageUrl ? (
                    <img
                      src={newCategory.imageUrl}
                      alt="Preview"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <FiCamera className="text-4xl text-gray-400 mb-2" />
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
                  value={newCategory.title}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter blog category title"
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
                  value={newCategory.description}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter blog category description"
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
              <th className="p-4 text-sm font-medium text-gray-600 text-left">Title</th>
              <th className="p-4 text-sm font-medium text-gray-600 text-left">Description</th>
              <th className="p-4 text-sm font-medium text-gray-600 text-left">Operations</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="border-b last:border-b-0">
                <td className="p-4">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="p-4 text-sm text-gray-800">{category.title || '-'}</td>
                <td className="p-4 text-sm text-gray-600">{category.description || '-'}</td>
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
          <div>Showing {(page - 1) * limit + 1}-{Math.min(page * limit, totalCount)} of {totalCount}</div>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              &lt;
            </button>
            <button 
              onClick={() => setPage(prev => prev + 1)}
              disabled={page * limit >= totalCount}
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