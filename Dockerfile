# Node.js bazasi
FROM node:18-alpine

# Ishchi katalog
WORKDIR /app

# Bash va boshqa kerakli paketlar
RUN apk add --no-cache bash curl

# package.json fayllarni nusxalash va modullarni o‘rnatish
COPY package*.json ./

# Node modullarini o‘rnatish
RUN npm install --force

# Loyihani nusxalash
COPY . .

# Prisma Client generatsiyasi
RUN npx prisma generate

# Production DB bo‘lsa migratsiyalarni deploy qilish
RUN npx prisma migrate deploy || echo "No migrations to apply"

# Loyihani build qilish
RUN npm run build

# Port ochish
EXPOSE 3000

# NestJS ilovasini ishga tushirish
CMD ["npm", "run", "start:dev"]
