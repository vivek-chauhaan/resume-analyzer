import { createApp } from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

async function bootstrap() {
  await connectDB();
  const app = createApp();

  app.listen(env.port, () => {
    console.log(`[server] Resume Analyzer API running on http://localhost:${env.port}`);
    console.log(`[server] Environment: ${env.nodeEnv}`);
  });
}

bootstrap().catch((err) => {
  console.error("[server] Failed to start:", err);
  process.exit(1);
});
