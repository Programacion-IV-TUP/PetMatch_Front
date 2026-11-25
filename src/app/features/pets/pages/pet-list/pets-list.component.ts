import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { CatalogService } from '../../../../core/services/catalog.service';
import { PetService } from '../../../../core/services/pet.service';
import { FavoriteService } from '../../../../core/services/favorite.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Pet, PetFilters } from '../../../../core/models/pet.model';
import { PetImagePipe } from '../../../../shared/pipes/pet-image.pipe';

interface SelectOption {
    label: string;
    value: string | number;
}

@Component({
    selector: 'app-pets-list',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        SelectModule,
        ButtonModule,
        DrawerModule,
        SkeletonModule,
        TranslocoModule,
        PetImagePipe
    ],
    templateUrl: './pets-list.component.html'
})
export class PetsListComponent implements OnInit {
    private fb = inject(FormBuilder);
    private transloco = inject(TranslocoService);
    private petService = inject(PetService);
    private router = inject(Router);
    catalogService = inject(CatalogService);
    favoriteService = inject(FavoriteService);
    authService = inject(AuthService);
    activeLang = toSignal(this.transloco.langChanges$, { initialValue: this.transloco.getActiveLang() });

    // State signals
    pets = signal<Pet[]>([]);
    isLoading = signal<boolean>(true);
    mobileFiltersOpen = signal<boolean>(false);
    desktopMoreFiltersOpen = signal<boolean>(false);

    // Filter reactive form matching GET /pets query params
    filterForm = this.fb.group({
        state_id: [null as number | null],
        city_id: [null as number | null],
        species: [null as string | null],
        breed_id: [null as number | null],
        size: [null as string | null],
        gender: [null as string | null],
        shelter_id: [null as number | null]
    });


    // Track form value changes as a signal so computed() reacts immediately
    private filterValues = toSignal(this.filterForm.valueChanges, {
        initialValue: this.filterForm.getRawValue()
    });

    hasAdvancedFilters = computed<boolean>(() => {
        const val = this.filterValues();
        return !!(val?.breed_id || val?.shelter_id);
    });

    // Filter breeds dynamically based on selected species (in-memory)
    filteredBreeds = computed(() => {
        const selectedSpecies = this.filterValues()?.species;
        const allBreeds = this.catalogService.breeds();

        if (!selectedSpecies) {
            return allBreeds;
        }

        return allBreeds.filter(breed => breed.species === selectedSpecies);
    });

    // Computed options from backend /enums
    speciesOptions = computed<SelectOption[]>(() => {
        this.activeLang();
        const list = this.catalogService.enums()?.breed?.species || [];
        return list.map(value => ({
            value,
            label: this.translateEnum('SPECIES', value)
        }));
    });

    sizeOptions = computed<SelectOption[]>(() => {
        this.activeLang();
        const list = this.catalogService.enums()?.pet?.sizes || [];
        return list.map(value => ({
            value,
            label: this.translateEnum('SIZE', value)
        }));
    });

    genderOptions = computed<SelectOption[]>(() => {
        this.activeLang();
        const list = this.catalogService.enums()?.pet?.genders || [];
        return list.map(value => ({
            value,
            label: this.translateEnum('GENDER', value)
        }));
    });

    onToggleFavorite(petId: number): void {
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/auth/login']);
            return;
        }
        this.favoriteService.toggleFavorite(petId).subscribe({
            error: () => this.favoriteService.loadFavorites().subscribe()
        });
    }

    // Helper to translate enum keys using Transloco with capitalized fallback
    translateEnum(category: 'SPECIES' | 'SIZE' | 'GENDER', value?: string): string {
        if (!value) return '';
        const key = `ENUMS.${category}.${value.toUpperCase()}`;
        const translated = this.transloco.translate(key);
        return translated !== key ? translated : value.charAt(0).toUpperCase() + value.slice(1);
    }

    ngOnInit(): void {
        this.loadInitialCatalogs();
        this.setupCascadeListeners();
        this.fetchPets();

        if (this.authService.isAuthenticated()) {
            this.favoriteService.loadFavorites().subscribe();
        }
    }

    private loadInitialCatalogs(): void {
        this.catalogService.loadStates().subscribe();
        this.catalogService.loadBreeds().subscribe();
        this.catalogService.loadShelters().subscribe();
        this.catalogService.loadEnums().subscribe();
    }

    // Listen for state_id and species changes to handle dependent fields
    private setupCascadeListeners(): void {
        this.filterForm.get('state_id')?.valueChanges.subscribe((stateId) => {
            this.filterForm.patchValue({ city_id: null }, { emitEvent: false });
            if (stateId) {
                this.catalogService.loadCities(stateId).subscribe();
            } else {
                this.catalogService.cities.set([]);
            }
        });

        this.filterForm.get('species')?.valueChanges.subscribe((species) => {
            const currentBreedId = this.filterForm.get('breed_id')?.value;
            if (!currentBreedId) return;

            if (!species) return;

            const currentBreed = this.catalogService.breeds().find(b => b.id === currentBreedId);
            if (currentBreed && currentBreed.species !== species) {
                this.filterForm.patchValue({ breed_id: null }, { emitEvent: false });
            }
        });
    }
    fetchPets(): void {
        this.isLoading.set(true);
        const filters = this.filterForm.getRawValue() as PetFilters;

        this.petService.getPets(filters).subscribe({
            next: (data) => {
                this.pets.set(data);
                this.isLoading.set(false);
                this.mobileFiltersOpen.set(false);
            },
            error: (err) => {
                console.error('Error fetching pets:', err);
                this.isLoading.set(false);
            }
        });
    }

    clearFilters(): void {
        this.filterForm.reset();
        this.catalogService.cities.set([]);
        this.fetchPets();
    }
}