FROM node:18-alpine

WORKDIR /app

# Instalar dependencias necesarias para compilar better-sqlite3
RUN apk add --no-cache python3 make g++ build-base

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos
COPY . .

# Crear la carpeta de datos
RUN mkdir -p /app/data

EXPOSE 4000

# Inicializar la base de datos y luego iniciar la aplicación
CMD ["sh", "-c", "node src/init-db.js && npm run dev"] 