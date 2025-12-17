import { Audit, Complaint, Station } from '@/types';

export const stations: Station[] = [
  {
    id: 'st-quito-1',
    name: 'Estación La Carolina',
    city: 'Quito',
    province: 'Pichincha',
    lat: -0.182, // Quito area
    lng: -78.484,
    complianceStatus: 'Complies',
    lastAuditDate: '2024-06-02',
    fuels: [
      { type: 'Extra', price: 2.46, dailyLitersSold: 12500 },
      { type: 'Super', price: 3.38, dailyLitersSold: 7500 },
      { type: 'Diesel', price: 1.75, dailyLitersSold: 18750 },
    ],
  },
  {
    id: 'st-quito-2',
    name: 'Estación Mitad del Mundo',
    city: 'Quito',
    province: 'Pichincha',
    lat: 0.002, // north Quito
    lng: -78.455,
    complianceStatus: 'Observation',
    lastAuditDate: '2024-05-18',
    fuels: [
      { type: 'Extra', price: 2.52, dailyLitersSold: 9000 },
      { type: 'Diesel', price: 1.8, dailyLitersSold: 16000 },
    ],
  },
  {
    id: 'st-gye-1',
    name: 'Gasolinera Malecón',
    city: 'Guayaquil',
    province: 'Guayas',
    lat: -2.1901,
    lng: -79.8862,
    complianceStatus: 'Infraction',
    lastAuditDate: '2024-04-28',
    fuels: [
      { type: 'Extra', price: 2.6, dailyLitersSold: 21000 },
      { type: 'Super', price: 3.5, dailyLitersSold: 9500 },
      { type: 'Diesel', price: 1.95, dailyLitersSold: 23500 },
    ],
  },
  {
    id: 'st-cuenca-1',
    name: 'Estación Tomebamba',
    city: 'Cuenca',
    province: 'Azuay',
    lat: -2.9006,
    lng: -79.0045,
    complianceStatus: 'Complies',
    lastAuditDate: '2024-05-30',
    fuels: [
      { type: 'Extra', price: 2.44, dailyLitersSold: 11200 },
      { type: 'Super', price: 3.3, dailyLitersSold: 5200 },
      { type: 'Diesel', price: 1.72, dailyLitersSold: 13100 },
    ],
  },
  {
    id: 'st-manta-1',
    name: 'Puerto Azul Combustibles',
    city: 'Manta',
    province: 'Manabí',
    lat: -0.9677,
    lng: -80.7089,
    complianceStatus: 'Observation',
    lastAuditDate: '2024-06-10',
    fuels: [
      { type: 'Extra', price: 2.49, dailyLitersSold: 14000 },
      { type: 'Diesel', price: 1.78, dailyLitersSold: 15600 },
    ],
  },
];

export const complaintsSeed: Complaint[] = [
  {
    id: 'cmp-1',
    stationId: 'st-gye-1',
    stationName: 'Gasolinera Malecón',
    createdAt: '2024-06-15T09:00:00Z',
    issueType: 'Quantity fraud',
    description: 'Cliente reporta menor cantidad entregada.',
    status: 'Pending',
  },
  {
    id: 'cmp-2',
    stationId: 'st-quito-2',
    stationName: 'Estación Mitad del Mundo',
    createdAt: '2024-06-12T13:00:00Z',
    issueType: 'Price mismatch',
    description: 'Precio en bomba no coincide con listado.',
    status: 'Resolved',
  },
];

export const auditsSeed: Audit[] = [
  {
    id: 'aud-1',
    stationId: 'st-quito-1',
    inspectorName: 'Ing. Pérez',
    createdAt: '2024-06-05T10:00:00Z',
    checklistScore: 92,
    observations: 'Documentación al día. Señalética adecuada.',
    status: 'Approved',
  },
  {
    id: 'aud-2',
    stationId: 'st-gye-1',
    inspectorName: 'Ing. Zambrano',
    createdAt: '2024-06-08T15:00:00Z',
    checklistScore: 68,
    observations: 'Fugas menores en tubería de carga. Requiere seguimiento.',
    status: 'Pending',
  },
  {
    id: 'aud-3',
    stationId: 'st-cuenca-1',
    inspectorName: 'Ing. Cárdenas',
    createdAt: '2024-06-02T11:30:00Z',
    checklistScore: 74,
    observations: 'Inventario conciliado. Se sugiere capacitar en bioseguridad.',
    status: 'Rejected',
  },
];

export const reportSummaries = [
  {
    title: 'Resumen de cumplimiento nacional',
    createdAt: '2024-06-01',
    keyFigures: [
      { name: 'Estaciones revisadas', value: 82 },
      { name: 'Observaciones', value: 14 },
      { name: 'Infracciones', value: 6 },
    ],
    notes: 'La tendencia de cumplimiento mejora en la Sierra central.',
  },
  {
    title: 'Análisis de precios Costa',
    createdAt: '2024-05-20',
    keyFigures: [
      { name: 'Muestreos', value: 45 },
      { name: 'Desviaciones detectadas', value: 7 },
      { name: 'Ajustes realizados', value: 4 },
    ],
    notes: 'Se detectaron variaciones por retrasos en actualización de tablas.',
  },
];
