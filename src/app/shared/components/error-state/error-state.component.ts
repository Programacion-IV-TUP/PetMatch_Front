import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TranslocoPipe } from '@ngneat/transloco';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule, ButtonModule, TranslocoPipe],
  template: `
    <div class="flex flex-col items-center justify-center p-6 text-center bg-red-50 border border-red-200 rounded-xl my-6">
      <i class="pi pi-exclamation-triangle text-4xl text-red-500 mb-2"></i>
      <h3 class="text-md font-semibold text-red-800 mb-1">
        {{ (titleKey | transloco) || ('COMMON.ERROR_TITLE' | transloco) }}
      </h3>
      <p class="text-sm text-red-600 mb-4 max-w-md">
        {{ (messageKey | transloco) || ('COMMON.ERROR_DESC' | transloco) }}
      </p>
      <p-button 
        [label]="'COMMON.RETRY' | transloco" 
        icon="pi pi-refresh" 
        styleClass="p-button-outlined p-button-danger p-button-sm"
        (onClick)="retry.emit()">
      </p-button>
    </div>
  `
})
export class ErrorStateComponent {
  @Input() titleKey?: string;
  @Input() messageKey?: string;

  @Output() retry = new EventEmitter<void>();
}