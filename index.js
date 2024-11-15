import express from "express";
const app = express();

import mongoose from "./db.js";
import cors from "cors";

import {
  createTexto,
  getTexto,
  getTextoById,
  createTextoForObjeto,
} from "./texto.ctrl.js";
app.use(cors());
app.use(express.json());
app.get("/", getTexto);
app.get("/:ide", getTextoById);

app.post("/", createTextoForObjeto);

app.listen(5000, () => {
  console.log("servidor abierto");
});
