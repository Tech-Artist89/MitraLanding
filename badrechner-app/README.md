# 🛁 Badrechner App - Interaktiver Badkonfigurator

Eine moderne, benutzerfreundliche Webanwendung zur Planung und Konfiguration von Badezimmern in 5 einfachen Schritten.

![Angular](https://img.shields.io/badge/Angular-18-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple?logo=bootstrap)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Features

### ✨ Hauptfunktionen
- **5-Schritte Konfigurator** für die komplette Badplanung
- **Interaktive Ausstattungsauswahl** mit visuellen Checkboxes
- **Größenbestimmung** mit einem benutzerfreundlichen Range-Slider
- **Qualitätslevel-Auswahl** (Classic, Hochwertig, Premium)
- **Fliesen- und Heizungsoptionen** mit Bildvorschau
- **Kontaktformular** mit Validierung
- **Responsive Design** für alle Geräte
- **PDF-Export** der Konfiguration
- **E-Mail-Integration** für Anfragen

### 🎨 UI/UX Features
- Moderne, saubere Benutzeroberfläche
- Fortschrittsanzeige während des Konfigurationsprozesses
- Popup-Modalfenster für detaillierte Optionen
- Vollständig responsive Bootstrap-Design
- Dunkle/helle Theme-Unterstützung

## 🛠️ Technologie-Stack

### Frontend
- **Angular 18** - Hauptframework
- **TypeScript 5.0** - Typisierte Programmierung
- **Bootstrap 5.3** - CSS Framework
- **Bootstrap Icons** - Icon-Set
- **RxJS** - Reaktive Programmierung

### Tools & Build
- **Angular CLI** - Entwicklungstools
- **Webpack** - Module Bundler
- **SCSS** - CSS Preprocessor
- **ESLint** - Code Linting

### Libraries
- **jsPDF** - PDF-Generierung
- **html2canvas** - HTML zu Canvas Konvertierung

## 📋 Voraussetzungen

- **Node.js** (Version 18 oder höher)
- **npm** (Version 9 oder höher)
- **Angular CLI** (Global installiert)

```bash
# Angular CLI global installieren
npm install -g @angular/cli
```

## ⚡ Installation & Setup

### 1. Repository klonen
```bash
git clone https://github.com/ihr-username/badrechner-app.git
cd badrechner-app
```

### 2. Dependencies installieren
```bash
npm install
```

### 3. Bootstrap installieren
```bash
npm install bootstrap bootstrap-icons
```

### 4. Entwicklungsserver starten
```bash
ng serve
```

Die Anwendung ist dann unter `http://localhost:4200` erreichbar.

## 📁 Projektstruktur

```
src/
├── app/
│   ├── components/
│   │   ├── bathroom-configurator/          # Hauptkonfigurator
│   │   ├── page-one/                       # Ausstattungsauswahl
│   │   ├── page-two/                       # Qualitätslevel
│   │   ├── page-three/                     # Fliesen
│   │   ├── page-four/                      # Heizung
│   │   ├── page-five/                      # Kontakt
│   │   └── shared/
│   │       ├── progress-indicator/         # Fortschrittsanzeige
│   │       ├── image-checkbox/             # Bild-Checkbox Component
│   │       ├── popup-modal/                # Modal für Details
│   │       ├── range-slider/               # Größen-Slider
│   │       └── navigation-buttons/         # Navigation
│   ├── services/
│   │   ├── bathroom-data.service.ts        # Datenmanagement
│   │   ├── navigation.service.ts           # Navigation Logic
│   │   ├── pdf-generator.service.ts        # PDF Export
│   │   └── email.service.ts                # E-Mail Integration
│   ├── interfaces/
│   │   └── index.ts                        # TypeScript Interfaces
│   ├── guards/
│   │   └── page-guard.guard.ts             # Route Guards
│   └── app.routes.ts                       # Routing Konfiguration
├── assets/
│   └── images/                             # Bilder und Assets
├── styles.scss                            # Globale Styles
└── index.html                             # HTML Entry Point
```

## 🔧 Konfiguration

### Environment Setup
Erstellen Sie Environment-Dateien für verschiedene Umgebungen:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  emailServiceUrl: 'your-email-service-url'
};
```

### Bootstrap Konfiguration
In `angular.json` sind Bootstrap CSS und JS bereits konfiguriert:

```json
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "node_modules/bootstrap-icons/font/bootstrap-icons.css",
  "src/styles.scss"
],
"scripts": [
  "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
]
```

## 🚦 Verfügbare Scripts

| Command | Beschreibung |
|---------|-------------|
| `ng serve` | Startet Entwicklungsserver |
| `ng build` | Erstellt Production Build |
| `ng test` | Führt Unit Tests aus |
| `ng lint` | Code Linting |
| `ng e2e` | End-to-End Tests |

## 📱 Responsive Design

Die App ist vollständig responsive und unterstützt:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (< 768px)

### Breakpoints
```scss
// Verwendete Bootstrap Breakpoints
$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px
);
```

## 🎨 Styling Guide

### CSS Variablen
```scss
:root {
  --primary-color: #0066cc;
  --primary-dark: #004499;
  --secondary-color: #f8f9fa;
  --accent-color: #28a745;
  --text-color: #333;
  --border-color: #dee2e6;
}
```

### Component Styling
- Jede Component hat eigene SCSS-Styles
- Verwendung von Bootstrap-Utility-Klassen
- CSS Custom Properties für Konsistenz

## 🔄 State Management

Das State Management erfolgt über **RxJS BehaviorSubjects**:

```typescript
// Zentrale Datenverwaltung
bathroomData$ = new BehaviorSubject<BathroomData>(initialData);

// Subscription in Components
this.bathroomDataService.bathroomData$
  .pipe(takeUntil(this.destroy$))
  .subscribe(data => {
    this.bathroomData = data;
  });
```

## 🔒 Security

### Implementierte Sicherheitsmaßnahmen
- **Route Guards** für Seitennavigation
- **Form Validation** mit Angular Reactive Forms
- **XSS Protection** durch Angular's sanitization
- **Type Safety** durch TypeScript

## 🚀 Deployment

### Production Build
```bash
ng build --configuration production
```

### Docker Deployment
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/badrechner-app /usr/share/nginx/html
EXPOSE 80
```

### Netlify/Vercel
1. Connect Repository
2. Build Command: `ng build`
3. Publish Directory: `dist/badrechner-app`

## 🐛 Troubleshooting

### Häufige Probleme

#### Bootstrap Styles werden nicht geladen
```bash
# Bootstrap neu installieren
npm uninstall bootstrap bootstrap-icons
npm install bootstrap bootstrap-icons
```

#### Interface Import Fehler
```typescript
// Verwenden Sie zentrale Interface-Datei
import { BathroomData, EquipmentItem } from '../interfaces';
```

#### Range Slider Binding Fehler
```typescript
// Stellen Sie sicher, dass @Input() value in range-slider.component.ts vorhanden ist
@Input() value: number = 0;
```

### Development Tools
```bash
# Cache löschen
npm start -- --delete-output-path

# Dependencies aktualisieren
ng update

# Angular Version prüfen
ng version
```

## 📝 Entwicklungsrichtlinien

### Code Style
- Verwenden Sie **TypeScript strict mode**
- Folgen Sie **Angular Style Guide**
- Implementieren Sie **OnDestroy** für Memory Leaks
- Verwenden Sie **Reactive Forms** für Formulare

### Component Patterns
```typescript
// Beispiel Component Structure
export class YourComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Subscriptions mit takeUntil
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## 🤝 Contributing

1. Fork das Repository
2. Erstellen Sie einen Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit Ihre Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffnen Sie eine Pull Request

## 📄 License

Dieses Projekt steht unter der MIT License. Siehe [LICENSE](LICENSE) für Details.

## 👥 Team

- **Entwicklung**: [Ihr Name]
- **Design**: [Designer Name]
- **Projektleitung**: [PM Name]

## 📞 Support

Bei Fragen oder Problemen:
- 📧 E-Mail: support@ihre-firma.de
- 📞 Telefon: 030 / 123 456 789
- 🌐 Website: [www.ihre-firma.de](https://www.ihre-firma.de)

---

**Entwickelt mit ❤️ für die perfekte Badplanung**