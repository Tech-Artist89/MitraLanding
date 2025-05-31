// src/app/services/navigation.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private currentPageSubject = new BehaviorSubject<number>(1);
  public currentPage$ = this.currentPageSubject.asObservable();
  
  private readonly totalPages = 5;

  constructor(private router: Router) {}

  getCurrentPage(): number {
    return this.currentPageSubject.value;
  }

  getTotalPages(): number {
    return this.totalPages;
  }

  canNavigateNext(): boolean {
    return this.getCurrentPage() < this.totalPages;
  }

  canNavigatePrevious(): boolean {
    return this.getCurrentPage() > 1;
  }

  navigateToNext(): void {
    const currentPage = this.getCurrentPage();
    if (this.canNavigateNext()) {
      this.navigateToPage(currentPage + 1);
    }
  }

  navigateToPrevious(): void {
    const currentPage = this.getCurrentPage();
    if (this.canNavigatePrevious()) {
      this.navigateToPage(currentPage - 1);
    }
  }

  navigateToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPageSubject.next(page);
      this.router.navigate(['/page', page]);
    }
  }

  getProgressPercentage(): number {
    return (this.getCurrentPage() / this.totalPages) * 100;
  }
}