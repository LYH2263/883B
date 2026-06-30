FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install

COPY . .

EXPOSE 5173

CMD ["pnpm", "run", "dev", "--", "--host"]
