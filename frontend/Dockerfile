FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY tsconfig.json ./
COPY vite.config.ts ./
COPY src ./src
COPY public ./public

RUN npm run build

EXPOSE 4173

CMD ["npx", "serve", "-s", "dist", "-l", "4173"]
