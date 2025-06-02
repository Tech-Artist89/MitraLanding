// src/app/services/bathroom-data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BathroomData, EquipmentItem, EquipmentOption, QualityLevel, TileOption, HeatingOption, ContactData } from '../interfaces';


@Injectable({
  providedIn: 'root'
})
export class BathroomDataService {
  private bathroomDataSubject = new BehaviorSubject<BathroomData>(this.getInitialData());
  public bathroomData$ = this.bathroomDataSubject.asObservable();

  constructor() {}

  private getInitialData(): BathroomData {
    return {
      equipment: this.getInitialEquipment(),
      bathroomSize: 5,
      qualityLevel: null,
      floorTiles: [],
      wallTiles: [],
      heating: [],
      additionalInfo: [],
      comments: '',
      contactData: {
        salutation: 'Herr',
        firstName: '',
        lastName: '',
        phone: '',
        email: ''
      }
    };
  }

  private getInitialEquipment(): EquipmentItem[] {
    return [
      {
        id: 'wc',
        name: 'WC',
        selected: false,
        imageUrl: 'assets/images/checkboxes/wc-icon-120x120.jpeg',
        iconUrl: 'assets/images/checkboxes/wc-icon-120x120.jpeg',
        popupDetails: {
          options: [
            {
              id: 'wc-mit-spuelrand',
              name: 'Mit Spülrand',
              description: 'Klassisches WC mit Spülrand für eine gründliche Reinigung',
              imageUrl: 'assets/images/equipment/wc-mit-spuelrand.jpg',
              selected: false
            },
            {
              id: 'wc-spuelrandlos',
              name: 'Spülrandlos',
              description: 'Modernes spülrandloses WC für einfache Reinigung und Hygiene',
              imageUrl: 'assets/images/equipment/wc-spuelrandlos.jpg',
              selected: false
            }
          ]
        }
      },
      {
        id: 'waschbecken',
        name: 'Waschbecken',
        selected: false,
        imageUrl: 'assets/images/checkboxes/waschbecken-icon.svg',
        iconUrl: 'assets/images/checkboxes/waschbecken-icon.svg',
        popupDetails: {
          options: [
            {
              id: 'waschbecken-wandhaengend',
              name: 'Wandhängendes Waschbecken',
              description: 'Platzsparendes wandhängendes Waschbecken',
              imageUrl: 'assets/images/equipment/waschbecken-wandhaengend.jpg',
              selected: false
            },
            {
              id: 'waschbecken-aufsatz',
              name: 'Aufsatzwaschbecken mit Unterschrank',
              description: 'Elegantes Aufsatzwaschbecken mit praktischem Unterschrank',
              imageUrl: 'assets/images/equipment/waschbecken-aufsatz.jpg',
              selected: false
            }
          ]
        }
      },
      {
        id: 'dusche',
        name: 'Dusche',
        selected: false,
        imageUrl: 'assets/images/checkboxes/dusche-icon.svg',
        iconUrl: 'assets/images/checkboxes/dusche-icon.svg',
        popupDetails: {
          options: [
            {
              id: 'dusche-duschtasse',
              name: 'Dusche mit Duschtasse und Aufputz Armatur',
              description: 'Klassische Dusche mit Duschtasse und sichtbarer Armatur',
              imageUrl: 'assets/images/equipment/dusche-duschtasse.jpg',
              selected: false
            },
            {
              id: 'dusche-ebenerdig',
              name: 'Ebenerdige Dusche mit Unterputz Armatur',
              description: 'Moderne ebenerdige Dusche mit eleganter Unterputz-Armatur',
              imageUrl: 'assets/images/equipment/dusche-ebenerdig.jpg',
              selected: false
            }
          ]
        }
      },
      {
        id: 'badewanne',
        name: 'Badewanne',
        selected: false,
        imageUrl: 'assets/images/checkboxes/badewanne-icon.svg',
        iconUrl: 'assets/images/checkboxes/badewanne-icon.svg',
        popupDetails: {
          options: [
            {
              id: 'badewanne-gefliest',
              name: 'Badewanne gefliest',
              description: 'Eingebaute geflieste Badewanne',
              imageUrl: 'assets/images/equipment/badewanne-gefliest.jpg',
              selected: false
            },
            {
              id: 'badewanne-freistehend',
              name: 'Badewanne freistehend',
              description: 'Elegante freistehende Badewanne als Highlight',
              imageUrl: 'assets/images/equipment/badewanne-freistehend.jpg',
              selected: false
            }
          ]
        }
      }
    ];
  }

  // Getter methods
  getCurrentData(): BathroomData {
    return this.bathroomDataSubject.value;
  }

  // Equipment methods
  updateEquipmentSelection(equipmentId: string, selected: boolean): void {
    const currentData = this.getCurrentData();
    const equipment = currentData.equipment.map(item => 
      item.id === equipmentId ? { ...item, selected } : item
    );
    this.updateData({ equipment });
  }

  updateEquipmentOption(equipmentId: string, optionId: string, selected: boolean): void {
    const currentData = this.getCurrentData();
    const equipment = currentData.equipment.map(item => {
      if (item.id === equipmentId) {
        const options = item.popupDetails.options.map((option: EquipmentOption) =>
          option.id === optionId ? { ...option, selected } : { ...option, selected: false }
        );
        return { ...item, popupDetails: { ...item.popupDetails, options } };
      }
      return item;
    });
    this.updateData({ equipment });
  }

  // Bathroom size methods
  updateBathroomSize(size: number): void {
    this.updateData({ bathroomSize: size });
  }

  // Quality level methods
  updateQualityLevel(qualityLevel: QualityLevel): void {
    this.updateData({ qualityLevel });
  }

  // Tiles methods
  updateFloorTiles(tiles: string[]): void {
    this.updateData({ floorTiles: tiles });
  }

  updateWallTiles(tiles: string[]): void {
    this.updateData({ wallTiles: tiles });
  }

  // Heating methods
  updateHeating(heating: string[]): void {
    this.updateData({ heating });
  }

  // Page 5 methods
  updateAdditionalInfo(info: string[]): void {
    this.updateData({ additionalInfo: info });
  }

  updateComments(comments: string): void {
    this.updateData({ comments });
  }

  updateContactData(contactData: ContactData): void {
    this.updateData({ contactData });
  }

  // Generic update method
  private updateData(updates: Partial<BathroomData>): void {
    const currentData = this.getCurrentData();
    const newData = { ...currentData, ...updates };
    this.bathroomDataSubject.next(newData);
  }

  // Reset data
  resetData(): void {
    this.bathroomDataSubject.next(this.getInitialData());
  }

  // Quality levels data
  getQualityLevels(): QualityLevel[] {
    return [
      {
        id: 'classic',
        name: 'Classic',
        description: 'Gelungene Verbindung von Qualität und fairem Preis',
        imageUrl: 'assets/images/quality/classic-example.jpg',
        selected: false,
        features: [
          'Aufputz Armatur',
          'WC mit Spülrand',
          'Duschtasse',
          'Plastik Duschabtrennung'
        ]
      },
      {
        id: 'hochwertig',
        name: 'Hochwertig',
        description: 'Zeitlos-elegante Produkte in einem höheren Preissegment',
        imageUrl: 'assets/images/quality/hochwertig-example.jpg',
        selected: false,
        features: [
          'Aufputz Armatur',
          'WC ohne Spülrand',
          'Ebenerdige Dusche',
          'Plastik Duschabtrennung'
        ]
      },
      {
        id: 'premium',
        name: 'Premium',
        description: 'Zukunftsweisendes Design und modernste Technik',
        imageUrl: 'assets/images/quality/premium-example.jpg',
        selected: false,
        features: [
          'Unterputz Armatur',
          'Luxus WC',
          'Ebenerdige Dusche',
          'Duschabtrennung Vollverglast'
        ]
      }
    ];
  }

  // Tile options
  getTileOptions(): { floor: TileOption[], wall: TileOption[] } {
    return {
      floor: [
        {
          id: 'normale-bodenfliesen',
          name: 'Normale Bodenfliesen',
          imageUrl: 'assets/images/tiles/normale-bodenfliesen.jpg',
          selected: false,
          type: 'floor'
        },
        {
          id: 'grosse-bodenfliesen',
          name: 'Große Bodenfliesen',
          imageUrl: 'assets/images/tiles/grosse-bodenfliesen.jpg',
          selected: false,
          type: 'floor'
        },
        {
          id: 'mosaik-bodenfliesen',
          name: 'Mosaik Bodenfliesen',
          imageUrl: 'assets/images/tiles/mosaik-bodenfliesen.jpg',
          selected: false,
          type: 'floor'
        },
        {
          id: 'keine-bodenfliesen',
          name: 'Keine Bodenfliesen',
          imageUrl: 'assets/images/tiles/keine-fliesen.jpg',
          selected: false,
          type: 'floor'
        }
      ],
      wall: [
        {
          id: 'normale-wandfliesen',
          name: 'Normale Wandfliesen',
          imageUrl: 'assets/images/tiles/normale-wandfliesen.jpg',
          selected: false,
          type: 'wall'
        },
        {
          id: 'grosse-wandfliesen',
          name: 'Große Wandfliesen',
          imageUrl: 'assets/images/tiles/grosse-wandfliesen.jpg',
          selected: false,
          type: 'wall'
        },
        {
          id: 'mosaik-wandfliesen',
          name: 'Mosaik Wandfliesen',
          imageUrl: 'assets/images/tiles/mosaik-wandfliesen.jpg',
          selected: false,
          type: 'wall'
        },
        {
          id: 'keine-wandfliesen',
          name: 'Keine Wandfliesen',
          imageUrl: 'assets/images/tiles/keine-fliesen.jpg',
          selected: false,
          type: 'wall'
        }
      ]
    };
  }

  // Heating options
  getHeatingOptions(): HeatingOption[] {
    return [
      {
        id: 'heizkoerper',
        name: 'Heizkörper',
        imageUrl: 'assets/images/heating/heizkoerper.jpg',
        selected: false
      },
      {
        id: 'fussbodenheizung',
        name: 'Fußbodenheizung',
        imageUrl: 'assets/images/heating/fussbodenheizung.jpg',
        selected: false
      }
    ];
  }
}