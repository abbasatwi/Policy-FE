export interface policy {
    id?: number;
    name: string;
    description: string;
    creationDate: String | undefined;
    effectiveDate: string;
    expiryDate: string;
    policyTypeId?: number; 
    policyMembers?: string[];
  }
  