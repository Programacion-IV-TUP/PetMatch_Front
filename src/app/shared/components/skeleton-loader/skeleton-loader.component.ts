import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  template: `
    <div class="w-full p-4 space-y-4">
      <ng-container *ngIf="type === 'table'">
        <p-skeleton width="100%" height="3rem" styleClass="mb-2 rounded-lg"></p-skeleton>
        <p-skeleton width="100%" height="2.5rem" *ngFor="let i of [1, 2, 3, 4]" styleClass="mb-2"></p-skeleton>
      </ng-container>

      <ng-container *ngIf="type === 'card'">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div *ngFor="let i of [1, 2, 3]" class="border border-gray-200 rounded-xl p-4 space-y-3 bg-white shadow-sm">
            <p-skeleton width="100%" height="10rem" styleClass="rounded-lg"></p-skeleton>
            <p-skeleton width="60%" height="1.5rem"></p-skeleton>
            <p-skeleton width="40%" height="1rem"></p-skeleton>
          </div>
        </div>
      </ng-container>
    </div>
  `
})
export class SkeletonLoaderComponent {
  @Input() type: 'table' | 'card' = 'card';
}