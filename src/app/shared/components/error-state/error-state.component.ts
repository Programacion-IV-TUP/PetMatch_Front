import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TranslocoPipe } from '@ngneat/transloco';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [ButtonModule, TranslocoPipe],
  templateUrl: './error-state.component.html',
  styleUrl: './error-state.component.scss'
})
export class ErrorStateComponent {
  @Input() titleKey?: string;
  @Input() messageKey?: string;

  @Output() retry = new EventEmitter<void>();
}