// src/app/components/page-four/page-four.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { BathroomDataService } from '../../services/bathroom-data.service';
import { NavigationService } from '../../services/navigation.service';
import { ProgressIndicatorComponent } from '../shared/progress-indicator/progress-indicator.component';
import { ImageCheckboxComponent } from '../shared/image-checkbox/image-checkbox.component';
import { NavigationButtonsComponent } from '../shared/navigation-buttons/navigation-buttons.component';
import { BathroomData, HeatingOption } from '../../interfaces';

@Component({
  selector: 'app-page-four',
  standalone: true,
  imports: [
    CommonModule,
    ProgressIndicatorComponent,
    ImageCheckboxComponent,
    NavigationButtonsComponent
  ],
  template: `
    <div class="container mt-4">
      <app-progress-indicator [currentStep]="4" [totalSteps]="5"></app-progress-indicator>
      
      <div class="page-content">
        <h2 class="page-title">Welche Heizung benötigen Sie?</h2>
        <p class="page-subtitle">Mehrfachauswahl möglich</p>
        
        <div class="heating-grid">
          <app-image-checkbox
            *ngFor="let heating of heatingOptions"
            [selected]="isHeatingSelected(heating.id)"
            [imageUrl]="heating.imageUrl"
            [label]="heating.name"
            (selectionChange)="onHeatingSelectionChange(heating.id, $event)">
          </app-image-checkbox>
        </div>

        <div class="info-section">
          <div class="alert alert-info" role="alert">
            <h5 class="alert-heading">
              <i class="bi bi-info-circle"></i> Hinweise zur Heizungsauswahl
            </h5>
            <p class="mb-2"><strong>Heizkörper:</strong> Klassische und bewährte Heizlösung mit schneller Wärmeabgabe</p>
            <p class="mb-0"><strong>Fußbodenheizung:</strong> Gleichmäßige Wärmeverteilung und erhöhter Komfort, besonders bei Fliesen empfehlenswert</p>
          </div>
        </div>

        <app-navigation-buttons
          [canGoBack]="true"
          [canGoNext]="true"
          [isLastPage]="false"
          (goBack)="navigateBack()"
          (goNext)="navigateNext()">
        </app-navigation-buttons>
      </div>
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

    .heating-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      margin-bottom: 40px;
    }

    .info-section {
      margin-bottom: 30px;
    }

    .alert-info {
      border-left: 4px solid #0066cc;
      background-color: #f8f9ff;
      border-color: #e3e9ff;
    }

    .alert-heading {
      color: #0066cc;
    }

    .alert-heading i {
      margin-right: 8px;
    }

    @media (max-width: 768px) {
      .heating-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .page-content {
        padding: 20px;
      }
    }
  `]
})
export class PageFourComponent implements OnInit, OnDestroy {
  bathroomData!: BathroomData;
  heatingOptions: HeatingOption[] = [];
  
  private destroy$ = new Subject<void>();

  constructor(
    private bathroomDataService: BathroomDataService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.heatingOptions = this.bathroomDataService.getHeatingOptions();
    
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

  isHeatingSelected(heatingId: string): boolean {
    return this.bathroomData.heating.includes(heatingId);
  }

  onHeatingSelectionChange(heatingId: string, selected: boolean): void {
    let updatedHeating = [...this.bathroomData.heating];
    
    if (selected) {
      if (!updatedHeating.includes(heatingId)) {
        updatedHeating.push(heatingId);
      }
    } else {
      updatedHeating = updatedHeating.filter(id => id !== heatingId);
    }
    
    this.bathroomDataService.updateHeating(updatedHeating);
  }

  navigateBack(): void {
    this.navigationService.navigateToPrevious();
  }

  navigateNext(): void {
    this.navigationService.navigateToNext();
  }
}
