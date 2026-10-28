import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TranslocoPipe } from '@ngneat/transloco';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonModule, TranslocoPipe],
  template: `
    <div class="flex flex-col items-center justify-center p-8 text-center bg-gray-50 border border-dashed border-gray-300 rounded-xl my-6">
      <i [class]="iconClass + ' text-5xl text-gray-400 mb-3'"></i>
      <h3 class="text-lg font-semibold text-gray-700 mb-1">
        {{ (titleKey | transloco) || ('COMMON.EMPTY_TITLE' | transloco) }}
      </h3>
      <p class="text-sm text-gray-500 mb-4 max-w-sm">
        {{ (descriptionKey | transloco) || ('COMMON.EMPTY_DESC' | transloco) }}
      </p>
      <p-button 
        *ngIf="actionLabelKey" 
        [label]="actionLabelKey | transloco" 
        icon="pi pi-plus" 
        styleClass="p-button-sm p-button-outlined"
        (onClick)="actionClicked.emit()">
      </p-button>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() titleKey?: string;
  @Input() descriptionKey?: string;
  @Input() iconClass: string = 'pi pi-folder-open';
  @Input() actionLabelKey?: string;

  @Output() actionClicked = new EventEmitter<void>();
}