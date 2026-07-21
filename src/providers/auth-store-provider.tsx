'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';
import { User } from '@supabase/supabase-js';
import {
  createAuthStore,
  type AuthStore,
  defaultInitState,
} from '@/store/auth-store';
import { Profile } from '@/types/auth';

export type AuthStoreApi = ReturnType<typeof createAuthStore>;

export const AuthStoreContext = createContext<AuthStoreApi | undefined>(
  undefined,
);

export interface AuthStoreProviderProps {
  children: ReactNode;
  initialProfile?: Profile;
  initialUser?: User | null;
}

export const AuthStoreProvider = ({
  children,
  initialProfile,
  initialUser,
}: AuthStoreProviderProps) => {
  const storeRef = useRef<AuthStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createAuthStore({
      ...defaultInitState,
      profile: initialProfile ?? defaultInitState.profile,
      user: initialUser ?? defaultInitState.user,
    });
  }

  return (
    <AuthStoreContext.Provider value={storeRef.current}>
      {children}
    </AuthStoreContext.Provider>
  );
};

export const useAuthStore = <T,>(selector: (store: AuthStore) => T): T => {
  const authStoreContext = useContext(AuthStoreContext);

  if (!authStoreContext) {
    throw new Error('useAuthStore must be used within AuthStoreProvider');
  }

  return useStore(authStoreContext, selector);
};
