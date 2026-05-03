# Dev server — browser loads this app from http://localhost:5173
# API stays on http://localhost:5005 (host maps to Docker backend).
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
