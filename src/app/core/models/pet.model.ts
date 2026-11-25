export interface Pet {
    id: number;
    name: string;
    species: string;
    breed_id?: number;
    breed_name?: string;
    gender: string;
    size: string;
    age?: number;
    age_unit?: string;
    description?: string;
    status?: string;
    image_url?: string;
    images?: string[];
    shelter_id?: number;
    shelter_name?: string;
    city_name?: string;
    state_name?: string;
    is_favorite?: boolean;
}

export interface PetFilters {
    species?: string | null;
    breed_id?: number | null;
    gender?: string | null;
    size?: string | null;
    state_id?: number | null;
    city_id?: number | null;
    shelter_id?: number | null;
}