FROM node:18
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install || true
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
