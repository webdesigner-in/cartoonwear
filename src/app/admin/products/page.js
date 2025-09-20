"use client";
import React, { useState, useEffect } from 'react';

function ProductForm({ initial, onSave, onCancel, categories, loadingCategories }) {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryError, setCategoryError] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [form, setForm] = useState({
    name: initial?.name || '',
    description: initial?.description || '',
    price: initial?.price || '',
    stock: initial?.stock || 0,
    categoryName: initial?.categoryName || initial?.category?.name || '',
    sku: initial?.sku || '',
    material: initial?.material || '',
    color: initial?.color || '',
    images: initial?.images || []
  });
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageInputType, setImageInputType] = useState('upload'); // 'upload' or 'url'
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imagePreview, setImagePreview] = useState(initial?.images?.[0]?.url || '');
  const [imageFile, setImageFile] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === 'categoryName' && value === '__new__') {
      setCreatingCategory(true);
      setForm(f => ({ ...f, categoryName: '' }));
    } else {
      setCreatingCategory(false);
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  function handleImageTypeChange(e) {
    setImageInputType(e.target.value);
    setImagePreview('');
    setImageFile(null);
    setImageUrlInput('');
    setForm(f => ({ ...f, images: [] }));
  }

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setUploading(true);
      // Upload to ImageKit
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      // You need to set up an API route or proxy for ImageKit upload
      // Example: POST /api/imagekit-upload
      const res = await fetch('/api/imagekit-upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        // data should have { url, path }
        setImagePreview(data.url);
        setForm(f => ({ ...f, images: [{ url: data.url, path: data.path }] }));
      } else {
        setError('Image upload failed');
      }
      setUploading(false);
    }
  }

  function handleImageUrlInput(e) {
    setImageUrlInput(e.target.value);
    setImagePreview(e.target.value);
    setForm(f => ({ ...f, images: [{ url: e.target.value, path: '' }] }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.price || (!form.categoryName && !newCategoryName) || !form.sku || !form.description) {
      setError('Please fill all required fields.');
      return;
    }
    if (creatingCategory && newCategoryName) {
      try {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newCategoryName })
        });
        const data = await res.json();
        if (data.category && data.category.name) {
          setForm(f => ({ ...f, categoryName: data.category.name }));
          onSave({ ...form, categoryName: data.category.name });
        } else {
          setError('Failed to create category');
        }
      } catch {
        setError('Failed to create category');
      }
    } else {
      onSave(form);
    }
  }

  // categories and loadingCategories now come from parent ProductsPage

  return (
    <div>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="border border-gray-400 p-2 rounded col-span-2 text-gray-900 bg-white"
          required
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="border border-gray-400 p-2 rounded text-gray-900 bg-white"
          required
          type="number"
          min="0"
        />
        <input
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="border border-gray-400 p-2 rounded text-gray-900 bg-white"
          required
          type="number"
          min="0"
        />
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <label className="block mb-1 font-medium text-gray-700">Category:</label>
          </div>
          <div className="mb-2">
            <select
              name="categoryName"
              value={creatingCategory ? '__new__' : form.categoryName}
              onChange={handleChange}
              className="border border-gray-400 p-2 rounded text-gray-900 bg-white w-full"
              required
              disabled={!!initial || loadingCategories}
            >
              <option value="">{loadingCategories ? 'Loading categories...' : 'Select Category'}</option>
              {(categories || []).map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
              <option value="__new__">Create new category</option>
            </select>
          </div>
          {creatingCategory && (
            <div className="flex gap-2 items-center mt-2">
              <input
                type="text"
                className="border border-gray-400 p-2 rounded text-gray-900 bg-white"
                placeholder="New category name"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                required
              />
              <button
                type="button"
                className="bg-blue-500 text-white px-3 py-2 rounded text-sm"
                onClick={async () => {
                  setCategoryError('');
                  if (!newCategoryName) {
                    setCategoryError('Category name required');
                    return;
                  }
                  try {
                    const res = await fetch('/api/categories', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name: newCategoryName })
                    });
                    const data = await res.json();
                    if (data.category && data.category.name) {
                      // Update categories locally so dropdown updates
                      if (Array.isArray(categories)) {
                        categories.push(data.category);
                      }
                      setCreatingCategory(false);
                      setNewCategoryName('');
                      setForm(f => ({ ...f, categoryName: data.category.name }));
                    } else {
                      setCategoryError(data.error || 'Failed to create category');
                    }
                  } catch {
                    setCategoryError('Failed to create category');
                  }
                }}
              >Add</button>
              <button
                type="button"
                className="bg-gray-300 px-3 py-2 rounded text-gray-900"
                onClick={() => { setCreatingCategory(false); setNewCategoryName(''); setCategoryError(''); }}
              >Cancel</button>
            </div>
          )}
          {/* Category Modal */}
          {showCategoryModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/10" role="dialog" aria-modal="true">
              <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
                <h3 className="text-lg font-bold mb-2">Add New Category</h3>
                <input
                  type="text"
                  className="border border-gray-400 p-2 rounded text-gray-900 bg-white w-full mb-2"
                  placeholder="Category name"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                />
                {categoryError && <div className="text-red-500 text-sm mb-2">{categoryError}</div>}
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={async () => {
                      setCategoryError('');
                      if (!newCategoryName) {
                        setCategoryError('Category name required');
                        return;
                      }
                      try {
                        const res = await fetch('/api/categories', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ name: newCategoryName })
                        });
                        const data = await res.json();
                        if (data.category && data.category.name) {
                          setShowCategoryModal(false);
                          setNewCategoryName('');
                        } else {
                          setCategoryError(data.error || 'Failed to create category');
                        }
                      } catch {
                        setCategoryError('Failed to create category');
                      }
                    }}
                  >Add</button>
                  <button
                    type="button"
                    className="bg-gray-300 px-4 py-2 rounded text-gray-900"
                    onClick={() => { setShowCategoryModal(false); setNewCategoryName(''); setCategoryError(''); }}
                  >Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
        <input
          name="sku"
          value={form.sku}
          onChange={handleChange}
          placeholder="SKU"
          className="border border-gray-400 p-2 rounded text-gray-900 bg-white col-span-2"
          required
        />
        <input
          name="material"
          value={form.material}
          onChange={handleChange}
          placeholder="Material"
          className="border border-gray-400 p-2 rounded text-gray-900 bg-white col-span-2"
        />
        <input
          name="color"
          value={form.color}
          onChange={handleChange}
          placeholder="Color"
          className="border border-gray-400 p-2 rounded text-gray-900 bg-white col-span-2"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border border-gray-400 p-2 rounded col-span-2 text-gray-900 bg-white"
          required
        />
        {/* Image input type selector */}
        <div className="col-span-2 flex gap-4 items-center">
          <label className="font-medium text-gray-700">Product Image:</label>
          <label className="flex items-center gap-1">
            <input type="radio" name="imageType" value="upload" checked={imageInputType === 'upload'} onChange={handleImageTypeChange} /> Upload
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" name="imageType" value="url" checked={imageInputType === 'url'} onChange={handleImageTypeChange} /> URL
          </label>
        </div>
        {/* Image upload or URL input */}
        {imageInputType === 'upload' ? (
          <div className="col-span-2 flex flex-col gap-2">
            <input
              key={imageInputType} // force reset when switching modes
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border border-gray-400 p-2 rounded bg-white"
              disabled={uploading}
            />
            {uploading && <div className="text-blue-500">Uploading...</div>}
          </div>
        ) : (
          <div className="col-span-2 flex flex-col gap-2">
            <input
              type="text"
              placeholder="Paste image URL here"
              value={imageUrlInput}
              onChange={handleImageUrlInput}
              className="border border-gray-400 p-2 rounded bg-white"
            />
          </div>
        )}
        {/* Image preview */}
        {imagePreview && (
          <div className="col-span-2">
            <img src={imagePreview} alt="Preview" className="mt-2 max-h-40 rounded border" />
          </div>
        )}
        {error && <div className="col-span-2 text-red-500 text-sm mb-2">{error}</div>}
        <div className="col-span-2 flex gap-2 mt-2">
          <button type="submit" className="bg-accent text-white px-4 py-2 rounded" disabled={uploading}>
            {initial ? 'Update' : 'Add'}
          </button>
          <button type="button" className="bg-gray-300 px-4 py-2 rounded text-gray-900" onClick={onCancel} disabled={uploading}>Cancel</button>
        </div>
      </form>
    </div>
  );
// ...existing code...
}

// ...existing code...

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import { toast } from 'react-hot-toast'

export default function ProductsPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  useEffect(() => {
    async function fetchCategories() {
      setLoadingCategories(true);
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
      setLoadingCategories(false);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (authLoading) return
    
    if (!isAuthenticated || !user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      router.push('/')
      return
    }
  }, [authLoading, isAuthenticated, user, router])

  useEffect(() => {
    async function fetchProducts() {
      setLoadingProducts(true);
      setError('');
      try {
        const res = await fetch('/api/products?limit=100');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        setProducts([])
        setError('Failed to load products.')
        toast.error('Failed to load products')
      }
      setLoadingProducts(false);
    }
    fetchProducts();
  }, []);

  async function handleSaveProduct(product) {
    setError('');
    const method = editProduct ? 'PUT' : 'POST';
    const url = '/api/products';
    let selectedCategory = categories.find(cat => cat.name === product.categoryName);
    // If category not found, refetch categories (in case just added)
    if (!selectedCategory) {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
          selectedCategory = (data.categories || []).find(cat => cat.name === product.categoryName);
        }
      } catch {}
    }
    const categoryId = selectedCategory ? selectedCategory.id : null;
    const payload = {
      ...product,
      categoryId,
      stock: product.stock !== undefined ? parseInt(product.stock) : 0,
    };
    delete payload.categoryName;
    if (editProduct) payload.id = editProduct.id;
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Failed to save product.');
        return;
      }
      setShowProductModal(false);
      setEditProduct(null);
      const data = await res.json();
      if (editProduct) {
        setProducts(products.map(p => p.id === data.product.id ? data.product : p));
      } else {
        setProducts([data.product, ...products]);
      }
      } catch (err) {
        setError('Failed to save product.')
        toast.error('Failed to save product')
      }
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm('Delete this product?')) return;
    setError('');
    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error('Failed to delete');
      setProducts(products.filter(p => p.id !== id))
      toast.success('Product deleted successfully')
    } catch (err) {
      setError('Failed to delete product.')
      toast.error('Failed to delete product')
    }
  }

  if (authLoading || !isAuthenticated || !user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
    return (
      <div className="min-h-screen bg-cream-50 flex">
        <AdminSidebar />
        <div className="flex-1 lg:ml-0 flex items-center justify-center">
          <div className="text-xl text-gray-500">Checking admin access...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 lg:ml-0">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Products Management</h1>
              <p className="text-gray-600">Manage your product catalog</p>
            </div>
            <button
              className="bg-golden hover:bg-golden-dark text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
              onClick={() => { setEditProduct(null); setShowProductModal(true); }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          </div>
          {error && <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-lg border border-red-200">{error}</div>}
          {loadingProducts ? (
            <div className="card p-8 text-center text-gray-500">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">Image</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.length > 0 ? products.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            {product.images && product.images.length > 0 ? (
                              <img 
                                src={product.images[0].url || product.images[0]} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                  e.target.nextSibling.style.display = 'flex'
                                }}
                              />
                            ) : null}
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs" style={{display: product.images && product.images.length > 0 ? 'none' : 'flex'}}>
                              No Image
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">₹{product.price}</td>
                        <td className="px-6 py-4 text-gray-700">{product.stock ?? 0}</td>
                        <td className="px-6 py-4 text-gray-700">{product.category?.name || 'Uncategorized'}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                              onClick={() => { setEditProduct(product); setShowProductModal(true); }}
                              title="Edit Product"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              onClick={() => handleDeleteProduct(product.id)}
                              title="Delete Product"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            <svg className="h-12 w-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <p className="text-lg font-medium">No products found</p>
                            <p className="text-sm">Get started by adding your first product</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        {/* Product Modal */}
        {showProductModal && (
          <>
            {/* Prevent background scroll when modal is open */}
            {typeof document !== 'undefined' && (document.body.style.overflow = 'hidden')}
            <div
              className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/10"
              role="dialog"
              aria-modal="true"
            >
              <div
                className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg min-h-[400px] max-h-[90vh] overflow-y-auto"
                style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
              >
                <h3 className="text-2xl font-bold mb-4">{editProduct ? 'Edit Product' : 'Add Product'}</h3>
                <ProductForm
                  initial={editProduct}
                  onSave={handleSaveProduct}
                  onCancel={() => {
                    setShowProductModal(false);
                    setEditProduct(null);
                    if (typeof document !== 'undefined') document.body.style.overflow = '';
                  }}
                  categories={categories}
                  loadingCategories={loadingCategories}
                />
              </div>
            </div>
          </>
        )}
        {/* Restore scroll when modal closes */}
        </div>
      </div>
    </div>
  )
}
