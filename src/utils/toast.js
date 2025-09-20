import { toast } from 'react-hot-toast'

// Custom toast functions to handle different toast types consistently

export const toastSuccess = (message, options = {}) => {
  return toast.success(message, {
    duration: 4000,
    ...options
  })
}

export const toastError = (message, options = {}) => {
  return toast.error(message, {
    duration: 5000,
    ...options
  })
}

export const toastInfo = (message, options = {}) => {
  return toast(message, {
    icon: 'ℹ️',
    duration: 3000,
    style: {
      borderRadius: '8px',
      background: '#dbeafe',
      color: '#1e40af',
      border: '1px solid #3b82f6'
    },
    ...options
  })
}

export const toastWarning = (message, options = {}) => {
  return toast(message, {
    icon: '⚠️',
    duration: 4000,
    style: {
      borderRadius: '8px',
      background: '#fef3c7',
      color: '#92400e',
      border: '1px solid #f59e0b'
    },
    ...options
  })
}

export const toastLoading = (message, options = {}) => {
  return toast.loading(message, {
    style: {
      borderRadius: '8px',
    },
    ...options
  })
}