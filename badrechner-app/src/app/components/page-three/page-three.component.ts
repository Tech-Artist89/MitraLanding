// src/app/components/page-three/page-three.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { BathroomDataService } from '../../services/bathroom-data.service';
import { NavigationService } from '../../services/navigation.service';
import { ProgressIndicatorComponent } from '../shared/progress-indicator/progress-indicator.component';
import { ImageCheckboxComponent } from '../shared/image-checkbox/image-checkbox.component';
import { NavigationButtonsComponent } from '../shared/navigation-buttons/navigation-buttons.component';
import { BathroomData, TileOption } from '../../interfaces';

@Component({
  selector: 'app-page-three',
  standalone: true,
  imports: [
    CommonModule,
    ProgressIndicatorComponent,
    ImageCheckboxComponent,
    NavigationButtonsComponent
  ],
  template: `
    <div class="container mt-4">
      <app-progress-indicator [currentStep]="3" [totalSteps]="5"></app-progress-indicator>
      
      <div class="page-content">
        <h2 class="page-title">Welche Fliesen benötigen Sie?</h2>
        
        <div class="tiles-section">
          <h3 class="section-title">Bodenfliesen</h3>
          <div class="tiles-grid">
            <app-image-checkbox
              *ngFor="let tile of floorTiles"
              [selected]="isFloorTileSelected(tile.id)"
              [imageUrl]="tile.imageUrl"
              [label]="tile.name"
              (selectionChange)="onFloorTileSelectionChange(tile.id, $event)">
            </app-image-checkbox>
          </div>
        </div>

        <div class="tiles-section">
          <h3 class="section-title">Wandfliesen</h3>
          <div class="tiles-grid">
            <app-image-checkbox
              *ngFor="let tile of wallTiles"
              [selected]="isWallTileSelected(tile.id)"
              [imageUrl]="tile.imageUrl"
              [label]="tile.name"
              (selectionChange)="onWallTileSelectionChange(tile.id, $event)">
            </app-image-checkbox>
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
      margin-bottom: 30px;
      font-weight: 700;
    }

    .tiles-section {
      margin-bottom: 40px;
    }

    .section-title {
      color: #0066cc;
      margin-bottom: 20px;
      font-weight: 600;
      font-size: 1.25rem;
      border-bottom: 2px solid #e3e9ff;
      padding-bottom: 10px;
    }

    .tiles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    @media (max-width: 768px) {
      .tiles-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
      }
      
      .page-content {
        padding: 20px;
      }
    }
  `]
})
export class PageThreeComponent implements OnInit, OnDestroy {
  bathroomData!: BathroomData;
  floorTiles: TileOption[] = [];
  wallTiles: TileOption[] = [];
  
  private destroy$ = new Subject<void>();

  constructor(
    private bathroomDataService: BathroomDataService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    const tileOptions = this.bathroomDataService.getTileOptions();
    this.floorTiles = tileOptions.floor;
    this.wallTiles = tileOptions.wall;
    
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

  isFloorTileSelected(tileId: string): boolean {
    return this.bathroomData.floorTiles.includes(tileId);
  }

  isWallTileSelected(tileId: string): boolean {
    return this.bathroomData.wallTiles.includes(tileId);
  }

  onFloorTileSelectionChange(tileId: string, selected: boolean): void {
    let updatedTiles = [...this.bathroomData.floorTiles];
    
    if (selected) {
      if (!updatedTiles.includes(tileId)) {
        updatedTiles.push(tileId);
      }
    } else {
      updatedTiles = updatedTiles.filter(id => id !== tileId);
    }
    
    this.bathroomDataService.updateFloorTiles(updatedTiles);
  }

  onWallTileSelectionChange(tileId: string, selected: boolean): void {
    let updatedTiles = [...this.bathroomData.wallTiles];
    
    if (selected) {
      if (!updatedTiles.includes(tileId)) {
        updatedTiles.push(tileId);
      }
    } else {
      updatedTiles = updatedTiles.filter(id => id !== tileId);
    }
    
    this.bathroomDataService.updateWallTiles(updatedTiles);
  }

  navigateBack(): void {
    this.navigationService.navigateToPrevious();
  }

  navigateNext(): void {
    this.navigationService.navigateToNext();
  }
}