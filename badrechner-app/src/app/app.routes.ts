// src/app/app.routes.ts - VOLLSTÄNDIGE ROUTING KONFIGURATION
import { Routes } from '@angular/router';
import { PageOneComponent } from './components/page-one/page-one.component';
import { PageTwoComponent } from './components/page-two/page-two.component';
import { PageThreeComponent } from './components/page-three/page-three.component';
import { PageFourComponent } from './components/page-four/page-four.component';
import { PageFiveComponent } from './components/page-five/page-five.component';

export const routes: Routes = [
  { path: '', redirectTo: '/page/1', pathMatch: 'full' },
  { path: 'page/1', component: PageOneComponent },
  { path: 'page/2', component: PageTwoComponent },
  { path: 'page/3', component: PageThreeComponent },
  { path: 'page/4', component: PageFourComponent },
  { path: 'page/5', component: PageFiveComponent }, // ← Stellen Sie sicher, dass diese Route existiert
  { path: '**', redirectTo: '/page/1' } // Fallback für ungültige Routen
];

// DEBUGGING: Prüfen Sie, ob alle Komponenten korrekt importiert sind
// Falls eine Komponente fehlt, bekommen Sie einen Compile-Fehler

// ALTERNATIVE ROUTING (falls Sie lazy loading verwenden):
// export const routes: Routes = [
//   { path: '', redirectTo: '/page/1', pathMatch: 'full' },
//   { 
//     path: 'page/1', 
//     loadComponent: () => import('./components/page-one/page-one.component').then(c => c.PageOneComponent)
//   },
//   { 
//     path: 'page/2', 
//     loadComponent: () => import('./components/page-two/page-two.component').then(c => c.PageTwoComponent)
//   },
//   { 
//     path: 'page/3', 
//     loadComponent: () => import('./components/page-three/page-three.component').then(c => c.PageThreeComponent)
//   },
//   { 
//     path: 'page/4', 
//     loadComponent: () => import('./components/page-four/page-four.component').then(c => c.PageFourComponent)
//   },
//   { 
//     path: 'page/5', 
//     loadComponent: () => import('./components/page-five/page-five.component').then(c => c.PageFiveComponent)
//   },
//   { path: '**', redirectTo: '/page/1' }
// ];