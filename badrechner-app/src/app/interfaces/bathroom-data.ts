import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  BathroomData, 
  EquipmentItem, 
  EquipmentOption,
  QualityLevel, 
  TileOption, 
  HeatingOption, 
  ContactData 
} from '../interfaces';

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
        imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&q=80',
        iconUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&q=80',
        popupDetails: {
          options: [
            {
              id: 'wc-mit-spuelrand',
              name: 'Mit Spülrand',
              description: 'Klassisches WC mit Spülrand für eine gründliche Reinigung',
              imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&q=80',
              selected: false
            },
            {
              id: 'wc-spuelrandlos',
              name: 'Spülrandlos',
              description: 'Modernes spülrandloses WC für einfache Reinigung und Hygiene',
              imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&q=80',
              selected: false
            }
          ]
        }
      },
      {
        id: 'waschbecken',
        name: 'Waschbecken',
        selected: false,
        imageUrl: 'https://images.unsplash.com/photo-1580229831176-f165b43e50e7?w=300&q=80',
        iconUrl: 'https://images.unsplash.com/photo-1580229831176-f165b43e50e7?w=300&q=80',
        popupDetails: {
          options: [
            {
              id: 'waschbecken-wandhaengend',
              name: 'Wandhängendes Waschbecken',
              description: 'Platzsparendes wandhängendes Waschbecken',
              imageUrl: 'https://images.unsplash.com/photo-1580229831176-f165b43e50e7?w=300&q=80',
              selected: false
            },
            {
              id: 'waschbecken-aufsatz',
              name: 'Aufsatzwaschbecken mit Unterschrank',
              description: 'Elegantes Aufsatzwaschbecken mit praktischem Unterschrank',
              imageUrl: 'https://images.unsplash.com/photo-1580229831176-f165b43e50e7?w=300&q=80',
              selected: false
            }
          ]
        }
      },
      {
        id: 'dusche',
        name: 'Dusche',
        selected: false,
        imageUrl: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=300&q=80',
        iconUrl: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=300&q=80',
        popupDetails: {
          options: [
            {
              id: 'dusche-duschtasse',
              name: 'Dusche mit Duschtasse und Aufputz Armatur',
              description: 'Klassische Dusche mit Duschtasse und sichtbarer Armatur',
              imageUrl: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=300&q=80',
              selected: false
            },
            {
              id: 'dusche-ebenerdig',
              name: 'Ebenerdige Dusche mit Unterputz Armatur',
              description: 'Moderne ebenerdige Dusche mit eleganter Unterputz-Armatur',
              imageUrl: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=300&q=80',
              selected: false
            }
          ]
        }
      },
      {
        id: 'badewanne',
        name: 'Badewanne',
        selected: false,
        imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=300&q=80',
        iconUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=300&q=80',
        popupDetails: {
          options: [
            {
              id: 'badewanne-gefliest',
              name: 'Badewanne gefliest',
              description: 'Eingebaute geflieste Badewanne',
              imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=300&q=80',
              selected: false
            },
            {
              id: 'badewanne-freistehend',
              name: 'Badewanne freistehend',
              description: 'Elegante freistehende Badewanne als Highlight',
              imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=300&q=80',
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
        imageUrl: 'https://images.unsplash.com/photo-1604014238170-1ddc2a7d93c1?w=300&q=80',
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
        imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=300&q=80',
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
        imageUrl: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=300&q=80',
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
          imageUrl: 'https://images.unsplash.com/photo-1559034650-e91f6e16a06f?w=300&q=80',
          selected: false,
          type: 'floor'
        },
        {
          id: 'grosse-bodenfliesen',
          name: 'Große Bodenfliesen',
          imageUrl: 'https://images.unsplash.com/photo-1562116238-1b5a2f7e4b50?w=300&q=80',
          selected: false,
          type: 'floor'
        },
        {
          id: 'mosaik-bodenfliesen',
          name: 'Mosaik Bodenfliesen',
          imageUrl: 'https://images.unsplash.com/photo-1582119269450-70cc6b4eaae5?w=300&q=80',
          selected: false,
          type: 'floor'
        },
        {
          id: 'keine-bodenfliesen',
          name: 'Keine Bodenfliesen',
          imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80',
          selected: false,
          type: 'floor'
        }
      ],
      wall: [
        {
          id: 'normale-wandfliesen',
          name: 'Normale Wandfliesen',
          imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&q=80',
          selected: false,
          type: 'wall'
        },
        {
          id: 'grosse-wandfliesen',
          name: 'Große Wandfliesen',
          imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&q=80',
          selected: false,
          type: 'wall'
        },
        {
          id: 'mosaik-wandfliesen',
          name: 'Mosaik Wandfliesen',
          imageUrl: 'https://images.unsplash.com/photo-1549304166-d91a5dba34c4?w=300&q=80',
          selected: false,
          type: 'wall'
        },
        {
          id: 'keine-wandfliesen',
          name: 'Keine Wandfliesen',
          imageUrl: 'https://images.unsplash.com/photo-1560449752-94fb4aea6472?w=300&q=80',
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
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80',
        selected: false
      },
      {
        id: 'fussbodenheizung',
        name: 'Fußbodenheizung',
        imageUrl: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=300&q=80',
        selected: false
      }
    ];
  }
}