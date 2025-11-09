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
  createdAt: Date;
  updatedAt: Date;
}
export default IPets;
