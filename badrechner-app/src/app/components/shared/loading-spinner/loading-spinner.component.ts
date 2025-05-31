import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-overlay" *ngIf="isLoading">
      <div class="loading-content">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 mb-0">{{ message }}</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .loading-content {
      background: white;
      padding: 30px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .spinner-border {
      width: 3rem;
      height: 3rem;
    }

    p {
      color: #666;
      font-weight: 500;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() isLoading: boolean = false;
  @Input() message: string = 'Wird verarbeitet...';
}

// Updated page-five.component.ts mit Loading Spinner
// Fügen Sie LoadingSpinnerComponent zu den Imports hinzu und verwenden Sie es:

/*
In Template:
<app-loading-spinner 
  [isLoading]="isSubmitting" 
  [message]="'Ihre Anfrage wird versendet...'">
</app-loading-spinner>

In Component:
isSubmitting: boolean = false;

async onSubmit(): Promise<void> {
  // ... validation code ...

  this.isSubmitting = true;
  
  try {
    // ... send email code ...
  } finally {
    this.isSubmitting = false;
  }
    }
    */