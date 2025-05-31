import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="app-container">
      <header class="app-header">
        <nav class="navbar navbar-expand-lg">
          <div class="container">
            <a class="navbar-brand" href="#">
              <i class="bi bi-droplet-fill me-2"></i>
              Badrechner
            </a>
            <div class="navbar-nav ms-auto">
              <span class="nav-text">Ihr Traumbad in 5 einfachen Schritten</span>
            </div>
          </div>
        </nav>
      </header>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="app-footer">
        <div class="container">
          <div class="row">
            <div class="col-md-6">
              <h6>Kontakt</h6>
              <p class="mb-1">Ihre Heizung- und Sanitärfirma</p>
              <p class="mb-1">Telefon: 030 / 123 456 789</p>
              <p class="mb-1">E-Mail: info&#64;ihre-firma.de</p>
            </div>
            <div class="col-md-6">
              <h6>Öffnungszeiten</h6>
              <p class="mb-1">Mo - Fr: 08:00 - 17:00 Uhr</p>
              <p class="mb-1">Sa: 09:00 - 14:00 Uhr</p>
              <p class="mb-1">So: Geschlossen</p>
            </div>
          </div>
          <hr>
          <div class="text-center">
            <small>&copy; 2025 Ihre Heizung- und Sanitärfirma. Alle Rechte vorbehalten.</small>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-header {
      background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
      color: white;
      box-shadow: 0 2px 12px rgba(0, 102, 204, 0.2);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .navbar {
      padding: 1rem 0;
    }

    .navbar-brand {
      font-size: 1.5rem;
      font-weight: 700;
      color: white !important;
      text-decoration: none;
      display: flex;
      align-items: center;
    }

    .nav-text {
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
    }

    .main-content {
      flex: 1;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      min-height: calc(100vh - 140px);
      padding: 0;
    }

    .app-footer {
      background: #343a40;
      color: white;
      padding: 2rem 0 1rem;
      margin-top: auto;
    }

    .app-footer h6 {
      color: #0066cc;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .app-footer p {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
    }

    .app-footer hr {
      border-color: rgba(255, 255, 255, 0.2);
      margin: 1.5rem 0 1rem;
    }

    @media (max-width: 768px) {
      .navbar-brand {
        font-size: 1.25rem;
      }
      
      .nav-text {
        display: none;
      }
    }
  `]
})
export class AppComponent {
  title = 'badrechner-app';
}