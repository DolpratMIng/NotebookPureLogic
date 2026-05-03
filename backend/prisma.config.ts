import { defineConfig, env } from "prisma/config";

await import("dotenv/config").catch(() => {});

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // url: env("DATABASE_URL"),
    url: env("DIRECT_URL"),
  },
});
