FROM node:22-alpine AS builder

WORKDIR /app

# Nhận build args cho các biến NEXT_PUBLIC_*
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_FEATURABLE_WIDGET_ID

# Set biến môi trường cho build stage (NEXT_PUBLIC_* được embed vào bundle)
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_FEATURABLE_WIDGET_ID=$NEXT_PUBLIC_FEATURABLE_WIDGET_ID

# Cài đặt dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy toàn bộ source và build
COPY . .
RUN npm run build

# ---------- Production image ----------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Standalone output chỉ cần 3 thứ:
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3200
ENV PORT=3200
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
