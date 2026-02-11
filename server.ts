console.log("=================================");
console.log("STEP 1: Starting server.ts...");
console.log("=================================");

import express from "npm:express@4.18.2";
console.log("✅ Express imported");

import mongoose from "npm:mongoose@8.0.0";
console.log("✅ Mongoose imported");

import staticRoutes from "./routes/static.ts";
console.log("✅ Routes imported");

console.log("=================================");
console.log("STEP 2: Initializing app...");
console.log("=================================");

const app = express();
const port = parseInt(Deno.env.get("PORT") || "3000");
const mongoUri = Deno.env.get("MONGO_URI");

console.log("Port:", port);
console.log("MongoDB URI:", mongoUri ? "SET ✅" : "NOT SET ❌");

if (!mongoUri) {
  console.error("FATAL: MONGO_URI environment variable is missing!");
  Deno.exit(1);
}

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "Trivy Scanner API" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.use("/static", staticRoutes);

console.log("=================================");
console.log("STEP 3: Connecting to MongoDB...");
console.log("=================================");

try {
  await mongoose.connect(mongoUri);
  console.log("✅ MongoDB connected successfully!");
  
  console.log("=================================");
  console.log("STEP 4: Starting HTTP server...");
  console.log("=================================");
  
  app.listen(port, "0.0.0.0", () => {
    console.log("=================================");
    console.log("🎉 SERVER IS RUNNING!");
    console.log(`📡 Port: ${port}`);
    console.log(`🌐 Health: http://0.0.0.0:${port}/health`);
    console.log("=================================");
  });
} catch (err: any) {
  console.error("=================================");
  console.error("❌ STARTUP FAILED!");
  console.error("=================================");
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);
  Deno.exit(1);
}