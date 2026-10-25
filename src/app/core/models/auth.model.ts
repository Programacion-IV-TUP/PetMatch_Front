export interface User {
    id: number;
    email_address: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
    role: 'adopter' | 'shelter_manager' | 'admin';
    active: boolean;
}

export interface LoginCredentials {
    email_address: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface RegisterPayload {
    user: {
        email_address: string;
        password: string;
        password_confirmation: string;
        first_name: string;
        last_name: string;
        phone_number?: string;
    };
}