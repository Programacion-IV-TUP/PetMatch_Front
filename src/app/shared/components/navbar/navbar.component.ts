import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        TranslocoModule,
        MenuModule
    ],
    templateUrl: './navbar.component.html'
})
export class NavbarComponent {
    authService = inject(AuthService);
    private transloco = inject(TranslocoService);

    currentLang = signal<string>(this.transloco.getActiveLang() || 'es');
    private activeLang = toSignal(this.transloco.langChanges$, { initialValue: this.currentLang() });

    userMenuItems = computed<MenuItem[]>(() => {
        this.activeLang();
        return [
            {
                label: this.transloco.translate('NAV.PROFILE'),
                icon: 'pi pi-user',
                routerLink: '/profile'
            },
            {
                label: this.transloco.translate('NAV.APPLICATIONS'),
                icon: 'pi pi-file-check',
                routerLink: '/applications'
            },
            { separator: true },
            {
                label: this.transloco.translate('NAV.LOGOUT'),
                icon: 'pi pi-sign-out',
                command: () => this.authService.logout()
            }
        ];
    });

    toggleLanguage(): void {
        const nextLang = this.currentLang() === 'es' ? 'en' : 'es';
        this.transloco.setActiveLang(nextLang);
        this.currentLang.set(nextLang);
    }
}