// server.js - MIT PDF FALLBACK SYSTEM
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const emailService = require('./services/emailService');

// PDF Services - mit Fallback
let pdfServiceAlt = null;
let pdfService = null;

try {
  pdfServiceAlt = require('./services/pdfServiceAlt'); // PDFKit (Windows-sicher)
  console.log('✅ PDFKit Service geladen');
} catch (error) {
  console.log('⚠️ PDFKit Service nicht verfügbar:', error.message);
}

try {
  pdfService = require('./services/pdfService'); // Puppeteer (kann auf Windows problematisch sein)
  console.log('✅ Puppeteer Service geladen');
} catch (error) {
  console.log('⚠️ Puppeteer Service nicht verfügbar:', error.message);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Debug Mode
const DEBUG = process.env.DEBUG_PDF === 'true' || process.env.NODE_ENV === 'development';

function log(message, data = null) {
  if (DEBUG) {
    console.log(`[Server] ${message}`, data || '');
  }
}

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Zu viele Anfragen von dieser IP-Adresse. Bitte versuchen Sie es später erneut.'
});

app.use('/api/', limiter);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Validation rules
const validateBathroomConfig = [
  body('contactData.firstName').trim().isLength({ min: 2 }).withMessage('Vorname muss mindestens 2 Zeichen lang sein'),
  body('contactData.lastName').trim().isLength({ min: 2 }).withMessage('Nachname muss mindestens 2 Zeichen lang sein'),
  body('contactData.email').isEmail().withMessage('Gültige E-Mail-Adresse erforderlich'),
  body('contactData.phone').trim().isLength({ min: 5 }).withMessage('Telefonnummer muss mindestens 5 Zeichen lang sein'),
  body('contactData.salutation').isIn(['Herr', 'Frau']).withMessage('Anrede muss Herr oder Frau sein'),
  body('bathroomData.bathroomSize').isFloat({ min: 1, max: 100 }).withMessage('Badezimmergröße muss zwischen 1 und 100 m² liegen')
];

// Smart PDF Generation mit Fallback
async function generatePDFWithFallback(data) {
  const methods = [];
  
  // Priorisiere PDFKit für Windows
  if (pdfServiceAlt) {
    methods.push({ name: 'PDFKit', service: pdfServiceAlt });
  }
  
  if (pdfService) {
    methods.push({ name: 'Puppeteer', service: pdfService });
  }
  
  if (methods.length === 0) {
    throw new Error('Keine PDF-Services verfügbar');
  }
  
  for (const method of methods) {
    try {
      log(`Versuche PDF Generierung mit ${method.name}...`);
      const pdfBuffer = await method.service.generateBathroomPDF(data);
      log(`✅ PDF erfolgreich mit ${method.name} generiert`);
      return { buffer: pdfBuffer, method: method.name };
    } catch (error) {
      console.error(`❌ ${method.name} fehlgeschlagen:`, error.message);
      if (method === methods[methods.length - 1]) {
        throw new Error(`Alle PDF-Methoden fehlgeschlagen. Letzter Fehler: ${error.message}`);
      }
    }
  }
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Bathroom Planner Backend',
    debug: DEBUG,
    environment: process.env.NODE_ENV || 'development',
    pdfServices: {
      pdfkit: !!pdfServiceAlt,
      puppeteer: !!pdfService
    }
  });
});

// PDF Test Endpoints
app.get('/api/test-pdf', async (req, res) => {
  try {
    log('PDF Test Endpoint aufgerufen');
    
    const testData = {
      contactData: {
        salutation: 'Herr',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '030 123456789'
      },
      bathroomData: {
        bathroomSize: 8.5,
        equipment: [],
        qualityLevel: null,
        floorTiles: [],
        wallTiles: [],
        heating: []
      },
      comments: '',
      additionalInfo: {}
    };
    
    const result = await generatePDFWithFallback(testData);
    
    res.json({
      success: true,
      message: 'PDF Test erfolgreich',
      method: result.method,
      size: result.buffer.length
    });
    
  } catch (error) {
    console.error('PDF Test fehlgeschlagen:', error);
    res.status(500).json({
      success: false,
      message: 'PDF Test fehlgeschlagen',
      error: error.message,
      availableServices: {
        pdfkit: !!pdfServiceAlt,
        puppeteer: !!pdfService
      }
    });
  }
});

app.get('/api/test-pdfkit', async (req, res) => {
  if (!pdfServiceAlt) {
    return res.status(404).json({
      success: false,
      message: 'PDFKit Service nicht verfügbar'
    });
  }
  
  try {
    const success = await pdfServiceAlt.testPDFGeneration();
    res.json({
      success: true,
      message: 'PDFKit Test erfolgreich',
      pdfkitWorking: success
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'PDFKit Test fehlgeschlagen',
      error: error.message
    });
  }
});

app.get('/api/test-puppeteer', async (req, res) => {
  if (!pdfService) {
    return res.status(404).json({
      success: false,
      message: 'Puppeteer Service nicht verfügbar'
    });
  }
  
  try {
    const success = await pdfService.testPDFGeneration();
    res.json({
      success: true,
      message: 'Puppeteer Test erfolgreich',
      puppeteerWorking: success
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Puppeteer Test fehlgeschlagen',
      error: error.message
    });
  }
});

// E-Mail Test Endpoint  
app.get('/api/test-email', async (req, res) => {
  try {
    log('E-Mail Test Endpoint aufgerufen');
    
    const emailConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
    
    if (!emailConfigured) {
      return res.json({
        success: false,
        message: 'E-Mail nicht konfiguriert',
        configured: false,
        missing: {
          SMTP_HOST: !process.env.SMTP_HOST,
          SMTP_USER: !process.env.SMTP_USER,
          SMTP_PASS: !process.env.SMTP_PASS
        }
      });
    }
    
    const connectionOk = await emailService.testConnection();
    
    res.json({
      success: connectionOk,
      message: connectionOk ? 'E-Mail Verbindung erfolgreich' : 'E-Mail Verbindung fehlgeschlagen',
      configured: true
    });
    
  } catch (error) {
    console.error('E-Mail Test fehlgeschlagen:', error);
    res.status(500).json({
      success: false,
      message: 'E-Mail Test fehlgeschlagen',
      error: error.message
    });
  }
});

// Hauptendpoint
app.post('/api/send-bathroom-configuration', validateBathroomConfig, async (req, res) => {
  const startTime = Date.now();
  
  try {
    log('Neue Badkonfigurator Anfrage empfangen');
    
    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      log('Validierungsfehler:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validierungsfehler',
        errors: errors.array()
      });
    }

    const { contactData, bathroomData, comments, additionalInfo } = req.body;

    log('Verarbeite Anfrage für:', `${contactData.firstName} ${contactData.lastName}`);

    // Generate PDF mit Fallback-System
    log('Starte PDF Generierung...');
    let pdfResult;
    try {
      pdfResult = await generatePDFWithFallback({
        contactData,
        bathroomData,
        comments,
        additionalInfo
      });
      log(`PDF erfolgreich generiert mit ${pdfResult.method}, Größe: ${pdfResult.buffer.length} bytes`);
    } catch (pdfError) {
      console.error('❌ PDF Generierung komplett fehlgeschlagen:', pdfError.message);
      
      return res.status(500).json({
        success: false,
        message: 'PDF konnte nicht erstellt werden. Bitte versuchen Sie es erneut.',
        error: 'PDF_GENERATION_FAILED',
        details: DEBUG ? pdfError.message : undefined,
        availableServices: {
          pdfkit: !!pdfServiceAlt,
          puppeteer: !!pdfService
        }
      });
    }

    // Check if email is configured
    const emailConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
    
    if (!emailConfigured) {
      log('E-Mail nicht konfiguriert, nur PDF wurde erstellt');
      return res.json({
        success: true,
        message: 'Vielen Dank für Ihre Anfrage! Ihre Badkonfiguration wurde erfasst.',
        timestamp: new Date().toISOString(),
        referenceId: `BAD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        pdfGenerated: true,
        pdfMethod: pdfResult.method,
        emailSent: false,
        note: 'E-Mail Service wird derzeit konfiguriert'
      });
    }

    // Send emails if configured
    log('Starte E-Mail Versand...');
    try {
      const emailResults = await Promise.allSettled([
        emailService.sendToCompany({
          contactData,
          bathroomData,
          comments,
          additionalInfo,
          pdfBuffer: pdfResult.buffer
        }),
        emailService.sendConfirmationToCustomer({
          contactData,
          pdfBuffer: pdfResult.buffer
        })
      ]);

      const companyEmailResult = emailResults[0];
      const customerEmailResult = emailResults[1];

      if (companyEmailResult.status === 'rejected') {
        console.error('Fehler beim Senden der E-Mail an die Firma:', companyEmailResult.reason);
        return res.status(500).json({
          success: false,
          message: 'Fehler beim Senden der E-Mail. Bitte versuchen Sie es erneut.',
          error: 'EMAIL_SEND_FAILED'
        });
      }

      let responseMessage = 'Vielen Dank für Ihre Anfrage! Wir haben Ihre Badkonfiguration erhalten und werden uns in Kürze bei Ihnen melden.';
      
      if (customerEmailResult.status === 'rejected') {
        console.error('Fehler beim Senden der Bestätigungs-E-Mail:', customerEmailResult.reason);
        responseMessage += ' Die Bestätigungs-E-Mail konnte nicht versendet werden, aber Ihre Anfrage wurde erfolgreich übermittelt.';
      }

      log('E-Mail Versand abgeschlossen');

      res.json({
        success: true,
        message: responseMessage,
        timestamp: new Date().toISOString(),
        referenceId: `BAD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        pdfGenerated: true,
        pdfMethod: pdfResult.method,
        emailSent: true,
        processingTime: `${Date.now() - startTime}ms`
      });

    } catch (emailError) {
      console.error('E-Mail Fehler:', emailError);
      return res.status(500).json({
        success: false,
        message: 'PDF wurde erstellt, aber E-Mail konnte nicht versendet werden.',
        error: 'EMAIL_SERVICE_ERROR',
        pdfGenerated: true,
        pdfMethod: pdfResult.method,
        emailSent: false
      });
    }

  } catch (error) {
    console.error('💥 Unerwarteter Fehler:', error);
    res.status(500).json({
      success: false,
      message: 'Ein unerwarteter Fehler ist aufgetreten.',
      error: 'GENERAL_ERROR',
      details: DEBUG ? error.message : undefined,
      processingTime: `${Date.now() - startTime}ms`
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Ein interner Serverfehler ist aufgetreten.',
    error: DEBUG ? err.message : 'INTERNAL_ERROR'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint nicht gefunden'
  });
});

// Startup checks
async function startupChecks() {
  console.log('🔍 Führe Startup-Checks durch...');
  
  // Check PDFKit Service
  if (pdfServiceAlt) {
    try {
      console.log('📄 Teste PDFKit Service...');
      const pdfkitWorks = await pdfServiceAlt.testPDFGeneration();
      console.log(pdfkitWorks ? '✅ PDFKit Service funktioniert' : '❌ PDFKit Service hat Probleme');
    } catch (error) {
      console.error('❌ PDFKit Service Test fehlgeschlagen:', error.message);
    }
  }
  
  // Check Puppeteer Service
  if (pdfService) {
    try {
      console.log('📄 Teste Puppeteer Service...');
      const puppeteerWorks = await pdfService.testPDFGeneration();
      console.log(puppeteerWorks ? '✅ Puppeteer Service funktioniert' : '❌ Puppeteer Service hat Probleme');
    } catch (error) {
      console.error('❌ Puppeteer Service Test fehlgeschlagen:', error.message);
    }
  }
  
  // Check Email Service
  const emailConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  if (emailConfigured) {
    try {
      console.log('📧 Teste E-Mail Service...');
      const emailWorks = await emailService.testConnection();
      console.log(emailWorks ? '✅ E-Mail Service funktioniert' : '❌ E-Mail Service hat Probleme');
    } catch (error) {
      console.error('❌ E-Mail Service Test fehlgeschlagen:', error.message);
    }
  } else {
    console.log('⚠️ E-Mail Service nicht konfiguriert');
  }
}

app.listen(PORT, async () => {
  console.log('\n🚀 Badrechner Backend gestartet!');
  console.log(`📡 Server läuft auf: http://localhost:${PORT}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:4200'}`);
  console.log(`🔧 Debug Mode: ${DEBUG ? 'EIN' : 'AUS'}`);
  console.log(`📧 E-Mail Service: ${process.env.SMTP_HOST ? 'Konfiguriert' : 'Nicht konfiguriert'}`);
  
  console.log('\n📄 PDF Services:');
  console.log(`   PDFKit:    ${pdfServiceAlt ? '✅ Verfügbar' : '❌ Nicht verfügbar'}`);
  console.log(`   Puppeteer: ${pdfService ? '✅ Verfügbar' : '❌ Nicht verfügbar'}`);
  
  console.log('\n🧪 Test-Endpoints:');
  console.log(`   Health Check:      http://localhost:${PORT}/api/health`);
  console.log(`   PDF Test:          http://localhost:${PORT}/api/test-pdf`);
  console.log(`   PDFKit Test:       http://localhost:${PORT}/api/test-pdfkit`);
  console.log(`   Puppeteer Test:    http://localhost:${PORT}/api/test-puppeteer`);
  console.log(`   E-Mail Test:       http://localhost:${PORT}/api/test-email`);
  
  console.log('\n' + '='.repeat(60));
  
  await startupChecks();
  
  console.log('='.repeat(60));
  console.log('✨ Backend bereit für Anfragen!\n');
});