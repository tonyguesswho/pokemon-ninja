import axios, { type AxiosInstance } from 'axios';
import type { Pokemon, Organization } from '../types';
import { auth } from '../stores/auth';

const api: AxiosInstance = axios.create({
  baseURL:  import.meta.env.VITE_API_URL || 'http://localhost:3000/'
});

api.interceptors.request.use((config) => {
    const token = auth.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export interface UserProfile {
    id: number;
    email: string;
    organization_id: number;
    organization_name: string;
  }


  export interface PokemonResponse {
    pokemons: Pokemon[];
    total: number;
  }

export default {
  login: (email: string, password: string) =>
    api.post<{ access_token: string }>('/auth/login', { email, password }),
  register: (email: string, password: string, organizationId: number) =>
    api.post<{ access_token: string }>('/auth/register', { email, password, organizationId }),
  getOrganizations: () =>
    api.get<Organization[]>('/organizations'),
  getPokemons: (page: number = 1, limit: number = 10) =>
    api.get<PokemonResponse>(`/pokemon?page=${page}&limit=${limit}`),
  toggleFavorite: (pokemonId: number) =>
    api.post<{ isFavorited: boolean }>(`/pokemon/${pokemonId}/toggle-favorite`),
  getProfile: () => api.get<UserProfile>('/auth/profile'),
};