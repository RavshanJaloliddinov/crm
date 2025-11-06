# Node.js bazasi
FROM node:18-alpine

# Redis o'rnatish
RUN apk add --no-cache redis

# Ishchi katalog
WORKDIR /app

# package.json fayllarni nusxalash va modullarni o‘rnatish
COPY package*.json ./
RUN npm install --force

# Endi butun loyihani nusxalash
COPY . .

# Prisma client generatsiyasi (schema.prisma hozir mavjud)
RUN npx prisma generate

# Loyihani build qilish
RUN npm run build

# Port ochish
EXPOSE 3000

# Redis va NestJS`ni ishga tushirish
CMD redis-server --daemonize yes && npm run start:dev
