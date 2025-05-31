export interface EquipmentOption {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  selected: boolean;
}

export interface EquipmentItem {
  id: string;
  name: string;
  selected: boolean;
  imageUrl: string;
  iconUrl: string;
  popupDetails: {
    options: EquipmentOption[];
  };
}

export interface QualityLevel {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  selected: boolean;
  features: string[];
}

export interface ContactData {
  salutation: 'Herr' | 'Frau';
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface TileOption {
  id: string;
  name: string;
  imageUrl: string;
  selected: boolean;
  type: 'floor' | 'wall';
}

export interface HeatingOption {
  id: string;
  name: string;
  imageUrl: string;
  selected: boolean;
}

export interface BathroomData {
  equipment: EquipmentItem[];
  bathroomSize: number;
  qualityLevel: QualityLevel | null;
  floorTiles: string[];
  wallTiles: string[];
  heating: string[];
  additionalInfo: string[];
  comments: string;
  contactData: ContactData;
}