import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { AppEnums, Breed, City, Shelter, State } from '../models/catalog.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CatalogService {
    private http = inject(HttpClient);
    private readonly API_URL = environment.apiUrl;

    // Cached signals for static catalogs
    states = signal<State[]>([]);
    cities = signal<City[]>([]);
    breeds = signal<Breed[]>([]);
    shelters = signal<Shelter[]>([]);
    enums = signal<AppEnums>({});

    // Helper to unwrap Rails { status, data } envelope if present
    private unwrap<T>(response: T | { data: T }): T {
        return (response && typeof response === 'object' && 'data' in response)
            ? response.data
            : response;
    }

    loadStates(): Observable<State[]> {
        return this.http.get<State[] | { data: State[] }>(`${this.API_URL}/states`).pipe(
            map(res => this.unwrap(res)),
            tap(data => this.states.set(data))
        );
    }

    loadCities(stateId?: number | null): Observable<City[]> {
        let params = new HttpParams();
        if (stateId) {
            params = params.set('state_id', stateId.toString());
        }

        return this.http.get<City[] | { data: City[] }>(`${this.API_URL}/cities`, { params }).pipe(
            map(res => this.unwrap(res)),
            tap(data => this.cities.set(data))
        );
    }

    loadBreeds(): Observable<Breed[]> {
        return this.http.get<Breed[] | { data: Breed[] }>(`${this.API_URL}/breeds`).pipe(
            map(res => this.unwrap(res)),
            tap(data => this.breeds.set(data))
        );
    }

    loadShelters(): Observable<Shelter[]> {
        return this.http.get<Shelter[] | { data: Shelter[] }>(`${this.API_URL}/shelters`).pipe(
            map(res => this.unwrap(res)),
            tap(data => this.shelters.set(data))
        );
    }

    loadEnums(): Observable<AppEnums> {
        return this.http.get<AppEnums | { data: AppEnums }>(`${this.API_URL}/enums`).pipe(
            map(res => this.unwrap(res)),
            tap(data => this.enums.set(data))
        );
    }
}