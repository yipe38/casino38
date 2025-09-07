# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Nur Manifest kopieren -> schnelleres Caching
COPY package*.json ./
RUN npm install --omit=dev

# Rest kopieren
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
