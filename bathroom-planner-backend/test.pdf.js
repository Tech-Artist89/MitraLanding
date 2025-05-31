// test-pdf.js - PDF Test Script
require('dotenv').config();
const pdfService = require('./services/pdfService');

async function testPDF() {
  console.log('🔍 Starte PDF Test...');
  console.log('DEBUG_PDF:', process.env.DEBUG_PDF);
  
  try {
    const success = await pdfService.testPDFGeneration();
    if (success) {
      console.log('✅ PDF Service funktioniert!');
      process.exit(0);
    } else {
      console.log('❌ PDF Service hat Probleme');
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Kritischer Fehler:', error);
    process.exit(1);
  }
}

testPDF();

// =============================================================================

// test-email.js - E-Mail Test Script
// require('dotenv').config();
// const emailService = require('./services/emailService');

// async function testEmail() {
//   console.log('📧 Teste E-Mail Verbindung...');
  
//   // Erst Verbindung testen
//   const connectionOk = await emailService.testConnection();
//   if (!connectionOk) {
//     console.log('❌ E-Mail Konfiguration fehlerhaft');
//     console.log('Überprüfen Sie folgende Environment-Variablen:');
//     console.log('- SMTP_HOST:', process.env.SMTP_HOST || 'NICHT GESETZT');
//     console.log('- SMTP_PORT:', process.env.SMTP_PORT || 'NICHT GESETZT');  
//     console.log('- SMTP_USER:', process.env.SMTP_USER || 'NICHT GESETZT');
//     console.log('- SMTP_PASS:', process.env.SMTP_PASS ? '***' : 'NICHT GESETZT');
//     return;
//   }

//   console.log('✅ E-Mail Verbindung erfolgreich!');
// }

// testEmail();

// =============================================================================

// install.js - Installation Helper
const { execSync } = require('child_process');
const fs = require('fs');

function checkPuppeteerInstallation() {
  console.log('🔍 Überprüfe Puppeteer Installation...');
  
  try {
    // Prüfe ob node_modules/puppeteer existiert
    const puppeteerPath = './node_modules/puppeteer';
    if (!fs.existsSync(puppeteerPath)) {
      console.log('❌ Puppeteer nicht installiert');
      return false;
    }
    
    // Prüfe ob Chromium heruntergeladen wurde
    const chromiumPath = './node_modules/puppeteer/.local-chromium';
    if (!fs.existsSync(chromiumPath)) {
      console.log('⚠️ Chromium nicht gefunden, wird nachinstalliert...');
      
      // Puppeteer neu installieren um Chromium herunterzuladen
      execSync('npm install puppeteer --force', { stdio: 'inherit' });
    }
    
    console.log('✅ Puppeteer und Chromium gefunden');
    return true;
    
  } catch (error) {
    console.error('❌ Fehler bei Puppeteer Check:', error.message);
    return false;
  }
}

// checkPuppeteerInstallation();