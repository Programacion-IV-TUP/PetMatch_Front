import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
            },
            {
                path: 'register',
                loadComponent: () => import('./features/auth/pages/register/register.component').then(m => m.RegisterComponent)
            }
        ]
    },
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'pets',
                pathMatch: 'full'
            },
            {
                path: 'pets',
                loadComponent: () => import('./features/pets/pages/pet-list/pets-list.component').then(m => m.PetsListComponent)
            },
            {
                path: 'pets/:id',
                loadComponent: () => import('./features/pets/pages/pet-detail/pet-detail.component').then(m => m.PetDetailComponent)
            },
            {
                path: 'favorites',
                canActivate: [authGuard],
                loadComponent: () => import('./features/favorites/pages/favorite-list/favorites-list.component').then(m => m.FavoritesListComponent)
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'pets'
    }
];