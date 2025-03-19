FROM node:22
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY . /app
WORKDIR /app

EXPOSE 3000
EXPOSE 8000

RUN pnpm install
RUN pnpm build

CMD ["pnpm", "start"]
