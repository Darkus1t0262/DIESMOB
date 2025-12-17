export type ComplianceStatus = 'Complies' | 'Observation' | 'Infraction';

export type FuelType = 'Extra' | 'Super' | 'Diesel';

export interface StationFuel {
  type: FuelType;
  price: number;
  dailyLitersSold: number;
}

export interface Station {
  id: string;
  name: string;
  city: string;
  province: string;
  lat: number;
  lng: number;
  complianceStatus: ComplianceStatus;
  lastAuditDate: string;
  fuels: StationFuel[];
}

export type IssueType = 'Price mismatch' | 'Quantity fraud' | 'Closed station' | 'Other';

export interface Complaint {
  id: string;
  stationId: string;
  stationName: string;
  createdAt: string;
  issueType: IssueType;
  description: string;
  gps?: { lat: number; lng: number };
  photoUri?: string;
  status: 'Pending' | 'Resolved';
}

export interface Audit {
  id: string;
  stationId: string;
  inspectorName: string;
  createdAt: string;
  checklistScore: number;
  observations: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface ReportFilters {
  period: 'Week' | 'Month' | 'Quarter' | 'Year';
  type: 'Compliance' | 'Price analysis' | 'Complaints';
  startDate?: string;
  endDate?: string;
}

export interface ReportSummary {
  title: string;
  createdAt: string;
  keyFigures: {
    name: string;
    value: number;
  }[];
  notes: string;
}
