import express from "npm:express@4.18.2";
import mongoose from "npm:mongoose@8.0.0";
import staticRoutes from "./routes/static.ts";

console.log("================================");
console.log("🚀 Trivy Scanner API Starting");
console.log("================================");
console.log("📍 Deno version:", Deno.version.deno);
console.log("📍 TypeScript version:", Deno.version.typescript);
console.log("📍 V8 version:", Deno.version.v8);
console.log("================================");

const app = express();
const port = parseInt(Deno.env.get("PORT") || "3000");
const mongoUri = Deno.env.get("MONGO_URI");

console.log("🔍 Environment check:");
console.log("  - PORT:", port);
console.log("  - MONGO_URI:", mongoUri ? "✅ Set" : "❌ Not set");

if (!mongoUri) {
  console.error("================================");
  console.error("❌ ERROR: MONGO_URI is required!");
  console.error("================================");
  console.error("Please set MONGO_URI in Render environment variables");
  Deno.exit(1);
}

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ 
    service: "Trivy Scanner API",
    status: "running",
    version: "1.0.0"
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    uptime: performance.now()
  });
});

app.use("/static", staticRoutes);

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("❌ Express error:", err);
  res.status(500).json({ error: "Internal server error" });
});

console.log("🔄 Connecting to MongoDB...");

mongoose.connect(mongoUri)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");
    console.log("================================");
    
    app.listen(port, "0.0.0.0", () => {
      console.log(`🎉 Server is running!`);
      console.log(`📡 Listening on 0.0.0.0:${port}`);
      console.log(`🌐 Health check: http://0.0.0.0:${port}/health`);
      console.log("================================");
    });
  })
  .catch((err) => {
    console.error("================================");
    console.error("❌ MongoDB connection failed!");
    console.error("================================");
    console.error("Error details:", err.message);
    console.error("Stack:", err.stack);
    console.error("================================");
    Deno.exit(1);
  });

globalThis.addEventListener("unhandledrejection", (e) => {
  console.error("❌ Unhandled promise rejection:", e.reason);
});

globalThis.addEventListener("error", (e) => {
  console.error("❌ Uncaught error:", e.error);
});

console.log("✅ Server initialization complete, waiting for MongoDB...");