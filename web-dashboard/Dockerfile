# ============================================================
# TEMPORARY — DEVELOPMENT ONLY — DO NOT USE IN PRODUCTION
# ============================================================
# This Dockerfile is ONLY for local dev/test via Docker.
# It does NOT affect Capacitor, Android, or any production config.
# ============================================================

FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Install dependencies in a separate layer for Docker cache efficiency.
# node_modules stays inside the container, isolated from host.
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the source (volumes will override at runtime)
COPY . .

# Expose Next.js dev server port
EXPOSE 3000

# Run Next.js in development mode with hot reload enabled
# HOST=0.0.0.0 is required so the container accepts connections from the host machine
CMD ["npm", "run", "dev"]
