#!/usr/bin/env node
import { createServer } from "vite";
import { resolve } from "path";
import fs from "fs";

const configFile = resolve(process.cwd(), "vite.config.ts");

if (!fs.existsSync(configFile)) {
  console.error("Cannot find vite.config.ts file");
  process.exit(1);
}

async function startServer() {
  try {
    console.log("Starting development server with SPA routing enabled...");

    const server = await createServer({
      configFile,
      server: {
        middlewareMode: false,
      },
    });

    await server.listen();

    server.printUrls();

    console.log(
      "\nSPA routing is enabled - all routes will be served with index.html",
    );
    console.log("Press Ctrl+C to stop the server");

    ["SIGINT", "SIGTERM"].forEach((signal) => {
      process.on(signal, () => {
        console.log("\nShutting down server...");
        server.close().then(() => process.exit(0));
      });
    });
  } catch (error) {
    console.error("Failed to start development server:", error);
    process.exit(1);
  }
}

startServer();
