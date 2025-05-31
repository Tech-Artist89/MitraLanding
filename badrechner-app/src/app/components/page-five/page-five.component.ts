// src/app/components/page-five/page-five.component.ts - BACKEND-UNABHÄNGIG

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BathroomDataService } from '../../services/bathroom-data.service';
import { NavigationService } from '../../services/navigation.service';
import { EmailService } from '../../services/email.service';
import { ProgressIndicatorComponent } from '../shared/progress-indicator/progress-indicator.component';
import { NavigationButtonsComponent } from '../shared/navigation-buttons/navigation-buttons.component';
import { BathroomData } from '../../interfaces';

@Component({
  selector: 'app-page-five',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ProgressIndicatorComponent,
    NavigationButtonsComponent
  ],
  template: `
    <div class="container mt-4">
      <app-progress-indicator [currentStep]="5" [totalSteps]="5"></app-progress-indicator>
      
      <div class="page-content">
        <h2 class="page-title">Kostenlose Beratung anfordern</h2>
        
        <!-- Backend Status Anzeige -->
        <div class="backend-status" [ngClass]="backendStatusClass">
          <div class="alert" [ngClass]="backendAvailable ? 'alert-success' : 'alert-warning'">
            <h6>
              <i class="bi" [ngClass]="backendAvailable ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'"></i>
              {{ backendAvailable ? 'Backend verbunden' : 'Backend offline' }}
            </h6>
            <p class="mb-0" *ngIf="!backendAvailable">
              PDF-Test nicht verfügbar. E-Mail wird über Standard-Programm geöffnet.
            </p>
          </div>
        </div>

        <!-- Test Section (nur wenn Backend verfügbar) -->
        <div class="test-section" *ngIf="backendAvailable && showTestSection">
          <h3 class="section-title">🔧 Test-Modus</h3>
          <div class="alert alert-info">
            <h6><i class="bi bi-info-circle"></i> PDF Test ohne E-Mail-Versand</h6>
            <p class="mb-2">Testen Sie die PDF-Generierung, ohne dass eine E-Mail versendet wird.</p>
            <button 
              type="button" 
              class="btn btn-info me-3"
              [disabled]="!contactForm.valid || isLoading"
              (click)="testPDFGeneration()">
              <i class="bi bi-file-earmark-pdf me-2"></i>
              PDF Test (ohne E-Mail)
            </button>
            <button 
              type="button" 
              class="btn btn-outline-info"
              [disabled]="isLoading"
              (click)="showDebugPDFs()">
              <i class="bi bi-folder me-2"></i>
              Debug PDFs anzeigen
            </button>
          </div>
        </div>

        <!-- Additional Info Section -->
        <div class="section">
          <h3 class="section-title">Zu welchen Themen wünschen Sie sich weitere Informationen?</h3>
          <div class="checkbox-group">
            <div class="form-check">
              <input 
                class="form-check-input" 
                type="checkbox" 
                id="info-projektablauf" 
                [(ngModel)]="additionalInfo.projektablauf">
              <label class="form-check-label" for="info-projektablauf">
                Projektablauf
              </label>
            </div>
            <div class="form-check">
              <input 
                class="form-check-input" 
                type="checkbox" 
                id="info-garantie" 
                [(ngModel)]="additionalInfo.garantie">
              <label class="form-check-label" for="info-garantie">
                Garantie & Gewährleistung
              </label>
            </div>
            <div class="form-check">
              <input 
                class="form-check-input" 
                type="checkbox" 
                id="info-referenzen" 
                [(ngModel)]="additionalInfo.referenzen">
              <label class="form-check-label" for="info-referenzen">
                Referenzen
              </label>
            </div>
          </div>
        </div>

        <!-- Comments Section -->
        <div class="section">
          <h3 class="section-title">Haben Sie noch Anmerkungen?</h3>
          <div class="form-group">
            <textarea 
              class="form-control" 
              id="comments" 
              rows="4" 
              placeholder="Teilen Sie uns Ihre besonderen Wünsche oder Anmerkungen mit..."
              [(ngModel)]="comments">
            </textarea>
          </div>
        </div>

        <!-- Contact Form Section -->
        <div class="section">
          <h3 class="section-title">Kontaktdaten</h3>
          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" novalidate>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label for="salutation" class="form-label">Anrede *</label>
                  <select 
                    class="form-select" 
                    id="salutation" 
                    formControlName="salutation">
                    <option value="Herr">Herr</option>
                    <option value="Frau">Frau</option>
                  </select>
                  <div *ngIf="contactForm.get('salutation')?.invalid && contactForm.get('salutation')?.touched" 
                       class="invalid-feedback d-block">
                    Bitte wählen Sie eine Anrede aus.
                  </div>
                </div>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label for="firstName" class="form-label">Vorname *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="firstName" 
                    formControlName="firstName"
                    placeholder="Ihr Vorname"
                    [class.is-invalid]="contactForm.get('firstName')?.invalid && contactForm.get('firstName')?.touched">
                  <div *ngIf="contactForm.get('firstName')?.invalid && contactForm.get('firstName')?.touched" 
                       class="invalid-feedback">
                    Bitte geben Sie Ihren Vornamen ein.
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label for="lastName" class="form-label">Nachname *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="lastName" 
                    formControlName="lastName"
                    placeholder="Ihr Nachname"
                    [class.is-invalid]="contactForm.get('lastName')?.invalid && contactForm.get('lastName')?.touched">
                  <div *ngIf="contactForm.get('lastName')?.invalid && contactForm.get('lastName')?.touched" 
                       class="invalid-feedback">
                    Bitte geben Sie Ihren Nachnamen ein.
                  </div>
                </div>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label for="phone" class="form-label">Telefon *</label>
                  <input 
                    type="tel" 
                    class="form-control" 
                    id="phone" 
                    formControlName="phone" 
                    placeholder="z.B. 030 123456789"
                    [class.is-invalid]="contactForm.get('phone')?.invalid && contactForm.get('phone')?.touched">
                  <div *ngIf="contactForm.get('phone')?.invalid && contactForm.get('phone')?.touched" 
                       class="invalid-feedback">
                    Bitte geben Sie eine gültige Telefonnummer ein.
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label for="email" class="form-label">E-Mail *</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email" 
                    formControlName="email" 
                    placeholder="ihre.email@beispiel.de"
                    [class.is-invalid]="contactForm.get('email')?.invalid && contactForm.get('email')?.touched">
                  <div *ngIf="contactForm.get('email')?.invalid && contactForm.get('email')?.touched" 
                       class="invalid-feedback">
                    <span *ngIf="contactForm.get('email')?.errors?.['required']">Bitte geben Sie Ihre E-Mail-Adresse ein.</span>
                    <span *ngIf="contactForm.get('email')?.errors?.['email']">Bitte geben Sie eine gültige E-Mail-Adresse ein.</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Privacy Section -->
        <div class="section">
          <div class="alert alert-info" role="alert">
            <h6 class="alert-heading">
              <i class="bi bi-shield-check"></i> Datenschutz
            </h6>
            <p class="mb-0">Ihre Daten werden vertraulich behandelt und nur für die Bearbeitung Ihrer Anfrage verwendet. 
            Sie erhalten eine kostenlose und unverbindliche Beratung.</p>
          </div>
        </div>

        <!-- Loading Indicator -->
        <div class="loading-section" *ngIf="isLoading">
          <div class="alert alert-primary text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 mb-0">{{ loadingMessage }}</p>
          </div>
        </div>

        <!-- Navigation Section -->
        <div class="navigation-section">
          <div class="d-flex justify-content-between align-items-center">
            <button 
              type="button" 
              class="btn btn-outline-primary btn-lg" 
              [disabled]="isLoading"
              (click)="navigateBack()">
              <i class="bi bi-arrow-left me-2"></i>
              Zurück
            </button>
            
            <button 
              type="button" 
              class="btn btn-primary btn-lg px-4"
              [disabled]="!contactForm.valid || isLoading"
              (click)="onSubmit()">
              <i class="bi bi-send me-2" *ngIf="!isLoading"></i>
              <div class="spinner-border spinner-border-sm me-2" *ngIf="isLoading"></div>
              {{ getSubmitButtonText() }}
            </button>
          </div>
        </div>
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

    .backend-status {
      margin-bottom: 25px;
    }

    .section {
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

    .test-section {
      margin-bottom: 40px;
      padding: 20px;
      background: #e8f4fd;
      border-radius: 8px;
      border: 1px solid #b3d9ff;
    }

    .checkbox-group {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
    }

    .form-check {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
      border: 1px solid #dee2e6;
      transition: all 0.3s ease;
    }

    .form-check:hover {
      background: #e3e9ff;
      border-color: #0066cc;
    }

    .form-check-input:checked {
      background-color: #0066cc;
      border-color: #0066cc;
    }

    .form-check-label {
      font-weight: 500;
      margin-left: 8px;
      cursor: pointer;
    }

    .form-control, .form-select {
      border-radius: 8px;
      border: 2px solid #dee2e6;
      padding: 12px 15px;
      transition: border-color 0.3s ease;
    }

    .form-control:focus, .form-select:focus {
      border-color: #0066cc;
      box-shadow: 0 0 0 0.2rem rgba(0, 102, 204, 0.25);
    }

    .form-control.is-invalid, .form-select.is-invalid {
      border-color: #dc3545;
    }

    .form-label {
      font-weight: 600;
      color: #333;
    }

    .invalid-feedback {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .alert-info {
      border-left: 4px solid #0066cc;
      background-color: #f8f9ff;
      border-color: #e3e9ff;
    }

    .alert-heading {
      color: #0066cc;
    }

    .loading-section {
      margin: 20px 0;
    }

    .navigation-section {
      margin-top: 40px;
      padding-top: 30px;
      border-top: 2px solid #e3e9ff;
    }

    .btn-lg {
      padding: 12px 24px;
      font-weight: 600;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
    }

    @media (max-width: 768px) {
      .checkbox-group {
        grid-template-columns: 1fr;
      }
      
      .page-content {
        padding: 20px;
      }

      .navigation-section .d-flex {
        flex-direction: column;
        gap: 15px;
      }

      .navigation-section .btn {
        width: 100%;
      }
    }
  `]
})
export class PageFiveComponent implements OnInit, OnDestroy {
  bathroomData!: BathroomData;
  contactForm!: FormGroup;
  comments: string = '';
  showTestSection: boolean = true;
  isLoading: boolean = false;
  loadingMessage: string = '';
  backendAvailable: boolean = false;
  backendStatusClass: string = '';
  
  additionalInfo = {
    projektablauf: false,
    garantie: false,
    referenzen: false
  };
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private bathroomDataService: BathroomDataService,
    private navigationService: NavigationService,
    private emailService: EmailService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    console.log('PageFive Component wird geladen...');
    
    // Bathroom Data laden
    this.bathroomDataService.bathroomData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.bathroomData = data;
        console.log('Bathroom Data geladen:', !!data);
      });

    // Backend Status prüfen (aber Komponente funktioniert auch ohne)
    this.checkBackendStatus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.contactForm = this.fb.group({
      salutation: ['Herr', [Validators.required]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]]
    });
    
    console.log('Kontakt-Form initialisiert');
  }

  // Backend Status prüfen (optional, nicht blockierend)
  private async checkBackendStatus(): Promise<void> {
    try {
      const response = await fetch('http://localhost:3000/api/health', {
        method: 'GET',
        signal: AbortSignal.timeout(3000) // 3 Sekunden Timeout
      });
      
      if (response.ok) {
        this.backendAvailable = true;
        console.log('✅ Backend verfügbar');
      } else {
        this.backendAvailable = false;
        console.log('❌ Backend antwortet nicht korrekt');
      }
    } catch (error) {
      this.backendAvailable = false;
      console.log('❌ Backend nicht erreichbar (normal wenn nicht gestartet)');
    }
  }

  // Submit Button Text abhängig vom Backend Status
  getSubmitButtonText(): string {
    if (this.isLoading) {
      return this.backendAvailable ? 'Wird versendet...' : 'E-Mail wird geöffnet...';
    }
    return this.backendAvailable ? 'Kostenlose Beratung anfordern' : 'E-Mail-Programm öffnen';
  }

  // PDF Test (nur wenn Backend verfügbar)
  async testPDFGeneration(): Promise<void> {
    if (!this.backendAvailable) {
      alert('Backend ist nicht verfügbar. Bitte starten Sie das Backend für PDF-Tests.');
      return;
    }

    if (!this.contactForm.valid) {
      alert('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    this.isLoading = true;
    this.loadingMessage = 'PDF wird erstellt...';

    try {
      const formData = {
        contactData: this.contactForm.value,
        comments: this.comments,
        additionalInfo: this.additionalInfo,
        bathroomData: this.bathroomData
      };

      const result = await this.emailService.generatePDFOnly(formData);
      
      if (result.success) {
        let message = 'PDF erfolgreich erstellt!';
        
        if (result.debug?.downloadUrl) {
          message += `\n\nSie können die PDF hier herunterladen:\n${result.debug.downloadUrl}`;
          window.open(result.debug.downloadUrl, '_blank');
        }
        
        alert(message);
      } else {
        alert(`Fehler beim Erstellen der PDF: ${result.message}`);
      }

    } catch (error) {
      console.error('PDF Test Fehler:', error);
      alert('Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      this.isLoading = false;
      this.loadingMessage = '';
    }
  }

  // Debug PDFs anzeigen
  async showDebugPDFs(): Promise<void> {
    if (!this.backendAvailable) {
      alert('Backend ist nicht verfügbar.');
      return;
    }

    try {
      const result = await this.emailService.getDebugPDFs();
      
      if (result.pdfs && result.pdfs.length > 0) {
        let message = `Debug PDFs (${result.count} gefunden):\n\n`;
        
        result.pdfs.slice(0, 5).forEach((pdf: any, index: number) => {
          message += `${index + 1}. ${pdf.filename} (${pdf.size})\n`;
          message += `   Erstellt: ${new Date(pdf.created).toLocaleString('de-DE')}\n\n`;
        });
        
        alert(message);
      } else {
        alert('Keine Debug PDFs gefunden.');
      }
    } catch (error) {
      alert('Fehler beim Laden der Debug PDFs.');
    }
  }

  // Hauptmethode - funktioniert IMMER (mit oder ohne Backend)
  async onSubmit(): Promise<void> {
    if (!this.contactForm.valid) {
      this.markFormGroupTouched(this.contactForm);
      alert('Bitte füllen Sie alle Pflichtfelder korrekt aus.');
      return;
    }

    this.isLoading = true;
    this.loadingMessage = this.backendAvailable ? 'Ihre Anfrage wird versendet...' : 'E-Mail-Programm wird geöffnet...';

    try {
      const formData = {
        contactData: this.contactForm.value,
        comments: this.comments,
        additionalInfo: this.additionalInfo,
        bathroomData: this.bathroomData
      };

      // Update Service mit den Daten
      this.bathroomDataService.updateContactData(this.contactForm.value);
      this.bathroomDataService.updateComments(this.comments);

      // E-Mail senden (Backend oder Fallback)
      const result = await this.emailService.sendBathroomConfiguration(formData);
      
      if (result.success) {
        let successMessage = result.message;
        
        if (result.referenceId) {
          successMessage += `\n\nReferenznummer: ${result.referenceId}`;
        }
        
        alert(successMessage);
        
        // Optional: PDF öffnen wenn verfügbar
        if (result.debug?.downloadUrl) {
          const openPDF = confirm('Möchten Sie die erstellte PDF ansehen?');
          if (openPDF) {
            window.open(result.debug.downloadUrl, '_blank');
          }
        }
      } else {
        alert(`Fehler: ${result.message}`);
      }

    } catch (error) {
      console.error('Unerwarteter Fehler:', error);
      alert('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      this.isLoading = false;
      this.loadingMessage = '';
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  navigateBack(): void {
    this.navigationService.navigateToPrevious();
  }
}