import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Pet, PetFilters } from '../models/pet.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PetService {
    private http = inject(HttpClient);
    private readonly API_URL = environment.apiUrl;

    private unwrap<T>(response: T | { data: T }): T {
        return (response && typeof response === 'object' && 'data' in response)
            ? response.data
            : response;
    }

    // Fetch filtered list of available pets
    getPets(filters?: PetFilters): Observable<Pet[]> {
        let params = new HttpParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    params = params.set(key, String(value));
                }
            });
        }

        return this.http.get<Pet[] | { data: Pet[] }>(`${this.API_URL}/pets`, { params }).pipe(
            map(res => this.unwrap(res))
        );
    }

    // Fetch single pet detail including medical record
    getPetById(id: number): Observable<Pet> {
        return this.http.get<Pet | { data: Pet }>(`${this.API_URL}/pets/${id}`).pipe(
            map(res => this.unwrap(res))
        );
    }
}