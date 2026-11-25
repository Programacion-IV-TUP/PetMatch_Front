import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FavoriteService } from '../../../../core/services/favorite.service';
import { PetImagePipe } from '../../../../shared/pipes/pet-image.pipe';

@Component({
    selector: 'app-favorites-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        SkeletonModule,
        TranslocoModule,
        PetImagePipe
    ],
    templateUrl: './favorites-list.component.html'
})
export class FavoritesListComponent implements OnInit {
    favoriteService = inject(FavoriteService);
    private transloco = inject(TranslocoService);

    isLoading = signal<boolean>(true);
    activeLang = toSignal(this.transloco.langChanges$, {
        initialValue: this.transloco.getActiveLang()
    });

    ngOnInit(): void {
        this.fetchFavorites();
    }

    fetchFavorites(): void {
        this.isLoading.set(true);
        this.favoriteService.loadFavorites().subscribe({
            next: () => this.isLoading.set(false),
            error: (err) => {
                console.error('Error loading favorites:', err);
                this.isLoading.set(false);
            }
        });
    }

    onRemoveFavorite(petId: number): void {
        this.favoriteService.toggleFavorite(petId).subscribe({
            error: () => this.fetchFavorites()
        });
    }

    translateEnum(category: 'SPECIES' | 'SIZE' | 'GENDER', value?: string): string {
        this.activeLang();
        if (!value) return '';
        const key = `ENUMS.${category}.${value.toUpperCase()}`;
        const translated = this.transloco.translate(key);
        return translated !== key ? translated : value.charAt(0).toUpperCase() + value.slice(1);
    }
}