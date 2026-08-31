# Container image for the Miracle Exterminating Service Management System.
# Lets anyone run the whole app with only Docker installed (no local Node.js).
FROM node:20-alpine

# Prisma needs OpenSSL on Alpine.
RUN apk add --no-cache openssl

WORKDIR /app

# Install dependencies first (better layer caching).
COPY package*.json ./
RUN npm install

# Copy the rest of the source and generate the Prisma client.
COPY . .
RUN npx prisma generate

EXPOSE 3000

# The database schema + seed run at container start (see docker-compose.yml),
# because the database is only reachable once the containers are up.
CMD ["npx", "next", "dev", "-H", "0.0.0.0", "-p", "3000"]
