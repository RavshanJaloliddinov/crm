# Node.js bazasi
FROM node:18-alpine

# Redis o'rnatish
RUN apk add --no-cache redis

# Ishchi katalog
WORKDIR /app

# Fayllarni nusxalash
COPY package*.json ./

# Dependencies o‘rnatish
RUN npm install --force

# Prisma client generatsiyasi
RUN npx prisma generate

# Loyihani nusxalash
COPY . .

# Loyihani build qilish
RUN npm run build

# Port ochish
EXPOSE 3000

# Redis va NestJS`ni ishga tushirish
CMD redis-server --daemonize yes && npm run start:dev
