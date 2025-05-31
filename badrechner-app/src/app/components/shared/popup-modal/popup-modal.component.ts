// src/app/components/shared/popup-modal/popup-modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentOption } from '../../../interfaces';

@Component({
  selector: 'app-popup-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal fade show" tabindex="-1" style="display: block;" *ngIf="isOpen">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" (click)="close()"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6" *ngFor="let option of options">
                <div class="option-card" [class.selected]="option.selected" 
                     (click)="selectOption(option)">
                  <img [src]="option.imageUrl" [alt]="option.name" class="option-image">
                  <h6 class="option-title">{{ option.name }}</h6>
                  <p class="option-description">{{ option.description }}</p>
                  <div class="selection-indicator" *ngIf="option.selected">
                    <i class="bi bi-check-circle-fill"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="close()">Schließen</button>
            <button type="button" class="btn btn-primary" (click)="confirm()" 
                    [disabled]="!hasSelection()">Auswählen</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" *ngIf="isOpen" (click)="close()"></div>
  `,
  styles: [`
    .option-card {
      border: 2px solid #dee2e6;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      background: white;
    }

    .option-card:hover {
      border-color: #0066cc;
      box-shadow: 0 2px 8px rgba(0, 102, 204, 0.1);
    }

    .option-card.selected {
      border-color: #0066cc;
      background-color: #f8f9ff;
      box-shadow: 0 2px 12px rgba(0, 102, 204, 0.2);
    }

    .option-image {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 6px;
      margin-bottom: 10px;
      background: #f8f9fa;
    }

    .option-title {
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }

    .option-description {
      font-size: 14px;
      color: #666;
      margin-bottom: 0;
    }

    .selection-indicator {
      position: absolute;
      top: 10px;
      right: 10px;
      color: #0066cc;
      font-size: 24px;
    }

    .modal {
      z-index: 1055;
    }

    .modal-backdrop {
      z-index: 1050;
    }
  `]
})
export class PopupModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() options: EquipmentOption[] = [];
  @Output() optionSelected = new EventEmitter<EquipmentOption>();
  @Output() modalClosed = new EventEmitter<void>();

  selectOption(option: EquipmentOption): void {
    // Clear all selections first
    this.options.forEach(opt => opt.selected = false);
    // Select the clicked option
    option.selected = true;
  }

  hasSelection(): boolean {
    return this.options.some(option => option.selected);
  }

  confirm(): void {
    const selectedOption = this.options.find(option => option.selected);
    if (selectedOption) {
      this.optionSelected.emit(selectedOption);
    }
    this.close();
  }

  close(): void {
    this.modalClosed.emit();
  }
}