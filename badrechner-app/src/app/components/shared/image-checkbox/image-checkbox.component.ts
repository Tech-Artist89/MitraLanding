// src/app/components/shared/image-checkbox/image-checkbox.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-checkbox',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="image-checkbox-container" [class.selected]="selected" (click)="toggle()">
      <div class="image-wrapper">
        <img [src]="imageUrl" [alt]="label" class="checkbox-image">
        <div class="checkbox-overlay">
          <div class="checkbox-icon">
            <i class="bi bi-check-lg" *ngIf="selected"></i>
          </div>
        </div>
      </div>
      <div class="checkbox-label">{{ label }}</div>
      <button *ngIf="hasPopup" type="button" class="btn btn-info btn-sm popup-btn" 
              (click)="$event.stopPropagation(); openPopup.emit()">
        <i class="bi bi-info-circle"></i> Details
      </button>
    </div>
  `,
  styles: [`
    .image-checkbox-container {
      position: relative;
      cursor: pointer;
      border: 2px solid #dee2e6;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
      transition: all 0.3s ease;
      background: white;
    }

    .image-checkbox-container:hover {
      border-color: #0066cc;
      box-shadow: 0 2px 8px rgba(0, 102, 204, 0.1);
    }

    .image-checkbox-container.selected {
      border-color: #0066cc;
      background-color: #f8f9ff;
      box-shadow: 0 2px 12px rgba(0, 102, 204, 0.2);
    }

    .image-wrapper {
      position: relative;
      margin-bottom: 10px;
    }

    .checkbox-image {
      width: 100%;
      height: 120px;
      object-fit: cover;
      border-radius: 6px;
      background: #f8f9fa;
    }

    .checkbox-overlay {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 30px;
      height: 30px;
      background: white;
      border: 2px solid #dee2e6;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .selected .checkbox-overlay {
      background: #0066cc;
      border-color: #0066cc;
      color: white;
    }

    .checkbox-icon {
      font-size: 16px;
      font-weight: bold;
    }

    .checkbox-label {
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .popup-btn {
      font-size: 12px;
      padding: 4px 8px;
    }

    @media (max-width: 768px) {
      .checkbox-image {
        height: 100px;
      }
      
      .checkbox-label {
        font-size: 13px;
      }
    }
  `]
})
export class ImageCheckboxComponent {
  @Input() selected: boolean = false;
  @Input() imageUrl: string = '';
  @Input() label: string = '';
  @Input() hasPopup: boolean = false;
  @Output() selectionChange = new EventEmitter<boolean>();
  @Output() openPopup = new EventEmitter<void>();

  toggle(): void {
    this.selected = !this.selected;
    this.selectionChange.emit(this.selected);
  }
}