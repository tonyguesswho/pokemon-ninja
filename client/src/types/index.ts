export interface User {
    id: number;
    email: string;
    token: string;
    organizationId: number;
  }

  export interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    is_favorite: boolean;
  }

  export interface Organization {
    id: number;
    name: string;
  }