import { model, Schema } from "mongoose";

const textoSchema = new Schema(
  {
    content: String,
  },
  {
    timestamps: true,
  }
);
const textoModel = model("texto", textoSchema);

export default textoModel;
