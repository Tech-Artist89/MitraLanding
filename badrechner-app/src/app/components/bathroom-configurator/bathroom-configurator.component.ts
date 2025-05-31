import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-bathroom-configurator',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="configurator-container">
      <div class="hero-section">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-8 mx-auto text-center">
              <h1 class="hero-title">Ihr Traumbad planen</h1>
              <p class="hero-subtitle">
                Gestalten Sie Ihr perfektes Badezimmer in nur 5 einfachen Schritten. 
                Unser Konfigurator hilft Ihnen dabei, alle wichtigen Entscheidungen zu treffen.
              </p>
              <div class="hero-features">
                <div class="row">
                  <div class="col-md-4">
                    <div class="feature-item">
                      <i class="bi bi-check-circle-fill"></i>
                      <span>Kostenlose Beratung</span>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="feature-item">
                      <i class="bi bi-check-circle-fill"></i>
                      <span>Individuelle Planung</span>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="feature-item">
                      <i class="bi bi-check-circle-fill"></i>
                      <span>Hochwertige Materialien</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="configurator-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .configurator-container {
      min-height: 100vh;
    }

    .hero-section {
      background: linear-gradient(135deg, rgba(0, 102, 204, 0.95) 0%, rgba(0, 68, 153, 0.95) 100%);
      color: white;
      padding: 4rem 0;
      position: relative;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .hero-subtitle {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.95;
      line-height: 1.6;
    }

    .hero-features {
      margin-top: 3rem;
    }

    .feature-item {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      font-size: 1.1rem;
      font-weight: 500;
      margin-bottom: 1rem;
    }

    .feature-item i {
      color: #28a745;
      font-size: 1.25rem;
    }

    .configurator-content {
      padding: 2rem 0;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: 2rem 0;
      }
      
      .hero-title {
        font-size: 2rem;
      }
      
      .hero-subtitle {
        font-size: 1.1rem;
      }
      
      .configurator-content {
        padding: 1rem 0;
      }
    }
  `]
})
export class BathroomConfiguratorComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        const urlSegments = event.url.split('/');
        const pageNumber = parseInt(urlSegments[urlSegments.length - 1]);
        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= 5) {
          this.navigationService.navigateToPage(pageNumber);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}