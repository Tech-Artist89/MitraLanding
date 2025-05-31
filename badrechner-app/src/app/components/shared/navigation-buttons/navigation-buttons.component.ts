// src/app/components/shared/navigation-buttons/navigation-buttons.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation-buttons',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="navigation-buttons">
      <button 
        type="button" 
        class="btn btn-outline-secondary" 
        [disabled]="!canGoBack"
        (click)="goBack.emit()"
        *ngIf="canGoBack">
        <i class="bi bi-arrow-left"></i> Zurück
      </button>
      
      <div class="spacer"></div>
      
      <button 
        type="button" 
        class="btn btn-primary" 
        [disabled]="!canGoNext"
        (click)="goNext.emit()"
        *ngIf="!isLastPage">
        Weiter <i class="bi bi-arrow-right"></i>
      </button>
      
      <button 
        type="button" 
        class="btn btn-success" 
        [disabled]="!canSubmit"
        (click)="submit.emit()"
        *ngIf="isLastPage">
        <i class="bi bi-send"></i> Kostenlose Beratung anfordern
      </button>
    </div>
  `,
  styles: [`
    .navigation-buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 30px;
      padding: 20px 0;
      border-top: 1px solid #dee2e6;
    }

    .spacer {
      flex: 1;
    }

    .btn {
      padding: 12px 24px;
      font-weight: 600;
      border-radius: 6px;
    }

    .btn i {
      margin: 0 4px;
    }

    @media (max-width: 768px) {
      .navigation-buttons {
        flex-direction: column;
        gap: 10px;
      }
      
      .spacer {
        display: none;
      }
      
      .btn {
        width: 100%;
      }
    }
  `]
})
export class NavigationButtonsComponent {
  @Input() canGoBack: boolean = false;
  @Input() canGoNext: boolean = true;
  @Input() canSubmit: boolean = true;
  @Input() isLastPage: boolean = false;
  
  @Output() goBack = new EventEmitter<void>();
  @Output() goNext = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
}