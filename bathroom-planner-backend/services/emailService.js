// services/emailService.js - KORRIGIERTE VERSION
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  createTransporter() {
    // SMTP Configuration
    const config = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    };

    console.log('E-Mail Konfiguration:', {
      host: config.host,
      port: config.port,
      secure: config.secure,
      user: config.auth.user ? '***' : 'nicht gesetzt'
    });

    // KORREKTUR: createTransport statt createTransporter
    return nodemailer.createTransport(config);
  }

  async sendToCompany({ contactData, bathroomData, comments, additionalInfo, pdfBuffer }) {
    const selectedEquipment = bathroomData.equipment
      .filter(item => item.selected)
      .map(item => {
        const selectedOption = item.popupDetails?.options?.find(opt => opt.selected);
        return selectedOption ? `${item.name}: ${selectedOption.name}` : item.name;
      })
      .join('\n• ');

    const floorTiles = bathroomData.floorTiles.length > 0 ? bathroomData.floorTiles.join(', ') : 'Keine ausgewählt';
    const wallTiles = bathroomData.wallTiles.length > 0 ? bathroomData.wallTiles.join(', ') : 'Keine ausgewählt';
    const heating = bathroomData.heating.length > 0 ? bathroomData.heating.join(', ') : 'Keine ausgewählt';
    const additionalInfoText = additionalInfo && Object.keys(additionalInfo).length > 0 
      ? Object.entries(additionalInfo)
          .filter(([key, value]) => value)
          .map(([key]) => key)
          .join(', ')
      : 'Keine gewünscht';

    const emailBody = `
Neue Badkonfigurator Anfrage

════════════════════════════════════════

📋 KONTAKTDATEN:
${contactData.salutation} ${contactData.firstName} ${contactData.lastName}
📧 E-Mail: ${contactData.email}
📞 Telefon: ${contactData.phone}

════════════════════════════════════════

🛁 BADKONFIGURATION:

📐 Badezimmergröße: ${bathroomData.bathroomSize} m²

🔧 Gewählte Ausstattung:
${selectedEquipment ? `• ${selectedEquipment}` : 'Keine Ausstattung ausgewählt'}

⭐ Qualitätsanspruch: ${bathroomData.qualityLevel?.name || 'Nicht ausgewählt'}
${bathroomData.qualityLevel?.description ? `   Beschreibung: ${bathroomData.qualityLevel.description}` : ''}

🏺 Bodenfliesen: ${floorTiles}
🧱 Wandfliesen: ${wallTiles}

🔥 Heizung: ${heating}

════════════════════════════════════════

ℹ️ ZUSÄTZLICHE INFORMATIONEN:
Gewünschte Informationen: ${additionalInfoText}

${comments ? `💬 ANMERKUNGEN:\n${comments}` : ''}

════════════════════════════════════════

📅 Anfrage erstellt am: ${new Date().toLocaleString('de-DE')}

Die vollständige Konfiguration finden Sie im angehängten PDF.

Mit freundlichen Grüßen,
Ihr Badkonfigurator System
    `;

    const mailOptions = {
      from: `"Badkonfigurator" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: process.env.COMPANY_EMAIL || 'info@ihre-firma.de',
      subject: `🛁 Neue Badkonfigurator Anfrage von ${contactData.firstName} ${contactData.lastName}`,
      text: emailBody,
      attachments: [
        {
          filename: `Badkonfigurator_${contactData.lastName}_${new Date().toISOString().split('T')[0]}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    return await this.transporter.sendMail(mailOptions);
  }

  async sendConfirmationToCustomer({ contactData, pdfBuffer }) {
    const emailBody = `
Liebe/r ${contactData.salutation} ${contactData.lastName},

vielen Dank für Ihr Interesse an unseren Badezimmer-Lösungen!

Wir haben Ihre Konfiguration erhalten und werden uns in Kürze bei Ihnen melden, um ein individuelles Angebot zu erstellen.

Im Anhang finden Sie eine Zusammenfassung Ihrer gewählten Badkonfiguration.

Was passiert als nächstes?
• Wir prüfen Ihre Angaben und bereiten ein individuelles Angebot vor
• Binnen 24-48 Stunden erhalten Sie von uns eine erste Rückmeldung
• Gerne vereinbaren wir einen Termin für eine persönliche Beratung

Bei Rückfragen erreichen Sie uns unter:
📞 ${process.env.COMPANY_PHONE || '030 / 123 456 789'}
📧 ${process.env.COMPANY_EMAIL || 'info@ihre-firma.de'}

Mit freundlichen Grüßen
Ihr Team von ${process.env.COMPANY_NAME || 'Ihre Heizung- und Sanitärfirma'}

──────────────────────────────────────
${process.env.COMPANY_NAME || 'Ihre Heizung- und Sanitärfirma'}
${process.env.COMPANY_ADDRESS || 'Musterstraße 123, 12345 Berlin'}
Web: ${process.env.COMPANY_WEBSITE || 'www.ihre-firma.de'}
    `;

    const mailOptions = {
      from: `"${process.env.COMPANY_NAME || 'Ihre Sanitärfirma'}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: contactData.email,
      subject: `✅ Bestätigung Ihrer Badkonfigurator Anfrage`,
      text: emailBody,
      attachments: [
        {
          filename: `Ihre_Badkonfiguration_${new Date().toISOString().split('T')[0]}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    return await this.transporter.sendMail(mailOptions);
  }

  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ E-Mail Server Verbindung erfolgreich');
      return true;
    } catch (error) {
      console.error('❌ E-Mail Server Verbindung fehlgeschlagen:', error.message);
      return false;
    }
  }
}

module.exports = new EmailService();