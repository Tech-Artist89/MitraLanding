// services/pdfServiceAlt.js - PDFKit Alternative (Windows-kompatibel)
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFServiceAlt {
  constructor() {
    this.debugMode = process.env.DEBUG_PDF === 'true';
  }

  log(message, data = null) {
    if (this.debugMode) {
      console.log(`[PDF Service Alt] ${message}`, data || '');
    }
  }

  async generateBathroomPDF(data) {
    const { contactData, bathroomData, comments, additionalInfo } = data;
    
    this.log('PDF Generierung gestartet für:', `${contactData.firstName} ${contactData.lastName}`);
    
    return new Promise((resolve, reject) => {
      try {
        // PDF Dokument erstellen
        const doc = new PDFDocument({
          size: 'A4',
          margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
          }
        });

        // Buffer für PDF sammeln
        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks);
          this.log('PDF erfolgreich generiert, Größe:', `${pdfBuffer.length} bytes`);
          
          // Optional: Debug PDF speichern
          if (this.debugMode) {
            const debugPath = path.join(__dirname, '..', 'debug_output_alt.pdf');
            fs.writeFileSync(debugPath, pdfBuffer);
            this.log('Debug PDF gespeichert unter:', debugPath);
          }
          
          resolve(pdfBuffer);
        });
        doc.on('error', reject);

        // PDF Inhalt generieren
        this.generatePDFContent(doc, { contactData, bathroomData, comments, additionalInfo });
        
        // PDF finalisieren
        doc.end();
        
      } catch (error) {
        this.log('Fehler bei PDF Generierung:', error.message);
        reject(error);
      }
    });
  }

  generatePDFContent(doc, { contactData, bathroomData, comments, additionalInfo }) {
    const pageWidth = doc.page.width - 100; // Margins berücksichtigen
    let y = 50;

    // Firmenlogo/Header Bereich
    doc.rect(50, y, pageWidth, 80)
       .fill('#0066cc');
    
    // Header Text
    doc.fillColor('white')
       .fontSize(24)
       .font('Helvetica-Bold')
       .text('🛁 Badezimmer Konfigurator', 70, y + 20);
    
    doc.fontSize(14)
       .font('Helvetica')
       .text('Zusammenfassung Ihrer Badkonfiguration', 70, y + 50);

    y += 100;

    // Datum
    doc.fillColor('black')
       .fontSize(10)
       .text(`Erstellt am: ${new Date().toLocaleDateString('de-DE')}`, 50, y);
    
    y += 30;

    // Kontaktdaten Sektion
    y = this.addSection(doc, '👤 Kontaktdaten', y);
    
    const contactInfo = [
      ['Name:', `${contactData.salutation} ${contactData.firstName} ${contactData.lastName}`],
      ['E-Mail:', contactData.email],
      ['Telefon:', contactData.phone]
    ];

    contactInfo.forEach(([label, value]) => {
      doc.fontSize(11)
         .font('Helvetica-Bold')
         .text(label, 70, y, { width: 80 });
      
      doc.font('Helvetica')
         .text(value, 150, y, { width: 300 });
      
      y += 18;
    });

    y += 20;

    // Badezimmergröße
    y = this.addSection(doc, '📐 Badezimmergröße', y);
    
    doc.rect(70, y, 150, 40)
       .stroke('#0066cc')
       .lineWidth(2);
    
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .fillColor('#0066cc')
       .text(`${bathroomData.bathroomSize} m²`, 80, y + 10, { width: 130, align: 'center' });

    y += 60;

    // Ausgewählte Ausstattung
    y = this.addSection(doc, '🔧 Gewählte Ausstattung', y);

    const selectedEquipment = bathroomData.equipment.filter(item => item.selected);
    
    if (selectedEquipment.length > 0) {
      selectedEquipment.forEach(item => {
        // Equipment Box
        doc.rect(70, y, pageWidth - 40, 25)
           .fill('#f8f9fa')
           .stroke('#dee2e6');
        
        doc.fillColor('#0066cc')
           .fontSize(12)
           .font('Helvetica-Bold')
           .text(`• ${item.name}`, 80, y + 8);

        // Option falls vorhanden
        const selectedOption = item.popupDetails?.options?.find(opt => opt.selected);
        if (selectedOption) {
          doc.fillColor('#666')
             .fontSize(10)
             .font('Helvetica')
             .text(`Variante: ${selectedOption.name}`, 200, y + 8);
        }

        y += 30;
      });
    } else {
      doc.fillColor('#999')
         .fontSize(11)
         .font('Helvetica-Oblique')
         .text('Keine Ausstattung ausgewählt', 70, y);
      y += 20;
    }

    y += 10;

    // Qualitätsanspruch
    if (y > 700) { // Neue Seite wenn nötig
      doc.addPage();
      y = 50;
    }

    y = this.addSection(doc, '⭐ Qualitätsanspruch', y);

    if (bathroomData.qualityLevel) {
      doc.rect(70, y, pageWidth - 40, 60)
         .fill('#f8f9ff')
         .stroke('#0066cc')
         .lineWidth(2);

      doc.fillColor('#0066cc')
         .fontSize(16)
         .font('Helvetica-Bold')
         .text(bathroomData.qualityLevel.name, 80, y + 10);

      doc.fillColor('#666')
         .fontSize(11)
         .font('Helvetica')
         .text(bathroomData.qualityLevel.description, 80, y + 30, { width: pageWidth - 60 });

      y += 70;
    } else {
      doc.fillColor('#999')
         .fontSize(11)
         .font('Helvetica-Oblique')
         .text('Keine Qualitätsstufe ausgewählt', 70, y);
      y += 20;
    }

    // Fliesen
    y = this.addSection(doc, '🏺 Fliesenauswahl', y);

    // Bodenfliesen
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .fillColor('#333')
       .text('Bodenfliesen:', 70, y);
    y += 15;

    const floorTiles = bathroomData.floorTiles.length > 0 ? bathroomData.floorTiles : ['Keine ausgewählt'];
    floorTiles.forEach(tile => {
      doc.fontSize(11)
         .font('Helvetica')
         .text(`• ${tile}`, 80, y);
      y += 15;
    });

    y += 5;

    // Wandfliesen
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('Wandfliesen:', 70, y);
    y += 15;

    const wallTiles = bathroomData.wallTiles.length > 0 ? bathroomData.wallTiles : ['Keine ausgewählt'];
    wallTiles.forEach(tile => {
      doc.fontSize(11)
         .font('Helvetica')
         .text(`• ${tile}`, 80, y);
      y += 15;
    });

    y += 10;

    // Heizung
    y = this.addSection(doc, '🔥 Heizung', y);

    const heating = bathroomData.heating.length > 0 ? bathroomData.heating : ['Keine ausgewählt'];
    heating.forEach(h => {
      doc.fontSize(11)
         .font('Helvetica')
         .text(`• ${h}`, 70, y);
      y += 15;
    });

    // Zusätzliche Informationen
    if (additionalInfo && Object.keys(additionalInfo).length > 0) {
      y += 10;
      y = this.addSection(doc, 'ℹ️ Zusätzliche Informationen gewünscht', y);

      const selectedInfo = Object.entries(additionalInfo)
        .filter(([key, value]) => value)
        .map(([key]) => this.formatAdditionalInfoKey(key));

      selectedInfo.forEach(info => {
        doc.fontSize(11)
           .font('Helvetica')
           .text(`• ${info}`, 70, y);
        y += 15;
      });
    }

    // Anmerkungen
    if (comments) {
      y += 10;
      y = this.addSection(doc, '💬 Anmerkungen', y);

      doc.rect(70, y, pageWidth - 40, 60)
         .fill('#f8f9fa')
         .stroke('#dee2e6');

      doc.fontSize(11)
         .font('Helvetica')
         .fillColor('#555')
         .text(comments, 80, y + 10, { 
           width: pageWidth - 60, 
           height: 40,
           ellipsis: true 
         });

      y += 70;
    }

    // Footer
    const footerY = doc.page.height - 80;
    doc.rect(50, footerY, pageWidth, 1)
       .fill('#dee2e6');

    doc.fontSize(9)
       .font('Helvetica')
       .fillColor('#666')
       .text(`Erstellt mit dem Badkonfigurator | ${process.env.COMPANY_NAME || 'Ihre Heizung- und Sanitärfirma'}`, 
             50, footerY + 10, { width: pageWidth, align: 'center' });
  }

  addSection(doc, title, y) {
    // Prüfen ob Platz für Sektion da ist
    if (y > 650) {
      doc.addPage();
      y = 50;
    }

    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#0066cc')
       .text(title, 50, y);

    // Unterlinie
    doc.rect(50, y + 18, 200, 1)
       .fill('#e3e9ff');

    return y + 30;
  }

  formatAdditionalInfoKey(key) {
    const mappings = {
      'projektablauf': 'Projektablauf',
      'garantie': 'Garantie & Gewährleistung',
      'referenzen': 'Referenzen'
    };
    return mappings[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }

  async testPDFGeneration() {
    const testData = {
      contactData: {
        salutation: 'Herr',
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max@example.com',
        phone: '030 123456789'
      },
      bathroomData: {
        bathroomSize: 8.5,
        equipment: [
          {
            id: 'wc',
            name: 'WC',
            selected: true,
            popupDetails: {
              options: [
                { id: 'test', name: 'Spülrandlos', selected: true }
              ]
            }
          }
        ],
        qualityLevel: {
          name: 'Premium',
          description: 'Hochwertige Ausstattung'
        },
        floorTiles: ['Große Bodenfliesen'],
        wallTiles: ['Normale Wandfliesen'],
        heating: ['Fußbodenheizung']
      },
      comments: 'Das ist ein Test-Kommentar für die PDF-Generierung.',
      additionalInfo: {
        projektablauf: true,
        garantie: false
      }
    };

    try {
      console.log('🧪 Starte PDFKit Test...');
      const pdfBuffer = await this.generateBathroomPDF(testData);
      console.log('✅ PDFKit Test erfolgreich! Größe:', pdfBuffer.length, 'bytes');
      return true;
    } catch (error) {
      console.error('❌ PDFKit Test fehlgeschlagen:', error.message);
      return false;
    }
  }
}

module.exports = new PDFServiceAlt();