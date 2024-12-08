import express from "express";
import mongoose from "./db.js";
import cors from "cors";
import rateLimit from "express-rate-limit"; // Importar express-rate-limit
import dotenv from "dotenv";
const envFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env';
dotenv.config({ path: envFile });
const PORT = process.env.PORT || 3000;
// Función para limitar el tamaño del cuerpo
const setBodySizeLimit = (sizeLimit) => express.json({ limit: sizeLimit });

import {
  createTexto,
  getTexto,
  getTextoById,
  createTextoForObjeto,
} from "./texto.ctrl.js";

const app = express();

// Configuración del límite de solicitudes para GET y POST
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Ventana de tiempo de 15 minutos
  max: 150, // Límite de 150 solicitudes por IP
  message: {
    error:
      "Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde.",
  },
});

const limiterPost = rateLimit({
  windowMs: 15 * 60 * 1000, // Ventana de tiempo de 15 minutos
  max: 3, // Límite de 3 solicitudes por IP
  message: {
    error: "Máximo de 3 JSON para crear.",
  },
});
const whitelist = [process.env.FRONTEND, process.env.FRONTEND_DEV];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin) || !origin) {
      // Permitir solicitudes si están en la whitelist o no tienen origen (como Postman)
      callback(null, true);
    } else {
      // Bloquear otros orígenes
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));
// Aplicar middleware
app.use(setBodySizeLimit("100b")); // Limitar el tamaño del cuerpo a 1 KB
app.use(cors(corsOptions));
app.use((err, req, res, next) => {
  if (err && err.message === 'Not allowed by CORS') {
      res.status(403).json({ error: 'Access not allowed by CORS' });
  } else {
      next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: "El tamaño del cuerpo excede el límite permitido (500B)." });
  }
  next(err); // Pasar otros errores a middlewares estándar
});
// Rutas con limitadores personalizados
app.get("/", limiter, getTexto);
app.get("/:ide", limiter, getTextoById);
app.post("/", limiterPost, createTextoForObjeto);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`server abierto en: ${process.env.FRONTEND_DEV} y ${process.env.FRONTEND}`);
});
