export interface UserAddress {
    street?: string;
    number?: string;
    city_id?: number;
}

export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name?: string;
    phone?: string;
    address?: UserAddress;
    role?: 'adopter' | 'shelter_manager' | 'admin';
    active?: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    status: number;
    data: {
        token: string;
        user: User;
    };
}

export interface RegisterPayload {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
}