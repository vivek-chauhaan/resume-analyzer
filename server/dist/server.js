"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const db_1 = require("./config/db");
const env_1 = require("./config/env");
async function bootstrap() {
    await (0, db_1.connectDB)();
    const app = (0, app_1.createApp)();
    app.listen(env_1.env.port, () => {
        console.log(`[server] Resume Analyzer API running on http://localhost:${env_1.env.port}`);
        console.log(`[server] Environment: ${env_1.env.nodeEnv}`);
    });
}
bootstrap().catch((err) => {
    console.error("[server] Failed to start:", err);
    process.exit(1);
});
