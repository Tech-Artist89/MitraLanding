// src/app/components/page-two/page-two.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { BathroomDataService } from '../../services/bathroom-data.service';
import { NavigationService } from '../../services/navigation.service';
import { ProgressIndicatorComponent } from '../shared/progress-indicator/progress-indicator.component';
import { ImageCheckboxComponent } from '../shared/image-checkbox/image-checkbox.component';
import { PopupModalComponent } from '../shared/popup-modal/popup-modal.component';
import { NavigationButtonsComponent } from '../shared/navigation-buttons/navigation-buttons.component';
import { BathroomData, QualityLevel } from '../../interfaces';

@Component({
  selector: 'app-page-two',
  standalone: true,
  imports: [
    CommonModule,
    ProgressIndicatorComponent,
    ImageCheckboxComponent,
    PopupModalComponent,
    NavigationButtonsComponent
  ],
  template: `
    <div class="container mt-4">
      <app-progress-indicator [currentStep]="2" [totalSteps]="5"></app-progress-indicator>
      
      <div class="page-content">
        <h2 class="page-title">Welchen Qualitätsanspruch haben Sie?</h2>
        <p class="page-subtitle">Wählen Sie eine Qualitätsstufe aus</p>
        
        <div class="quality-grid">
          <div *ngFor="let quality of qualityLevels" class="quality-option">
            <div class="quality-card" 
                 [class.selected]="bathroomData.qualityLevel?.id === quality.id"
                 (click)="selectQuality(quality)">
              <img [src]="quality.imageUrl" [alt]="quality.name" class="quality-image">
              <div class="quality-content">
                <h4 class="quality-name">{{ quality.name }}</h4>
                <p class="quality-description">{{ quality.description }}</p>
                <button type="button" class="btn btn-info btn-sm" 
                        (click)="$event.stopPropagation(); openQualityDetails(quality)">
                  <i class="bi bi-info-circle"></i> Details anzeigen
                </button>
              </div>
              <div class="selection-indicator" *ngIf="bathroomData.qualityLevel?.id === quality.id">
                <i class="bi bi-check-circle-fill"></i>
              </div>
            </div>
          </div>
        </div>

        <app-navigation-buttons
          [canGoBack]="true"
          [canGoNext]="canProceed()"
          [isLastPage]="false"
          (goBack)="navigateBack()"
          (goNext)="navigateNext()">
        </app-navigation-buttons>
      </div>

      <!-- Quality Details Modal -->
      <div class="modal fade show" tabindex="-1" style="display: block;" *ngIf="isModalOpen">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ selectedQuality?.name }} - Details</h5>
              <button type="button" class="btn-close" (click)="closeModal()"></button>
            </div>
            <div class="modal-body" *ngIf="selectedQuality">
              <img [src]="selectedQuality.imageUrl" [alt]="selectedQuality.name" class="modal-image">
              <p class="quality-description">{{ selectedQuality.description }}</p>
              <h6>Ausstattungsmerkmale:</h6>
              <ul class="feature-list">
                <li *ngFor="let feature of selectedQuality.features">{{ feature }}</li>
              </ul>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Schließen</button>
              <button type="button" class="btn btn-primary" (click)="selectAndClose(selectedQuality)" *ngIf="selectedQuality">
                {{ selectedQuality.name }} auswählen
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show" *ngIf="isModalOpen" (click)="closeModal()"></div>
    </div>
  `,
  styles: [`
    .page-content {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }

    .page-title {
      color: #0066cc;
      margin-bottom: 10px;
      font-weight: 700;
    }

    .page-subtitle {
      color: #666;
      margin-bottom: 30px;
      font-style: italic;
    }

    .quality-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .quality-card {
      border: 2px solid #dee2e6;
      border-radius: 12px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: white;
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .quality-card:hover {
      border-color: #0066cc;
      box-shadow: 0 4px 16px rgba(0, 102, 204, 0.1);
      transform: translateY(-2px);
    }

    .quality-card.selected {
      border-color: #0066cc;
      background-color: #f8f9ff;
      box-shadow: 0 4px 20px rgba(0, 102, 204, 0.2);
    }

    .quality-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 15px;
      background: #f8f9fa;
    }

    .quality-content {
      flex: 1;
    }

    .quality-name {
      color: #333;
      margin-bottom: 10px;
      font-weight: 700;
      font-size: 1.5rem;
    }

    .quality-description {
      color: #666;
      margin-bottom: 15px;
      line-height: 1.5;
    }

    .selection-indicator {
      position: absolute;
      top: 15px;
      right: 15px;
      color: #0066cc;
      font-size: 28px;
    }

    .modal-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .feature-list {
      list-style-type: none;
      padding: 0;
    }

    .feature-list li {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
      position: relative;
      padding-left: 25px;
    }

    .feature-list li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #28a745;
      font-weight: bold;
    }

    .feature-list li:last-child {
      border-bottom: none;
    }

    @media (max-width: 768px) {
      .quality-grid {
        grid-template-columns: 1fr;
      }
      
      .page-content {
        padding: 20px;
      }
    }
  `]
})
export class PageTwoComponent implements OnInit, OnDestroy {
  bathroomData!: BathroomData;
  qualityLevels: QualityLevel[] = [];
  isModalOpen = false;
  selectedQuality: QualityLevel | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(
    private bathroomDataService: BathroomDataService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.qualityLevels = this.bathroomDataService.getQualityLevels();
    
    this.bathroomDataService.bathroomData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.bathroomData = data;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectQuality(quality: QualityLevel): void {
    this.bathroomDataService.updateQualityLevel(quality);
  }

  openQualityDetails(quality: QualityLevel): void {
    this.selectedQuality = quality;
    this.isModalOpen = true;
  }

  selectAndClose(quality: QualityLevel): void {
    this.selectQuality(quality);
    this.closeModal();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedQuality = null;
  }

  canProceed(): boolean {
    return this.bathroomData.qualityLevel !== null;
  }

  navigateBack(): void {
    this.navigationService.navigateToPrevious();
  }

  navigateNext(): void {
    if (this.canProceed()) {
      this.navigationService.navigateToNext();
    }
  }
}
