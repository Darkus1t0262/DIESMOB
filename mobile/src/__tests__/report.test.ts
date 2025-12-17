import { aggregateReportData, defaultReportData } from '@/utils/report';
import { ReportFilters } from '@/types';

describe('aggregateReportData', () => {
  it('returns averages for provided sample', () => {
    const filters: ReportFilters = { period: 'Month', type: 'Compliance' };
    const result = aggregateReportData(filters, defaultReportData);
    expect(result.complianceRate).toBeCloseTo(0.85, 2);
    expect(result.averagePrice).toBeCloseTo(2.46, 2);
    expect(result.pendingComplaints).toBeGreaterThan(0);
  });

  it('handles empty data', () => {
    const filters: ReportFilters = { period: 'Month', type: 'Complaints' };
    const result = aggregateReportData(filters, []);
    expect(result).toEqual({ complianceRate: 0, averagePrice: 0, pendingComplaints: 0 });
  });
});
