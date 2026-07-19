import app from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";
import { logger } from "./logger/logger";

const server = app.listen(env.port, () => {
  logger.info(`API running on port ${env.port}`);
});

const shutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received. Shutting down.`);

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
