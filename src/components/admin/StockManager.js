'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Package, Plus, Minus, Edit, AlertTriangle, CheckCircle } from 'lucide-react';

const StockManager = ({ product, onStockUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [stockValue, setStockValue] = useState('');
  const [operation, setOperation] = useState('set');
  const [loading, setLoading] = useState(false);

  const getStockStatus = (stock) => {
    if (stock === 0) return { status: 'out_of_stock', color: 'text-red-600 bg-red-50', label: 'Out of Stock' };
    if (stock < 5) return { status: 'low_stock', color: 'text-orange-600 bg-orange-50', label: 'Low Stock' };
    return { status: 'in_stock', color: 'text-green-600 bg-green-50', label: 'In Stock' };
  };

  const handleStockUpdate = async () => {
    if (!stockValue || stockValue < 0) {
      toast.error('Please enter a valid stock value');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${product.id}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stock: parseInt(stockValue),
          operation
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to update stock');
      }

      const result = await response.json();
      
      // Success notification
      let message;
      switch (operation) {
        case 'add':
          message = `Added ${stockValue} items. Stock: ${result.previousStock} → ${result.product.stock}`;
          break;
        case 'subtract':
          message = `Removed ${stockValue} items. Stock: ${result.previousStock} → ${result.product.stock}`;
          break;
        default:
          message = `Stock updated to ${result.product.stock}`;
      }
      
      toast.success(message);
      
      // Reset form
      setStockValue('');
      setIsEditing(false);
      
      // Notify parent component
      if (onStockUpdate) {
        onStockUpdate(result.product);
      }

    } catch (error) {
      console.error('Stock update error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Current Stock Display */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-gray-900">Stock Management</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color}`}>
          {stockStatus.label}
        </div>
      </div>

      {/* Stock Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{product.stock}</div>
          <div className="text-sm text-gray-600">Current Stock</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{product.metrics?.totalSold || 0}</div>
          <div className="text-sm text-gray-600">Total Sold</div>
        </div>
      </div>

      {/* Stock Update Form */}
      {isEditing ? (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex gap-2">
            <button
              onClick={() => setOperation('set')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                operation === 'set'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Set
            </button>
            <button
              onClick={() => setOperation('add')}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 ${
                operation === 'add'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
            <button
              onClick={() => setOperation('subtract')}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 ${
                operation === 'subtract'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Minus className="h-4 w-4" />
              Remove
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              value={stockValue}
              onChange={(e) => setStockValue(e.target.value)}
              placeholder={`Enter quantity to ${operation}`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-golden focus:border-transparent"
            />
            <button
              onClick={handleStockUpdate}
              disabled={loading || !stockValue}
              className="px-4 py-2 bg-golden hover:bg-golden-dark text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Update
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setStockValue('');
                setOperation('set');
              }}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-golden hover:bg-golden-dark text-white rounded-md text-sm font-medium"
          >
            <Edit className="h-4 w-4" />
            Update Stock
          </button>
        </div>
      )}

      {/* Stock Alerts */}
      {product.stock === 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Out of Stock</span>
          </div>
          <p className="text-sm text-red-700 mt-1">
            This product is currently out of stock and not available for purchase.
          </p>
        </div>
      )}

      {product.stock > 0 && product.stock < 5 && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 text-orange-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Low Stock Alert</span>
          </div>
          <p className="text-sm text-orange-700 mt-1">
            Only {product.stock} items remaining. Consider restocking soon.
          </p>
        </div>
      )}
    </div>
  );
};

export default StockManager;
