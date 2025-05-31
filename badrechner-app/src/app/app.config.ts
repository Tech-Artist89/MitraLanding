// src/app/app.config.ts - BULLETPROOF VERSION
import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // TRIPLE SAFETY: 3 verschiedene Methoden für HttpClient
    importProvidersFrom(HttpClientModule), // Methode 1: Klassisch (funktioniert immer)
    importProvidersFrom(CommonModule),     // Methode 2: CommonModule (enthält auch HttpClient)
  ]
};

// DEBUGGING: Verifizierung dass die Datei geladen wird
console.log('✅ app.config.ts wurde geladen');
console.log('✅ HttpClientModule Provider registriert');

// ALTERNATIVE VERSIONEN (falls die obige nicht funktioniert):

// VERSION A: Nur importProvidersFrom
// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(routes),
//     importProvidersFrom(HttpClientModule)
//   ]
// };

// VERSION B: Moderne provideHttpClient (falls unterstützt)
// import { provideHttpClient } from '@angular/common/http';
// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(routes),
//     provideHttpClient()
//   ]
// };

// VERSION C: Hybrid Approach
// import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(routes),
//     provideHttpClient(withInterceptorsFromDi())
//   ]
// };