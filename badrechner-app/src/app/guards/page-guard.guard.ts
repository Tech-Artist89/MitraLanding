// src/app/guards/page-guard.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { BathroomDataService } from '../services/bathroom-data.service';

@Injectable({
  providedIn: 'root'
})
export class PageGuard implements CanActivate {
  constructor(
    private bathroomDataService: BathroomDataService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const pageNumber = parseInt(route.params['page']);
    
    // Always allow access to page 1
    if (pageNumber === 1) {
      return true;
    }

    const currentData = this.bathroomDataService.getCurrentData();

    // Check if previous steps are completed
    switch (pageNumber) {
      case 2:
        // Allow if at least one equipment is selected
        return currentData.equipment.some(item => item.selected);
      
      case 3:
        // Allow if quality level is selected
        return currentData.qualityLevel !== null;
      
      case 4:
        // Allow if tiles are selected (at least floor or wall)
        return currentData.floorTiles.length > 0 || currentData.wallTiles.length > 0;
      
      case 5:
        // Allow if heating is selected
        return currentData.heating.length > 0;
      
      default:
        this.router.navigate(['/page/1']);
        return false;
    }
  }
}