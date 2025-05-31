// src/app/components/shared/progress-indicator/progress-indicator.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-container">
      <div class="progress-header">
        <h6 class="progress-title">Schritt {{ currentStep }} von {{ totalSteps }}</h6>
        <span class="progress-percentage">{{ progressPercentage }}%</span>
      </div>
      <div class="progress">
        <div 
          class="progress-bar progress-bar-striped" 
          role="progressbar" 
          [style.width.%]="progressPercentage"
          [attr.aria-valuenow]="progressPercentage"
          aria-valuemin="0" 
          aria-valuemax="100">
        </div>
      </div>
      <div class="step-indicators">
        <div 
          *ngFor="let step of steps; let i = index"
          class="step-indicator"
          [class.completed]="i < currentStep - 1"
          [class.current]="i === currentStep - 1">
          <div class="step-circle">
            <i class="bi bi-check" *ngIf="i < currentStep - 1"></i>
            <span *ngIf="i >= currentStep - 1">{{ i + 1 }}</span>
          </div>
          <span class="step-label">{{ step }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .progress-container {
      margin-bottom: 30px;
      background: white;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #dee2e6;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .progress-title {
      margin: 0;
      color: #333;
      font-weight: 600;
    }

    .progress-percentage {
      font-weight: 600;
      color: #0066cc;
    }

    .progress {
      height: 8px;
      margin-bottom: 20px;
      background-color: #e9ecef;
      border-radius: 4px;
    }

    .progress-bar {
      background-color: #0066cc;
      transition: width 0.3s ease;
    }

    .step-indicators {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
    }

    .step-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      min-width: 120px;
    }

    .step-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      margin-bottom: 8px;
      transition: all 0.3s ease;
      border: 2px solid #dee2e6;
      background: white;
      color: #666;
    }

    .step-indicator.completed .step-circle {
      background: #28a745;
      border-color: #28a745;
      color: white;
    }

    .step-indicator.current .step-circle {
      background: #0066cc;
      border-color: #0066cc;
      color: white;
    }

    .step-label {
      font-size: 12px;
      text-align: center;
      color: #666;
      font-weight: 500;
    }

    .step-indicator.current .step-label {
      color: #0066cc;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .step-indicators {
        justify-content: center;
      }
      
      .step-indicator {
        min-width: 80px;
      }
      
      .step-circle {
        width: 30px;
        height: 30px;
        font-size: 12px;
      }
      
      .step-label {
        font-size: 10px;
      }
    }
  `]
})
export class ProgressIndicatorComponent {
  @Input() currentStep: number = 1;
  @Input() totalSteps: number = 5;
  @Input() steps: string[] = [
    'Ausstattung',
    'Qualität',
    'Fliesen',
    'Heizung',
    'Kontakt'
  ];

  get progressPercentage(): number {
    return Math.round((this.currentStep / this.totalSteps) * 100);
  }
}