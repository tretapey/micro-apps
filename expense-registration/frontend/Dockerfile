FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Establecer NODE_ENV para producción
ENV NODE_ENV=production

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 