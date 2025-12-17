import { z } from 'zod';

export const complaintSchema = z.object({
  stationId: z.string().nonempty('Seleccione estación'),
  stationName: z.string().nonempty(),
  issueType: z.string().nonempty('Seleccione tipo de denuncia'),
  description: z.string().min(10, 'Describa el problema con más detalle'),
  photoUri: z.string().optional(),
  gps: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});

export type ComplaintForm = z.infer<typeof complaintSchema>;
