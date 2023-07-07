# Define base image
FROM node:18-bullseye-slim as base

ENV NODE_ENV=production

RUN apt-get update && \
    apt-get install -y ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Install dependencies
FROM base as deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --include=dev

# Setup production node_modules
FROM base as production-deps
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
COPY package.json package-lock.json ./
RUN npm prune --omit=dev

# Build application
FROM base as build
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN npm run build

# Final image
FROM base

ENV API_SERVER_ADDRESS=
ENV NODE_ENV=production

WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules
# COPY --from=build /app/server-build /app/server-build
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=build /app/package.json /app/package.json

COPY . .

RUN chown -R node /app
USER node

CMD ["npm", "start"]
