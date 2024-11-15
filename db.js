import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config()
  mongoose.connect(process.env.DB_MONGO_URL)
  .then(() => {
    console.log("Base de datos Conectada");
  })
  .catch((err) => {
    console.log(err);
  });
export default mongoose