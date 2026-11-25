import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pet } from '../models/pet.model';

export interface FavoriteItem {
    id: number;
    pet_id: number;
    pet: Pet;
}

@Injectable({
    providedIn: 'root'
})
export class FavoriteService {
    private http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/favorites`;

    favorites = signal<FavoriteItem[]>([]);
    favoriteIds = signal<Set<number>>(new Set());

    loadFavorites(): Observable<FavoriteItem[]> {
        return this.http.get<FavoriteItem[] | { data: FavoriteItem[] }>(this.API_URL).pipe(
            map(res => Array.isArray(res) ? res : (res?.data ?? [])),
            tap((items) => {
                this.favorites.set(items);
                this.favoriteIds.set(new Set(items.map(item => item.pet_id || item.pet?.id)));
            })
        );
    }

    isFavorite(petId: number): boolean {
        return this.favoriteIds().has(petId);
    }

    toggleFavorite(petId: number): Observable<unknown> {
        const currentlyFav = this.isFavorite(petId);

        // Optimistic UI update
        const updatedIds = new Set(this.favoriteIds());
        if (currentlyFav) {
            updatedIds.delete(petId);
            this.favorites.update(list => list.filter(item => (item.pet_id || item.pet?.id) !== petId));
        } else {
            updatedIds.add(petId);
        }
        this.favoriteIds.set(updatedIds);

        if (currentlyFav) {
            return this.http.delete(`${this.API_URL}/${petId}`);
        }
        return this.http.post(this.API_URL, { pet_id: petId });
    }
}