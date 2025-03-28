# build
FROM oven/bun:latest AS builder

WORKDIR /email-builder

COPY . .

RUN bun install && bun run build

# production
FROM oven/bun:latest

WORKDIR /email-builder

COPY package*.json ./

COPY --from=builder /email-builder/build ./

EXPOSE 3000

ENTRYPOINT ["bun","./index.js"]