// test-pdfkit.js - PDFKit Test Script
require('dotenv').config();

async function testPDFKit() {
  console.log('📄 Starte PDFKit Test (Windows-sicher)...');
  
  try {
    // PDFKit importieren und testen
    const pdfServiceAlt = require('./services/pdfServiceAlt');
    
    console.log('✅ PDFKit erfolgreich importiert');
    
    // PDF Test ausführen
    const success = await pdfServiceAlt.testPDFGeneration();
    
    if (success) {
      console.log('🎉 PDFKit Service funktioniert perfekt!');
      console.log('📁 Debug PDF wurde erstellt: debug_output_alt.pdf');
      process.exit(0);
    } else {
      console.log('❌ PDFKit Service hat Probleme');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 Kritischer Fehler bei PDFKit Test:', error.message);
    
    if (error.message.includes('Cannot find module')) {
      console.log('\n🔧 Lösung: Installieren Sie PDFKit:');
      console.log('npm install pdfkit');
    }
    
    process.exit(1);
  }
}

testPDFKit();