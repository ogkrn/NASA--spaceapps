FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ARG BACKEND_URL=http://backend:8000
ENV BACKEND_URL=$BACKEND_URL
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/next.config.mjs ./next.config.mjs
ENV BACKEND_URL=http://backend:8000
USER node
EXPOSE 3000
CMD ["npm", "start"]
