import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TranslocoPipe } from '@ngneat/transloco';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [ButtonModule, TranslocoPipe],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
  @Input() titleKey?: string;
  @Input() descriptionKey?: string;
  @Input() iconClass: string = 'pi pi-folder-open';
  @Input() actionLabelKey?: string;

  @Output() actionClicked = new EventEmitter<void>();
}