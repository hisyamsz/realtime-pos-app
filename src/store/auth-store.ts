import { User } from '@supabase/supabase-js';
import { createStore } from 'zustand';
import { Profile } from '@/types/auth';
import { INITIAL_STATE_PROFILE } from '@/constants/auth-constants';

export interface AuthState {
  user: User | null;
  profile: Profile;
}

export interface AuthActions {
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile) => void;
  setAuth: (profile: Profile, user?: User | null) => void;
}

export type AuthStore = AuthState & AuthActions;

export const defaultInitState: AuthState = {
  user: null,
  profile: INITIAL_STATE_PROFILE,
};

export const createAuthStore = (initState: AuthState = defaultInitState) => {
  return createStore<AuthStore>()((set) => ({
    ...initState,
    setUser: (user) => set({ user }),
    setProfile: (profile) => set({ profile }),
    setAuth: (profile, user = null) => set({ profile, user }),
  }));
};
