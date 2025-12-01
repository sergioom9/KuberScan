import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import staticRoutes from "./routes/static.ts";
import dynamicRoutes from "./routes/dynamic.ts";

dotenv.config();

const app = express();
const port = Deno.env.get("PORT") || 3000;
const mongoUri = Deno.env.get("MONGO_URI") || "";

app.use(express.json());
app.use("/static", staticRoutes);
app.use("/dynamic", dynamicRoutes);


mongoose.connect(mongoUri)
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(port, () => console.log(`Servidor en http://localhost:${port}`));
  })
  .catch((err) => console.error("Error al conectar a MongoDB:", err));