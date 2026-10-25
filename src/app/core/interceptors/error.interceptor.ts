import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { TokenStorageService } from '../services/token-storage.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService);
    const tokenStorage = inject(TokenStorageService);
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An unexpected error occurred. Please try again.';

            if (error.status === 401) {
                tokenStorage.clearSession();
                router.navigate(['/auth/login']);
                errorMessage = 'Your session has expired. Please log in again.';
            } else if (error.status === 403) {
                errorMessage = 'You do not have permission to execute this action.';
            } else if (error.status === 422 && error.error?.errors) {
                errorMessage = Array.isArray(error.error.errors)
                    ? error.error.errors.join('. ')
                    : 'Validation failed. Please review your input.';
            } else if (error.status >= 500) {
                errorMessage = 'Server error. Please try again later.';
            }

            messageService.add({
                severity: 'error',
                summary: `Error ${error.status || 'Network'}`,
                detail: errorMessage,
                life: 5000
            });

            return throwError(() => error);
        })
    );
};