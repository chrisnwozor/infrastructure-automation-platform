import cors from "cors";
import express from "express";
import helmet from "helmet";

import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
import routes from "./routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api/v1", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
