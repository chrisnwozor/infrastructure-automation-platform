import { env } from "./config/env";
import { logger } from "./logger/logger";
import app from "./app";

app.listen(env.port, () => {
  logger.info(`API running on port ${env.port}`);
});
