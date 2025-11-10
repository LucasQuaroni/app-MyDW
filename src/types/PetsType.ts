interface IPets {
  _id: string;
  name: string;
  description: string;
  birthDate: string;
  gender: string;
  breed: string;
  isCastrated: boolean;
  owner: string;
  isActive: boolean;
  photos?: string[];
  medicalInformation?: string;
  temperament?: string;
  tagId?: string;
  tagActivatedAt?: Date;
  isPublicProfile?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TagInfo {
  isActivated: boolean;
  canActivate?: boolean;
  needsLogin?: boolean;
  message?: string;
  tagId?: string;
  pet?: {
    name: string;
    description: string;
    breed: string;
    gender: string;
    photos?: string[];
    temperament?: string;
    medicalInformation?: string;
  };
  owner?: {
    name: string;
    phone: string;
    email: string;
  };
}

export default IPets;
