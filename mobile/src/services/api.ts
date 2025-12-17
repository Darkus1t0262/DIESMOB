import AsyncStorage from '@react-native-async-storage/async-storage';
import { auditsSeed, complaintsSeed, reportSummaries, stations } from '@/mocks/data';
import { Audit, Complaint, ReportFilters, Station } from '@/types';

let failureRate = 0.08;
let complaints = [...complaintsSeed];
let audits = [...auditsSeed];

const randomDelay = () => 300 + Math.random() * 500;

const maybeFail = () => {
  if (Math.random() < failureRate) {
    throw new Error('Falla simulada en la red local');
  }
};

async function simulate<T>(fn: () => T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, randomDelay()));
  maybeFail();
  return fn();
}

export const api = {
  setFailureRate: (rate: number) => {
    failureRate = rate;
  },
  async getStations(): Promise<Station[]> {
    return simulate(() => stations);
  },
  async getStationById(id: string): Promise<Station | undefined> {
    return simulate(() => stations.find((s) => s.id === id));
  },
  async getComplaints(): Promise<Complaint[]> {
    return simulate(() => complaints);
  },
  async createComplaint(payload: Omit<Complaint, 'id' | 'status' | 'createdAt'>): Promise<Complaint> {
    return simulate(() => {
      const newComplaint: Complaint = {
        ...payload,
        id: `cmp-${Date.now()}`,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };
      complaints = [newComplaint, ...complaints];
      return newComplaint;
    });
  },
  async getAudits(): Promise<Audit[]> {
    return simulate(() => audits);
  },
  async approveAudit(id: string): Promise<Audit | undefined> {
    return simulate(() => {
      audits = audits.map((a) => (a.id === id ? { ...a, status: 'Approved' } : a));
      return audits.find((a) => a.id === id);
    });
  },
  async rejectAudit(id: string): Promise<Audit | undefined> {
    return simulate(() => {
      audits = audits.map((a) => (a.id === id ? { ...a, status: 'Rejected' } : a));
      return audits.find((a) => a.id === id);
    });
  },
  async getReportSummary(filters: ReportFilters) {
    return simulate(() => ({
      filters,
      summaries: reportSummaries,
      totals: {
        stations: stations.length,
        complaints: complaints.length,
        audits: audits.length,
      },
    }));
  },
  async login(username: string, password: string) {
    if (!username || !password) {
      throw new Error('Credenciales requeridas');
    }
    return simulate(async () => {
      const token = `token-${Date.now()}`;
      await AsyncStorage.setItem('session_token', token);
      return token;
    });
  },
  async logout() {
    await AsyncStorage.removeItem('session_token');
  },
};
