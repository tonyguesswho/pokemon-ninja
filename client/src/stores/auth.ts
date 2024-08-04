// src/stores/auth.ts
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import api, {type  UserProfile } from '../services/api';

export interface AuthUser extends UserProfile {
  token: string;
}

interface AuthStore {
  subscribe: Writable<AuthUser | null>['subscribe'];
  login: (token: string) => Promise<void>;
  logout: (callback?: () => void) => void;
  getToken: () => string | null;
}

function createAuthStore(): AuthStore {
  const { subscribe, set } = writable<AuthUser | null>(getStoredAuth());

  return {
    subscribe,
    login: async (token: string) => {
      localStorage.setItem('auth_token', token);
      try {
        const response = await api.getProfile();
        const user: AuthUser = { ...response.data, token };
        localStorage.setItem('auth', JSON.stringify(user));
        set(user);
      } catch (error) {
        console.error('Failed to fetch user profile', error);
        localStorage.removeItem('auth_token');
        set(null);
      }
    },
    logout: (callback?: () => void) => {
        localStorage.removeItem('auth');
        localStorage.removeItem('auth_token');
        set(null);
        if (callback) {
          callback();
        }
      },
    getToken: () => localStorage.getItem('auth_token')
  };
}

function getStoredAuth(): AuthUser | null {
  const storedAuth = localStorage.getItem('auth');
  if (storedAuth) {
    try {
      return JSON.parse(storedAuth);
    } catch (error) {
      console.error('Failed to parse stored auth data', error);
    }
  }
  return null;
}

export const auth = createAuthStore();