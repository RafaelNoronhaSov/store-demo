# -------- Build --------
FROM node:24 AS builder
WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json nest-cli.json ./

COPY apps ./apps
COPY libs ./libs
COPY libs/common/src/proto ./libs/common/src/proto

RUN npm install
RUN npm install tsc-alias

RUN npm run build common
ARG APP=orchestrator
RUN npm run build ${APP}

# -------- Run --------
FROM node:24-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

ARG APP=orchestrator
COPY --from=builder /usr/src/app/dist/apps/${APP} ./dist/apps/${APP}
COPY --from=builder /usr/src/app/libs/common/src/proto ./libs/common/src/proto

EXPOSE 3000 50051
