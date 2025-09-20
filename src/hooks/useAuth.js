"use client";

import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { useProductStore } from '@/store/productStore';

export function useAuth() {
  const { data: session, status, update } = useSession();
  const { clearUser } = useProductStore();

  const signOut = async () => {
    try {
      await nextAuthSignOut({ redirect: false });
      clearUser();
      toast.success('Signed out successfully!');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out.');
    }
  };

  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated' && !!session?.user,
    status,
    signOut,
    refreshSession: update,
  };
}
