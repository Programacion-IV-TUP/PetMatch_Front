import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [RouterOutlet, NavbarComponent],
    template: `
        <div class="min-h-screen flex flex-col bg-stone-50 text-stone-900 pb-20 md:pb-20">
            <app-navbar></app-navbar>

            <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <router-outlet></router-outlet>
            </main>

            <footer class="bg-white border-t border-stone-200 mt-auto">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
                    <div class="flex items-center gap-2 font-heading font-bold text-stone-700">
                        <i class="pi pi-heart-fill text-orange-500"></i>
                        <span>PetMatch</span>
                    </div>
                    <p>© 2026 PetMatch — Conectando mascotas con hogares responsables.</p>
                </div>
            </footer>
        </div>
    `
})
export class MainLayoutComponent { }