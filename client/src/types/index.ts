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
    sprite_front: string;
    sprite_back: string
  }

  export interface Organization {
    id: number;
    name: string;
  }