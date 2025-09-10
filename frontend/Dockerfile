FROM node:20-alpine

WORKDIR /app
COPY package*.json ./

# devDependencies MIT installieren (Vite!)
RUN npm ci --include=dev

COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
