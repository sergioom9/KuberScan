import express from "npm:express@4.18.2";
import mongoose from "npm:mongoose@8.0.0";
import { config } from "https://deno.land/std@0.208.0/dotenv/mod.ts";
import staticRoutes from "./routes/static.ts";

await config({ export: true });

const app = express();
const port = Deno.env.get("PORT") || 3000;
const mongoUri = Deno.env.get("MONGO_URI") || "";

app.use(express.json());
app.use("/static", staticRoutes);

mongoose.connect(mongoUri)
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(port, () => console.log(`Servidor en http://localhost:${port}`));
  })
  .catch((err) => console.error("Error al conectar a MongoDB:", err));