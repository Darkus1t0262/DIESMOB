# DieselSubsidyManager

Prototipo semifuncional para gestionar subsidios de diésel para flotas. Incluye backend en Node.js/Express, base de datos PostgreSQL, almacenamiento de imágenes local y app móvil con React Native + Expo.

## 1. Diseño general de arquitectura
- **App móvil (React Native + Expo):** consume la API, maneja autenticación JWT y permite subir imágenes de vehículos.
- **Backend API (Express):** servicios REST, validación, subida de archivos, lógica de negocio y módulo de IA heurístico.
- **PostgreSQL:** persistencia principal.
- **Redis (opcional):** cache ligero inicializable con `REDIS_URL`.
- **Almacenamiento de imágenes:** carpeta `uploads/` servida estáticamente; fácilmente reemplazable por S3/Cloudinary.
- **Flujo principal:**
  1. Login → backend valida credenciales, emite JWT.
  2. Gestión de vehículos/Conductores/Estaciones → CRUD protegido por roles.
  3. Registro de cargas → valida capacidad de tanque, guarda transacción y expone para reportes.
  4. IA → endpoint que calcula riesgo de anomalía por carga/vehículo usando heurísticas basadas en historial y capacidad.

La separación de servicios (API, DB, cache, almacenamiento) permite escalar cada componente de forma independiente y mantener código modular.

## 2. Modelo de datos
Tablas y relaciones clave:
- `roles (1:N) users`
- `vehicles (1:N) fuel_transactions`
- `drivers (1:N) fuel_transactions`
- `fuel_stations (1:N) fuel_transactions`
- `drivers (N:1) vehicles` (asignación opcional)

SQL en `backend/db/schema.sql` define la estructura y semilla de roles.

## 3. Endpoints principales
- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`
- **Users:** `GET /api/users` (ADMIN)
- **Vehicles:** `POST /api/vehicles`, `GET /api/vehicles`, `GET /api/vehicles/:id`, `PUT /api/vehicles/:id`, `POST /api/vehicles/:id/image`
- **Drivers:** `POST /api/drivers`, `GET /api/drivers`
- **Stations:** `POST /api/stations`, `GET /api/stations`
- **Fuel Transactions:** `POST /api/fuel-transactions`, `GET /api/fuel-transactions`
- **Reports:** `GET /api/reports/vehicle?start&end`, `GET /api/reports/driver?start&end`
- **IA:** `POST /api/ai/anomaly-check`, `GET /api/ai/vehicle-risk/:vehicleId`

Borrador OpenAPI (extracto):
```yaml
openapi: 3.0.0
info:
  title: DieselSubsidyManager API
  version: 1.0.0
paths:
  /api/auth/login:
    post:
      summary: Login
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email: { type: string }
                password: { type: string }
      responses:
        '200': { description: JWT issued }
  /api/vehicles:
    get:
      security: [ { bearerAuth: [] } ]
      responses:
        '200': { description: Vehicle list }
    post:
      security: [ { bearerAuth: [] } ]
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Vehicle'
  /api/vehicles/{id}/image:
    post:
      security: [ { bearerAuth: [] } ]
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                image:
                  type: string
                  format: binary
  /api/fuel-transactions:
    post:
      security: [ { bearerAuth: [] } ]
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/FuelTransaction'
  /api/ai/anomaly-check:
    post:
      security: [ { bearerAuth: [] } ]
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                vehicleId: { type: string }
                liters: { type: number }
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    Vehicle:
      type: object
      properties:
        plate: { type: string }
        model: { type: string }
        brand: { type: string }
        tankCapacity: { type: number }
        fuelType: { type: string }
    FuelTransaction:
      type: object
      properties:
        vehicleId: { type: string }
        stationId: { type: string }
        driverId: { type: string }
        datetime: { type: string, format: date-time }
        liters: { type: number }
        pricePerLiter: { type: number }
```

## 4. Backend
- Código en `backend/src` con rutas separadas por dominio y servicios de acceso a datos.
- Validación con `express-validator`, autenticación JWT y roles.
- Subida de imágenes con Multer hacia carpeta `uploads/` servida como estático.
- Módulo de IA heurístico (`services/aiService.js`) para detectar cargas anómalas.

## 5. App móvil Expo
- Estructura simple en `mobile/` con navegación stack.
- Pantallas: Login, Dashboard, Vehicles, VehicleDetail (incluye subida de imagen), NewFuel, Alerts.
- Uso de `axios` para consumir API y `expo-image-picker` para seleccionar imagen.

## 6. Seguridad básica
- Hash de contraseñas con bcryptjs.
- Validación de input y manejo de errores centralizado.
- Roles ADMIN/FLEET_MANAGER/STATION_OPERATOR/DRIVER en JWT.
- Limitación de tipos/tamaño de archivos para imágenes.

## 7. Despliegue y ejecución local
### Requisitos previos
- Node.js 18+
- Docker y Docker Compose
- Expo CLI (para la app móvil)

### Backend local
```bash
cd backend
cp .env.example .env
# Instalar dependencias (requiere acceso a npm)
npm install
# Preparar base de datos
psql "$DATABASE_URL" -f db/schema.sql
# Levantar API
npm start
```

### App móvil
```bash
cd mobile
npm install
npm start
```

### Docker Compose
Archivo `docker-compose.yml` en la raíz levanta PostgreSQL, Redis y el backend.
```bash
docker compose up --build
```
Backend expone puerto 4000 y volumen `uploads/` para imágenes.

### Despliegue sugerido
- Railway/Render: crear servicios para PostgreSQL y backend usando este repo. Configurar variables de entorno (`DATABASE_URL`, `JWT_SECRET`, `UPLOAD_DIR=/app/uploads`).
- Para S3/Cloudinary: reemplazar Multer diskStorage por adaptador respectivo y guardar la URL resultante en la BD.
