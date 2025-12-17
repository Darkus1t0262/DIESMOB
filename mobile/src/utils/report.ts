import { ReportFilters } from '@/types';

interface ReportData {
  complianceRate: number;
  averagePrice: number;
  pendingComplaints: number;
}

export function aggregateReportData(filters: ReportFilters, sample: ReportData[]): ReportData {
  if (sample.length === 0) {
    return { complianceRate: 0, averagePrice: 0, pendingComplaints: 0 };
  }
  const filtered = sample.filter(() => true); // placeholder for filter logic
  const complianceRate = filtered.reduce((acc, cur) => acc + cur.complianceRate, 0) / filtered.length;
  const averagePrice = filtered.reduce((acc, cur) => acc + cur.averagePrice, 0) / filtered.length;
  const pendingComplaints = filtered.reduce((acc, cur) => acc + cur.pendingComplaints, 0);
  return {
    complianceRate: Number(complianceRate.toFixed(2)),
    averagePrice: Number(averagePrice.toFixed(2)),
    pendingComplaints,
  };
}

export const defaultReportData: ReportData[] = [
  { complianceRate: 0.86, averagePrice: 2.4, pendingComplaints: 12 },
  { complianceRate: 0.78, averagePrice: 2.55, pendingComplaints: 9 },
  { complianceRate: 0.9, averagePrice: 2.42, pendingComplaints: 6 },
];
