# Registrador de Gastos

Una aplicación minimalista para registrar y gestionar gastos personales de forma rápida y sencilla.

## Características

- Dashboard con resumen mensual de gastos por categoría
- Registro rápido de gastos (menos de 5 segundos)
- Historial cronológico de gastos
- Exportación de datos en formato CSV
- Diseño minimalista y responsivo

## Estructura del Proyecto

El proyecto está dividido en tres componentes principales:

- **Frontend**: Aplicación React con Vite y Tailwind CSS
- **Backend**: API REST con Node.js y Express
- **Base de datos**: SQLite para almacenamiento ligero

## Requisitos

- Node.js (v14 o superior)
- Docker y Docker Compose

## Instalación y Ejecución

### Con Docker Compose

1. Clona este repositorio
2. Navega a la carpeta del proyecto
3. Ejecuta el siguiente comando:

```bash
docker-compose up
```

La aplicación estará disponible en:
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

### Desarrollo local

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
npm install
npm run dev
```

## Estructura de la Base de Datos

La aplicación utiliza una estructura simple con una tabla principal:

```sql
CREATE TABLE gastos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  monto REAL NOT NULL,
  categoria TEXT NOT NULL,
  fecha TEXT NOT NULL,
  forma_pago TEXT,
  aclaracion_pago TEXT,
  descripcion TEXT
);
``` 