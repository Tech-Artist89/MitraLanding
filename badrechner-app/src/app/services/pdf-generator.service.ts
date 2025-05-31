// src/app/services/pdf-generator.service.ts
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BathroomData } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {
  constructor() {}

  async generatePDF(data: BathroomData): Promise<Blob> {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(0, 102, 204);
    pdf.text('Badezimmer Konfigurator - Zusammenfassung', 20, yPosition);
    yPosition += 15;

    // Datum
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Erstellt am: ${new Date().toLocaleDateString('de-DE')}`, 20, yPosition);
    yPosition += 20;

    // Seite 1: Ausstattung
    pdf.setFontSize(16);
    pdf.setTextColor(0, 102, 204);
    pdf.text('1. Gewählte Ausstattung:', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    
    const selectedEquipment = data.equipment.filter(item => item.selected);
    if (selectedEquipment.length > 0) {
      selectedEquipment.forEach(item => {
        pdf.text(`• ${item.name}`, 25, yPosition);
        yPosition += 7;
        
        const selectedOption = item.popupDetails.options.find((opt: any) => opt.selected);
        if (selectedOption) {
          pdf.setFontSize(10);
          pdf.text(`  - ${selectedOption.name}`, 30, yPosition);
          yPosition += 5;
          pdf.setFontSize(12);
        }
      });
    } else {
      pdf.text('Keine Ausstattung ausgewählt', 25, yPosition);
      yPosition += 7;
    }

    yPosition += 10;
    pdf.text(`Badezimmergröße: ${data.bathroomSize} m²`, 20, yPosition);
    yPosition += 20;

    // Seite 2: Qualität
    pdf.setFontSize(16);
    pdf.setTextColor(0, 102, 204);
    pdf.text('2. Qualitätsanspruch:', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    if (data.qualityLevel) {
      pdf.text(`• ${data.qualityLevel.name}`, 25, yPosition);
      yPosition += 7;
      pdf.setFontSize(10);
      pdf.text(`  ${data.qualityLevel.description}`, 25, yPosition);
      yPosition += 10;
      pdf.setFontSize(12);
    } else {
      pdf.text('Keine Qualitätsstufe ausgewählt', 25, yPosition);
      yPosition += 10;
    }

    yPosition += 10;

    // Seite 3: Fliesen
    pdf.setFontSize(16);
    pdf.setTextColor(0, 102, 204);
    pdf.text('3. Fliesen:', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    
    if (data.floorTiles.length > 0) {
      pdf.text('Bodenfliesen:', 25, yPosition);
      yPosition += 7;
      data.floorTiles.forEach(tile => {
        pdf.text(`• ${tile}`, 30, yPosition);
        yPosition += 5;
      });
    }

    yPosition += 5;

    if (data.wallTiles.length > 0) {
      pdf.text('Wandfliesen:', 25, yPosition);
      yPosition += 7;
      data.wallTiles.forEach(tile => {
        pdf.text(`• ${tile}`, 30, yPosition);
        yPosition += 5;
      });
    }

    yPosition += 15;

    // Seite 4: Heizung
    pdf.setFontSize(16);
    pdf.setTextColor(0, 102, 204);
    pdf.text('4. Heizung:', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    if (data.heating.length > 0) {
      data.heating.forEach(heating => {
        pdf.text(`• ${heating}`, 25, yPosition);
        yPosition += 7;
      });
    } else {
      pdf.text('Keine Heizung ausgewählt', 25, yPosition);
      yPosition += 7;
    }

    yPosition += 15;

    // Seite 5: Zusatzinfos und Kontakt
    pdf.setFontSize(16);
    pdf.setTextColor(0, 102, 204);
    pdf.text('5. Zusätzliche Informationen:', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    if (data.additionalInfo.length > 0) {
      data.additionalInfo.forEach(info => {
        pdf.text(`• ${info}`, 25, yPosition);
        yPosition += 7;
      });
    }

    if (data.comments) {
      yPosition += 5;
      pdf.text('Anmerkungen:', 20, yPosition);
      yPosition += 7;
      
      const splitComments = pdf.splitTextToSize(data.comments, pageWidth - 40);
      pdf.text(splitComments, 25, yPosition);
      yPosition += splitComments.length * 5;
    }

    yPosition += 15;

    // Kontaktdaten
    pdf.setFontSize(16);
    pdf.setTextColor(0, 102, 204);
    pdf.text('Kontaktdaten:', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${data.contactData.salutation} ${data.contactData.firstName} ${data.contactData.lastName}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Telefon: ${data.contactData.phone}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`E-Mail: ${data.contactData.email}`, 20, yPosition);

    return pdf.output('blob');
  }

  downloadPDF(data: BathroomData): void {
    this.generatePDF(data).then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Badkonfigurator_${data.contactData.lastName}_${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }
}