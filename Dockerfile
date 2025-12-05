FROM node:22-alpine AS builder

WORKDIR /app

# Nhận build args cho các biến NEXT_PUBLIC_*
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_FEATURABLE_WIDGET_ID
ARG NEXT_PUBLIC_FEATURABLE_WIDGET_ID_2

# Set biến môi trường cho build stage (NEXT_PUBLIC_* được embed vào bundle)
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_FEATURABLE_WIDGET_ID=$NEXT_PUBLIC_FEATURABLE_WIDGET_ID
ENV NEXT_PUBLIC_FEATURABLE_WIDGET_ID_2=$NEXT_PUBLIC_FEATURABLE_WIDGET_ID_2

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

# Copy file cần thiết từ builder
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Cài đặt deps cần cho runtime (không cài devDependencies)
RUN npm ci --omit=dev

EXPOSE 3200

CMD ["npm", "run", "start"]


