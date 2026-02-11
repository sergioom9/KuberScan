import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import staticRoutes from "./routes/static.ts";

dotenv.config();

const app = express();
const port = 8000;
const mongoUri = Deno.env.get("MONGO_URI") || "";

app.use(express.json());
app.use("/static", staticRoutes);
mongoose.connect(mongoUri)
  .then(() => {
    app.listen(port, () => console.log(`Servidor en http://localhost:${port}`));
  })
  .catch((err) => console.error("Error al conectar a MongoDB:", err));