import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { PetService } from '../../../../core/services/pet.service';
import { AuthService } from '../../../../core/services/auth.service';
import { FavoriteService } from '../../../../core/services/favorite.service';
import { Pet } from '../../../../core/models/pet.model';
import { PetImagePipe } from '../../../../shared/pipes/pet-image.pipe';

@Component({
    selector: 'app-pet-detail',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        ButtonModule,
        SkeletonModule,
        TranslocoModule,
        PetImagePipe
    ],
    templateUrl: './pet-detail.component.html'
})
export class PetDetailComponent implements OnInit {
    // Route param bound automatically via withComponentInputBinding()
    id = input.required<string>();

    private petService = inject(PetService);
    private router = inject(Router);
    private transloco = inject(TranslocoService);
    authService = inject(AuthService);
    favoriteService = inject(FavoriteService);

    pet = signal<Pet | null>(null);
    isLoading = signal<boolean>(true);
    hasError = signal<boolean>(false);

    activeLang = toSignal(this.transloco.langChanges$, {
        initialValue: this.transloco.getActiveLang()
    });

    ngOnInit(): void {
        const petId = Number(this.id());
        if (!petId) {
            this.router.navigate(['/pets']);
            return;
        }

        if (this.authService.isAuthenticated()) {
            this.favoriteService.loadFavorites().subscribe();
        }

        this.loadPet(petId);
    }

    private loadPet(petId: number): void {
        this.isLoading.set(true);
        this.hasError.set(false);

        this.petService.getPetById(petId).subscribe({
            next: (data) => {
                this.pet.set(data);
                this.isLoading.set(false);
            },
            error: () => {
                this.hasError.set(true);
                this.isLoading.set(false);
            }
        });
    }

    onToggleFavorite(): void {
        const currentPet = this.pet();
        if (!currentPet) return;

        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/auth/login']);
            return;
        }

        this.favoriteService.toggleFavorite(currentPet.id).subscribe({
            error: () => this.favoriteService.loadFavorites().subscribe()
        });
    }

    onApplyAdoption(): void {
        const currentPet = this.pet();
        if (!currentPet) return;

        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/auth/login']);
            return;
        }

        this.router.navigate(['/applications/new'], {
            queryParams: { pet_id: currentPet.id }
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