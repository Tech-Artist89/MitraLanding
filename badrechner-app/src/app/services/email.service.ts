// src/app/services/email.service.ts - TRADITIONELLE CONSTRUCTOR INJECTION
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BathroomData } from '../interfaces';
import { environment } from '../../enviroments/environment';
import { firstValueFrom, timeout, catchError, of } from 'rxjs';

interface ApiResponse {
  success: boolean;
  message: string;
  timestamp?: string;
  referenceId?: string;
  errors?: any[];
  debug?: {
    filename?: string;
    downloadUrl?: string;
    pdfSize?: string;
    pdfSaved?: string;
  };
  pdfGenerated?: boolean;
  emailSent?: boolean;
  emailError?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly apiUrl = environment.apiUrl || 'http://localhost:3000/api';
  private backendAvailable: boolean = false;

  // TRADITIONELLE Constructor Injection (funktioniert sicher)
  constructor(private http: HttpClient) {
    console.log('✅ EmailService geladen mit HttpClient');
    console.log('✅ HttpClient ist verfügbar:', !!this.http);
    this.checkBackendAvailability();
  }

  // Backend Verfügbarkeit prüfen
  private async checkBackendAvailability(): Promise<void> {
    try {
      console.log('🔍 Prüfe Backend Verfügbarkeit...');
      const response = await firstValueFrom(
        this.http.get(`${this.apiUrl}/health`).pipe(
          timeout(3000),
          catchError((error) => {
            console.log('Backend nicht erreichbar:', error.message);
            return of(null);
          })
        )
      );
      this.backendAvailable = !!response;
      console.log('Backend Status:', this.backendAvailable ? 'VERFÜGBAR ✅' : 'OFFLINE ❌');
    } catch (error) {
      this.backendAvailable = false;
      console.log('Backend Check Fehler:', error);
    }
  }

  // PDF Test ohne E-Mail
  async generatePDFOnly(data: {
    contactData: any;
    comments: string;
    additionalInfo: any;
    bathroomData: BathroomData;
  }): Promise<{ success: boolean; message: string; debug?: any }> {
    
    console.log('📄 PDF Test gestartet');
    
    if (!this.backendAvailable) {
      return {
        success: false,
        message: 'Backend ist nicht verfügbar. Bitte starten Sie das Backend mit "npm run dev".'
      };
    }

    try {
      console.log('📤 Sende PDF-Test Anfrage an:', `${this.apiUrl}/generate-pdf-only`);
      
      const response = await firstValueFrom(
        this.http.post<ApiResponse>(`${this.apiUrl}/generate-pdf-only`, data).pipe(
          timeout(10000)
        )
      );

      console.log('📥 PDF-Test Antwort:', response);

      return {
        success: response.success,
        message: response.message,
        debug: response.debug
      };
    } catch (error) {
      console.error('❌ PDF Test Fehler:', error);
      return this.handleError(error);
    }
  }

  // Hauptmethode für Badkonfiguration
  async sendBathroomConfiguration(data: {
    contactData: any;
    comments: string;
    additionalInfo: any;
    bathroomData: BathroomData;
  }): Promise<{ success: boolean; message: string; referenceId?: string; debug?: any }> {
    
    console.log('📧 Badkonfiguration senden gestartet');
    
    // Wenn Backend nicht verfügbar, Fallback verwenden
    if (!this.backendAvailable) {
      console.log('📧 Backend offline - verwende Fallback');
      return this.handleFallback(data);
    }

    try {
      console.log('📤 Sende an Backend:', `${this.apiUrl}/send-bathroom-configuration`);

      const response = await firstValueFrom(
        this.http.post<ApiResponse>(`${this.apiUrl}/send-bathroom-configuration`, data).pipe(
          timeout(15000)
        )
      );

      console.log('📥 Backend Antwort:', response);

      return {
        success: response.success,
        message: response.message,
        referenceId: response.referenceId,
        debug: response.debug
      };
    } catch (error) {
      console.error('❌ Backend Fehler:', error);
      console.log('📧 Verwende Fallback-Methode...');
      return this.handleFallback(data);
    }
  }

  // Debug-PDFs auflisten
  async getDebugPDFs(): Promise<any> {
    if (!this.backendAvailable) {
      return { pdfs: [], count: 0, debugMode: false };
    }

    try {
      console.log('📂 Lade Debug PDFs...');
      const response = await firstValueFrom(
        this.http.get<any>(`${this.apiUrl}/debug-pdfs`).pipe(
          timeout(5000)
        )
      );
      console.log('📂 Debug PDFs geladen:', response);
      return response;
    } catch (error) {
      console.error('❌ Debug PDFs Fehler:', error);
      return { pdfs: [], count: 0, debugMode: false };
    }
  }

  // Fallback-Methode: Mailto Link
  private handleFallback(data: any): { success: boolean; message: string; referenceId?: string; debug?: any } {
    try {
      console.log('📧 Erstelle Mailto Link...');
      const mailtoLink = this.createMailtoLink(data);
      
      console.log('📧 Öffne E-Mail-Programm...');
      window.open(mailtoLink, '_blank');
      
      return {
        success: true,
        message: 'Da das Backend nicht verfügbar ist, wurde Ihr Standard E-Mail-Programm geöffnet. Bitte senden Sie die E-Mail von dort aus.',
        referenceId: `FALLBACK-${Date.now()}`,
        debug: { fallbackMode: true }
      };
    } catch (error) {
      console.error('❌ Fallback Fehler:', error);
      return {
        success: false,
        message: 'Fehler beim Erstellen der Fallback E-Mail. Bitte kontaktieren Sie uns direkt unter info@ihre-firma.de'
      };
    }
  }

  // Mailto Link erstellen
  createMailtoLink(data: any): string {
    const { contactData, bathroomData, comments, additionalInfo } = data;
    
    const subject = encodeURIComponent(`Badkonfigurator Anfrage von ${contactData.firstName} ${contactData.lastName}`);
    const body = encodeURIComponent(this.generateEmailBody(contactData, bathroomData, comments, additionalInfo));
    
    return `mailto:info@ihre-firma.de?subject=${subject}&body=${body}`;
  }

  private generateEmailBody(contactData: any, bathroomData: any, comments: string, additionalInfo: any): string {
    const selectedEquipment = bathroomData?.equipment
      ?.filter((item: any) => item.selected)
      ?.map((item: any) => {
        const selectedOption = item.popupDetails?.options?.find((opt: any) => opt.selected);
        return selectedOption ? `${item.name}: ${selectedOption.name}` : item.name;
      })
      ?.join(', ') || 'Keine Ausstattung ausgewählt';

    const floorTiles = bathroomData?.floorTiles?.length > 0 ? bathroomData.floorTiles.join(', ') : 'Keine';
    const wallTiles = bathroomData?.wallTiles?.length > 0 ? bathroomData.wallTiles.join(', ') : 'Keine';
    const heating = bathroomData?.heating?.length > 0 ? bathroomData.heating.join(', ') : 'Keine';

    const additionalInfoText = additionalInfo && Object.keys(additionalInfo).length > 0 
      ? Object.entries(additionalInfo)
          .filter(([key, value]) => value)
          .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
          .join(', ')
      : 'Keine zusätzlichen Informationen';

    return `
BADKONFIGURATOR ANFRAGE

=== KONTAKTDATEN ===
${contactData.salutation} ${contactData.firstName} ${contactData.lastName}
Telefon: ${contactData.phone}
E-Mail: ${contactData.email}

=== BADKONFIGURATION ===
Badezimmergröße: ${bathroomData?.bathroomSize || 'Nicht angegeben'} m²
Gewählte Ausstattung: ${selectedEquipment}
Qualitätsanspruch: ${bathroomData?.qualityLevel?.name || 'Nicht ausgewählt'}

=== FLIESEN & HEIZUNG ===
Bodenfliesen: ${floorTiles}
Wandfliesen: ${wallTiles}
Heizung: ${heating}

=== ZUSÄTZLICHE INFORMATIONEN ===
Gewünschte Informationen: ${additionalInfoText}

${comments ? `=== ANMERKUNGEN ===\n${comments}\n` : ''}

=== SYSTEM-INFORMATIONEN ===
Erstellt am: ${new Date().toLocaleString('de-DE')}
System: Badkonfigurator v2.0 (Angular 19)
Referenz-ID: ${Date.now()}

---
Vielen Dank für Ihr Interesse! 
Wir werden uns schnellstmöglich bei Ihnen melden.
    `;
  }

  private handleError(error: any): { success: boolean; message: string } {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          return {
            success: false,
            message: 'Backend nicht erreichbar. Verwende Fallback-Modus.'
          };
        case 400:
          return {
            success: false,
            message: 'Ungültige Daten. Bitte überprüfen Sie Ihre Eingaben.'
          };
        case 429:
          return {
            success: false,
            message: 'Zu viele Anfragen. Bitte warten Sie einen Moment.'
          };
        case 500:
          return {
            success: false,
            message: 'Serverfehler. Verwende Fallback-Modus.'
          };
        default:
          return {
            success: false,
            message: `HTTP Fehler ${error.status}: ${error.statusText}`
          };
      }
    }
    
    return {
      success: false,
      message: 'Unbekannter Fehler. Verwende Fallback-Modus.'
    };
  }
}