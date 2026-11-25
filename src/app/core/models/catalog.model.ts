export interface State {
    id: number;
    name: string;
}

export interface City {
    id: number;
    name: string;
    state_id: number;
}

export interface Breed {
    id: number;
    name: string;
    species?: string;
}

export interface Shelter {
    id: number;
    name: string;
    city_id?: number;
    description?: string;
    phone?: string;
    email?: string;
}

export interface AppEnums {
    breed?: {
        species?: string[];
    };
    pet?: {
        genders?: string[];
        sizes?: string[];
        statuses?: string[];
    };
    adoption_application?: {
        statuses?: string[];
    };
    user?: {
        roles?: string[];
    };
}