'use client';

import { toast } from 'react-hot-toast';
import { toastSuccess, toastError, toastInfo, toastWarning } from '@/utils/toast';

export default function TestToastPage() {
  const showSuccessToast = () => {
    toastSuccess('Account created successfully! 🎉');
  };

  const showErrorToast = () => {
    toastError('Invalid email address. Please check and try again.');
  };

  const showInfoToast = () => {
    toastInfo('Email validation in progress...');
  };

  const showWarningToast = () => {
    toastWarning('Please verify your email address before proceeding.');
  };

  const showSimpleToast = () => {
    toast('Simple toast notification', {
      icon: '🧶',
      style: {
        borderRadius: '8px',
        background: '#f59e0b',
        color: '#fff',
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🧶 Toast Notification Testing
          </h1>
          
          <div className="text-center mb-8">
            <p className="text-gray-600">
              Toast notifications are now positioned at <strong>bottom-right</strong> of the screen.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Click any button below to test different toast types.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={showSuccessToast}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              ✅ Success Toast
            </button>

            <button
              onClick={showErrorToast}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              ❌ Error Toast
            </button>

            <button
              onClick={showInfoToast}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              ℹ️ Info Toast
            </button>

            <button
              onClick={showWarningToast}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              ⚠️ Warning Toast
            </button>

            <button
              onClick={showSimpleToast}
              className="bg-golden hover:bg-golden-dark text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              🧶 Custom Toast
            </button>

            <button
              onClick={() => {
                showSuccessToast();
                setTimeout(() => showErrorToast(), 500);
                setTimeout(() => showInfoToast(), 1000);
                setTimeout(() => showWarningToast(), 1500);
              }}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              🎪 Show All
            </button>
          </div>

          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-2">Toast Features:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Position: Bottom-Right corner</li>
              <li>• Styled with dark theme and rounded corners</li>
              <li>• Different icons for success (green) and error (red)</li>
              <li>• Auto-dismiss after 3 seconds</li>
              <li>• Stack nicely when multiple toasts appear</li>
              <li>• Smooth animations and transitions</li>
            </ul>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              After testing, you can delete this page: <code>src/app/test-toast/page.js</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}