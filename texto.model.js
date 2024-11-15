import { model, Schema } from "mongoose";

const textoSchema = new Schema({
  content: String,
});
const textoModel = model("texto", textoSchema);

export default textoModel;
