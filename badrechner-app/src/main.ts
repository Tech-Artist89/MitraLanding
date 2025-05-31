// src/main.ts - VERIFIED VERSION
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// DEBUGGING: Logs hinzufügen
console.log('🚀 main.ts wird ausgeführt');
console.log('📝 appConfig:', appConfig);

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    console.log('✅ Angular App erfolgreich gebootstrapt');
  })
  .catch((err) => {
    console.error('❌ Bootstrap Fehler:', err);
    console.error(err);
  });

// ALTERNATIVE: Falls bootstrapApplication Probleme macht
// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { AppModule } from './app/app.module';
// 
// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));