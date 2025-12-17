import { complaintSchema } from '@/utils/validation';

describe('complaintSchema', () => {
  it('validates a correct payload', () => {
    const parsed = complaintSchema.safeParse({
      stationId: 'st-1',
      stationName: 'Demo',
      issueType: 'Price mismatch',
      description: 'Descripción suficientemente larga',
    });
    expect(parsed.success).toBe(true);
  });

  it('fails on short description', () => {
    const parsed = complaintSchema.safeParse({
      stationId: 'st-1',
      stationName: 'Demo',
      issueType: 'Price mismatch',
      description: 'corto',
    });
    expect(parsed.success).toBe(false);
  });
});
